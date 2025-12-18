import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/guidance/route";

const mockProfile = { age: 30, weightKg: 75, goalType: "LOSE_FAT" as const, userId: "user1", id: "p1", updatedAt: new Date() };
const mockLogs = [{ id: "l1", userId: "user1", date: new Date("2024-01-02"), calories: 2200, createdAt: new Date(), updatedAt: new Date() }];

const profileFindUnique = vi.fn();
const calorieFindMany = vi.fn();
const requireUser = vi.fn(async () => ({ id: "user1" }));
const getLastNDates = vi.fn(() => ["2024-01-01", "2024-01-02"]);

vi.mock("@/lib/auth", () => ({ requireUser: () => requireUser() }));
vi.mock("@/lib/db", () => ({ prisma: { profile: { findUnique: (...args: any[]) => profileFindUnique(...args) }, calorieLog: { findMany: (...args: any[]) => calorieFindMany(...args) } } }));
vi.mock("@/lib/date", async () => {
  const actual = await vi.importActual<any>("@/lib/date");
  return { ...actual, getLastNDates: () => getLastNDates() };
});

describe("guidance API", () => {
  beforeEach(() => {
    profileFindUnique.mockResolvedValue(mockProfile);
    calorieFindMany.mockResolvedValue(mockLogs);
    requireUser.mockResolvedValue({ id: "user1" });
    getLastNDates.mockReturnValue(["2024-01-01", "2024-01-02"]);
  });

  it("returns guidance data for authenticated user", async () => {
    const res = await GET(new NextRequest("http://localhost/api/guidance"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.profile.goalType).toBe("LOSE_FAT");
    expect(json.guidance.targetCalories).toBeGreaterThan(0);
    expect(json.logs.length).toBe(2);
  });

  it("rejects unauthenticated access", async () => {
    requireUser.mockResolvedValueOnce(null);
    const res = await GET(new NextRequest("http://localhost/api/guidance"));
    expect(res.status).toBe(401);
  });
});
