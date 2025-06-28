// Routes
export { authRoutes } from "./authRoutes";

// Types
export * from "./types";

// API
export { authApi } from "./api/authApi";

// Store
export { useAuthStore } from "./stores/useAuthStore";
export { useForgotPasswordStore } from "./stores/useForgotPasswordStore";

// Hooks
export { useAuthOnMount } from "./hooks/useAuthOnMount";
export { useCurrentUser } from "./hooks/useCurrentUser";
export { useForgotPassword } from "./hooks/useForgotPassword";
export { useGetGoogleOAuthUrl } from "./hooks/useGetGoogleOAuthUrl";
export { useLogin } from "./hooks/useLogin";
export { useLogout } from "./hooks/useLogout";
export { useRegister } from "./hooks/useRegister";
export { useResendConfirmationEmail } from "./hooks/useResendConfirmationEmail";
export { useResetPassword } from "./hooks/useResetPassword";

// Components
export { AuthGuard } from "./components/AuthGuard";
export { EmailConfirmedPage } from "./components/EmailConfirmedPage";
export { EmailVerificationPage } from "./components/EmailVerificationPage";
export { ForgotPasswordForm } from "./components/ForgotPasswordForm";
export { ForgotPasswordPage } from "./components/ForgotPasswordPage";
export { LoginForm } from "./components/LoginForm";
export { LoginPage } from "./components/LoginPage";
export { RegisterForm } from "./components/RegisterForm";
export { RegisterPage } from "./components/RegisterPage";
export { ResetPasswordForm } from "./components/ResetPasswordForm";
export { ResetPasswordPage } from "./components/ResetPasswordPage";
