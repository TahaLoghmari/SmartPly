export interface User {
  id: string;
  email: string;
  userName: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface TokensDto {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginUserDto) => Promise<void>;
  register: (credentials: RegisterUserDto) => Promise<void>;
  logout: () => Promise<void>;
  getGoogleOAuthUrl: () => Promise<void>;
  googleLogin: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<void>;
  clearError: () => void;
}
