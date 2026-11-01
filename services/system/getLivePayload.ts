import { getAlertFeed } from "@/services/alerts/getAlertFeed";
import { getSystemOverview } from "./getSystemOverview";
import { summarisePoints } from "@/services/points/summarisePoints";
import { getLevelTrend } from "@/services/tank/getTankLevels";
import type { Role } from "@/lib/permissions";
import type { LivePayload } from "@/types/live";

/** Everything the dashboard polls for, assembled in one round trip. */
export async function getLivePayload(
  userId: string,
  role: Role
): Promise<LivePayload> {
  const [overview, alerts, tankTrend] = await Promise.all([
    getSystemOverview(userId, role),
    getAlertFeed(userId, role, { status: "open", limit: 6 }),
    getLevelTrend("tank", 72),
  ]);

  return {
    summary: summarisePoints(overview.points),
    overview,
    snapshots: overview.points,
    tank_trend: tankTrend,
    alerts,
    generated_at: new Date().toISOString(),
  };
}
