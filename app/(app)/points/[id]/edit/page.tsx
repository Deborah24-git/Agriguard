import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PointForm } from "@/components/points/form/PointForm";
import { updatePoint } from "@/actions/points/updatePoint";
import { getPointForUser } from "@/services/points/getPointForUser";
import { requireSessionUser } from "@/lib/session";
import { notFound } from "next/navigation";

export const metadata = { title: "Edit point" };

export default async function EditPointPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireSessionUser();
  const point = await getPointForUser(id, user.id, user.role);
  if (!point) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href={`/points/${point.id}`}
        className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to {point.name}
      </Link>

      <PageHeader
        title={`Edit ${point.name}`}
        description="Update the baseline detection compares every reading against."
      />

      <PointForm
        action={updatePoint}
        pointId={point.id}
        initial={{
          name: point.name,
          code: point.code,
          crop_type: point.crop_type,
          area_hectares: point.area_hectares,
          expected_flow_rate: point.expected_flow_rate,
          min_pressure: point.min_pressure,
          max_pressure: point.max_pressure,
          start_time: point.schedule.start_time,
          duration_minutes: point.schedule.duration_minutes,
          active_days: point.schedule.active_days,
        }}
        submitLabel="Save changes"
        cancelHref={`/points/${point.id}`}
      />
    </div>
  );
}
