"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { hasPermission } from "@/lib/permissions";
import { requireSessionUser } from "@/lib/session";
import { parsePointFormData, validatePointForm, type PointFormState } from "@/lib/pointForm";
import { updatePointRecord } from "@/services/points/updatePointRecord";

export async function updatePoint(
  _previous: PointFormState,
  formData: FormData
): Promise<PointFormState> {
  const user = await requireSessionUser();
  if (!hasPermission(user.role, "points:write")) throw new Error("Forbidden");

  const pointId = String(formData.get("point_id") ?? "");
  if (!pointId) return { error: "Missing point id." };

  const values = parsePointFormData(formData);
  const error = validatePointForm(values);
  if (error) return { error };

  const point = await updatePointRecord(pointId, values, user.id, user.role);
  if (!point) return { error: "That point does not exist or is not yours." };

  revalidatePath("/points");
  revalidatePath(`/points/${pointId}`);
  revalidatePath("/dashboard");
  redirect(`/points/${pointId}`);
}
