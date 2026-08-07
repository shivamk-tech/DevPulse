import { Sidebar } from "@/components/dashboard/layout/Sidebar";
// import { TopNavbar } from "@/components/dashboard/layout/top-navbar";

// import { WelcomeBanner } from "@/components/dashboard/sections/welcome-banner";
// import { EmptyState } from "@/components/dashboard/sections/empty-state";
// import { QuickStart } from "@/components/dashboard/sections/quick-start";
// import { QuickActions } from "@/components/dashboard/sections/quick-actions";
// import { RecentActivity } from "@/components/dashboard/sections/recent-activity";

// import { WorkspaceSummary } from "@/components/dashboard/widgets/workspace-summary";
// import { TipsCard } from "@/components/dashboard/widgets/tips-card";

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* <TopNavbar /> */}

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto flex max-w-[1600px] gap-6 p-6">
            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* <WelcomeBanner />

              <EmptyState />

              <QuickStart />

              <QuickActions />

              <RecentActivity /> */}
            </div>

            {/* Right Sidebar */}
            <aside className="hidden w-[320px] shrink-0 space-y-6 xl:block">
              {/* <WorkspaceSummary />

              <TipsCard /> */}
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}