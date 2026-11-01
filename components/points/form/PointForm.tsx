"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { PointFormState, PointFormValues } from "@/lib/pointForm";
import { PointIdentitySection } from "./PointIdentitySection";
import { PointHydraulicsSection } from "./PointHydraulicsSection";
import { PointScheduleSection } from "./PointScheduleSection";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { buttonStyles } from "@/components/ui/button";

type PointAction = (
  state: PointFormState,
  formData: FormData
) => Promise<PointFormState>;

interface Props {
  action: PointAction;
  initial?: Partial<PointFormValues>;
  pointId?: string;
  submitLabel: string;
  cancelHref: string;
}

export function PointForm({
  action,
  initial,
  pointId,
  submitLabel,
  cancelHref,
}: Props) {
  const [state, formAction] = useActionState(action, { error: "" });

  return (
    <form action={formAction} className="space-y-5">
      {pointId && <input type="hidden" name="point_id" value={pointId} />}

      {state.error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <PointIdentitySection initial={initial} />
      <PointHydraulicsSection initial={initial} />
      <PointScheduleSection initial={initial} />

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton pendingLabel="Saving">{submitLabel}</SubmitButton>
        <Link href={cancelHref} className={buttonStyles("ghost", "sm")}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
