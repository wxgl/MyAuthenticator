import { idText } from "typescript";
import { z } from "zod";

export const otpSchema = z.enum(["TOTP", "HOTP"]);
export const algorithmSchema = z.enum(["SHA1", "SHA256", "SHA512"]);

export const accountSchema = z.object({
  id: z.number().optional(),
  type: otpSchema,
  issuer: z.string(),
  label: z.string().nonempty("label is required"),
  icon: z.string(),
  secret: z.string().regex(/^[A-Z2-7=]+$/, "Invalid secret key"),
  algorithm: algorithmSchema,
  digits: z.number().min(6).max(8),
  period: z.number().min(5).max(60),
  counter: z.number().min(0),
});

export const accountsSchema = z.array(accountSchema);

export const accountEditSchema = accountSchema.pick({
  label: true,
  issuer: true,
  icon: true,
});

export const loginSchema = z.object({
  username: z.string().trim().min(5),
  password: z
    .string()
    .trim()
    .min(8)
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=(.*?[#?!@$%^&*-]){2,}).{8,}$/,
      "Invalid password"
    ),
});

export const iconSchema = z.object({
  label: z.string(),
  icon: z.string(),
});

export const passkeyUser = z.object({
  userName: z.string().nonempty(),
  displayName: z.string().nonempty(),
});

export const passkeyTableSchema = z.object({
  id: z.string().nonempty(),
  displayName: z.string().nonempty(),
  createdAt: z.string().nonempty(),
});

// TYPES
export type Account = z.infer<typeof accountSchema>;
export type Accounts = z.infer<typeof accountsSchema>;
export type AccountEdit = z.infer<typeof accountEditSchema>;
export type Login = z.infer<typeof loginSchema>;
export type Icon = z.infer<typeof iconSchema>;
export type PasskeyUser = z.infer<typeof passkeyUser>;
export type Passkey = z.infer<typeof passkeyTableSchema>;
