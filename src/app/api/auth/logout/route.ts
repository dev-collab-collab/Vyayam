import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, clearSessionCookie, destroySession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const sessionId = req.cookies.get(SESSION_COOKIE)?.value;
  if (sessionId) {
    await destroySession(sessionId);
  }
  const res = NextResponse.json({ ok: true });
  clearSessionCookie(res);
  return res;
}
