import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validators";
import { setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Please enter your credentials." }, { status: 400 });
  }
  const { email, password, otp } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();

  // QA OTP bypass: qa@qa.com + 111111
  if (normalizedEmail === "qa@qa.com") {
    if (otp === "111111") {
      const res = NextResponse.json({ ok: true });
      setSessionCookie(res, "qa-static");
      return res;
    }
    return NextResponse.json({ message: "Enter the 6-digit code we provided." }, { status: 401 });
  }

  // Legacy QA credentials (qa / qa) kept for compatibility.
  if (normalizedEmail !== "qa" || password !== "qa") {
    return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  setSessionCookie(res, "qa-static");
  return res;
}
