import { DETECTION } from "./config";
import type { AlertCandidate } from "@/types/alert";
import type { ReadingPoint } from "@/types/reading";
import type { DetectionPoint } from "@/types/point";

/**
 * Blockage: the pump is pushing pressure up but almost no water reaches the
 * field — a classic clogged filter, crushed line or closed inline tap.
 */
export function detectBlockage(
  reading: ReadingPoint,
  point: DetectionPoint
): AlertCandidate | null {
  if (reading.valve_state !== "open") return null;

  const highPressure = point.max_pressure * DETECTION.blockagePressureRatio;
  const lowFlow = point.expected_flow_rate * DETECTION.blockageFlowRatio;

  if (reading.pressure <= highPressure || reading.flow_rate >= lowFlow) return null;

  return {
    type: "blockage",
    severity: "warning",
    title: `Possible blockage in ${point.name}`,
    message:
      `Pressure is ${Math.round(reading.pressure)} kPa (above the ${Math.round(highPressure)} kPa ceiling) ` +
      `but flow is only ${reading.flow_rate.toFixed(1)} L/min against an expected ` +
      `${point.expected_flow_rate.toFixed(1)} L/min. Inspect filters and inline valves.`,
    metrics: {
      flow_rate: reading.flow_rate,
      pressure: reading.pressure,
      valve_state: reading.valve_state,
      expected_flow_rate: point.expected_flow_rate,
    },
  };
}
