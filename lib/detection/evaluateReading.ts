import { detectBlockage } from "./detectBlockage";
import { detectLeak } from "./detectLeak";
import { detectNoFlow } from "./detectNoFlow";
import { detectPressureDrop } from "./detectPressureDrop";
import type { AlertCandidate } from "@/types/alert";
import type { ReadingPoint } from "@/types/reading";
import type { DetectionPoint } from "@/types/point";

/**
 * Runs every rule against one reading and returns the single most urgent
 * finding. Order matters: a leak is never masked by a pressure symptom.
 */
export function evaluateReading(
  reading: ReadingPoint,
  point: DetectionPoint
): AlertCandidate | null {
  return (
    detectLeak(reading, point) ??
    detectBlockage(reading, point) ??
    detectNoFlow(reading, point) ??
    detectPressureDrop(reading, point)
  );
}
