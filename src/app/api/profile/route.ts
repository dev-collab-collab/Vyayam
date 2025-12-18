import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { profileSchema } from "@/lib/validators";
import { requireUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
  if (!profile) return NextResponse.json({ message: "Profile not found" }, { status: 404 });
  return NextResponse.json({ age: profile.age, weightKg: profile.weightKg, goalType: profile.goalType });
}

export async function PUT(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.message }, { status: 400 });
  }

  const data = parsed.data;
  await prisma.profile.upsert({
    where: { userId: user.id },
    update: data,
    create: { ...data, userId: user.id },
  });

  return NextResponse.json({ ok: true });
}
