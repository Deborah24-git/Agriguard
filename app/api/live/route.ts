import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { getLivePayload } from "@/services/system/getLivePayload";

export const dynamic = "force-dynamic";

/** Polled by the dashboard every few seconds for live telemetry. */
export async function GET(): Promise<NextResponse> {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const payload = await getLivePayload(user.id, user.role);
  return NextResponse.json(payload, {
    headers: { "Cache-Control": "no-store" },
  });
}
