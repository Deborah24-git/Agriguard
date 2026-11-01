"use client";

import { useEffect, useState } from "react";
import { RadioTower } from "lucide-react";
import { cn } from "@/lib/utils";
import { SummaryStats } from "./SummaryStats";
import { LiveMonitor } from "./LiveMonitor";
import { AlertFeed } from "./AlertFeed";
import { SectionCard } from "@/components/ui/SectionCard";
import { SystemOverview } from "@/components/system/SystemOverview";
import { TankTrendChart } from "@/components/charts/TankTrendChart";
import type { LivePayload } from "@/types/live";

const REFRESH_MS = 15_000;

/**
 * Client shell around the live parts of the dashboard. It starts with the
 * server-rendered payload, then polls /api/live so readings stay current.
 */
export function DashboardLive({ initial }: { initial: LivePayload }) {
  const [data, setData] = useState(initial);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      try {
        const response = await fetch("/api/live", { cache: "no-store" });
        if (!response.ok) throw new Error("Live endpoint failed");
        const payload = (await response.json()) as LivePayload;
        if (!cancelled) {
          setData(payload);
          setOnline(true);
        }
      } catch {
        if (!cancelled) setOnline(false);
      }
    }

    const timer = setInterval(refresh, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="space-y-6">
      <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
        <span
          className={cn(
            "h-2 w-2 rounded-full",
            online ? "animate-pulse bg-success" : "bg-destructive"
          )}
        />
        <RadioTower className="h-3.5 w-3.5" />
        {online ? "Live feed connected" : "Live feed interrupted"} · refreshed{" "}
        {new Date(data.generated_at).toLocaleTimeString("en-ZA", { hour12: false })} · every 15 s
      </p>

      <SummaryStats summary={data.summary} />

      <SystemOverview overview={data.overview} />

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          title="Live point status"
          description="Flow, pressure and valve state across points A to E"
          className="lg:col-span-2"
        >
          <LiveMonitor snapshots={data.snapshots} />
        </SectionCard>

        <div className="space-y-6">
          <SectionCard
            title="Smart tank level"
            description="Ultrasonic readings over the last 72 hours"
          >
            <TankTrendChart points={data.tank_trend} height={150} />
          </SectionCard>

          <SectionCard title="Open alerts" description="Newest unresolved findings">
            <AlertFeed alerts={data.alerts} compact />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
