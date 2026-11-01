import { connectDB } from "@/lib/mongodb";
import Point from "@/models/Point";
import Reading from "@/models/Reading";
import type { Role } from "@/lib/permissions";

/** Demo cadence: the simulator posts a sample every 10 minutes. */
const SAMPLE_MINUTES = 10;

/** Valve-open minutes today, estimated from how many open samples arrived. */
export async function getPumpRuntimeMinutes(
  userId: string,
  role: Role
): Promise<number> {
  await connectDB();

  const pointFilter = role === "admin" ? {} : { owner_id: userId };
  const pointIds = await Point.find(pointFilter).distinct("_id");
  if (pointIds.length === 0) return 0;

  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0);

  const openSamples = await Reading.countDocuments({
    point_id: { $in: pointIds },
    valve_state: "open",
    recorded_at: { $gte: midnight },
  });

  return openSamples * SAMPLE_MINUTES;
}
