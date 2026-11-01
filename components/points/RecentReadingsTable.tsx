import { formatClock, formatFlow, formatPressure } from "@/lib/format";
import type { ReadingDTO } from "@/types/reading";

export function RecentReadingsTable({ readings }: { readings: ReadingDTO[] }) {
  if (readings.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No readings received yet. A sensor or the simulator will populate this.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
            <th className="pb-2 pr-3 font-medium">Time</th>
            <th className="pb-2 pr-3 font-medium">Flow</th>
            <th className="pb-2 pr-3 font-medium">Pressure</th>
            <th className="pb-2 pr-3 font-medium">Valve</th>
            <th className="pb-2 font-medium">Source</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/70">
          {readings.map((reading) => (
            <tr key={reading.id}>
              <td className="py-2 pr-3 font-mono text-xs text-muted-foreground">
                {new Date(reading.recorded_at).toLocaleString("en-ZA", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </td>
              <td className="py-2 pr-3">{formatFlow(reading.flow_rate)}</td>
              <td className="py-2 pr-3">{formatPressure(reading.pressure)}</td>
              <td className="py-2 pr-3 capitalize">{reading.valve_state}</td>
              <td className="py-2 text-xs text-muted-foreground">{reading.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-[11px] text-muted-foreground">
        Latest {readings.length} samples · last sample at {formatClock(readings[0].recorded_at)}
      </p>
    </div>
  );
}
