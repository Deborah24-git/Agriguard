import { detectSessions } from "@/lib/reports/sessions";
import type { PointRange } from "./loadPointRanges";
import type { NamedSession } from "@/types/report";

/** Completed runs across every point, most recent first. */
export function collectNamedSessions(
  ranges: PointRange[],
  limit = 12
): NamedSession[] {
  const sessions: NamedSession[] = [];

  for (const range of ranges) {
    for (const session of detectSessions(range.readings)) {
      sessions.push({
        ...session,
        point_id: range.point.id,
        point_name: range.point.name,
      });
    }
  }

  return sessions
    .sort((a, b) => b.started_at.localeCompare(a.started_at))
    .slice(0, limit);
}
