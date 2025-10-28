import { createStore } from './index';
import { StateSlice } from './types';
import { getClient } from '@/lib/graphql/apollo-client';
import { LOGIN_MUTATION } from '@/lib/graphql/mutations/auth';
import { ME_QUERY } from '@/lib/graphql/queries/user';
import { getDashboardPathForRole } from '@/lib/auth/roleUtils';

// Storage keys for persisting auth data between page refreshes
const TOKEN_STORAGE_KEY = 'siemreap_auth_token';
const USER_STORAGE_KEY = 'siemreap_user';

// Define types
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
}

interface LoginResponse {
  login: {
    token: string;
    user: User;
  };
}

interface MeResponse {
  me: User;
}

// Define the auth store state
interface AuthState extends StateSlice<AuthState> {
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
  'auth',
  {
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
    
    // Sign in function
    signIn: async (credentials) => {
      const { email, password } = credentials;
      
      useAuthStore.setState({ loading: true, error: null });
      
      try {
        const client = getClient();
        const { data } = await client.mutate<{ login: LoginResponse['login'] }>({
          mutation: LOGIN_MUTATION,
          variables: { email, password }
        });
        
        if (data?.login) {
          const { token, user } = data.login;
          
          // Save token and user data
          localStorage.setItem(TOKEN_STORAGE_KEY, token);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
          
          // Update state
          useAuthStore.setState({
            user,
            loading: false,
            isAuthenticated: true
          });
          
          // Return dashboard path for navigation
          return Promise.resolve();
        }
      } catch (err: any) {
        useAuthStore.setState({
          error: err.message || 'Failed to sign in',
          loading: false
        });
        return Promise.reject(err);
      }
    },
    
    // Sign out function
    signOut: async () => {
      useAuthStore.setState({ loading: true });
      
      // Clear token and user data
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      
      // Clear Apollo cache
      const client = getClient();
      await client.resetStore();
      
      // Update state
      useAuthStore.setState({
        user: null,
        loading: false,
        isAuthenticated: false
      });
      
      return Promise.resolve();
    },
    
    // Clear any auth errors
    clearError: () => {
      useAuthStore.setState({ error: null });
    },
    
    // Load user from localStorage and verify with API
    loadUser: async () => {
      useAuthStore.setState({ loading: true });
      
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      
      if (!token) {
        useAuthStore.setState({ loading: false });
        return Promise.resolve();
      }
      
      try {
        // Verify token with API by fetching current user
        const client = getClient();
        const { data } = await client.query<MeResponse>({
          query: ME_QUERY,
          fetchPolicy: 'network-only' // Always fetch from network to ensure token is valid
        });
        
        if (data?.me) {
          useAuthStore.setState({
            user: data.me,
            isAuthenticated: true,
            loading: false
          });
        } else {
          // Token is invalid, clear storage
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem(USER_STORAGE_KEY);
          useAuthStore.setState({ loading: false });
        }
      } catch (err) {
        console.error('Failed to verify auth token:', err);
        // Token is invalid, clear storage
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        useAuthStore.setState({ loading: false });
      }
      
      return Promise.resolve();
    },
    
    set: (fn) => useAuthStore.setState(fn(useAuthStore.getState())),
  },
  { persist: true, persistKey: 'siemreap-auth' }
);

// Initialize the auth store by loading user data
if (typeof window !== 'undefined') {
  useAuthStore.getState().loadUser();
}

// Helper function to get the dashboard path for the current user
export function getDashboardPath(): string {
  const { user } = useAuthStore.getState();
  return user ? getDashboardPathForRole(user.role) : '/login';
}
