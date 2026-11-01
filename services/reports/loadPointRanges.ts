import { connectDB } from "@/lib/mongodb";
import Reading from "@/models/Reading";
import { getPointsForUser } from "@/services/points/getPointsForUser";
import { toReadingPoint } from "@/services/readings/toReadingDTO";
import { rangeStart } from "@/lib/reports/days";
import type { Role } from "@/lib/permissions";
import type { PointDTO } from "@/types/point";
import type { ReadingPoint } from "@/types/reading";

export interface PointRange {
  point: PointDTO;
  readings: ReadingPoint[];
}

/**
 * Loads every reading inside the report window once, grouped per point.
 * The pure compute helpers then work on this without touching Mongo.
 */
export async function loadPointRanges(
  userId: string,
  role: Role,
  days: number
): Promise<PointRange[]> {
  const points = await getPointsForUser(userId, role);
  if (points.length === 0) return [];

  await connectDB();

  const ids = points.map((point) => point.id);
  const readings = await Reading.find({
    point_id: { $in: ids },
    recorded_at: { $gte: rangeStart(days) },
  }).sort({ recorded_at: 1 });

  const grouped = new Map<string, ReadingPoint[]>();
  for (const reading of readings) {
    const key = reading.point_id.toString();
    const bucket = grouped.get(key) ?? [];
    bucket.push(toReadingPoint(reading));
    grouped.set(key, bucket);
  }

  return points.map((point) => ({
    point,
    readings: grouped.get(point.id) ?? [],
  }));
}
