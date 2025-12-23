import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1).optional(),
  otp: z.string().length(6, "OTP must be 6 digits").optional(),
});

export const profileSchema = z.object({
  nickname: z.string().min(1, "Nickname is required").max(50),
  email: z.string().email(),
  age: z.number().int().min(16, "Age must be at least 16").max(90, "Age must be 90 or less"),
  heightCm: z.number().min(100, "Height must be at least 100 cm").max(250, "Height must be 250 cm or less"),
  weightKg: z.number().min(30, "Weight must be at least 30 kg").max(300, "Weight must be 300 kg or less"),
  gender: z.enum(["MALE", "FEMALE"], { errorMap: () => ({ message: "Gender is required" }) }),
  goalType: z.enum(["LOSE_FAT", "GAIN_MUSCLE"]).optional(),
});

export const calorieLogSchema = z.object({
  date: z.string().regex(/\d{4}-\d{2}-\d{2}/, "Use YYYY-MM-DD"),
  calories: z.number().int().min(0).max(15000),
});
