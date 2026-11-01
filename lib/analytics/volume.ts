import type { ReadingPoint } from "@/types/reading";

/** Never integrate across a sensor gap longer than this or volumes inflate. */
const MAX_GAP_MINUTES = 45;

/** Trapezoidal volume for one interval: L/min average × minutes = litres. */
export function volumeBetween(previous: ReadingPoint, current: ReadingPoint): number {
  const minutes =
    (current.recorded_at.getTime() - previous.recorded_at.getTime()) / 60_000;
  if (minutes <= 0) return 0;

  const capped = Math.min(minutes, MAX_GAP_MINUTES);
  const averageFlow = (previous.flow_rate + current.flow_rate) / 2;
  return averageFlow * capped;
}

export function computeVolume(points: ReadingPoint[]): number {
  if (points.length < 2) return 0;

  let litres = 0;
  for (let index = 1; index < points.length; index += 1) {
    litres += volumeBetween(points[index - 1], points[index]);
  }
  return litres;
}

/** Litres that moved while the valve was shut — water that should not be used. */
export function computeClosedValveVolume(points: ReadingPoint[]): number {
  if (points.length < 2) return 0;

  let litres = 0;
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    if (previous.valve_state === "closed" && current.valve_state === "closed") {
      litres += volumeBetween(previous, current);
    }
  }
  return litres;
}
