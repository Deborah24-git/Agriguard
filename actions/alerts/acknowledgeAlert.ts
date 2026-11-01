"use server";

import { revalidatePath } from "next/cache";
import { hasPermission } from "@/lib/permissions";
import { requireSessionUser } from "@/lib/session";
import { updateAlertStatus } from "@/services/alerts/updateAlertStatus";

export async function acknowledgeAlert(formData: FormData): Promise<void> {
  const user = await requireSessionUser();
  if (!hasPermission(user.role, "alerts:write")) throw new Error("Forbidden");

  const alertId = String(formData.get("alert_id") ?? "");
  if (!alertId) throw new Error("Missing alert id.");

  await updateAlertStatus(alertId, "acknowledged", user.id, user.role);

  revalidatePath("/alerts");
  revalidatePath("/dashboard");
}
