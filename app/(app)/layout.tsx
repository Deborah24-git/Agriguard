import { AppShell } from "@/components/layout/AppShell";
import { requireSessionUser } from "@/lib/session";
import { getUserProfile } from "@/services/users/getUserProfile";
import { countOpenAlerts } from "@/services/alerts/countOpenAlerts";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireSessionUser();

  const [profile, alertCount] = await Promise.all([
    getUserProfile(user.id),
    countOpenAlerts(user.id, user.role),
  ]);

  return (
    <AppShell
      userName={profile?.name ?? user.name}
      farmName={profile?.farm_name ?? "My farm"}
      alertCount={alertCount}
      role={user.role}
    >
      {children}
    </AppShell>
  );
}
