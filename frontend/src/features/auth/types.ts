export interface User {
  id: string;
  email: string;
  name: string;
  imageUrl: string;
  emailConfirmed?: boolean;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordDto {
  email: string;
  token: string;
  newPassword: string;
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
}

export interface AuthContextType extends AuthState {
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}
