// components/dashboard/workspace-summary.tsx
import { Panel, PanelHeader } from "@/components/dashboard/ui/Panel";

interface WorkspaceSummaryProps {
  workspaceName?: string;
  plan?: string;
  members?: number;
  timezone?: string;
}

export function WorkspaceSummary({
  workspaceName = "Personal Workspace",
  plan = "Free",
  members = 1,
  timezone = "Asia/Kolkata (GMT+5:30)",
}: WorkspaceSummaryProps) {
  const rows = [
    { label: "Workspace", value: workspaceName },
    { label: "Plan", value: plan, isPill: true },
    { label: "Members", value: members },
    { label: "Timezone", value: timezone },
  ];

  return (
    <Panel className="p-5">
      <PanelHeader title="Workspace" />

      <dl className="mt-3 divide-y divide-white/6">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
          >
            <dt className="shrink-0 text-[11px] text-white/40">{row.label}</dt>
            <dd className="min-w-0">
              {row.isPill ? (
                <span className="rounded-md bg-white/6 px-2 py-0.5 text-[10px] font-medium text-white/70">
                  {row.value}
                </span>
              ) : (
                <span className="block truncate text-right text-xs text-white/80">
                  {row.value}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}
