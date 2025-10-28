import { getClient } from '../lib/graphql/apollo-client';
import { LOGIN_MUTATION } from '../lib/graphql/mutations/auth';
import { ME_QUERY } from '../lib/graphql/queries/user';
import { getDashboardPathForRole } from '../lib/auth/roleUtils';
import { createStore } from './index';

// Storage keys for persisting auth data between page refreshes
const TOKEN_STORAGE_KEY = "siemreap_auth_token";
const USER_STORAGE_KEY = "siemreap_user";

// Types
// GraphQL response types
interface LoginResponse {
  login: {
    token: string;
    user: User;
  };
}

interface MeResponse {
  me: User;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl?: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  // Actions
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  loadUser: () => Promise<void>;
}

// Create the auth store
export const useAuthStore = createStore<AuthState>(
  (set, get) => ({
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,

    // Sign in action
    signIn: async (credentials) => {
      set({ loading: true, error: null });
      
      try {
        const client = getClient();
        const { data } = await client.mutate<LoginResponse>({
          mutation: LOGIN_MUTATION,
          variables: {
            email: credentials.email,
            password: credentials.password
          }
        });
        
        if (!data || !data.login) {
          throw new Error('Invalid response from server');
        }
        
        const { token, user } = data.login;
        
        // Save token and user data
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        
        // Update state
        set({ 
          user, 
          loading: false, 
          isAuthenticated: true 
        });
        
        return Promise.resolve();
      } catch (error: any) {
        set({ 
          loading: false, 
          error: error.message || 'Failed to sign in',
          isAuthenticated: false
        });
        
        return Promise.reject(error);
      }
    },

    // Sign out action
    signOut: async () => {
      set({ loading: true });
      
      try {
        // Clear token and user data
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        
        // Clear Apollo cache
        const client = getClient();
        await client.resetStore();
        
        // Update state
        set({ 
          user: null, 
          loading: false, 
          isAuthenticated: false 
        });
        
        return Promise.resolve();
      } catch (error: any) {
        set({ 
          loading: false, 
          error: error.message || 'Failed to sign out' 
        });
        
        return Promise.reject(error);
      }
    },

    // Clear error action
    clearError: () => {
      set({ error: null });
    },

    // Load user from localStorage and verify with API
    loadUser: async () => {
      set({ loading: true });
      
      try {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        
        if (!token) {
          set({ 
            user: null, 
            loading: false, 
            isAuthenticated: false 
          });
          return Promise.resolve();
        }
        
        // Verify token with API by fetching current user
        const client = getClient();
        const { data } = await client.query<MeResponse>({
          query: ME_QUERY,
          fetchPolicy: 'network-only' // Always fetch from network to ensure token is valid
        });
        
        if (data && data.me) {
          set({ 
            user: data.me, 
            loading: false, 
            isAuthenticated: true 
          });
        } else {
          // Token is invalid, clear storage
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem(USER_STORAGE_KEY);
          
          set({ 
            user: null, 
            loading: false, 
            isAuthenticated: false 
          });
        }
        
        return Promise.resolve();
      } catch (error: any) {
        console.error("Failed to verify auth token:", error);
        
        // Token is invalid, clear storage
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        
        set({ 
          user: null, 
          loading: false, 
          error: error.message || 'Failed to load user',
          isAuthenticated: false 
        });
        
        return Promise.reject(error);
      }
    }
  }),
  {
    name: 'auth-store',
    persist: true,
    devtools: true
  }
);

// Helper function to get the current user
export const getCurrentUser = (): User | null => {
  return useAuthStore.getState().user;
};

// Helper function to check if the user is authenticated
export const isAuthenticated = (): boolean => {
  return useAuthStore.getState().isAuthenticated;
};

// Helper function to get the dashboard path for the current user
export const getDashboardPath = (): string => {
  const user = getCurrentUser();
  return user ? getDashboardPathForRole(user.role) : '/login';
};
