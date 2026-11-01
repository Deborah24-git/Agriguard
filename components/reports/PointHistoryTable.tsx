import Link from "next/link";
import { formatDate, formatLitres } from "@/lib/format";
import { EmptyState } from "@/components/ui/EmptyState";
import type { NamedSession } from "@/types/report";

export function PointHistoryTable({ sessions }: { sessions: NamedSession[] }) {
  if (sessions.length === 0) {
    return (
      <EmptyState
        title="No irrigation runs yet"
        description="Sessions appear once a point's valve has opened and closed."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
            <th className="pb-2 pr-3 font-medium">Point</th>
            <th className="pb-2 pr-3 font-medium">Started</th>
            <th className="pb-2 pr-3 font-medium">Duration</th>
            <th className="pb-2 text-right font-medium">Volume</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/70">
          {sessions.map((session) => (
            <tr key={`${session.point_id}-${session.started_at}`}>
              <td className="py-2 pr-3">
                <Link
                  href={`/points/${session.point_id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {session.point_name}
                </Link>
              </td>
              <td className="py-2 pr-3 text-muted-foreground">
                {formatDate(session.started_at)}
              </td>
              <td className="py-2 pr-3 text-muted-foreground">{session.minutes} min</td>
              <td className="py-2 text-right font-semibold">
                {formatLitres(session.litres)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
