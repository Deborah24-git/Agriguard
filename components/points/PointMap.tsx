import Link from "next/link";
import { Droplets, MapPin } from "lucide-react";
import type { PointSnapshot } from "@/types/point";

const LAYOUT = [
  { left: "16%", top: "30%" },
  { left: "42%", top: "22%" },
  { left: "72%", top: "34%" },
  { left: "30%", top: "68%" },
  { left: "60%", top: "72%" },
  { left: "84%", top: "64%" },
];

const TONE = {
  attention: "bg-destructive",
  normal: "bg-water",
  offline: "bg-muted-foreground",
} as const;

function toneFor(status: PointSnapshot["status"]): keyof typeof TONE {
  if (["leak", "blockage", "pressure_drop", "no_flow"].includes(status)) {
    return "attention";
  }
  if (status === "offline" || status === "inactive") return "offline";
  return "normal";
}

export function PointMap({ snapshots }: { snapshots: PointSnapshot[] }) {
  return (
    <section className="glass-card overflow-hidden rounded-xl">
      <div className="border-b border-primary/10 bg-primary/5 px-5 py-4">
        <h2 className="font-semibold text-primary">Water points</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Schematic of the five irrigation points fed by the smart tank. Not to scale.
        </p>
      </div>

      <div className="relative min-h-72 overflow-hidden bg-emerald-50/60 p-5 dark:bg-emerald-950/20 sm:min-h-80">
        <div
          aria-hidden="true"
          className="absolute inset-5 rounded-[2rem] border-2 border-dashed border-primary/20"
        />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-8 bottom-8 w-px -translate-x-1/2 bg-water/30"
        />
        <div
          aria-hidden="true"
          className="absolute left-8 right-8 top-1/2 h-px -translate-y-1/2 bg-water/30"
        />

        {snapshots.map((snapshot, index) => {
          const layout = LAYOUT[index % LAYOUT.length];
          return (
            <Link
              key={snapshot.point.id}
              href={`/points/${snapshot.point.id}`}
              className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-lg px-2 py-1 text-center transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={layout}
              aria-label={`Open ${snapshot.point.name}`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-white shadow-md dark:border-card ${TONE[toneFor(snapshot.status)]}`}
              >
                <Droplets className="h-4 w-4" />
              </span>
              <span className="max-w-28 truncate rounded-md bg-card/90 px-2 py-1 text-[10px] font-semibold shadow-sm">
                {snapshot.point.name}
              </span>
            </Link>
          );
        })}

        <div className="absolute bottom-4 right-5 flex items-center gap-1.5 rounded-md bg-card/90 px-2.5 py-1.5 text-[10px] text-muted-foreground shadow-sm">
          <MapPin className="h-3 w-3 text-water" />
          {snapshots.length} {snapshots.length === 1 ? "point" : "points"}
        </div>
      </div>
    </section>
  );
}
