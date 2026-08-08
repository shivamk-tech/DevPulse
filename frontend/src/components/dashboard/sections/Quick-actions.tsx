// components/dashboard/quick-actions.tsx
import { Plus, FileText, Bell, Users, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  id: string;
  title: string;
  description: string;
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

export function QuickActions({
  onAddMonitor,
  onCreateStatusPage,
  onConfigureAlerts,
  onInviteTeam,
}: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      id: "add-monitor",
      title: "Add Monitor",
      description: "Monitor a website or API",
      icon: Plus,
      iconClassName: "bg-indigo-500/10 text-indigo-400",
      onClick: onAddMonitor,
    },
    {
      id: "create-status-page",
      title: "Create Status Page",
      description: "Build a public status page",
      icon: FileText,
      iconClassName: "bg-sky-500/10 text-sky-400",
      onClick: onCreateStatusPage,
    },
    {
      id: "configure-alerts",
      title: "Configure Alerts",
      description: "Set up notification channels",
      icon: Bell,
      iconClassName: "bg-emerald-500/10 text-emerald-400",
      onClick: onConfigureAlerts,
    },
    {
      id: "invite-team",
      title: "Invite Team",
      description: "Add members to workspace",
      icon: Users,
      iconClassName: "bg-amber-500/10 text-amber-400",
      onClick: onInviteTeam,
    },
  ];

  return (
    <section className="rounded-lg border border-white/10 bg-[#0F0F14] p-3.5">
      <h2 className="text-[13px] font-normal text-white">Quick Actions</h2>

      <div className="mt-2.5 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {actions.map((action) => (
          <QuickActionCard key={action.id} action={action} />
        ))}
      </div>
    </section>
  );
}

function QuickActionCard({ action }: { action: QuickAction }) {
  const Icon = action.icon;

  return (
    <button
      type="button"
      onClick={action.onClick}
      className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.02] p-2.5 text-left transition-colors hover:bg-white/[0.04]"
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
            action.iconClassName
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div>
          <p className="text-[11px] font-normal text-white">
            {action.title}
          </p>
          <p className="text-[10px] font-light text-zinc-400">
            {action.description}
          </p>
        </div>
      </div>
      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-600" />
    </button>
  );
}