"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Globe, X } from "lucide-react";

import type { Moniters } from "@/types/moniter";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface MonitorDetailPanelProps {
  monitor: Moniters | null;
  onClose: () => void;
}

const TABS = ["Overview", "Checks", "Incidents", "Settings"] as const;

/**
 * Right-hand inspector for the selected monitor.
 *
 * Everything shown here comes straight off the `getAll()` payload. There is
 * deliberately no uptime figure, latency chart, or recent-checks list — the API
 * doesn't return that yet, and inventing plausible numbers on a monitoring
 * product is the one lie its users would take at face value.
 */
export function MonitorDetailPanel({ monitor, onClose }: MonitorDetailPanelProps) {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");

  return (
    <AnimatePresence>
      {monitor && (
        <>
          {/* Scrim, phones and tablets only — on desktop the panel sits beside
             the canvas rather than over it, so dimming would be wrong. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />

          <motion.aside
            key="panel"
            initial={reduce ? { opacity: 0 } : { x: "100%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.35, ease: EASE }}
            className={cn(
              "fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-white/10 bg-black",
              "lg:relative lg:inset-auto lg:z-auto lg:h-full lg:w-96 lg:max-w-none lg:shrink-0"
            )}
          >
            {/* Header */}
            <div className="relative shrink-0 border-b border-white/8 p-5">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close panel"
                className="absolute right-4 top-4 grid size-7 place-items-center rounded-md text-white/40 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X className="size-4" />
              </button>

              <div className="flex items-start gap-3 pr-8">
                <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5">
                  <Globe className="size-5 text-white/60" />
                </span>

                <div className="min-w-0">
                  {/* Status is a state we genuinely know: is_active. It is not
                     "Operational" — that would claim a successful check we
                     have no record of. */}
                  <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                    <span
                      aria-hidden
                      className={cn(
                        "size-1.5 rounded-full",
                        monitor.is_active ? "bg-[#0ca30c]" : "bg-white/30"
                      )}
                    />
                    {monitor.is_active ? "Active" : "Paused"}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-base font-medium text-white">
                      {monitor.name}
                    </h2>
                    <span className="shrink-0 rounded-sm border border-white/12 px-1.5 py-px font-mono text-[9px] tracking-tight text-white/50">
                      {monitor.method}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="shrink-0 overflow-x-auto border-b border-white/8 px-5 scrollbar-none">
              <div className="flex min-w-max gap-1">
                {TABS.map((label) => {
                  const active = tab === label;

                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setTab(label)}
                      className={cn(
                        "relative px-3 pb-3 pt-1 font-mono text-[11px] tracking-tight transition-colors",
                        active ? "text-white" : "text-white/35 hover:text-white/70"
                      )}
                    >
                      {label}
                      {active && (
                        <motion.span
                          layoutId="monitorPanelTab"
                          className="absolute inset-x-0 -bottom-px h-px bg-white"
                          transition={
                            reduce
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 420, damping: 36 }
                          }
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto p-5">
              {tab === "Overview" ? (
                <dl className="divide-y divide-white/6">
                  <Row label="Status" value={monitor.is_active ? "Active" : "Paused"} />
                  <Row label="Method" value={monitor.method} mono />
                  <Row label="Check interval" value={`Every ${monitor.interval}s`} mono />
                  <Row label="Timeout" value={`${monitor.timeout}s`} mono />
                  <Row label="Created" value={formatDate(monitor.created_at)} />
                  <Row label="Last updated" value={formatDate(monitor.updated_at)} />
                  <Row label="ID" value={String(monitor.id)} mono />
                </dl>
              ) : (
                /* Announced, not faked — same treatment as the security page. */
                <div className="grid h-full place-items-center px-4 text-center">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/30">
                      Coming soon
                    </p>
                    <p className="mt-3 max-w-[15rem] text-[13px] leading-relaxed text-white/40">
                      {tab === "Checks" &&
                        "Individual check results will appear here once Beacon starts recording them."}
                      {tab === "Incidents" &&
                        "Downtime periods for this monitor, with start and recovery times."}
                      {tab === "Settings" &&
                        "Edit the URL, interval, and timeout without leaving this panel."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <dt className="shrink-0 text-[11px] text-white/40">{label}</dt>
      <dd
        className={cn(
          "min-w-0 truncate text-right text-xs text-white/85",
          mono && "font-mono"
        )}
      >
        {value}
      </dd>
    </div>
  );
}

/** ISO string → readable date. Falls back to the raw value if it won't parse. */
function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
