import { Sidebar } from "@/components/dashboard/layout/Sidebar";
import { TopNavbar } from "@/components/dashboard/layout/Top-navbar";

import { WelcomeBanner } from "@/components/dashboard/sections/Welcome-banner";
import { EmptyState } from "@/components/dashboard/sections/Empty-state";
import { QuickStart } from "@/components/dashboard/sections/Quick-start";
import { QuickActions } from "@/components/dashboard/sections/Quick-actions";
import { RecentActivity } from "@/components/dashboard/sections/Recent-activity";

import { WorkspaceSummary } from "@/components/dashboard/widgets/Workspace-summary";
import { TipsCard } from "@/components/dashboard/widgets/Tip-card";

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto flex max-w-[1600px] gap-6 p-6">
            {/* Main Content */}
            <div className="flex-1 space-y-6">
              <WelcomeBanner />

              <EmptyState />

              <QuickStart />

              <QuickActions />

              <RecentActivity />
            </div>

            {/* Right Sidebar */}
            <aside className="hidden w-[320px] shrink-0 space-y-6 xl:block">
              <WorkspaceSummary />

              <TipsCard />
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}