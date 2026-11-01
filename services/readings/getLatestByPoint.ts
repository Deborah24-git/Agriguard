import { Types } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Reading from "@/models/Reading";
import { toReadingPoint } from "./toReadingDTO";
import type { ReadingPoint } from "@/types/reading";

/** Newest reading per point, in one aggregation. */
export async function getLatestByPoint(
  pointIds: string[]
): Promise<Map<string, ReadingPoint>> {
  if (pointIds.length === 0) return new Map();

  await connectDB();

  const rows = await Reading.aggregate<{ _id: Types.ObjectId; doc: unknown }>([
    { $match: { point_id: { $in: pointIds.map((id) => new Types.ObjectId(id)) } } },
    { $sort: { recorded_at: -1 } },
    { $group: { _id: "$point_id", doc: { $first: "$$ROOT" } } },
  ]);

  return new Map(
    rows.map((row) => [
      row._id.toString(),
      toReadingPoint(row.doc as Parameters<typeof toReadingPoint>[0]),
    ])
  );
}
