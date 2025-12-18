import { GoalType } from "@prisma/client";
import { getLastNDates } from "@/lib/date";

export interface ProfileData {
  age: number;
  weightKg: number;
  goalType: GoalType;
}

export interface CalorieLogEntry {
  date: string; // yyyy-mm-dd
  calories: number;
}

export interface GuidanceResult {
  maintenanceCalories: number;
  targetCalories: number;
  averageIntake: number;
  status: "ON_TRACK" | "OFF_TRACK";
  recommendation: string;
  plan: string;
  projection: string;
  notes: string;
}

export function estimateMaintenance(profile: ProfileData): number {
  let maintenance = profile.weightKg * 33;
  if (profile.age >= 40) maintenance *= 0.97;
  else if (profile.age <= 25) maintenance *= 1.02;
  return Math.round(maintenance);
}

export function targetCalories(goal: GoalType, maintenance: number): number {
  if (goal === "LOSE_FAT") {
    return Math.max(Math.round(maintenance - 500), 1200);
  }
  return Math.round(maintenance + 250);
}

export function buildRollingAverage(logs: CalorieLogEntry[], days = 7): number {
  const lastDays = getLastNDates(days);
  const total = lastDays.reduce((sum, day) => {
    const entry = logs.find((l) => l.date === day);
    return sum + (entry?.calories ?? 0);
  }, 0);
  return Math.round(total / days);
}

export function evaluateStatus(avg: number, target: number): "ON_TRACK" | "OFF_TRACK" {
  return Math.abs(avg - target) <= 150 ? "ON_TRACK" : "OFF_TRACK";
}

export function buildRecommendation(avg: number, target: number, status: "ON_TRACK" | "OFF_TRACK") {
  if (status === "ON_TRACK") {
    return "Great work! Keep your current daily calorie habits this week.";
  }
  const delta = target - avg;
  const direction = delta > 0 ? "increase" : "decrease";
  const adjustment = Math.min(Math.abs(delta), 300);
  return `You are off target. Aim to ${direction} intake by about ${Math.round(adjustment)} calories per day.`;
}

export function buildPlan(target: number) {
  return `For the next 7 days, center meals around your target of ~${Math.round(
    target
  )} calories/day. Log everything daily.`;
}

export function buildProjection(
  goal: GoalType,
  maintenance: number,
  average: number
): string {
  const dailyDelta = maintenance - average;
  if (goal === "LOSE_FAT") {
    const weeklyChange = (dailyDelta * 7) / 7700;
    const trend = weeklyChange >= 0 ? "loss" : "gain";
    return `Estimated weight ${trend}: ${Math.abs(weeklyChange).toFixed(2)} kg/week if habits stay similar.`;
  }
  const surplus = average - maintenance;
  const weeklyTrend = (surplus * 7) / 7700;
  return `Scale weight trend (not pure muscle): ${weeklyTrend >= 0 ? "+" : "-"}${Math.abs(weeklyTrend).toFixed(
    2
  )} kg/week based on calorie surplus.`;
}

export function scienceNotes(): string {
  return "Calories are estimates. The model assumes average activity and is not medical advice. Adjust based on how you feel and consult a professional when unsure.";
}

export function computeGuidance(profile: ProfileData, logs: CalorieLogEntry[]): GuidanceResult {
  const maintenanceCalories = estimateMaintenance(profile);
  const target = targetCalories(profile.goalType, maintenanceCalories);
  const averageIntake = buildRollingAverage(logs, 7);
  const status = evaluateStatus(averageIntake, target);
  const recommendation = buildRecommendation(averageIntake, target, status);
  const plan = buildPlan(target);
  const projection = buildProjection(profile.goalType, maintenanceCalories, averageIntake);
  const notes = scienceNotes();

  return {
    maintenanceCalories,
    targetCalories: target,
    averageIntake,
    status,
    recommendation,
    plan,
    projection,
    notes,
  };
}
