import z from "zod";

export const registerFormSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Name is required." })
      .max(50, { message: "Name must be at most 50 characters." }),
    email: z
      .string()
      .min(1, { message: "Email is required." })
      .email({ message: "Invalid email format." })
      .max(256, { message: "Email must be at most 256 characters." }),
    password: z
      .string()
      .min(1, { message: "Password is required." })
      .min(6, { message: "Password must be at least 6 characters long." })
      .max(100, { message: "Password must be at most 100 characters long." })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter (A-Z).",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter (a-z).",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one digit (0-9).",
      })
      .regex(/[^a-zA-Z0-9]/, {
        message:
          "Password must contain at least one non-alphanumeric character.",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirmation password is required." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirmation password do not match.",
    path: ["confirmPassword"],
  });

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Invalid email format." })
    .max(256, { message: "Email must be at most 256 characters." }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export const resetPasswordFormSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Email is required." })
      .email({ message: "Invalid email format." })
      .max(256, { message: "Email must be at most 256 characters." }),
    password: z
      .string()
      .min(1, { message: "Password is required." })
      .min(6, { message: "Password must be at least 6 characters long." })
      .max(100, { message: "Password must be at most 100 characters long." })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter (A-Z).",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter (a-z).",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one digit (0-9).",
      })
      .regex(/[^a-zA-Z0-9]/, {
        message:
          "Password must contain at least one non-alphanumeric character.",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirmation password is required." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirmation password do not match.",
    path: ["confirmPassword"],
  });

export const forgotPasswordFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Invalid email format." })
    .max(256, { message: "Email must be at most 256 characters." }),
});
