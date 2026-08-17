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
      <div className="flex h-screen bg-black">
        <Sidebar />

        <div className="flex flex-1 flex-col overflow-hidden">
          <TopNavbar />

          {/* data-lenis-prevent is load-bearing: the dashboard scrolls inside
             this panel, and Lenis would otherwise swallow the wheel event for
             the window and leave this area frozen. */}
          {/* `min-h-0` is doing real work: a flex item defaults to
             min-height:auto, so it refuses to shrink below its content and
             grows past its share instead. The parent clips the overflow, which
             silently cut the bottom off any full-height page — the monitors
             board and its controls, for one. */}
          <main data-lenis-prevent className="relative h-[calc(100dvh_-_3.5rem)] overflow-y-auto">
            {/* A single wide beam falling from the top-right, echoing the
               lighthouse on the marketing site. It scrolls with the content
               rather than being fixed, so it reads as light on the page
               instead of a sticker on the viewport — and at 4% white it is
               atmosphere, not decoration competing with the panels. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(120%_80%_at_78%_0%,rgba(255,255,255,0.05),transparent_62%)]"
            />

            {/* `h-full` matters: a percentage height only resolves when every
               ancestor has a definite one. Without it this wrapper is
               auto-height, and any page that lays itself out with `h-full` —
               the monitors canvas, for one — collapses to nothing. Content
               taller than the viewport still scrolls, because <main> owns the
               overflow. */}
            <div className="relative h-full">{children}</div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
