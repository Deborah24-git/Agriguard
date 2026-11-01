import { NextResponse, type NextRequest } from "next/server";
import Point from "@/models/Point";
import Sensor from "@/models/Sensor";
import User from "@/models/User";
import { recordReading } from "@/services/readings/recordReading";
import { recordLevelReading } from "@/services/tank/recordLevelReading";
import type { TankAsset } from "@/types/tank";

interface IngestBody {
  point_code?: string;
  sensor_code?: string;
  flow_rate?: number;
  pressure?: number;
  valve_state?: "open" | "closed";
  asset?: TankAsset;
  level_pct?: number;
  recorded_at?: string;
}

/**
 * Gateway ingest. Authenticated with a shared key rather than a user session,
 * so field hardware can post without a browser login.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const expected = process.env.INGEST_API_KEY;
  if (!expected || request.headers.get("x-api-key") !== expected) {
    return NextResponse.json({ error: "Invalid ingest key." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as IngestBody | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const recordedAt = body.recorded_at ? new Date(body.recorded_at) : new Date();

  if (body.asset && typeof body.level_pct === "number") {
    const owner = await User.findOne({ role: "farmer" }).select("_id");
    const sensor = body.sensor_code
      ? await Sensor.findOne({ code: body.sensor_code }).select("_id")
      : null;

    const alertRaised = await recordLevelReading({
      asset: body.asset,
      levelPct: body.level_pct,
      sensorId: sensor?._id.toString() ?? null,
      ownerId: owner?._id.toString() ?? null,
      recordedAt,
    });

    return NextResponse.json({ ok: true, alert_raised: alertRaised }, { status: 201 });
  }

  const pointCode = body.point_code?.toUpperCase();
  if (
    !pointCode ||
    typeof body.flow_rate !== "number" ||
    typeof body.pressure !== "number" ||
    (body.valve_state !== "open" && body.valve_state !== "closed")
  ) {
    return NextResponse.json(
      { error: "point_code, flow_rate, pressure and valve_state are required." },
      { status: 400 }
    );
  }

  const point = await Point.findOne({ code: pointCode });
  if (!point) {
    return NextResponse.json({ error: `Unknown point ${pointCode}.` }, { status: 404 });
  }

  const sensor = body.sensor_code
    ? await Sensor.findOne({ code: body.sensor_code }).select("_id")
    : await Sensor.findOne({ point_id: point._id, type: "flow" }).select("_id");

  const result = await recordReading({
    pointId: point._id.toString(),
    flowRate: body.flow_rate,
    pressure: body.pressure,
    valveState: body.valve_state,
    sensorId: sensor?._id.toString() ?? null,
    recordedAt,
    source: "sensor",
  });

  return NextResponse.json(
    { ok: true, alert_raised: result.alertRaised },
    { status: 201 }
  );
}
