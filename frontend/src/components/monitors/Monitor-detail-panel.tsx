"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ExternalLink,
  Globe,
  MoreHorizontal,
  Pause,
  PencilLine,
  Play,
  X,
} from "lucide-react";

import type { Monitor } from "@/types/monitor";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface MonitorDetailPanelProps {
  monitor: Monitor | null;
  onClose: () => void;
  /** Wire these when the endpoints exist; the buttons disable without them. */
  onTogglePause?: (monitor: Monitor) => void;
  onEdit?: (monitor: Monitor) => void;
}

const TABS = ["Overview", "Checks", "Incidents", "Settings"] as const;

/**
 * Inspector for the selected monitor.
 *
 * Structured after the reference: icon tile, status, name, URL, an action row,
 * tabs, a two-column stat grid, then cards for response time and recent checks.
 *
 * The cards that depend on check history render an empty state rather than a
 * number, because `getAll()` returns configuration only — no uptime, latency or
 * check log exists yet. A plausible-looking chart on a monitoring product is the
 * one fabrication its users would actually act on.
 */
export function MonitorDetailPanel({
  monitor,
  onClose,
  onTogglePause,
  onEdit,
}: MonitorDetailPanelProps) {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");

  useEffect(() => {
    if (!monitor) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [monitor, onClose]);

  return (
    <AnimatePresence>
      {monitor && (
        <>
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
            transition={
              reduce
                ? { duration: 0.15 }
                : { type: "spring", stiffness: 380, damping: 38, mass: 0.9 }
            }
            className={cn(
              "fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-white/10 bg-black",
              "lg:relative lg:inset-auto lg:z-auto lg:h-full lg:w-96 lg:max-w-none lg:shrink-0"
            )}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close panel"
              className="absolute right-4 top-4 z-10 grid size-8 place-items-center rounded-sm text-white/40 transition-colors hover:bg-white/5 hover:text-white"
            >
              <X className="size-4" />
            </button>

            <motion.div
              key={monitor.id}
              data-lenis-prevent
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: EASE, delay: 0.05 }}
              className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-5 lg:overflow-hidden"
            >
              {/* Identity */}
              <div className="flex items-start gap-3.5 pr-10">
                <span className="grid size-12 shrink-0 place-items-center rounded-md border border-violet-400/20 bg-violet-500/10">
                  <Globe className="size-5 text-violet-300" />
                </span>

                <div className="min-w-0 pt-0.5">
                  {/* "Active", not "Operational" — the API tells us the monitor
                     is enabled, not that its last check passed. */}
                  <p className="flex items-center gap-2 text-[13px]">
                    <span
                      aria-hidden
                      className={cn(
                        "size-1.5 rounded-full",
                        monitor.is_active ? "bg-[#22c55e]" : "bg-white/30"
                      )}
                    />
                    <span
                      className={monitor.is_active ? "text-[#4ade80]" : "text-white/45"}
                    >
                      {monitor.is_active ? "Active" : "Paused"}
                    </span>
                  </p>

                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-base font-semibold tracking-tight text-white">
                      {monitor.name}
                    </h2>
                    <span className="shrink-0 rounded-sm bg-violet-500/15 px-2 py-0.5 font-mono text-[10px] font-medium tracking-tight text-violet-300">
                      {monitor.method}
                    </span>
                  </div>

                  {monitor.url && (
                    <a
                      href={monitor.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group mt-1.5 flex items-center gap-2 text-xs text-white/45 transition-colors hover:text-white"
                    >
                      <span className="truncate">{monitor.url}</span>
                      <ExternalLink className="size-3.5 shrink-0 opacity-60 transition-opacity group-hover:opacity-100" />
                    </a>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 grid grid-cols-3 gap-2">
                <ActionButton
                  primary
                  icon={monitor.is_active ? Pause : Play}
                  label={monitor.is_active ? "Pause" : "Resume"}
                  onClick={onTogglePause && (() => onTogglePause(monitor))}
                />
                <ActionButton
                  icon={PencilLine}
                  label="Edit"
                  onClick={onEdit && (() => onEdit(monitor))}
                />
                <ActionButton icon={MoreHorizontal} label="More" />
              </div>

              {/* Tabs */}
              <div className="mt-5 border-b border-white/8">
                <div className="flex gap-6">
                  {TABS.map((label) => {
                    const active = tab === label;

                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setTab(label)}
                        className={cn(
                          "relative pb-2.5 text-xs transition-colors",
                          active
                            ? "font-medium text-white"
                            : "text-white/35 hover:text-white/70"
                        )}
                      >
                        {label}
                        {active && (
                          <motion.span
                            layoutId="monitorPanelTab"
                            className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-violet-400"
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

              <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: EASE }}
              >
              {tab === "Overview" ? (
                <div className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 rounded-sm border border-white/10">
                    <Cell
                      label="Status"
                      value={monitor.is_active ? "Active" : "Paused"}
                      accent={monitor.is_active}
                    />
                    <Cell label="Method" value={monitor.method} />
                    <Cell label="Check interval" value={`Every ${monitor.interval}s`} />
                    <Cell label="Timeout" value={`${monitor.timeout}s`} />
                    <Cell label="Created" value={formatDate(monitor.created_at)} />
                    <Cell label="Last updated" value={formatDate(monitor.updated_at)} />
                  </div>

                  {/* Structure kept, data honestly absent. */}
                  <Card title="Response time (24h)" badge="No data">
                    <NoSeries>
                      Beacon isn&apos;t recording check results yet, so there&apos;s
                      nothing to plot.
                    </NoSeries>
                  </Card>

                  <Card title="Recent checks">
                    <NoSeries>
                      Individual checks appear here once the checker starts running.
                    </NoSeries>
                  </Card>
                </div>
              ) : (
                <div className="mt-8 px-2 text-center">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/30">
                    Coming soon
                  </p>
                  <p className="mx-auto mt-3 max-w-64 text-[13px] leading-relaxed text-white/40">
                    {tab === "Checks" &&
                      "Every check result for this monitor, with status code and latency."}
                    {tab === "Incidents" &&
                      "Downtime periods, with start and recovery times."}
                    {tab === "Settings" &&
                      "Edit the URL, interval, and timeout without leaving this panel."}
                  </p>
                </div>
              )}
              </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */

function ActionButton({
  icon: Icon,
  label,
  onClick,
  primary = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      // Disabled without a handler rather than silently inert — a button that
      // looks live and does nothing is worse than one that admits it can't.
      title={onClick ? label : `${label} — not available yet`}
      className={cn(
        "flex h-9 items-center justify-center gap-2 rounded-sm text-xs font-medium transition-[background-color,color,transform] duration-200 active:scale-[0.98]",
        "disabled:cursor-not-allowed disabled:opacity-40",
        primary
          ? "bg-white text-black enabled:hover:bg-white/90"
          : "border border-white/12 text-white/80 enabled:hover:bg-white/5 enabled:hover:text-white"
      )}
    >
      <Icon className="size-3.5" />
      {label}
    </button>
  );
}

/** One cell of the stat grid; per-cell borders draw the inner rules. */
function Cell({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="border-b border-r border-white/8 px-3.5 py-2.5 nth-[2n]:border-r-0 nth-last-[-n+2]:border-b-0">
      <p className="text-[10px] text-white/40">{label}</p>
      <p
        className={cn(
          "mt-1 truncate text-xs font-semibold",
          accent ? "text-[#4ade80]" : "text-white"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function Card({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-sm border border-white/10 p-3.5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xs font-semibold text-white">{title}</h3>
        {badge && (
          <span className="rounded-sm bg-white/6 px-2 py-0.5 font-mono text-[10px] text-white/40">
            {badge}
          </span>
        )}
      </div>

      <div className="mt-3">{children}</div>
    </section>
  );
}

/** Where a chart or log will go, once there's history to draw. */
function NoSeries({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative grid h-14 place-items-center overflow-hidden rounded-sm border border-dashed border-white/8">
      {/* A flat baseline rather than a fake trace — it reads as "no data", not
         as "zero latency". */}
      <span
        aria-hidden
        className="absolute inset-x-4 top-1/2 h-px bg-linear-to-r from-transparent via-white/10 to-transparent"
      />
      <p className="relative max-w-64 px-4 text-center text-[10px] leading-relaxed text-white/30">
        {children}
      </p>
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
    hour: "2-digit",
    minute: "2-digit",
  });
}
