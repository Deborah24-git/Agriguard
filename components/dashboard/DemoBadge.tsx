import { RadioTower } from "lucide-react";

/** Tells the reader the numbers come from live simulator-backed telemetry. */
export function DemoBadge({ generatedAt }: { generatedAt?: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-semibold text-success">
      <RadioTower className="h-3.5 w-3.5" />
      Live telemetry
      {generatedAt && (
        <span className="font-normal text-muted-foreground">
          · {new Date(generatedAt).toLocaleTimeString("en-ZA", { hour12: false })}
        </span>
      )}
    </span>
  );
}
