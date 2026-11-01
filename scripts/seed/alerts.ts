import { evaluateReading } from "@/lib/detection/evaluateReading";
import Alert from "@/models/Alert";
import SmsLog from "@/models/SmsLog";
import type { SmsStatus } from "@/types/sms";
import type { ReadingPoint } from "@/types/reading";
import type { SeededPoint, SeededSensor } from "./history";

const PLAN: Record<
  string,
  { status: "open" | "acknowledged"; minutesAgo: number; sms: SmsStatus }
> = {
  "PT-B": { status: "open", minutesAgo: 12, sms: "skipped" },
  "PT-C": { status: "open", minutesAgo: 19, sms: "sent" },
  "PT-D": { status: "acknowledged", minutesAgo: 26, sms: "sent" },
  "PT-E": { status: "open", minutesAgo: 8, sms: "failed" },
};

export const SEEDED_PHONE = "+27821234567";

/** Raised alerts mirror real detection output, plus a resolved low-tank event. */
export async function seedAlerts(
  ownerId: string,
  points: SeededPoint[],
  sensors: SeededSensor[],
  lastSamples: Map<string, ReadingPoint>
): Promise<number> {
  const now = Date.now();
  let created = 0;

  for (const point of points) {
    const plan = PLAN[point.seed.code];
    const sample = lastSamples.get(point.id);
    if (!plan || !sample) continue;

    const candidate = evaluateReading(sample, point.seed);
    if (!candidate) continue;

    const detectedAt = new Date(now - plan.minutesAgo * 60_000);
    const alert = await Alert.create({
      owner_id: ownerId,
      point_id: point.id,
      sensor_id:
        sensors.find(
          (sensor) => sensor.type === "flow" && sensor.point_id === point.id
        )?.id ?? null,
      type: candidate.type,
      severity: candidate.severity,
      title: candidate.title,
      message: candidate.message,
      status: plan.status,
      flow_rate: candidate.metrics.flow_rate,
      pressure: candidate.metrics.pressure,
      detected_at: detectedAt,
      acknowledged_at:
        plan.status === "acknowledged"
          ? new Date(detectedAt.getTime() + 5 * 60_000)
          : null,
      sms_status: plan.sms,
    });

    await SmsLog.create({
      alert_id: alert._id,
      to: SEEDED_PHONE,
      message: `AgriGuard: ${candidate.title}. ${candidate.message}`.slice(0, 320),
      status: plan.sms,
      provider_id: plan.sms === "sent" ? `AT-${alert._id.toString().slice(-8)}` : null,
      error:
        plan.sms === "failed"
          ? "Insufficient credit on the Africa's Talking account."
          : plan.sms === "skipped"
            ? "Africa's Talking credentials are not configured."
            : null,
      created_at: detectedAt,
    });

    created += 1;
  }

  const lowTankAt = new Date(now - 6 * 86_400_000);
  const lowTank = await Alert.create({
    owner_id: ownerId,
    point_id: null,
    sensor_id: sensors.find((sensor) => sensor.type === "ultrasonic_level")?.id ?? null,
    type: "low_tank",
    severity: "critical",
    title: "Smart tank needed a refill",
    message:
      "Smart tank fell to 22%, under the 25% refill threshold. The borehole pump was started and the tank recovered.",
    status: "resolved",
    flow_rate: 0,
    pressure: 0,
    detected_at: lowTankAt,
    resolved_at: new Date(lowTankAt.getTime() + 42 * 60_000),
    sms_status: "sent",
  });

  await SmsLog.create({
    alert_id: lowTank._id,
    to: SEEDED_PHONE,
    message:
      "AgriGuard: Smart tank needed a refill. Tank at 22%, under the 25% refill threshold.",
    status: "sent",
    provider_id: `AT-${lowTank._id.toString().slice(-8)}`,
    created_at: lowTankAt,
  });

  return created + 1;
}
