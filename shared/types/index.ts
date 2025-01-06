import { z } from "zod";

export const otpSchema = z.enum(["TOTP", "HOTP"]);
export const algorithmSchema = z.enum(["SHA1", "SHA256", "SHA512"]);

export const accountSchema = z.object({
  id: z.number().optional(),
  type: otpSchema,
  issuer: z.string(),
  label: z.string().min(1),
  icon: z.string(),
  icontype: z.string(),
  secret: z
    .string()
    .trim()
    .min(1)
    .refine((s) => !s.includes(" "), "Key must not contain spaces !!"),
  algorithm: algorithmSchema,
  digits: z.number().min(6).max(8),
  period: z.number().min(5).max(60),
  counter: z.number().min(0).max(3000),
});
