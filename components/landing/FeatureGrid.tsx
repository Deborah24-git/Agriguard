import {
  Activity,
  BarChart3,
  BellRing,
  Gauge,
  RadioTower,
  TriangleAlert,
} from "lucide-react";

const FEATURES = [
  {
    icon: Activity,
    title: "Live irrigation monitoring",
    body: "Flow, pressure and valve state for Points A to E, refreshed from the field every few seconds.",
  },
  {
    icon: TriangleAlert,
    title: "Leak detection",
    body: "Catches water moving while a valve is shut and pressure falling away at any point on the line.",
  },
  {
    icon: Gauge,
    title: "Blockage detection",
    body: "Flags the tell-tale pattern: pressure climbing above the ceiling while flow drops away.",
  },
  {
    icon: BellRing,
    title: "Automated SMS alerts",
    body: "Every finding becomes a deduplicated alert and an Africa's Talking SMS, with a full audit trail.",
  },
  {
    icon: RadioTower,
    title: "Tank and sensor management",
    body: "Ultrasonic tank and standpipe probes, flow sensors, leak pads and drain probes in one live inventory.",
  },
  {
    icon: BarChart3,
    title: "Water usage reports",
    body: "Daily and weekly consumption, suspected losses and delivery history for every irrigation point.",
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="border-t border-border/60 bg-muted/30 py-16">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Six capabilities, one dashboard
          </h2>
          <p className="mt-2 text-muted-foreground">
            Track the whole water path — borehole, tank, standpipes and irrigation
            points — and catch waste before the crop goes dry.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="glass-card rounded-xl border p-5 transition-transform hover:-translate-y-0.5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="h-4 w-4" />
              </span>
              <h3 className="mt-3 font-semibold">{feature.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{feature.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
