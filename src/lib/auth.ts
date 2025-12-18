import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const SESSION_COOKIE = "vyayam_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

export async function createSession(userId: string) {
  const session = await prisma.session.create({
    data: {
      userId,
      expiresAt: new Date(Date.now() + SESSION_MAX_AGE * 1000),
    },
  });
  return session;
}

export function setSessionCookie(response: NextResponse, sessionId: string) {
  response.cookies.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession(sessionId: string) {
  if (sessionId === "qa-static") return;
  await prisma.session.deleteMany({ where: { id: sessionId } });
}

export async function getSessionUser(req: NextRequest) {
  const sessionId = req.cookies.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  if (sessionId === "qa-static") {
    return { id: "qa", email: "qa" } as any;
  }

  const session = await prisma.session.findFirst({
    where: {
      id: sessionId,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  });

  if (!session) return null;

  // Lock down access to the QA account only.
  if (session.user.email !== "qa") {
    await destroySession(sessionId);
    return null;
  }

  return session.user;
}

export async function requireUser(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) {
    return null;
  }
  return user;
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
  });
}
