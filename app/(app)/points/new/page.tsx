import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PointForm } from "@/components/points/form/PointForm";
import { createPoint } from "@/actions/points/createPoint";
import { nextPointCode } from "@/services/points/nextPointCode";
import { requireSessionUser } from "@/lib/session";

export const metadata = { title: "Add point" };

export default async function NewPointPage() {
  const user = await requireSessionUser();
  const suggestion = await nextPointCode(user.id);

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/points"
        className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to points
      </Link>

      <PageHeader
        title="Add a point"
        description="Set the healthy baseline for this section. Detection measures every reading against it."
      />

      <PointForm
        action={createPoint}
        initial={suggestion}
        submitLabel="Create point"
        cancelHref="/points"
      />
    </div>
  );
}
