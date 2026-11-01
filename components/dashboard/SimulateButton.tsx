"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pushSimulationTick } from "@/actions/demo/pushSimulationTick";

/** Writes one simulator tick so the dashboard visibly updates on demand. */
export function SimulateButton() {
  const [pending, startTransition] = useTransition();
  const [note, setNote] = useState("");
  const router = useRouter();

  function run() {
    startTransition(async () => {
      const result = await pushSimulationTick();
      setNote(
        `${result.readings} readings, ${result.alerts} alert(s). Leak SMS sends when detected.`
      );
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {note && <span className="text-[11px] text-muted-foreground">{note}</span>}
      {note && (
        <Link
          href="/settings"
          className="text-[11px] font-semibold text-primary hover:underline"
        >
          View SMS log
        </Link>
      )}
      <Button variant="outline" size="sm" onClick={run} disabled={pending}>
        <RefreshCw className={pending ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
        {pending ? "Sampling" : "Run sensor tick"}
      </Button>
    </div>
  );
}
