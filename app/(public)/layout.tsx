import { SiteNav } from "@/components/public/SiteNav";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} AgriGuard — farm water monitoring.</p>
          <p>Built for farms that cannot afford to guess.</p>
        </div>
      </footer>
    </div>
  );
}
