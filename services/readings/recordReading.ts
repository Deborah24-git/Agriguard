import { connectDB } from "@/lib/mongodb";
import { evaluateReading } from "@/lib/detection/evaluateReading";
import Point from "@/models/Point";
import Reading from "@/models/Reading";
import Sensor from "@/models/Sensor";
import { raiseAlert } from "@/services/alerts/raiseAlert";

export interface ReadingInput {
  pointId: string;
  flowRate: number;
  pressure: number;
  valveState: "open" | "closed";
  sensorId?: string | null;
  recordedAt?: Date;
  source?: "sensor" | "simulator" | "manual";
}

export interface RecordResult {
  alertRaised: boolean;
  smsStatus: "sent" | "failed" | "skipped" | null;
}

/**
 * The single write path for telemetry: store the sample, evaluate the rules,
 * raise at most one alert, and keep the sensor's last value in sync.
 */
export async function recordReading(input: ReadingInput): Promise<RecordResult> {
  await connectDB();

  const point = await Point.findById(input.pointId);
  if (!point) throw new Error("Point not found.");

  const recordedAt = input.recordedAt ?? new Date();

  await Reading.create({
    point_id: point._id,
    sensor_id: input.sensorId ?? null,
    flow_rate: input.flowRate,
    pressure: input.pressure,
    valve_state: input.valveState,
    source: input.source ?? "sensor",
    recorded_at: recordedAt,
  });

  if (input.sensorId) {
    await Sensor.findByIdAndUpdate(input.sensorId, {
      last_value: input.flowRate,
      last_seen_at: recordedAt,
      status: "online",
    });
  }

  const candidate = evaluateReading(
    {
      flow_rate: input.flowRate,
      pressure: input.pressure,
      valve_state: input.valveState,
      recorded_at: recordedAt,
    },
    point
  );

  const alertResult = candidate
    ? await raiseAlert({
        ownerId: point.owner_id.toString(),
        pointId: point._id.toString(),
        sensorId: input.sensorId ?? null,
        candidate,
        simulated: input.source === "simulator",
      })
    : null;

  return {
    alertRaised: alertResult?.created ?? false,
    smsStatus: alertResult?.smsStatus ?? null,
  };
}
