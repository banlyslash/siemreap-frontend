export type UserRole = 'employee' | 'manager' | 'hr';

export interface Department {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  avatarUrl?: string;
  role: UserRole;
  departmentId?: string;
  managerId?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  departmentId?: string;
  managerId?: string;
}

export interface AuthContextType extends AuthState {
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signUp: (credentials: SignupCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}
