import Link from "next/link";
import { cn } from "@/lib/utils";
import type { AlertStatusCounts } from "@/types/alert";

const TABS = [
  { key: "open", label: "Open" },
  { key: "acknowledged", label: "Acknowledged" },
  { key: "resolved", label: "Resolved" },
] as const;

export function AlertFilterTabs({
  counts,
  active,
}: {
  counts: AlertStatusCounts;
  active: keyof AlertStatusCounts;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {TABS.map((tab) => (
        <Link
          key={tab.key}
          href={`/alerts?status=${tab.key}`}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
            active === tab.key
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
          <span
            className={cn(
              "rounded-full px-1.5 text-[10px]",
              active === tab.key ? "bg-primary-foreground/20" : "bg-muted"
            )}
          >
            {counts[tab.key]}
          </span>
        </Link>
      ))}
    </div>
  );
}
