import { connectDB } from "@/lib/mongodb";
import { ROLES, type Role } from "@/lib/permissions";
import Alert from "@/models/Alert";
import Point from "@/models/Point";
import { toAlertDTO } from "./toAlertDTO";
import type { AlertStatus } from "@/types/alert";
import type { AlertDTO } from "@/types/alert";

interface FeedOptions {
  status?: AlertStatus;
  limit?: number;
}

/** Alert inbox: newest first, optionally filtered by status. */
export async function getAlertFeed(
  userId: string,
  role: Role,
  options: FeedOptions = {}
): Promise<AlertDTO[]> {
  await connectDB();

  const filter: Record<string, unknown> = {};
  if (role !== ROLES.ADMIN) filter.owner_id = userId;
  if (options.status) filter.status = options.status;

  const alerts = await Alert.find(filter)
    .sort({ detected_at: -1 })
    .limit(options.limit ?? 50);

  if (alerts.length === 0) return [];

  const pointIds = Array.from(
    new Set(
      alerts
        .map((alert) => (alert.point_id ? alert.point_id.toString() : null))
        .filter((id): id is string => Boolean(id))
    )
  );
  const points = await Point.find({ _id: { $in: pointIds } }).select("name");
  const names = new Map(points.map((point) => [point._id.toString(), point.name]));

  return alerts.map((alert) =>
    toAlertDTO(
      alert,
      alert.point_id
        ? names.get(alert.point_id.toString()) ?? "Unknown point"
        : "Smart tank"
    )
  );
}
