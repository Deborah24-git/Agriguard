import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  description,
  children,
  actions,
  className,
}: SectionCardProps) {
  return (
    <Card className={cn("glass-card overflow-hidden", className)}>
      <CardHeader className="flex-row items-start justify-between gap-4 border-b border-primary/10 bg-primary/5">
        <div className="space-y-1">
          <CardTitle className="text-primary">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {actions}
      </CardHeader>
      <CardContent className="p-5">{children}</CardContent>
    </Card>
  );
}
