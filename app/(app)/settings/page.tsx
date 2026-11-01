import { BellRing, Droplets, MessageSquare, Settings } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionCard } from "@/components/ui/SectionCard";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireSessionUser } from "@/lib/session";
import { getUserProfile } from "@/services/users/getUserProfile";
import { getSmsLog } from "@/services/notifications/getSmsLog";
import {
  isSmsConfigured,
  normalizeSmsRecipient,
} from "@/lib/sms/africasTalking";
import { formatRelative } from "@/lib/format";

export const metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

const SMS_VARIANT = {
  sent: "success",
  failed: "danger",
  skipped: "muted",
} as const;

export default async function SettingsPage() {
  const user = await requireSessionUser();
  const profile = await getUserProfile(user.id);
  const smsLog = await getSmsLog(10);
  const smsReady = isSmsConfigured();
  const smsRecipient = normalizeSmsRecipient(
    process.env.AT_SMS_TO?.trim() || profile?.phone?.trim() || ""
  );
  const smsSenderId = process.env.AT_SENDER_ID?.trim() || "";

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your farm profile, alert delivery and app preferences."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Farm profile"
          description="The account and farm these readings belong to."
        >
          <dl className="space-y-4">
            <div>
              <dt className="text-xs text-muted-foreground">Farm name</dt>
              <dd className="mt-1 font-medium">{profile?.farm_name ?? "My farm"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Account owner</dt>
              <dd className="mt-1 font-medium">{profile?.name ?? user.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Email</dt>
              <dd className="mt-1 font-medium">{profile?.email ?? user.email}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Alert phone</dt>
              <dd className="mt-1 font-medium">
                {profile?.phone ? profile.phone : "No number saved"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Role</dt>
              <dd className="mt-1 font-medium capitalize">{user.role}</dd>
            </div>
          </dl>
        </SectionCard>

        <SectionCard
          title="App preferences"
          description="Personal display preferences for your monitoring workspace."
        >
          <div className="divide-y divide-border">
            <div className="flex items-center justify-between gap-4 py-3 first:pt-0">
              <div className="flex items-start gap-3">
                <Settings className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Appearance</p>
                  <p className="text-xs text-muted-foreground">
                    Choose light or dark display mode.
                  </p>
                </div>
              </div>
              <ThemeToggle />
            </div>
            <div className="flex items-start gap-3 py-3">
              <Droplets className="mt-0.5 h-4 w-4 text-water" />
              <div>
                <p className="text-sm font-medium">Water measurements</p>
                <p className="text-xs text-muted-foreground">
                  Flow is shown in litres per minute, pressure in kilopascals and
                  tank fill as a percentage.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 py-3 last:pb-0">
              <BellRing className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Alert preferences</p>
                <p className="text-xs text-muted-foreground">
                  Leak, blockage, no-flow and low-tank findings raise an SMS to the
                  alert phone number.
                </p>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="mt-6">
        <SectionCard
          title="SMS alerts"
          description="Leak alerts send automatically through the configured SMS provider."
          actions={
            <Badge variant={smsReady ? "success" : "muted"}>
              {smsReady ? "Configured" : "Not configured"}
            </Badge>
          }
        >
          <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
            <p>
              Sender ID:{" "}
              <span className="font-medium text-foreground">
                {smsSenderId || "Africa's Talking default"}
              </span>
            </p>
            <p>
              Recipient:{" "}
              <span className="font-medium text-foreground">
                {smsRecipient || "No phone number configured"}
              </span>
            </p>
          </div>
          {smsLog.length === 0 ? (
            <EmptyState
              title="No SMS sent yet"
              description={
                smsReady
                  ? "The next alert that needs notifying will be logged here."
                  : "Add AT_API_KEY and AT_USERNAME to .env.local to enable SMS delivery."
              }
              icon={<MessageSquare className="h-5 w-5" />}
            />
          ) : (
            <ul className="divide-y divide-border">
              {smsLog.map((entry) => (
                <li key={entry.id} className="space-y-1 py-3 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={
                        entry.is_simulation || entry.is_sandbox_test
                          ? "info"
                          : SMS_VARIANT[entry.status]
                      }
                    >
                      {entry.is_simulation
                        ? "simulated"
                        : entry.is_sandbox_test
                          ? `sandbox ${entry.status}`
                          : entry.status}
                    </Badge>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      From: {entry.sender_id || "Africa's Talking default"}
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      To: {entry.to}
                    </span>
                    <span className="ml-auto text-[11px] text-muted-foreground">
                      {formatRelative(entry.created_at)}
                    </span>
                  </div>
                  {entry.provider_id && (
                    <p className="font-mono text-[10px] text-muted-foreground">
                      Provider ID: {entry.provider_id}
                    </p>
                  )}
                  <p className="text-sm">{entry.message}</p>
                  {entry.error && (
                    <p className="text-[11px] text-destructive">{entry.error}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </>
  );
}
