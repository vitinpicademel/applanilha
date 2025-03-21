export type UserRole = 'MASTER' | 'GESTOR' | 'CORRETOR';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password: string;
  teamId?: string; // Para GESTOR
  managerId?: string; // Para CORRETOR
  createdAt: string;
  lastLogin: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: UserCredentials) => Promise<void>;
  logout: () => void;
  register: (credentials: RegisterCredentials) => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
} 