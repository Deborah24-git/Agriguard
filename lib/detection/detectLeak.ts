import { DETECTION } from "./config";
import type { AlertCandidate } from "@/types/alert";
import type { ReadingPoint } from "@/types/reading";
import type { DetectionPoint } from "@/types/point";

/**
 * Leak: water is moving strongly while the valve is supposed to be shut.
 * This is the clearest signal of a burst pipe or a valve stuck open.
 */
export function detectLeak(
  reading: ReadingPoint,
  point: DetectionPoint
): AlertCandidate | null {
  if (reading.valve_state !== "closed") return null;

  const threshold = Math.max(
    DETECTION.leakMinFlowLpm,
    point.expected_flow_rate * DETECTION.leakFlowRatio
  );
  if (reading.flow_rate <= threshold) return null;

  return {
    type: "leak",
    severity: "critical",
    title: `Water flowing in ${point.name} while shut off`,
    message:
      `${reading.flow_rate.toFixed(1)} L/min is passing through the meter while the valve is closed. ` +
      `Check the line for a burst pipe or a valve that failed open.`,
    metrics: {
      flow_rate: reading.flow_rate,
      pressure: reading.pressure,
      valve_state: reading.valve_state,
      expected_flow_rate: point.expected_flow_rate,
    },
  };
}
