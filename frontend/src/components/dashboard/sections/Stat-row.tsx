import { Activity, Clock, Gauge, TriangleAlert } from "lucide-react";

import { Panel } from "@/components/dashboard/ui/Panel";
import { cn } from "@/lib/utils";

/**
 * The KPI row the dashboard leads with.
 *
 * Deliberately honest about a brand-new workspace: counts really are 0, and
 * metrics that need history render an em-dash rather than a fabricated number
 * or a decorative sparkline. Once monitors report in, pass real values and the
 * `delta`/`trend` slots light up — nothing here has to change shape.
 */
export interface Stat {
  id: string;
  label: string;
  value: string | number;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Only status-bearing tiles get color; the rest stay in plain ink. */
  tone?: "neutral" | "good" | "critical";
}

interface StatRowProps {
  monitors?: number;
  uptime?: string | null;
  incidents?: number;
  responseTime?: string | null;
}

export function StatRow({
  monitors = 0,
  uptime = null,
  incidents = 0,
  responseTime = null,
}: StatRowProps) {
  const stats: Stat[] = [
    {
      id: "monitors",
      label: "Active monitors",
      value: monitors,
      hint: monitors === 0 ? "None configured yet" : "Checking every minute",
      icon: Activity,
    },
    {
      id: "uptime",
      label: "Uptime, 30 days",
      value: uptime ?? "—",
      hint: uptime ? "Across all monitors" : "Needs 24h of checks",
      icon: Gauge,
      tone: uptime ? "good" : "neutral",
    },
    {
      id: "incidents",
      label: "Open incidents",
      value: incidents,
      hint: incidents === 0 ? "All clear" : "Needs attention",
      icon: TriangleAlert,
      tone: incidents > 0 ? "critical" : "neutral",
    },
    {
      id: "response",
      label: "Avg response",
      value: responseTime ?? "—",
      hint: responseTime ? "Last 24 hours" : "No checks recorded",
      icon: Clock,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatTile key={stat.id} stat={stat} />
      ))}
    </div>
  );
}

function StatTile({ stat }: { stat: Stat }) {
  const Icon = stat.icon;
  const isEmpty = stat.value === "—";

  return (
    <Panel className="p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-xs font-medium text-white/45">{stat.label}</span>
        <Icon className="size-3.5 shrink-0 text-white/25" />
      </div>

      {/* Proportional figures, not tabular — these are display-size numbers
         standing alone, and tabular would space `121` out awkwardly. */}
      <p
        className={cn(
          "mt-3 text-2xl font-semibold leading-none tracking-tight",
          isEmpty ? "text-white/25" : "text-white"
        )}
      >
        {stat.value}
      </p>

      {/* Status is never carried by color alone — the dot always travels with
         this label. */}
      <p className="mt-2 flex items-center gap-1.5 text-[11px] text-white/40">
        {stat.tone && stat.tone !== "neutral" && (
          <span
            aria-hidden
            className={cn(
              "size-1.5 shrink-0 rounded-full",
              stat.tone === "good" ? "bg-[#0ca30c]" : "bg-[#d03b3b]"
            )}
          />
        )}
        {stat.hint}
      </p>
    </Panel>
  );
}
