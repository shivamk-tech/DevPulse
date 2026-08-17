// components/dashboard/sidebar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Globe,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Settings,
  TriangleAlert,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface NavChild {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavChild[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Monitors", href: "/dashboard/monitors", icon: Globe },
      { label: "Incidents", href: "/dashboard/incidents", icon: TriangleAlert },
      { label: "Status Pages", href: "/dashboard/status-pages", icon: FileText },
      { label: "Alerts", href: "/dashboard/alerts", icon: Bell },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        label: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        children: [
          { label: "General", href: "/dashboard/settings" },
          { label: "Profile", href: "/dashboard/settings/profile" },
          { label: "Notifications", href: "/dashboard/settings/notifications" },
          { label: "Security", href: "/dashboard/settings/security" },
        ],
      },
    ],
  },
];

interface SidebarProps {
  userName?: string;
  userRole?: string;
  userAvatarUrl?: string;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Overrides the context logout — mainly for tests/storybook. */
  onLogout?: () => void;
}

export function Sidebar({
  userName,
  userRole = "Workspace",
  userAvatarUrl,
  onCollapsedChange,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(" ");
  const displayName = userName ?? (fullName || "there");

  // Falls back to the shared logout; no navigation here — AuthGuard owns it.
  const handleLogout = onLogout ?? (() => void logout());

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      onCollapsedChange?.(next);
      return next;
    });
  };

  // Landing on /dashboard/settings/security should arrive with Settings already
  // unfolded — otherwise the active child is hidden behind a closed parent.
  // Derived from the URL rather than pushed into state by an effect, which
  // would render once with the group shut and then again with it open.
  const routeOpenItem = useMemo(() => {
    const match = NAV_GROUPS.flatMap((group) => group.items).find(
      (item) => item.children && pathname.startsWith(item.href)
    );

    return match?.label ?? null;
  }, [pathname]);

  // `undefined` means "follow the route"; any other value is a deliberate
  // open/close by the user, which outranks the route until they navigate.
  const [override, setOverride] = useState<string | null | undefined>(undefined);
  const [lastPath, setLastPath] = useState(pathname);

  // Navigating hands control back to the route. Adjusting state during render
  // is the supported pattern for this — an effect would need an extra pass.
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOverride(undefined);
  }

  const openItem = override === undefined ? routeOpenItem : override;

  return (
    <aside
      className={cn(
        "relative flex h-screen shrink-0 flex-col justify-between border-r border-white/10 bg-black transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        collapsed ? "w-16" : "w-66"
      )}
    >
      {/* Collapse handle — floats on the border so it reads as a seam control
         rather than a nav item, and stays reachable in both states. */}
      <button
        type="button"
        onClick={toggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-7 z-20 grid size-6 place-items-center rounded-sm border border-white/12 bg-black text-white/45 shadow-lg shadow-black/60 transition-colors hover:border-white/30 hover:bg-white/5 hover:text-white"
      >
        {collapsed ? (
          <ChevronRight className="size-4" />
        ) : (
          <ChevronLeft className="size-4" />
        )}
      </button>

      <div data-lenis-prevent className="min-w-0 overflow-y-auto">
        {/* Brand row. The sidebar previously opened on the user's avatar, which
           meant the product's own mark appeared nowhere in the app — you could
           sit in the dashboard all day and never see it. */}
        <div
          className={cn(
            "flex h-16 items-center border-b border-white/10",
            collapsed ? "justify-center px-0" : "px-4"
          )}
        >
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <Image
              src="/brand/beacon-mark.png"
              alt=""
              width={256}
              height={256}
              priority
              className="size-7 w-auto mix-blend-screen"
            />
            {!collapsed && (
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-white">
                Beacon
              </span>
            )}
          </Link>
        </div>

        {/* Profile */}
        <div className={cn("px-3 py-4", collapsed && "px-2")}>
        <div
          className={cn(
            "group flex items-center gap-3 rounded-sm border border-white/10 bg-white/[0.02] transition-colors hover:border-white/20 hover:bg-white/[0.05]",
            collapsed ? "justify-center p-2" : "p-2.5"
          )}
        >
          <div className="relative size-8 shrink-0 overflow-hidden rounded-sm bg-white/10 ring-1 ring-white/20">
            {userAvatarUrl ? (
              <Image src={userAvatarUrl} alt={displayName} fill className="object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center font-mono text-[11px] font-bold text-white">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-white/30">
                {userRole}
              </p>
              <p className="truncate text-[13px] font-semibold tracking-tight text-white">
                {displayName}
              </p>
            </div>
          )}

          {!collapsed && (
            <ChevronDown className="size-3.5 shrink-0 text-white/25 transition-colors group-hover:text-white/50" />
          )}
        </div>
        </div>

        <div className="mx-4 border-t border-white/7" />

        <nav className="flex flex-col gap-6 px-3 pb-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-0.5">
              <p
                className={cn(
                  "mb-2 font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-white/25",
                  collapsed ? "text-center" : "px-2.5"
                )}
              >
                {group.label}
              </p>

              {group.items.map((item) => (
                <NavRow
                  key={item.label}
                  item={item}
                  collapsed={collapsed}
                  pathname={pathname}
                  isOpen={openItem === item.label}
                  onToggleOpen={() =>
                    setOverride(openItem === item.label ? null : item.label)
                  }
                />
              ))}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 p-3">
        <FooterRow
          icon={HelpCircle}
          label="Help"
          href="/dashboard/help"
          collapsed={collapsed}
        />

        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            "group relative flex w-full items-center gap-3 rounded-sm py-2.5 font-mono text-xs font-medium tracking-tight text-white/45 transition-colors hover:bg-white/[0.04] hover:text-white",
            collapsed ? "justify-center px-0" : "px-3"
          )}
        >
          <LogOut className="size-4.5 shrink-0" />
          {collapsed ? <Tooltip label="Logout Account" /> : <span>Logout Account</span>}
        </button>
      </div>
    </aside>
  );
}

function NavRow({
  item,
  collapsed,
  pathname,
  isOpen,
  onToggleOpen,
}: {
  item: NavItem;
  collapsed: boolean;
  pathname: string;
  isOpen: boolean;
  onToggleOpen: () => void;
}) {
  const Icon = item.icon;
  const hasChildren = Boolean(item.children?.length);

  // A parent counts as active anywhere in its subtree; a leaf only on an exact
  // match, so /dashboard doesn't light up on every child route.
  const isActive = hasChildren
    ? pathname.startsWith(item.href)
    : pathname === item.href;

  const rowClass = cn(
    "group relative flex w-full items-center gap-3 rounded-sm py-2.5 font-mono text-xs tracking-tight transition-all duration-200",
    collapsed ? "justify-center px-0" : "px-3",
    isActive
      ? "bg-white/[0.07] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
      : "font-medium text-white/45 hover:bg-white/[0.04] hover:text-white"
  );

  const iconEl = (
    <Icon
      className={cn("size-4.5 shrink-0", isActive && "text-white/80")}
    />
  );

  // Collapsed + has children → the submenu becomes a hover flyout, since
  // there's no room to expand a tree inside a 64px rail.
  if (collapsed && hasChildren) {
    return (
      <div className="group relative">
        <Link href={item.href} className={rowClass}>
          {iconEl}
        </Link>

        <Flyout>
          <div className="min-w-44 rounded-sm border border-white/12 bg-black p-1.5 shadow-xl shadow-black/60">
            {item.children!.map((child) => (
              <ChildLink key={child.href} child={child} pathname={pathname} />
            ))}
          </div>
        </Flyout>
      </div>
    );
  }

  if (collapsed) {
    return (
      <Link href={item.href} className={rowClass}>
        {iconEl}
        <Tooltip label={item.label} />
      </Link>
    );
  }

  if (!hasChildren) {
    return (
      <Link href={item.href} className={rowClass}>
        {iconEl}
        <span className="truncate">{item.label}</span>
      </Link>
    );
  }

  return (
    <div>
      <button type="button" onClick={onToggleOpen} className={rowClass}>
        {iconEl}
        <span className="flex-1 truncate text-left">{item.label}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-white/30 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Children hang off a rail with a short stub into each row — the tree
         shape makes the nesting obvious without indenting far enough to lose
         the label to truncation. */}
      {isOpen && (
        <ul className="relative mt-0.5 ml-5 space-y-0.5 border-l border-white/10 pl-3.5">
          {item.children!.map((child) => (
            <li key={child.href} className="relative">
              <span
                aria-hidden
                className="absolute -left-3.5 top-1/2 h-px w-2.5 bg-white/10"
              />
              <ChildLink child={child} pathname={pathname} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ChildLink({ child, pathname }: { child: NavChild; pathname: string }) {
  const isActive = pathname === child.href;

  return (
    <Link
      href={child.href}
      className={cn(
        "block truncate rounded-sm px-3 py-1.5 font-mono text-[11px] tracking-tight transition-colors",
        isActive
          ? "bg-white/[0.07] font-semibold text-white"
          : "font-medium text-white/35 hover:bg-white/[0.04] hover:text-white/80"
      )}
    >
      {child.label}
    </Link>
  );
}

/**
 * Hover panel for the collapsed rail. The wrapper carries left padding rather
 * than a margin so the gap between rail and panel is still inside the hover
 * target — with a margin the panel closes as the pointer crosses the gap.
 */
function Flyout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pointer-events-none absolute left-full top-0 z-50 pl-2 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
      {children}
    </div>
  );
}

function Tooltip({ label }: { label: string }) {
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-sm border border-white/12 bg-black px-2.5 py-1.5 font-mono text-[11px] font-medium text-white opacity-0 shadow-xl shadow-black/50 transition-opacity duration-150 group-hover:opacity-100"
    >
      {label}
    </span>
  );
}

function FooterRow({
  icon: Icon,
  label,
  href,
  collapsed,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-3 rounded-sm py-2.5 font-mono text-xs font-medium tracking-tight text-white/45 transition-colors hover:bg-white/[0.04] hover:text-white",
        collapsed ? "justify-center px-0" : "px-3"
      )}
    >
      <Icon className="size-4.5 shrink-0" />
      {collapsed ? <Tooltip label={label} /> : <span>{label}</span>}
    </Link>
  );
}
