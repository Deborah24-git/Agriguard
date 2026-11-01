import { computeVolume } from "@/lib/analytics/volume";
import { computeLoss } from "@/lib/analytics/loss";
import { dayKey, dayKeys } from "@/lib/reports/days";
import type { PointRange } from "./loadPointRanges";
import type { DailyUsage } from "@/types/report";
import type { ReadingPoint } from "@/types/reading";

function openMinutes(readings: ReadingPoint[]): number {
  let minutes = 0;
  for (let index = 1; index < readings.length; index += 1) {
    const previous = readings[index - 1];
    const current = readings[index];
    if (previous.valve_state !== "open" || current.valve_state !== "open") continue;

    const gap = (current.recorded_at.getTime() - previous.recorded_at.getTime()) / 60_000;
    minutes += Math.min(Math.max(0, gap), 45);
  }
  return minutes;
}

/** Metered volume, suspected loss and valve-open minutes per local day. */
export function computeDailyUsage(
  ranges: PointRange[],
  days: number
): DailyUsage[] {
  const keys = dayKeys(days);
  const usage = new Map(
    keys.map((key) => [
      key,
      { date: key, litres: 0, lost_litres: 0, irrigation_minutes: 0 },
    ])
  );

  for (const range of ranges) {
    const buckets = new Map<string, ReadingPoint[]>();

    for (const reading of range.readings) {
      const key = dayKey(reading.recorded_at);
      if (!usage.has(key)) continue;
      const bucket = buckets.get(key) ?? [];
      bucket.push(reading);
      buckets.set(key, bucket);
    }

    for (const [key, readings] of buckets) {
      const day = usage.get(key);
      if (!day) continue;

      day.litres += computeVolume(readings);
      day.lost_litres += computeLoss(readings, range.point.expected_flow_rate).total_litres;
      day.irrigation_minutes += openMinutes(readings);
    }
  }

  return keys.map((key) => {
    const day = usage.get(key);
    return {
      date: key,
      litres: Math.round(day?.litres ?? 0),
      lost_litres: Math.round(day?.lost_litres ?? 0),
      irrigation_minutes: Math.round(day?.irrigation_minutes ?? 0),
    };
  });
}
