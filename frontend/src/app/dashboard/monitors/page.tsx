"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { CreateMonitorDialog } from "@/components/monitors/Create-monitor-dialog";
import { DeleteMonitorDialog } from "@/components/monitors/Delete-monitor-dialog";
import { MonitorDetailPanel } from "@/components/monitors/Monitor-detail-panel";
import { MonitorsPlayground } from "@/components/monitors/Monitors-playground";
import { Button } from "@/components/ui";
import type { Monitor } from "@/types/monitor";
import { cn } from "@/lib/utils";
import { useMonitor, useUpdateMonitor } from "@/hooks/useMonitors";
import { monitorServices } from "@/services/monitor/monitors.service";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteMonitor, useToggleMonitor } from "@/hooks/useMonitors";

export default function MonitorsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<Monitor | null>(null);
  const { data, isLoading } = useMonitor()
  const [editing, setEditing] = useState<Monitor | null>(null);
  const updateMonitor = useUpdateMonitor();
  const monitors = data?.data ?? [];
  const counts = {
    all: monitors.length,
    active: monitors.filter((m) => m.is_active).length,
    paused: monitors.filter((m) => !m.is_active).length,
  };
  const queryClient = useQueryClient();
  const deleteMonitor = useDeleteMonitor();
  const toggleMonitor = useToggleMonitor();
  const [deleteTarget, setDeleteTarget] = useState<Monitor | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Canvas column. The header sits over the canvas rather than above it in
         flow, so the board keeps the full height — but it's inside this column,
         so opening the inspector narrows everything together. */}
      {/* `h-full` is explicit rather than relying on flex stretch: the
          canvas must never take its height from whatever sibling happens to be
          mounted, or closing the inspector collapses the board. */}
      <div className="relative h-full min-w-0 flex-1">
        <MonitorsPlayground
          monitors={monitors}
          loading={isLoading}
          selectedId={selected?.id ?? null}
          onSelect={setSelected}
          onDeselect={() => setSelected(null)}
          onCreate={() => setCreateOpen(true)}
        />

        {/* pointer-events-none on the wrapper keeps the board draggable through
           the gaps; interactive children switch it back on. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-4 p-5">
          <div>
            <p className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
              <span aria-hidden className="size-1 rounded-full bg-white/45" />
              Monitors
            </p>

            <h1 className="mt-2 text-lg font-normal leading-tight tracking-[-0.02em] text-white sm:text-xl">
              Everything you watch.{" "}
              <span className="text-white/30">In one place.</span>
            </h1>

            {/* Segmented, not separate chips — one control with dividers reads
               as a single filter rather than three loose badges. */}
            <div className="pointer-events-auto mt-4 inline-flex items-center divide-x divide-white/8 overflow-hidden rounded-sm border border-white/10 bg-black/70 backdrop-blur-md">
              <Segment label="All" count={counts.all} />
              <Segment label="Active" count={counts.active} tone="good" />
              <Segment label="Paused" count={counts.paused} />
            </div>
          </div>

          <div className="pointer-events-auto">
            <Button
              variant="white"
              size="sm"
              leftSection={<Plus className="size-3.5" />}
              onClick={() => setCreateOpen(true)}
            >
              Create monitor
            </Button>
          </div>
        </div>
      </div>

      <MonitorDetailPanel
        monitor={selected}
        onClose={() => setSelected(null)}
        onTogglePause={async (m) => {
          const res = await toggleMonitor.mutateAsync(m.id);
          setSelected(res.data);   // panel flips Pause <-> Resume immediately
        }}
        onEdit={(m) => { setEditing(m); setCreateOpen(true); }}
        onDelete={(m) => { setDeleteTarget(m); setDeleteOpen(true); }}
      />

      <DeleteMonitorDialog
        monitor={deleteTarget}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={async (m) => {
          await deleteMonitor.mutateAsync(m.id);
          setSelected(null);
        }}
      />

      <CreateMonitorDialog
        open={createOpen}
        onOpenChange={(open) => { setCreateOpen(open); if (!open) setEditing(null); }}
        monitor={editing}
        onSubmit={async (values) => {
          if (editing) {
            const res = await updateMonitor.mutateAsync({ id: editing.id, data: values });
            setSelected(res.data);      // panel shows fresh values immediately
          } else {
            await monitorServices.Create(values);
            await queryClient.invalidateQueries({
              queryKey : ["monitors"],
            })
          }
        }}
      />
    </div>
  );
}

/** One cell of the segmented count control. Derived purely from `is_active`. */
function Segment({
  label,
  count,
  tone = "neutral",
}: {
  label: string;
  count: number;
  tone?: "neutral" | "good";
}) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-2">
      {tone === "good" && (
        <span aria-hidden className="size-1.5 rounded-full bg-[#0ca30c]" />
      )}
      <span className="font-mono text-[11px] text-white/55">{label}</span>
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
