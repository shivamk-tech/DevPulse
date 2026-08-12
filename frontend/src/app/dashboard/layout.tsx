import { AuthGuard } from "@/components/auth/AuthGuard";
import { Sidebar } from "@/components/dashboard/layout/Sidebar";
import { TopNavbar } from "@/components/dashboard/layout/Top-navbar";

/**
 * Shell for every /dashboard/* route.
 *
 * AuthGuard wraps the shell rather than each page, so protection is a property
 * of the URL segment: any route added under /dashboard is covered the moment
 * the file exists, with no per-page check to remember or forget.
 *
 * It also wraps the chrome, not just `children` — the sidebar and top bar
 * display the user's name and workspace, so they are protected content too.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-[#08080B]">
        <Sidebar />

        <div className="flex flex-1 flex-col overflow-hidden">
          <TopNavbar />

          {/* data-lenis-prevent is load-bearing: the dashboard scrolls inside
             this panel, and Lenis would otherwise swallow the wheel event for
             the window and leave this area frozen. */}
          <main data-lenis-prevent className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
