"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BellRing } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { sendSandboxTestSms } from "@/actions/notifications/sendSandboxTestSms";
import type { SandboxSmsTestResult } from "@/types/sms";

interface SidebarNotificationButtonProps {
  isCollapsed: boolean;
}

export function SidebarNotificationButton({
  isCollapsed,
}: SidebarNotificationButtonProps) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<SandboxSmsTestResult | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  function sendTest() {
    startTransition(async () => {
      setError("");
      try {
        const response = await sendSandboxTestSms();
        setResult(response);
        router.refresh();
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "Unable to send sandbox test SMS."
        );
      }
    });
  }

  const statusText = error || (result
    ? result.status === "sent"
      ? `Simulated leak alert accepted by the sandbox for ${result.recipient}.`
      : result.error ?? "The sandbox did not accept the alert."
    : "");

  return (
    <div className={cn("space-y-2", isCollapsed && "px-0")}>
      <Button
        variant="outline"
        size="sm"
        className={cn("w-full", isCollapsed && "h-10 w-10 px-0")}
        onClick={sendTest}
        disabled={pending}
        aria-label="Send simulated leak notification"
        title={isCollapsed ? "Send simulated leak notification" : undefined}
      >
        <BellRing className="h-3.5 w-3.5 shrink-0" />
        {!isCollapsed &&
          (pending ? "Sending notification..." : "Simulate leak notification")}
      </Button>
      {statusText && (
        <p
          role={error || result?.status !== "sent" ? "alert" : "status"}
          title={statusText}
          className={
            result?.status === "sent" && !error
              ? "text-xs text-success"
              : "text-xs text-destructive"
          }
        >
          {isCollapsed
            ? result?.status === "sent" && !error
              ? "SMS accepted"
              : "SMS failed"
            : statusText}
        </p>
      )}
      {!isCollapsed && result?.provider_id && (
        <p className="font-mono text-[10px] text-muted-foreground">
          Sandbox message ID: {result.provider_id}
        </p>
      )}
    </div>
  );
}
