import { evaluateReading } from "./evaluateReading";
import { isStale } from "@/lib/format";
import type { ReadingPoint } from "@/types/reading";
import type { DetectionPoint, PointStatus } from "@/types/point";

/**
 * Resolves the one-word health state shown on the dashboard.
 * Pure: it only looks at the latest reading and the point expectations.
 */
export function derivePointStatus(
  latest: ReadingPoint | null,
  point: DetectionPoint,
  isActive: boolean
): PointStatus {
  if (!isActive) return "inactive";
  if (!latest || isStale(latest)) return "offline";

  const finding = evaluateReading(latest, point);
  if (finding && finding.type !== "low_tank") return finding.type;

  return latest.valve_state === "open" ? "irrigating" : "normal";
}
