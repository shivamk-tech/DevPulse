// components/dashboard/quick-start.tsx
import { Bell, Check, ChevronRight, Globe, Plus, ShieldCheck } from "lucide-react";

import { Panel, PanelHeader } from "@/components/dashboard/ui/Panel";
import { cn } from "@/lib/utils";

type StepStatus = "done" | "current" | "pending";

interface QuickStartStep {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: StepStatus;
}

const STEPS: QuickStartStep[] = [
  {
    id: 1,
    title: "Create a monitor",
    description: "Add your first website or API endpoint.",
    icon: Plus,
    status: "current",
  },
  {
    id: 2,
    title: "Configure alerts",
    description: "Choose where downtime notifications land.",
    icon: Bell,
    status: "pending",
  },
  {
    id: 3,
    title: "Publish a status page",
    description: "Share uptime with your users.",
    icon: Globe,
    status: "pending",
  },
  {
    id: 4,
    title: "You're protected",
    description: "Monitoring is live and alerting is on.",
    icon: ShieldCheck,
    status: "pending",
  },
];

export function QuickStart() {
  const done = STEPS.filter((step) => step.status === "done").length;

  return (
    <Panel className="p-5">
      <PanelHeader
        title="Finish setting up"
        description="Four steps to a fully monitored stack."
        action={
          <span className="text-xs text-white/40">
            {done} of {STEPS.length}
          </span>
        }
      />

      {/* Progress track — one honest bar beats four "Pending" badges */}
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/6">
        <div
          className="h-full rounded-full bg-linear-to-r from-[#6366f1] to-[#4f46e5] transition-[width] duration-500"
          style={{ width: `${(done / STEPS.length) * 100}%` }}
        />
      </div>

      {/* Rows, not a 4-up card grid: the steps are sequential, and a vertical
         list makes that order obvious while taking half the vertical space. */}
      <ol className="mt-4 divide-y divide-white/6">
        {STEPS.map((step) => (
          <StepRow key={step.id} step={step} />
        ))}
      </ol>
    </Panel>
  );
}

function StepRow({ step }: { step: QuickStartStep }) {
  const Icon = step.icon;
  const isCurrent = step.status === "current";
  const isDone = step.status === "done";

  return (
    <li>
      <button
        type="button"
        disabled={!isCurrent}
        className={cn(
          "group flex w-full items-center gap-3 py-3 text-left transition-colors",
          isCurrent ? "cursor-pointer" : "cursor-default"
        )}
      >
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors",
            isDone && "border-emerald-400/25 bg-emerald-500/10",
            isCurrent && "border-indigo-400/30 bg-indigo-500/12",
            !isDone && !isCurrent && "border-white/7 bg-white/2"
          )}
        >
          {isDone ? (
            <Check className="size-4 text-emerald-400" strokeWidth={2.5} />
          ) : (
            <Icon
              className={cn("size-4", isCurrent ? "text-indigo-300" : "text-white/30")}
            />
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span
            className={cn(
              "block text-[13px] font-medium",
              isDone ? "text-white/45 line-through" : isCurrent ? "text-white" : "text-white/50"
            )}
          >
            {step.title}
          </span>
          <span className="mt-0.5 block truncate text-xs text-white/35">
            {step.description}
          </span>
        </span>

        {/* Only the actionable step advertises itself */}
        {isCurrent && (
          <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-indigo-300">
            Start
            <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        )}
      </button>
    </li>
  );
}
