import Link from "next/link";
import { Activity, ArrowRight, Droplets, Gauge, ShieldCheck } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";

const METRICS = [
  { label: "Points watched", value: "A to E" },
  { label: "Sensor types", value: "4 kinds" },
  { label: "Reading cadence", value: "10 minutes" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            Smart irrigation monitoring
          </span>

          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            See every litre before it is wasted.
          </h1>

          <p className="max-w-xl text-lg text-muted-foreground">
            AgriGuard watches the borehole pump, the smart tank and Points A to E in
            real time. Ultrasonic levels, flow and leak sensors raise an SMS the
            moment a line leaks, blocks or the tank runs low.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/dashboard" className={buttonStyles("primary")}>
              Open the dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/register" className={buttonStyles("outline")}>
              Register your farm
            </Link>
          </div>

          <dl className="grid grid-cols-3 gap-4 border-t border-border/60 pt-6">
            {METRICS.map((metric) => (
              <div key={metric.label}>
                <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {metric.label}
                </dt>
                <dd className="text-sm font-semibold">{metric.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="glass-card rounded-2xl p-5 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold">Point C · Smart tank line</p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" />
              Leak suspected
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { icon: Droplets, label: "Flow", value: "14.2 L/min" },
              { icon: Gauge, label: "Pressure", value: "96 kPa" },
              { icon: Activity, label: "Valve", value: "Closed" },
            ].map((item) => (
              <div key={item.label} className="rounded-lg bg-muted/60 p-3">
                <item.icon className="mx-auto h-4 w-4 text-primary" />
                <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                  {item.label}
                </p>
                <p className="text-sm font-semibold">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-border bg-card p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold">Smart tank</span>
              <span className="font-semibold text-water">78%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[78%] rounded-full bg-water" />
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
              <span>Standpipe 1 · 72%</span>
              <span>Standpipe 2 · 65%</span>
              <span>Standpipe 3 · 41%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
