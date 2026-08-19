"use client";

import { CreateMonitorDialog } from "@/components/monitors/Create-monitor-dialog";
import { WelcomeBanner } from "@/components/dashboard/sections/Welcome-banner";
import { StatRow } from "@/components/dashboard/sections/Stat-row";
import { EmptyState } from "@/components/dashboard/sections/Empty-state";
import { QuickStart } from "@/components/dashboard/sections/Quick-start";
import { QuickActions } from "@/components/dashboard/sections/Quick-actions";
import { RecentActivity } from "@/components/dashboard/sections/Recent-activity";
import { LoadError } from "@/components/dashboard/sections/Load-error";
import { useState } from "react";
import { WorkspaceSummary } from "@/components/dashboard/widgets/Workspace-summary";
import { TipsCard } from "@/components/dashboard/widgets/Tip-card";
import { useMonitor } from "@/hooks/useMonitors";
import { monitorServices } from "@/services/monitor/monitors.service";
import { createMonitorData } from "@/types/monitor";
import { useQueryClient } from "@tanstack/react-query";

export default function DashboardPage() {

  const [createMonitorOpen, setCreateMonitorOpen] = useState(false)
  const {
    data,
    isLoading,
    isError,
    refetch
  } = useMonitor()
  const queryClient = useQueryClient()

  const monitors = data?.data ?? [];

  if (isError) {
    return <LoadError what="monitors" onRetry={refetch} />;
  }

  const hasMonitors = monitors.length > 0
  const monitorsCount = monitors.length

  const handleCreateMonitor = async (
    values: createMonitorData
  ) => {
    await monitorServices.Create(values);

    await queryClient.invalidateQueries({
      queryKey: ["monitors"],
    });
  };

  return (
    <div className="mx-auto max-w-350 space-y-6 p-6">
      <WelcomeBanner onCreateMonitor={() => setCreateMonitorOpen(true)} />

      {/* Metrics first: the reader's question is "is anything broken?"
         and it gets answered above the fold, before any onboarding. */}
      <StatRow monitorsCount={monitorsCount} loading={isLoading} />

      <div className="flex flex-col gap-6 xl:flex-row">
        <div className="min-w-0 flex-1 space-y-6">
          <EmptyState
            hasMonitors={hasMonitors}
            loading={isLoading}
            onCreateMonitor={() => setCreateMonitorOpen(true)}
          />
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
        open={createMonitorOpen}
        onOpenChange={setCreateMonitorOpen}
        onSubmit={handleCreateMonitor}
      />
    </div>
  );
}
