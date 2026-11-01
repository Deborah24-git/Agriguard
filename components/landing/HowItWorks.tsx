const STEPS = [
  {
    step: "01",
    title: "Register each point",
    body: "Give every point a code, crop, area, expected flow rate and safe pressure band. That baseline is what detection compares against.",
  },
  {
    step: "02",
    title: "Sensors post readings",
    body: "Flow, leak and ultrasonic probes post to the ingest endpoint every ten minutes. No hardware? The built-in simulator produces the same feed.",
  },
  {
    step: "03",
    title: "AgriGuard raises the flag",
    body: "Four rules plus a tank-level watch run on every reading. When one fires, it lands on your dashboard, the point page and an SMS to your phone.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16">
      <div className="mx-auto w-full max-w-6xl px-4">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          How it works
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {STEPS.map((item) => (
            <div key={item.step} className="relative border-l-2 border-primary/25 pl-5">
              <span className="text-xs font-bold tracking-widest text-primary">
                {item.step}
              </span>
              <h3 className="mt-1 font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
