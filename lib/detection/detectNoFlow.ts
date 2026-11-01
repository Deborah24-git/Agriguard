import { DETECTION } from "./config";
import type { AlertCandidate } from "@/types/alert";
import type { ReadingPoint } from "@/types/reading";
import type { DetectionPoint } from "@/types/point";

/**
 * No flow: the valve is open and pressurised but the meter is essentially
 * still. Covers a pump that never started, an airlock or a fully closed main.
 */
export function detectNoFlow(
  reading: ReadingPoint,
  point: DetectionPoint
): AlertCandidate | null {
  if (reading.valve_state !== "open") return null;

  const floor = point.expected_flow_rate * DETECTION.noFlowRatio;
  if (reading.flow_rate > floor) return null;

  return {
    type: "no_flow",
    severity: "critical",
    title: `No water moving in ${point.name}`,
    message:
      `The valve is open at ${Math.round(reading.pressure)} kPa but flow is only ` +
      `${reading.flow_rate.toFixed(1)} L/min. The crop is not being irrigated — ` +
      `check the pump, airlock and main line.`,
    metrics: {
      flow_rate: reading.flow_rate,
      pressure: reading.pressure,
      valve_state: reading.valve_state,
      expected_flow_rate: point.expected_flow_rate,
    },
  };
}
