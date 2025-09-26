export interface User {
  id: string;
  email: string;
  name: string;
  department: string;
  departmentIds: string[];
  canPlan: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}