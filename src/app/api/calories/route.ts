import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calorieLogSchema } from "@/lib/validators";
import { requireUser } from "@/lib/auth";
import { formatYMD, parseYMD, getDateRange } from "@/lib/utils/date";

export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  if (!from || !to) return NextResponse.json({ message: "from/to required" }, { status: 400 });

  const fromDate = parseYMD(from);
  const toDate = parseYMD(to);
  const logs = await prisma.calorieLog.findMany({
    where: { userId: user.id, date: { gte: fromDate, lte: toDate } },
    orderBy: { date: "desc" },
  });

  const dateRange = getDateRange(fromDate, toDate).reverse();
  const normalized = dateRange.map((d) => {
    const entry = logs.find((l) => formatYMD(l.date) === d);
    return { date: d, calories: entry ? entry.calories : 0 };
  });

  return NextResponse.json({ logs: normalized });
}

export async function POST(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = calorieLogSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.message }, { status: 400 });
  }

  const { date, calories } = parsed.data;
  const dateValue = parseYMD(date);
  await prisma.calorieLog.upsert({
    where: { userId_date: { userId: user.id, date: dateValue } },
    update: { calories },
    create: { userId: user.id, date: dateValue, calories },
  });

  return NextResponse.json({ ok: true });
}
