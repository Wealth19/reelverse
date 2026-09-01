import { z } from "zod";

export const editProfileSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters"),

  email: z.string().email("Invalid email address"),
});

export type EditProfileSchema = z.infer<typeof editProfileSchema>;
