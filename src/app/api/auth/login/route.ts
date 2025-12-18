import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validators";
import { setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Please enter your QA credentials (qa/qa)." }, { status: 400 });
  }
  const { email, password } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();

  // Only allow the hardcoded QA credentials.
  if (normalizedEmail !== "qa" || password !== "qa") {
    return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  setSessionCookie(res, "qa-static");
  return res;
}
