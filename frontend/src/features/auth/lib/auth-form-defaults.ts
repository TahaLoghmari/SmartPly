export function RegisterFormDefaults() {
  return {
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  };
}

export function LoginFormDefaults() {
  return {
    email: "",
    password: "",
  };
}

export function ResetPasswordDefaults(email: string | null) {
  return {
    email: email || "",
    password: "",
    confirmPassword: "",
  };
}

export function ForgotPasswordDefautls() {
  return {
    email: "",
  };
}
