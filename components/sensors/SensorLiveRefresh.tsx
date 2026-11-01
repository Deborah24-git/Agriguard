"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RadioTower } from "lucide-react";

const REFRESH_MS = 15_000;

export function SensorLiveRefresh() {
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => router.refresh(), REFRESH_MS);
    return () => clearInterval(timer);
  }, [router]);

  return (
    <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
      <RadioTower className="h-3.5 w-3.5 text-success" />
      Live sensor readings · refreshed every 15 seconds
    </p>
  );
}
