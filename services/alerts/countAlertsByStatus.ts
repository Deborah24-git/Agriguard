import { Types } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { ROLES, type Role } from "@/lib/permissions";
import Alert from "@/models/Alert";
import type { AlertStatus, AlertStatusCounts } from "@/types/alert";

/** Tab counters for the alert inbox, in one aggregation. */
export async function countAlertsByStatus(
  userId: string,
  role: Role
): Promise<AlertStatusCounts> {
  await connectDB();

  const match: Record<string, unknown> = {};
  if (role !== ROLES.ADMIN) match.owner_id = new Types.ObjectId(userId);

  const rows = await Alert.aggregate<{ _id: AlertStatus; count: number }>([
    { $match: match },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const counts: AlertStatusCounts = { open: 0, acknowledged: 0, resolved: 0 };
  for (const row of rows) counts[row._id] = row.count;
  return counts;
}
