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
  monitorsCount?: number
  /** True while the counts are still being fetched. */
  loading?: boolean;
}

export function StatRow({
  monitors = 0,
  uptime = null,
  incidents = 0,
  responseTime = null,
  monitorsCount = 0,
  loading = false,
}: StatRowProps) {
  const stats: Stat[] = [
    {
      id: "monitors",
      label: "Active monitors",
      // A zero while the request is still in flight is a wrong answer, not an
      // empty one — em-dash until the count is actually known.
      value: loading ? "—" : monitorsCount,
      hint: loading
        ? "Loading…"
        : monitorsCount === 0
          ? "None configured yet"
          : "Checking every minute",
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
        <StatTile key={stat.id} stat={stat} loading={loading} />
      ))}
    </div>
  );
}

function StatTile({ stat, loading = false }: { stat: Stat; loading?: boolean }) {
  const Icon = stat.icon;
  const isEmpty = stat.value === "—";

  return (
    <Panel className={cn("p-4", loading && "animate-pulse")}>
      <div className="flex items-center justify-between gap-2">
        <span className="truncate font-mono text-[11px] font-medium tracking-tight text-white/45">{stat.label}</span>
        <Icon className="size-3.5 shrink-0 text-white/25" />
      </div>

      {/* Proportional figures, not tabular — these are display-size numbers
         standing alone, and tabular would space `121` out awkwardly. */}
      <p
        className={cn(
          "mt-3 font-mono text-xl font-semibold leading-none tracking-tight",
          isEmpty ? "text-white/25" : "text-white"
        )}
      >
        {stat.value}
      </p>

      {/* Status is never carried by color alone — the dot always travels with
         this label. */}
      <p className="mt-2 flex items-center gap-1.5 text-[10px] text-white/40">
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
