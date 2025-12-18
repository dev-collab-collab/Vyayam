import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

export const profileSchema = z.object({
  age: z.number().int().min(16).max(90),
  weightKg: z.number().min(30).max(300),
  goalType: z.enum(["LOSE_FAT", "GAIN_MUSCLE"]),
});

export const calorieLogSchema = z.object({
  date: z.string().regex(/\d{4}-\d{2}-\d{2}/, "Use YYYY-MM-DD"),
  calories: z.number().int().min(0).max(15000),
});
