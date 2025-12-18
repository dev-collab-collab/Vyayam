import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ message: "Registrations are disabled. Use QA credentials (qa/qa)." }, { status: 403 });
}
