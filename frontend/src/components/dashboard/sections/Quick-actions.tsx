// components/dashboard/quick-actions.tsx
"use client";

import { Bell, ChevronRight, FileText, Plus, Users } from "lucide-react";

import { Panel, PanelHeader } from "@/components/dashboard/ui/Panel";
import { cn } from "@/lib/utils";

interface QuickAction {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClassName: string;
  onClick?: () => void;
}

interface QuickActionsProps {
  onAddMonitor?: () => void;
  onCreateStatusPage?: () => void;
  onConfigureAlerts?: () => void;
  onInviteTeam?: () => void;
}

/**
 * Shortcuts rail.
 *
 * This was a second four-across card grid sitting directly under the setup
 * checklist, repeating the same four tasks in the same shape — so the eye had
 * two competing "start here" blocks. Demoted to a narrow list in the right
 * rail: still one click away, no longer arguing with the checklist for
 * attention. Descriptions dropped for the same reason — the checklist already
 * explains each task.
 */
export function QuickActions({
  onAddMonitor,
  onCreateStatusPage,
  onConfigureAlerts,
  onInviteTeam,
}: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      id: "add-monitor",
      title: "Add monitor",
      icon: Plus,
      iconClassName: "bg-white/8 text-white/80",
      onClick: onAddMonitor,
    },
    {
      id: "create-status-page",
      title: "Create status page",
      icon: FileText,
      iconClassName: "bg-white/8 text-white/70",
      onClick: onCreateStatusPage,
    },
    {
      id: "configure-alerts",
      title: "Configure alerts",
      icon: Bell,
      iconClassName: "bg-white/8 text-white/70",
      onClick: onConfigureAlerts,
    },
    {
      id: "invite-team",
      title: "Invite team",
      icon: Users,
      iconClassName: "bg-white/8 text-white/70",
      onClick: onInviteTeam,
    },
  ];

  return (
    <Panel className="p-5">
      <PanelHeader title="Shortcuts" />

      <div className="mt-3 flex flex-col">
        {actions.map((action) => (
          <ActionRow key={action.id} action={action} />
        ))}
      </div>
    </Panel>
  );
}

function ActionRow({ action }: { action: QuickAction }) {
  const Icon = action.icon;

  return (
    <button
      type="button"
      onClick={action.onClick}
      className="group -mx-2 flex items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-white/4"
    >
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-md",
          action.iconClassName
        )}
      >
        <Icon className="size-3.5" />
      </span>

      <span className="min-w-0 flex-1 truncate text-xs text-white/70 transition-colors group-hover:text-white">
        {action.title}
      </span>

      <ChevronRight className="size-3.5 shrink-0 text-white/20 transition-all group-hover:translate-x-0.5 group-hover:text-white/40" />
    </button>
  );
}
