import { isValveOpen } from "./schedule";
import type { IrrigationSchedule } from "@/types/point";
import type { ValveState } from "@/types/reading";

export type SimulatedFault =
  | "none"
  | "leak"
  | "blockage"
  | "pressure_drop"
  | "no_flow";

export interface SimulationPoint {
  name: string;
  expected_flow_rate: number;
  min_pressure: number;
  max_pressure: number;
  schedule: IrrigationSchedule;
  simulated_fault?: SimulatedFault;
}

export interface SimulatedSample {
  flow_rate: number;
  pressure: number;
  valve_state: ValveState;
}

/** Deterministic wobble so seeded history looks like a real sensor. */
function wobble(seed: number, at: Date, amplitude: number): number {
  return Math.sin(at.getTime() / 600_000 + seed) * amplitude;
}

function round(value: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/**
 * Produces one plausible sample for a point, including its scripted fault.
 * The same function feeds the seed script and every live simulator tick, so
 * history and "real time" stay consistent.
 */
export function generatePointSample(
  point: SimulationPoint,
  at: Date,
  seed = point.name.length
): SimulatedSample {
  const open = isValveOpen(point.schedule, at);
  const fault = point.simulated_fault ?? "none";
  const midPressure = (point.min_pressure + point.max_pressure) / 2;
  const band = point.max_pressure - point.min_pressure;

  if (!open) {
    if (fault === "leak") {
      return {
        flow_rate: round(point.expected_flow_rate * 0.32 + wobble(seed, at, 1.2)),
        pressure: round(midPressure * 0.4 + wobble(seed, at, 3)),
        valve_state: "closed",
      };
    }
    return {
      flow_rate: round(Math.max(0, wobble(seed + 2, at, 0.08)), 2),
      pressure: round(point.min_pressure * 0.35 + wobble(seed + 3, at, 2)),
      valve_state: "closed",
    };
  }

  switch (fault) {
    case "blockage":
      return {
        flow_rate: round(point.expected_flow_rate * 0.42 + wobble(seed, at, 0.6)),
        pressure: round(point.max_pressure * 1.22 + wobble(seed, at, 3)),
        valve_state: "open",
      };
    case "pressure_drop":
      return {
        flow_rate: round(point.expected_flow_rate * 0.88 + wobble(seed, at, 1.4)),
        pressure: round(point.min_pressure * 0.62 + wobble(seed, at, 2)),
        valve_state: "open",
      };
    case "no_flow":
      return {
        flow_rate: round(0.2 + Math.abs(wobble(seed, at, 0.1)), 2),
        pressure: round(point.min_pressure * 0.92 + wobble(seed, at, 2)),
        valve_state: "open",
      };
    default:
      return {
        flow_rate: round(point.expected_flow_rate * (1 + wobble(seed, at, 0.05)), 2),
        pressure: round(midPressure + wobble(seed, at, band * 0.12)),
        valve_state: "open",
      };
  }
}
