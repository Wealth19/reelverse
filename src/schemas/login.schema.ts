
import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email format").trim(),

  password: z.string().min(1, "Password field is required"),
});

export type LoginSchema = z.infer<typeof loginSchema>;