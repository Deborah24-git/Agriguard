import { connectDB } from "@/lib/mongodb";
import Reading from "@/models/Reading";
import { toReadingDTO } from "./toReadingDTO";
import type { ReadingDTO } from "@/types/reading";

export async function getRecentReadings(
  pointId: string,
  limit = 10
): Promise<ReadingDTO[]> {
  await connectDB();

  const readings = await Reading.find({ point_id: pointId })
    .sort({ recorded_at: -1 })
    .limit(limit);

  return readings.map(toReadingDTO);
}
