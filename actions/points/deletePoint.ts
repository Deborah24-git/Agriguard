"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { hasPermission } from "@/lib/permissions";
import { requireSessionUser } from "@/lib/session";
import { deletePointRecord } from "@/services/points/deletePointRecord";

export async function deletePoint(formData: FormData): Promise<void> {
  const user = await requireSessionUser();
  if (!hasPermission(user.role, "points:write")) throw new Error("Forbidden");

  const pointId = String(formData.get("point_id") ?? "");
  if (!pointId) throw new Error("Missing point id.");

  const removed = await deletePointRecord(pointId, user.id, user.role);
  if (!removed) throw new Error("Point not found.");

  revalidatePath("/points");
  revalidatePath("/dashboard");
  revalidatePath("/reports");
  redirect("/points");
}
