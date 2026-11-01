import Link from "next/link";
import { Droplets } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-md flex-col items-center justify-center px-4 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Droplets className="h-6 w-6" />
      </span>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Not found</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        That point, sensor or alert does not exist, or it belongs to another farm.
      </p>
      <Link href="/dashboard" className={buttonStyles("primary", "sm")}>
        Back to dashboard
      </Link>
    </div>
  );
}
