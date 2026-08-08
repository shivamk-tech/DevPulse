// components/dashboard/sidebar.tsx
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

interface SidebarProps {
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({ onCollapsedChange }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      onCollapsedChange?.(next);
      return next;
    });
  };

  return (
    <aside
      className={cn(
        "relative flex h-screen shrink-0 flex-col justify-between border-r border-white/10 bg-[#0B0B0F] transition-[width] duration-200 ease-in-out",
        collapsed ? "w-[64px]" : "w-[210px]"
      )}
    >
      <div className="min-w-0">
        {/* Logo row */}
        <div
          className={cn(
            "flex items-center py-3.5",
            collapsed ? "justify-center px-0" : "justify-between px-4"
          )}
        >
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-2 overflow-hidden",
              collapsed && "justify-center"
            )}
          >
            <Activity
              className="h-5 w-5 shrink-0 text-indigo-400"
              strokeWidth={2.5}
            />
            {!collapsed && (
              <span className="truncate text-[15px] font-medium tracking-tight text-white">
                Beacon
              </span>
            )}
          </Link>

          {!collapsed && (
            <button
              type="button"
              onClick={toggle}
              aria-label="Collapse sidebar"
              className="shrink-0 rounded-md p-1 text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-300"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Nav items */}
        <nav className="mt-2.5 flex flex-col gap-0.5 px-2.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-md py-1.5 text-[12.5px] font-normal transition-colors",
                  collapsed ? "justify-center px-0" : "px-2.5",
                  isActive
                    ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.10),transparent_60%),linear-gradient(180deg,rgba(99,102,241,0.18),rgba(79,70,229,0.10))] text-indigo-300 ring-1 ring-inset ring-indigo-400/20 shadow-sm shadow-indigo-500/20"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                )}
              >
                <Icon className="h-[16px] w-[16px] shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Workspace footer */}
      <div className="border-t border-white/10 p-2.5">
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-2.5 rounded-md py-1.5 text-left transition-colors hover:bg-white/5",
            collapsed ? "justify-center px-0" : "px-1.5"
          )}
          title={collapsed ? "Personal Workspace" : undefined}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[linear-gradient(180deg,rgba(255,255,255,0.22),transparent_45%),linear-gradient(180deg,#6366f1,#4f46e5)] text-xs font-medium text-white ring-1 ring-inset ring-white/15 shadow-sm shadow-indigo-500/30">
            A
          </div>
          {!collapsed && (
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-[12.5px] font-normal text-white">
                Personal Workspace
              </span>
              <span className="truncate text-[11px] font-light text-zinc-500">
                Free Plan
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Peek-out expand handle, shown only when collapsed */}
      {collapsed && (
        <button
          type="button"
          onClick={toggle}
          aria-label="Expand sidebar"
          className="absolute -right-3 top-16 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[#141419] text-zinc-400 shadow-md transition-colors hover:text-zinc-200"
        >
          <ChevronsRight className="h-3.5 w-3.5" />
        </button>
      )}
    </aside>
  );
}