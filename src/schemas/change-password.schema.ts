import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .max(30, "New password cannot exceed 30 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&]).+$/,
        "Password must contain uppercase, lowercase, number, and special character",
      ),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
