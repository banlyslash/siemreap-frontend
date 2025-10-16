"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client/react";
import { LOGIN_MUTATION } from "../graphql/mutations/auth";
import { ME_QUERY } from "../graphql/queries/user";
import { getClient } from "../graphql/apollo-client";
import { getDashboardPathForRole } from "./roleUtils";

// Define types
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

interface LoginCredentials {
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

// Create context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys for persisting auth data between page refreshes
const TOKEN_STORAGE_KEY = "siemreap_auth_token";
const USER_STORAGE_KEY = "siemreap_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const client = getClient();
  
  // Login mutation
  const [loginMutation] = useMutation<LoginResponse>(LOGIN_MUTATION, {
    client,
    onCompleted: (data) => {
      const { token, user } = data.login;
      handleAuthSuccess(token, user);
    },
    onError: (error) => {
      setError(error.message || "Failed to sign in");
      setLoading(false);
    }
  });

  // Handle successful authentication
  const handleAuthSuccess = (token: string, userData: User) => {
    // Save token and user data
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    
    // Update state
    setUser(userData);
    setLoading(false);
    
    // Redirect based on user role using the utility function
    const dashboardPath = getDashboardPathForRole(userData.role);
    router.push(dashboardPath);
  };
  
  // Handle logout
  const handleLogout = () => {
    // Clear token and user data
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    
    // Clear Apollo cache
    client.resetStore();
    
    // Update state
    setUser(null);
    setLoading(false);
    
    // Redirect to login page
    router.push('/login');
  };

  // Load user from localStorage and verify with API on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      
      if (token) {
        try {
          // Verify token with API by fetching current user
          const { data } = await client.query<MeResponse>({
            query: ME_QUERY,
            fetchPolicy: 'network-only' // Always fetch from network to ensure token is valid
          });
          
          if (data?.me) {
            setUser(data.me);
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            localStorage.removeItem(USER_STORAGE_KEY);
          }
        } catch (err) {
          console.error("Failed to verify auth token:", err);
          // Token is invalid, clear storage
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      }
      
      setLoading(false);
    };
    
    loadUser();
  }, [client]);

  // Sign in function
  const signIn = async ({ email, password }: LoginCredentials) => {
    setLoading(true);
    setError(null);
    
    try {
      await loginMutation({
        variables: {
          email,
          password
        }
      });
      
      // Note: Redirect is handled in the onCompleted callback
    } catch (err: any) {
      // Error is handled in the onError callback
      throw err;
    }
  };

  // Sign out function
  const signOut = async () => {
    setLoading(true);
    handleLogout();
  };

  // Clear any auth errors
  const clearError = () => {
    setError(null);
  };

  // Provide the auth context to children
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}
