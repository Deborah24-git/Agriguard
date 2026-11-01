import { connectDB } from "@/lib/mongodb";
import { ROLES, type Role } from "@/lib/permissions";
import Alert from "@/models/Alert";
import type { AlertStatus } from "@/types/alert";

interface UpdateResult {
  ok: boolean;
  error?: string;
}

/**
 * Moves an alert through its lifecycle. Resolving is terminal; acknowledging
 * only applies to an open alert. Admins may act on any farm's alerts.
 */
export async function updateAlertStatus(
  alertId: string,
  next: Exclude<AlertStatus, "open">,
  userId: string,
  role: Role = ROLES.FARMER
): Promise<UpdateResult> {
  await connectDB();

  const now = new Date();
  const update =
    next === "acknowledged"
      ? { status: "acknowledged", acknowledged_at: now }
      : { status: "resolved", resolved_at: now };

  const filter: Record<string, unknown> = { _id: alertId };
  if (role !== ROLES.ADMIN) filter.owner_id = userId;
  if (next === "acknowledged") filter.status = "open";

  const alert = await Alert.findOneAndUpdate(filter, update, { new: true });
  if (!alert) return { ok: false, error: "Alert not found or already updated." };

  return { ok: true };
}
