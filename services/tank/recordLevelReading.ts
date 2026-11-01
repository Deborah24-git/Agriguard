import { connectDB } from "@/lib/mongodb";
import Alert from "@/models/Alert";
import LevelReading from "@/models/LevelReading";
import Sensor from "@/models/Sensor";
import { DETECTION } from "@/lib/detection/config";
import {
  REFILL_THRESHOLD_PCT,
  TANK_ASSET_LABELS,
  type TankAsset,
} from "@/types/tank";

export interface LevelInput {
  asset: TankAsset;
  levelPct: number;
  sensorId?: string | null;
  ownerId?: string | null;
  recordedAt?: Date;
}

/**
 * Stores an ultrasonic level sample. The tank (not the standpipes) raises a
 * low-level alert so the borehole pump can be started before the line runs dry.
 */
export async function recordLevelReading(input: LevelInput): Promise<boolean> {
  await connectDB();

  const recordedAt = input.recordedAt ?? new Date();
  const level = Math.max(0, Math.min(100, input.levelPct));

  await LevelReading.create({
    asset: input.asset,
    level_pct: level,
    sensor_id: input.sensorId ?? null,
    recorded_at: recordedAt,
  });

  if (input.sensorId) {
    await Sensor.findByIdAndUpdate(input.sensorId, {
      last_value: level,
      last_seen_at: recordedAt,
      status: "online",
    });
  }

  if (input.asset !== "tank" || level >= REFILL_THRESHOLD_PCT) return false;
  if (!input.ownerId) return false;

  const cooldownStart = new Date(
    Date.now() - DETECTION.alertCooldownMinutes * 60_000
  );

  const duplicate = await Alert.exists({
    type: "low_tank",
    status: { $ne: "resolved" },
    detected_at: { $gte: cooldownStart },
  });
  if (duplicate) return false;

  await Alert.create({
    owner_id: input.ownerId,
    point_id: null,
    sensor_id: input.sensorId ?? null,
    type: "low_tank",
    severity: "critical",
    title: "Smart tank needs a refill",
    message: `${TANK_ASSET_LABELS.tank} is at ${Math.round(level)}%, under the ${REFILL_THRESHOLD_PCT}% refill threshold. Start the borehole pump.`,
    status: "open",
    flow_rate: 0,
    pressure: 0,
    detected_at: new Date(),
    sms_status: null,
  });

  return true;
}
