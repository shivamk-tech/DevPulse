"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  LayoutDashboard,
  Globe,
  TriangleAlert,
  FileText,
  Bell,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Monitors", href: "/dashboard/monitors", icon: Globe },
  { label: "Incidents", href: "/dashboard/incidents", icon: TriangleAlert },
  { label: "Status Pages", href: "/dashboard/status-pages", icon: FileText },
  { label: "Alerts", href: "/dashboard/alerts", icon: Bell },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

function SidebarNavItem({ label, href, icon: Icon, active, collapsed }: {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  collapsed: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "group flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition-colors duration-200",
          active
            ? "bg-blue-500/10 text-blue-400"
            : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
        )}
      >
        <Icon className={cn("h-5 w-5 shrink-0", active ? "text-blue-400" : "text-zinc-400 group-hover:text-zinc-100")} />
        <span className={cn("truncate", collapsed && "sr-only")}>{label}</span>
      </Link>
    </li>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex h-screen flex-col justify-between border-r border-white/10 bg-[#0B0B0F] transition-all duration-200",
        collapsed ? "w-20" : "w-72"
      )}
      aria-label="Dashboard sidebar"
    >
      <div>
        <div className={cn("flex items-center justify-between px-4 py-4", collapsed ? "px-3" : "px-5")}> 
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-500/20">
              <Activity className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div>
                <p className="text-base font-semibold tracking-tight text-white">DevPulse</p>
                <p className="text-xs text-zinc-500">Analytics workspace</p>
              </div>
            )}
          </Link>

          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((current) => !current)}
            className="rounded-2xl p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="mt-4 px-2">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <SidebarNavItem
                key={item.href}
                label={item.label}
                href={item.href}
                icon={item.icon}
                active={pathname === item.href}
                collapsed={collapsed}
              />
            ))}
          </ul>
        </nav>
      </div>

      <div className={cn("border-t border-white/10 p-4", collapsed ? "px-3" : "px-5")}> 
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-3 py-3 text-left transition-colors duration-200 hover:border-white/15 hover:bg-white/10",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500 text-sm font-semibold text-white">
            A
          </div>

          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">Personal Workspace</p>
              <p className="mt-1 text-xs text-zinc-500">Free Plan</p>
            </div>
          ) : (
            <span className="sr-only">Personal Workspace, Free Plan</span>
          )}
        </button>
      </div>
    </aside>
  );
}
