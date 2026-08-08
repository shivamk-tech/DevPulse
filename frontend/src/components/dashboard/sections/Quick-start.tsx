// components/dashboard/quick-start.tsx
import { Plus, Bell, Globe, ShieldCheck, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

type StepStatus = "current" | "pending" | "locked";

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
    title: "Create Monitor",
    description: "Add your first website or API.",
    icon: Plus,
    status: "current",
  },
  {
    id: 2,
    title: "Configure Alerts",
    description: "Receive instant downtime notifications.",
    icon: Bell,
    status: "pending",
  },
  {
    id: 3,
    title: "Publish Status Page",
    description: "Share uptime publicly.",
    icon: Globe,
    status: "pending",
  },
  {
    id: 4,
    title: "You're Protected",
    description: "Your monitoring setup is complete.",
    icon: ShieldCheck,
    status: "locked",
  },
];

export function QuickStart() {
  return (
    <section className="rounded-lg border border-white/10 bg-[#0F0F14] p-3.5">
      <h2 className="text-[13px] font-normal text-white">Quick Start</h2>
      <p className="mt-0.5 text-[11.5px] font-light text-zinc-400">
        Complete these steps to get your infrastructure protected.
      </p>

      <div className="mt-2.5 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {STEPS.map((step) => (
          <QuickStartCard key={step.id} step={step} />
        ))}
      </div>
    </section>
  );
}

function QuickStartCard({ step }: { step: QuickStartStep }) {
  const Icon = step.icon;
  const isCurrent = step.status === "current";

  return (
    <div
      className={cn(
        "relative rounded-md border p-2.5 transition-colors",
        isCurrent
          ? "border-indigo-400/30 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.12),transparent_65%)]"
          : "border-white/10 bg-white/[0.02]"
      )}
    >
      <div
        className={cn(
          "flex h-[22px] w-[22px] items-center justify-center rounded-full text-[10px] font-light",
          isCurrent
            ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.22),transparent_45%),linear-gradient(180deg,#6366f1,#4f46e5)] text-white ring-1 ring-inset ring-white/15 shadow-sm shadow-indigo-500/40"
            : "bg-white/5 text-zinc-500"
        )}
      >
        {step.id}
      </div>

      <div
        className={cn(
          "mt-2 flex h-7 w-7 items-center justify-center rounded-md border",
          isCurrent
            ? "border-indigo-400/30 bg-indigo-500/10"
            : "border-white/10 bg-white/[0.03]"
        )}
      >
        <Icon
          className={cn(
            "h-3 w-3",
            isCurrent ? "text-indigo-400" : "text-zinc-300"
          )}
        />
      </div>

      <h3 className="mt-2 text-[11.5px] font-normal text-white">
        {step.title}
      </h3>
      <p className="mt-0.5 text-[10.5px] font-light leading-snug text-zinc-400">
        {step.description}
      </p>

      <StatusBadge status={step.status} />
    </div>
  );
}

function StatusBadge({ status }: { status: StepStatus }) {
  if (status === "current") {
    return (
      <span className="mt-2 inline-flex items-center rounded-md bg-indigo-500/15 px-1.5 py-0.5 text-[9.5px] font-light text-indigo-400 ring-1 ring-inset ring-indigo-400/20">
        Current Step
      </span>
    );
  }

  if (status === "locked") {
    return (
      <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-white/5 px-1.5 py-0.5 text-[9.5px] font-light text-zinc-500">
        <Lock className="h-2.5 w-2.5" />
        Locked
      </span>
    );
  }

  return (
    <span className="mt-2 inline-flex items-center rounded-md bg-white/5 px-1.5 py-0.5 text-[9.5px] font-light text-zinc-500">
      Pending
    </span>
  );
}