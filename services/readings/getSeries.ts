import { connectDB } from "@/lib/mongodb";
import Reading from "@/models/Reading";
import { toReadingDTO } from "./toReadingDTO";
import type { ReadingDTO } from "@/types/reading";

/** Readings from the last `hoursBack` hours, oldest first — feeds the chart. */
export async function getSeries(
  pointId: string,
  hoursBack: number
): Promise<ReadingDTO[]> {
  await connectDB();

  const from = new Date(Date.now() - hoursBack * 60 * 60_000);
  const readings = await Reading.find({
    point_id: pointId,
    recorded_at: { $gte: from },
  }).sort({ recorded_at: 1 });

  return readings.map(toReadingDTO);
}
