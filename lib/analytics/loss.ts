import { computeClosedValveVolume, volumeBetween } from "./volume";
import type { ReadingPoint } from "@/types/reading";
import type { LossEstimate } from "@/types/report";

/**
 * Two loss sources:
 *  - leak: water billed while the valve was closed
 *  - shortfall: the gap between expected and actual flow during open segments
 *    (a blocked or starved line under-delivers what the schedule asked for)
 */
export function computeLoss(
  points: ReadingPoint[],
  expectedFlowRate: number,
  options: { minShortfallRatio?: number } = {}
): LossEstimate {
  const minShortfallRatio = options.minShortfallRatio ?? 0.9;

  const leakLitres = computeClosedValveVolume(points);

  let shortfallLitres = 0;
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    if (previous.valve_state !== "open" || current.valve_state !== "open") continue;

    const expected = volumeBetween(
      { ...previous, flow_rate: expectedFlowRate },
      { ...current, flow_rate: expectedFlowRate }
    );
    const actual = volumeBetween(previous, current);

    if (actual < expected * minShortfallRatio) {
      shortfallLitres += expected - actual;
    }
  }

  return {
    leak_litres: leakLitres,
    shortfall_litres: shortfallLitres,
    total_litres: leakLitres + shortfallLitres,
  };
}
