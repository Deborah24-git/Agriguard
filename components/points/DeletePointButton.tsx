"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deletePoint } from "@/actions/points/deletePoint";

/** Destructive action with a two-step confirmation and a real delete. */
export function DeletePointButton({
  pointId,
  pointName,
}: {
  pointId: string;
  pointName: string;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <Button variant="outline" size="sm" onClick={() => setConfirming(true)}>
        <Trash2 className="h-4 w-4" /> Remove
      </Button>
    );
  }

  return (
    <form
      action={deletePoint}
      className="flex flex-wrap items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2"
    >
      <input type="hidden" name="point_id" value={pointId} />
      <p className="text-xs text-destructive">Delete {pointName} and its readings?</p>
      <Button type="submit" variant="destructive" size="sm">
        Yes, delete
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={() => setConfirming(false)}>
        Cancel
      </Button>
    </form>
  );
}
