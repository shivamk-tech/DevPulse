// components/dashboard/recent-activity.tsx
import { History } from "lucide-react";

import { Panel, PanelHeader } from "@/components/dashboard/ui/Panel";

interface ActivityItem {
  id: string;
  title: string;
  timestamp: string;
}

interface RecentActivityProps {
  items?: ActivityItem[];
}

export function RecentActivity({ items = [] }: RecentActivityProps) {
  return (
    <Panel className="p-5">
      <PanelHeader
        title="Recent activity"
        action={
          items.length > 0 ? (
            <button
              type="button"
              className="text-[11px] text-white/40 transition-colors hover:text-white"
            >
              View all
            </button>
          ) : undefined
        }
      />

      {items.length === 0 ? (
        // Quiet by design: a nested empty state shouldn't compete with the
        // main canvas above it, so this is one line of text, no illustration.
        <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-dashed border-white/7 px-3.5 py-3">
          <History className="size-4 shrink-0 text-white/25" />
          <p className="text-[11px] text-white/40">
            Checks, incidents, and alerts will appear here once monitoring begins.
          </p>
        </div>
      ) : (
        <ul className="mt-2 divide-y divide-white/6">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 py-2.5"
            >
              <span className="min-w-0 truncate text-xs text-white/70">
                {item.title}
              </span>
              {/* Tabular figures here — these DO align in a column */}
              <span className="shrink-0 text-[11px] tabular-nums text-white/35">
                {item.timestamp}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
