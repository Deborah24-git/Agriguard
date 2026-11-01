import { generatePointSample } from "@/lib/simulator/sample";
import Reading from "@/models/Reading";
import LevelReading from "@/models/LevelReading";
import type { IrrigationSchedule } from "@/types/point";
import type { ReadingPoint } from "@/types/reading";
import type { SensorType } from "@/types/sensor";
import type { TankAsset } from "@/types/tank";
import type { PointSeed } from "./data";

const STEP_MS = 10 * 60_000;
const HISTORY_DAYS = 31;
const LEVEL_DAYS = 7;

export interface SeededPoint {
  id: string;
  seed: PointSeed;
  schedule: IrrigationSchedule;
}

export interface SeededSensor {
  id: string;
  type: SensorType;
  point_id: string | null;
}

export const LEVEL_TARGETS: Record<TankAsset, { start: number; end: number }> = {
  tank: { start: 93, end: 78 },
  standpipe_1: { start: 88, end: 72 },
  standpipe_2: { start: 80, end: 65 },
  standpipe_3: { start: 62, end: 41 },
};

/** 31 days of ten-minute samples per point, ending at the current minute. */
export async function seedReadings(
  points: SeededPoint[],
  sensors: SeededSensor[]
): Promise<Map<string, ReadingPoint>> {
  const now = new Date();
  now.setSeconds(0, 0);

  const start = now.getTime() - HISTORY_DAYS * 86_400_000;
  const docs: Record<string, unknown>[] = [];
  const lastSamples = new Map<string, ReadingPoint>();

  points.forEach((point, index) => {
    const sensor = sensors.find(
      (candidate) => candidate.type === "flow" && candidate.point_id === point.id
    );

    for (let at = start; at <= now.getTime(); at += STEP_MS) {
      const recordedAt = new Date(at);
      const sample = generatePointSample(
        {
          name: point.seed.name,
          expected_flow_rate: point.seed.expected_flow_rate,
          min_pressure: point.seed.min_pressure,
          max_pressure: point.seed.max_pressure,
          schedule: point.schedule,
          simulated_fault: point.seed.fault,
        },
        recordedAt,
        index * 7 + 3
      );

      docs.push({
        point_id: point.id,
        sensor_id: sensor?.id ?? null,
        flow_rate: sample.flow_rate,
        pressure: sample.pressure,
        valve_state: sample.valve_state,
        source: "simulator",
        recorded_at: recordedAt,
      });

      lastSamples.set(point.id, { ...sample, recorded_at: recordedAt });
    }
  });

  await Reading.insertMany(docs);
  return lastSamples;
}

/** Seven days of ultrasonic levels, ending on 78 / 72 / 65 / 41 percent. */
export async function seedLevels(
  sensorIds: Partial<Record<TankAsset, string>>
): Promise<void> {
  const now = new Date();
  now.setSeconds(0, 0);

  const start = now.getTime() - LEVEL_DAYS * 86_400_000;
  const steps = Math.round((now.getTime() - start) / STEP_MS);
  const docs: Record<string, unknown>[] = [];

  (Object.keys(LEVEL_TARGETS) as TankAsset[]).forEach((asset) => {
    const { start: from, end } = LEVEL_TARGETS[asset];

    for (let index = 0; index <= steps; index += 1) {
      const progress = index / steps;
      const wobble = Math.sin(index / 9 + asset.length) * 1.2 * (1 - progress);
      const value =
        index === steps ? end : from + (end - from) * progress + wobble;

      docs.push({
        asset,
        level_pct: Math.round(value * 10) / 10,
        sensor_id: sensorIds[asset] ?? null,
        recorded_at: new Date(start + index * STEP_MS),
      });
    }
  });

  await LevelReading.insertMany(docs);
}
