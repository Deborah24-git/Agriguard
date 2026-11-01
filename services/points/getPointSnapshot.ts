import { getPointForUser } from "./getPointForUser";
import { getPointSnapshots } from "./getPointSnapshots";
import type { Role } from "@/lib/permissions";
import type { PointSnapshot } from "@/types/point";

/** Dashboard-style snapshot for a single point, or null when not visible. */
export async function getPointSnapshot(
  pointId: string,
  userId: string,
  role: Role
): Promise<PointSnapshot | null> {
  const point = await getPointForUser(pointId, userId, role);
  if (!point) return null;

  const snapshots = await getPointSnapshots(userId, role);
  return snapshots.find((snapshot) => snapshot.point.id === point.id) ?? null;
}
