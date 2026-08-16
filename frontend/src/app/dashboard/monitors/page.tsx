"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { CreateMonitorDialog } from "@/components/monitors/Create-monitor-dialog";
import { MonitorDetailPanel } from "@/components/monitors/Monitor-detail-panel";
import { MonitorsPlayground } from "@/components/monitors/Monitors-playground";
import { Button } from "@/components/ui";
import type { Moniters } from "@/types/moniter";
import { cn } from "@/lib/utils";

interface monitorProps { 
  monitors: Moniters;
}

export default function MonitorsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<Moniters | null>(null);

  // ---------------------------------------------------------------------
  // INTEGRATION POINT — wire these two the same way the dashboard page does:
  //
  //   const [monitors, setMonitors] = useState<Moniters[]>([]);
  //   const [loading, setLoading]   = useState(true);
  //   useEffect(() => { ...moniterServices.getAll()... }, []);
  //
  // Everything below already reads from them; no other change is needed.
  // ---------------------------------------------------------------------
  const monitors: Moniters[] = [];
  const loading = false;

  const counts = {
    all: monitors.length,
    active: monitors.filter((m) => m.is_active).length,
    paused: monitors.filter((m) => !m.is_active).length,
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex min-h-0 flex-1 flex-col p-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
              <span aria-hidden className="size-1 rounded-full bg-white/45" />
              Monitors
            </p>
            <h1 className="mt-3 text-xl font-normal leading-tight tracking-[-0.02em] text-white sm:text-2xl">
              Everything you watch.{" "}
              <span className="text-white/30">In one place.</span>
            </h1>
          </div>

          <Button
            variant="white"
            size="sm"
            leftSection={<Plus className="size-3.5" />}
            onClick={() => setCreateOpen(true)}
          >
            Create monitor
          </Button>
        </header>

        {/* Counts, not filters — they're derived from `is_active`, the only
           state the API reports. Wire them to a filter once there's more than
           one dimension worth slicing by. */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Chip label="All" count={counts.all} />
          <Chip label="Active" count={counts.active} tone="good" />
          <Chip label="Paused" count={counts.paused} />
        </div>

        {/* Canvas and inspector share a row on desktop, so selecting a node
           narrows the canvas instead of covering it. Below lg the panel becomes
           an overlay, since there's no room to sit beside anything. */}
        <div className="mt-5 flex min-h-0 flex-1 gap-5">
          <div className="min-w-0 flex-1">
            <MonitorsPlayground
              monitors={monitors}
              loading={loading}
              selectedId={selected?.id ?? null}
              onSelect={setSelected}
            />
          </div>

          <MonitorDetailPanel monitor={selected} onClose={() => setSelected(null)} />
        </div>
      </div>

      <CreateMonitorDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}

function Chip({
  label,
  count,
  tone = "neutral",
}: {
  label: string;
  count: number;
  tone?: "neutral" | "good";
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-sm border border-white/10 px-3 py-1.5">
      {tone === "good" && (
        <span aria-hidden className="size-1.5 rounded-full bg-[#0ca30c]" />
      )}
      <span className="font-mono text-[11px] text-white/60">{label}</span>
      <span
        className={cn(
          "font-mono text-[11px] tabular-nums",
          count > 0 ? "text-white" : "text-white/25"
        )}
      >
        {count}
      </span>
    </span>
  );
}
