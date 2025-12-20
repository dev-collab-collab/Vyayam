import { describe, expect, it } from "vitest";
import {
  estimateMaintenance,
  targetCalories,
  buildRollingAverage,
  computeGuidance,
  evaluateStatus,
} from "@/lib/guidance";
import { GoalType } from "@prisma/client";

const sampleProfile = { age: 32, weightKg: 80, goalType: GoalType.LOSE_FAT as const };

describe("guidance algorithm", () => {
  it("adjusts maintenance by age", () => {
    expect(estimateMaintenance({ ...sampleProfile, age: 45 })).toBeCloseTo(80 * 33 * 0.97);
    expect(estimateMaintenance({ ...sampleProfile, age: 22 })).toBeCloseTo(80 * 33 * 1.02);
  });

  it("caps fat loss target to minimum calories", () => {
    const maintenance = 1500;
    expect(targetCalories(GoalType.LOSE_FAT, maintenance)).toBeGreaterThanOrEqual(1200);
  });

  it("computes rolling average over missing days as zero", () => {
    const logs = [
      { date: "2024-01-01", calories: 2000 },
      { date: "2024-01-02", calories: 2100 },
    ];
    const avg = buildRollingAverage(logs, 2);
    expect(avg).toBeGreaterThan(0);
  });

  it("flags off track when outside tolerance", () => {
    expect(evaluateStatus(1800, 2000)).toBe("ON_TRACK");
    expect(evaluateStatus(1500, 2000)).toBe("OFF_TRACK");
  });

  it("returns complete guidance payload", () => {
    const guidance = computeGuidance(sampleProfile, [
      { date: "2024-01-01", calories: 2000 },
      { date: "2024-01-02", calories: 2100 },
      { date: "2024-01-03", calories: 1900 },
      { date: "2024-01-04", calories: 2050 },
      { date: "2024-01-05", calories: 1950 },
      { date: "2024-01-06", calories: 1800 },
      { date: "2024-01-07", calories: 2000 },
    ]);
    expect(guidance.targetCalories).toBeGreaterThan(0);
    expect(guidance.recommendation.length).toBeGreaterThan(0);
  });
});
