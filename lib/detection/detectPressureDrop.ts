import { DETECTION } from "./config";
import type { AlertCandidate } from "@/types/alert";
import type { ReadingPoint } from "@/types/reading";
import type { DetectionPoint } from "@/types/point";

/**
 * Pressure drop: the line is open but pressure has fallen well under the
 * operating floor — usually an upstream break or a struggling pump.
 */
export function detectPressureDrop(
  reading: ReadingPoint,
  point: DetectionPoint
): AlertCandidate | null {
  if (reading.valve_state !== "open") return null;

  const floor = point.min_pressure * DETECTION.pressureDropRatio;
  if (reading.pressure >= floor) return null;

  return {
    type: "pressure_drop",
    severity: "warning",
    title: `Pressure below operating floor in ${point.name}`,
    message:
      `Pressure is ${Math.round(reading.pressure)} kPa, under the ${Math.round(floor)} kPa ` +
      `minimum for this point. Check the pump, supply line and upstream joints.`,
    metrics: {
      flow_rate: reading.flow_rate,
      pressure: reading.pressure,
      valve_state: reading.valve_state,
      expected_flow_rate: point.expected_flow_rate,
    },
  };
}
