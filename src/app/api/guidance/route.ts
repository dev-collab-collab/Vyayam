import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { computeGuidance } from "@/lib/guidance";
import { formatYMD, getLastNDates, parseYMD } from "@/lib/date";

export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
  if (!profile) return NextResponse.json({ message: "Profile missing" }, { status: 404 });

  const last14Dates = getLastNDates(14);
  const startDate = parseYMD(last14Dates[0]);
  const endDate = parseYMD(last14Dates[last14Dates.length - 1]);
  const logs = await prisma.calorieLog.findMany({
    where: { userId: user.id, date: { gte: startDate, lte: endDate } },
  });

  const normalizedLogs = last14Dates
    .map((date) => {
      const match = logs.find((l) => formatYMD(l.date) === date);
      return { date, calories: match ? match.calories : 0 };
    })
    .reverse();

  const guidance = computeGuidance(
    { age: profile.age, weightKg: profile.weightKg, goalType: profile.goalType },
    normalizedLogs
  );

  return NextResponse.json({ profile, guidance, logs: normalizedLogs });
}
