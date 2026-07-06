import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z.string().min(3, "Full name is required"),

    username: z.string().min(3, "Username is required"),

    email: z.email("Invalid email"),

    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
