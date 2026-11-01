import { countOpenAlerts } from "@/services/alerts/countOpenAlerts";
import { getPointSnapshots } from "@/services/points/getPointSnapshots";
import { getTankLevels } from "@/services/tank/getTankLevels";
import { getPumpRuntimeMinutes } from "./getPumpRuntimeMinutes";
import type { Role } from "@/lib/permissions";
import type { PumpStatus, SystemOverview } from "@/types/system";

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((total, value) => total + value, 0) / values.length;
}

/**
 * One payload for the water-system panel: borehole pump, smart tank with its
 * ultrasonic probe, the three standpipes, and the point snapshots they feed.
 */
export async function getSystemOverview(
  userId: string,
  role: Role
): Promise<SystemOverview> {
  const [snapshots, levels, openAlerts, runtimeMinutes] = await Promise.all([
    getPointSnapshots(userId, role),
    getTankLevels(),
    countOpenAlerts(userId, role),
    getPumpRuntimeMinutes(userId, role),
  ]);

  const tank = levels.find((level) => level.asset === "tank");
  const standpipes = levels.filter((level) => level.asset !== "tank");

  const openPoints = snapshots.filter((snapshot) => snapshot.valve_state === "open");
  const pumping = Boolean(tank?.needs_refill) || openPoints.length > 0;

  const lastSeen = snapshots
    .map((snapshot) => snapshot.last_reading_at)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1) ?? null;

  const pump: PumpStatus = {
    state: pumping ? "running" : "idle",
    pressure_kpa: Math.round(
      average(
        openPoints
          .map((snapshot) => snapshot.pressure)
          .filter((value): value is number => value !== null)
      )
    ),
    flow_rate: Math.round(
      snapshots.reduce((total, snapshot) => total + (snapshot.flow_rate ?? 0), 0)
    ),
    runtime_minutes_today: runtimeMinutes,
    last_updated_at: lastSeen,
  };

  return {
    pump,
    tank: tank ?? {
      asset: "tank",
      label: "Smart tank",
      level_pct: 0,
      capacity_litres: 25_000,
      refill_threshold_pct: 25,
      needs_refill: true,
      last_reading_at: null,
    },
    standpipes,
    points: snapshots,
    open_alerts: openAlerts,
    litres_today: Math.round(
      snapshots.reduce((total, snapshot) => total + snapshot.litres_today, 0)
    ),
  };
}
