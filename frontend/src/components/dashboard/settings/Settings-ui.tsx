"use client";

import { useState } from "react";

import { Panel } from "@/components/dashboard/ui/Panel";
import { Button, Input, type InputProps } from "@/components/ui";
import { cn } from "@/lib/utils";

/**
 * Shared building blocks for the /dashboard/settings pages.
 *
 * None of these submit anything — there's no onSave wiring here on purpose.
 * Pass a handler down from the page once the endpoint exists.
 */

/** Page title + subtitle. Each settings route owns its own. */
export function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header>
      <h1 className="text-lg font-semibold tracking-tight text-white">{title}</h1>
      <p className="mt-1 text-[13px] text-white/45">{description}</p>
    </header>
  );
}

export function SettingsSection({
  title,
  description,
  icon: Icon,
  badge,
  footer,
  muted = false,
  children,
}: {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  /** Status pill beside the title — e.g. <StatusPill /> or <ComingSoonPill />. */
  badge?: React.ReactNode;
  /** Defaults to a Save row; pass `null` for a section that has nothing to save. */
  footer?: React.ReactNode | null;
  /** Recedes the whole panel — used for features that aren't built yet. */
  muted?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Panel className={cn("overflow-hidden", muted && "bg-black")}>
      <div className="p-5">
        <div className="flex items-start gap-3">
          {Icon && (
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-lg",
                muted ? "bg-white/3 text-white/25" : "bg-white/5 text-white/60"
              )}
            >
              <Icon className="size-4" />
            </span>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                className={cn(
                  "font-mono text-[13px] font-medium tracking-tight",
                  muted ? "text-white/60" : "text-white"
                )}
              >
                {title}
              </h2>
              {badge}
            </div>

            {description && (
              <p className="mt-1 text-[11px] leading-relaxed text-white/45">
                {description}
              </p>
            )}
          </div>
        </div>

        {children && <div className="mt-5 space-y-4">{children}</div>}
      </div>

      {footer === null ? null : (
        <div className="flex items-center justify-end gap-3 border-t border-white/7 px-5 py-3">
          {footer ?? (
            <Button type="button" variant="white" size="sm" className="h-8">
              Save changes
            </Button>
          )}
        </div>
      )}
    </Panel>
  );
}

export function Field({
  label,
  hint,
  id,
  ...props
}: InputProps & { label: string; hint?: string; id: string }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-xs font-medium text-white/70">
        {label}
      </label>

      <Input
        id={id}
        className="border-white/10 bg-white/5 text-white placeholder:text-white/25"
        {...props}
      />

      {hint && <p className="text-[11px] text-white/35">{hint}</p>}
    </div>
  );
}

/** Label + description on the left, switch on the right. */
export function ToggleRow({
  label,
  description,
  defaultChecked = false,
}: {
  label: string;
  description?: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-start justify-between gap-6 border-b border-white/6 pb-4 last:border-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-xs font-medium text-white/80">{label}</p>
        {description && (
          <p className="mt-0.5 text-[11px] leading-relaxed text-white/40">{description}</p>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => setChecked((prev) => !prev)}
        className={cn(
          "relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors duration-200",
          checked ? "bg-white" : "bg-white/10"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform duration-200",
            checked ? "translate-x-4.5" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  );
}

/**
 * Bare status dot, from the reserved status palette.
 *
 * The dot is the only *visible* cue, so `label` is carried in the accessible
 * name instead — a screen reader announces "Verified" and a hover tooltip
 * spells it out, rather than the state existing only as a color.
 */
export function StatusDot({
  label,
  tone = "good",
}: {
  label: string;
  tone?: "good" | "warning";
}) {
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={cn(
        "size-2 shrink-0 rounded-full",
        tone === "good"
          ? "bg-[#0ca30c] shadow-[0_0_0_3px_rgba(12,163,12,0.15)]"
          : "bg-[#fab219] shadow-[0_0_0_3px_rgba(250,178,25,0.15)]"
      )}
    />
  );
}

export function ComingSoonPill() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/35 ring-1 ring-inset ring-white/8">
      Coming soon
    </span>
  );
}

/** Destructive actions, visually fenced off from everything above them. */
export function DangerRow({
  title,
  description,
  actionLabel,
}: {
  title: string;
  description: string;
  actionLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-rose-500/20 bg-rose-500/5 p-4">
      <div className="min-w-0">
        <p className="text-xs font-medium text-rose-200">{title}</p>
        <p className="mt-0.5 text-[11px] leading-relaxed text-white/40">{description}</p>
      </div>

      <button
        type="button"
        className="shrink-0 rounded-lg border border-rose-500/30 px-3 py-1.5 text-[11px] font-medium text-rose-300 transition-colors hover:bg-rose-500/15 hover:text-rose-200"
      >
        {actionLabel}
      </button>
    </div>
  );
}
