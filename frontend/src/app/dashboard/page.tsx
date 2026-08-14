"use client";

// Holds the dialog's open state, so this route is a client component.
import { CreateMonitorDialog } from "@/components/monitors/Create-monitor-dialog";
import { WelcomeBanner } from "@/components/dashboard/sections/Welcome-banner";
import { StatRow } from "@/components/dashboard/sections/Stat-row";
import { EmptyState } from "@/components/dashboard/sections/Empty-state";
import { QuickStart } from "@/components/dashboard/sections/Quick-start";
import { QuickActions } from "@/components/dashboard/sections/Quick-actions";
import { RecentActivity } from "@/components/dashboard/sections/Recent-activity";

import { WorkspaceSummary } from "@/components/dashboard/widgets/Workspace-summary";
import { TipsCard } from "@/components/dashboard/widgets/Tip-card";
import { useState } from "react";

// The shell (sidebar + top bar) lives in dashboard/layout.tsx so every route
// under /dashboard shares it. This file is just the index route's content.
export default function DashboardPage() {

  const [createMoniterOpen, setCreateMoniterOpen] = useState(false)

  return (
    <div className="mx-auto max-w-350 space-y-6 p-6">
      <WelcomeBanner onCreateMonitor={() => setCreateMoniterOpen(true)} />

      {/* Metrics first: the reader's question is "is anything broken?"
         and it gets answered above the fold, before any onboarding. */}
      <StatRow />

      <div className="flex flex-col gap-6 xl:flex-row">
        <div className="min-w-0 flex-1 space-y-6">
          <EmptyState onCreateMonitor={() => setCreateMoniterOpen(true)} />
          <QuickStart />
          <RecentActivity />
        </div>

        <aside className="w-full shrink-0 space-y-6 xl:w-80">
          <WorkspaceSummary />
          <QuickActions />
          <TipsCard />
        </aside>
      </div>

      <CreateMonitorDialog
        open={createMoniterOpen}
        onOpenChange={setCreateMoniterOpen}
      />
    </div>
  );
}
