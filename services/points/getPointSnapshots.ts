import { Types } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { computeVolume } from "@/lib/analytics/volume";
import Alert from "@/models/Alert";
import Reading from "@/models/Reading";
import { getLatestByPoint } from "@/services/readings/getLatestByPoint";
import { toReadingPoint } from "@/services/readings/toReadingDTO";
import { getPointsForUser } from "./getPointsForUser";
import { derivePointStatus } from "@/lib/detection/derivePointStatus";
import type { Role } from "@/lib/permissions";
import type { PointSnapshot } from "@/types/point";

async function litresToday(pointIds: string[]): Promise<Map<string, number>> {
  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0);

  const readings = await Reading.find({
    point_id: { $in: pointIds },
    recorded_at: { $gte: midnight },
  }).sort({ recorded_at: 1 });

  const grouped = new Map<string, ReturnType<typeof toReadingPoint>[]>();
  for (const reading of readings) {
    const key = reading.point_id.toString();
    const bucket = grouped.get(key) ?? [];
    bucket.push(toReadingPoint(reading));
    grouped.set(key, bucket);
  }

  return new Map(
    Array.from(grouped.entries()).map(([key, points]) => [key, Math.round(computeVolume(points))])
  );
}

async function openAlertCounts(pointIds: string[]): Promise<Map<string, number>> {
  const rows = await Alert.aggregate<{ _id: Types.ObjectId; count: number }>([
    {
      $match: {
        point_id: { $in: pointIds.map((id) => new Types.ObjectId(id)) },
        status: "open",
      },
    },
    { $group: { _id: "$point_id", count: { $sum: 1 } } },
  ]);

  return new Map(rows.map((row) => [row._id.toString(), row.count]));
}

/** One batched read for the dashboard, points list and zone detail header. */
export async function getPointSnapshots(
  userId: string,
  role: Role
): Promise<PointSnapshot[]> {
  const points = await getPointsForUser(userId, role);
  if (points.length === 0) return [];

  await connectDB();
  const ids = points.map((point) => point.id);

  const [latest, volumes, alerts] = await Promise.all([
    getLatestByPoint(ids),
    litresToday(ids),
    openAlertCounts(ids),
  ]);

  return points.map((point) => {
    const reading = latest.get(point.id) ?? null;

    return {
      point,
      status: derivePointStatus(reading, point, point.is_active),
      flow_rate: reading ? reading.flow_rate : null,
      pressure: reading ? reading.pressure : null,
      valve_state: reading ? reading.valve_state : null,
      last_reading_at: reading ? reading.recorded_at.toISOString() : null,
      litres_today: volumes.get(point.id) ?? 0,
      open_alerts: alerts.get(point.id) ?? 0,
    };
  });
}
