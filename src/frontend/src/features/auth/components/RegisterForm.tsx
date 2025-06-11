import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const formSchema = z
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

export function RegisterForm() {
  const { register, error } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(register)} className="w-full space-y-6">
        {error && (
          <div className="bg-destructive/10 border-destructive text-destructive mb-4 rounded-md border p-3 text-sm">
            {error}
          </div>
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={!form.formState.isValid}
        >
          Register
        </Button>
        <p className="text-sm font-semibold">
          Already have an account ?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#2a8176] underline decoration-solid"
          >
            Login
          </Link>
        </p>
      </form>
    </Form>
  );
}
