import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { profileSchema } from "@/lib/validators";
import { requireUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
  if (!profile) return NextResponse.json({ profileExists: false }, { status: 404 });
  return NextResponse.json({ 
    profileExists: true,
    nickname: profile.nickname,
    email: profile.email,
    age: profile.age, 
    heightCm: profile.heightCm,
    weightKg: profile.weightKg, 
    gender: profile.gender,
    goalType: profile.goalType 
  });
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
