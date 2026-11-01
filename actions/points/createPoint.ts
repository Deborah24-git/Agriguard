"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { hasPermission } from "@/lib/permissions";
import { requireSessionUser } from "@/lib/session";
import { parsePointFormData, validatePointForm, type PointFormState } from "@/lib/pointForm";
import Point from "@/models/Point";
import { createPointRecord } from "@/services/points/createPointRecord";

export async function createPoint(
  _previous: PointFormState,
  formData: FormData
): Promise<PointFormState> {
  const user = await requireSessionUser();
  if (!hasPermission(user.role, "points:write")) throw new Error("Forbidden");

  const values = parsePointFormData(formData);
  const error = validatePointForm(values);
  if (error) return { error };

  await connectDB();
  const duplicate = await Point.exists({ owner_id: user.id, code: values.code });
  if (duplicate) return { error: `Point code ${values.code} is already in use.` };

  const point = await createPointRecord(values, user.id);

  revalidatePath("/points");
  revalidatePath("/dashboard");
  redirect(`/points/${point.id}`);
}
