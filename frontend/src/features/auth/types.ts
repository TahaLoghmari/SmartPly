export interface User {
  id: string;
  email: string;
  googleEmail: string;
  name: string;
  imageUrl: string;
  gmailConnected: boolean;
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

export interface ForgotPasswordState {
  hasClickedResetPassword: boolean;
  email: string;
  setResetPasswordClicked: (email: string) => void;
  clearResetState: () => void;
}

export interface GoogleAuthResponseDto {
  authorizationUrl: string;
}

export interface AuthGuardProps {
  children: React.ReactNode;
}
