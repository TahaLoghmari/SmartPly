import type { LoginUserDto } from "../types";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validationService = {
  validateEmail(email: string): { isValid: boolean; error?: string } {
    if (!email) {
      return { isValid: false, error: "Email is required" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: "Please enter a valid email address" };
    }

    return { isValid: true };
  },

  validatePassword(password: string): { isValid: boolean; error?: string } {
    if (!password) {
      return { isValid: false, error: "Password is required" };
    }

    if (password.length < 6) {
      return {
        isValid: false,
        error: "Password must be at least 6 characters",
      };
    }

    return { isValid: true };
  },

  validateLoginForm(credentials: LoginUserDto): ValidationResult {
    const errors: string[] = [];

    const emailValidation = this.validateEmail(credentials.email);
    if (!emailValidation.isValid) {
      errors.push(emailValidation.error!);
    }

    const passwordValidation = this.validatePassword(credentials.password);
    if (!passwordValidation.isValid) {
      errors.push(passwordValidation.error!);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};
