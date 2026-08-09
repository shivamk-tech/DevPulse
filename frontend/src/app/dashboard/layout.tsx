import { Sidebar } from "@/components/dashboard/layout/Sidebar";
import { TopNavbar } from "@/components/dashboard/layout/Top-navbar";

/**
 * Shell for every /dashboard/* route.
 *
 * This used to live inside dashboard/page.tsx, which meant the sidebar and top
 * bar existed only on the index route — /dashboard/settings would have rendered
 * as a bare page with no navigation. Hoisting it here also keeps the sidebar
 * mounted across navigations, so its collapsed state and open submenu survive
 * a route change.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#08080B]">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar />

        {/* The dashboard scrolls inside this panel, not the window. Without
           data-lenis-prevent, Lenis swallows the wheel event for the page and
           this area stops scrolling entirely. */}
        <main data-lenis-prevent className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
