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

export function SettingsSection({
  title,
  description,
  footer,
  children,
}: {
  title: string;
  description?: string;
  /** Defaults to a Save row; pass `null` for a section that has nothing to save. */
  footer?: React.ReactNode | null;
  children: React.ReactNode;
}) {
  return (
    <Panel className="overflow-hidden">
      <div className="p-5">
        <h2 className="text-sm font-medium text-white">{title}</h2>

        {description && (
          <p className="mt-1 text-xs leading-relaxed text-white/45">{description}</p>
        )}

        <div className="mt-5 space-y-4">{children}</div>
      </div>

      {footer === null ? null : (
        <div className="flex items-center justify-end gap-3 border-t border-white/7 bg-white/2 px-5 py-3">
          {footer ?? (
            <Button type="button" variant="gradient" size="sm" className="h-9">
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
      <label htmlFor={id} className="block text-[13px] font-medium text-white/70">
        {label}
      </label>

      <Input
        id={id}
        className="border-white/10 bg-white/5 text-white placeholder:text-white/25"
        {...props}
      />

      {hint && <p className="text-xs text-white/35">{hint}</p>}
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
        <p className="text-[13px] font-medium text-white/80">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs leading-relaxed text-white/40">{description}</p>
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
          checked ? "bg-indigo-500" : "bg-white/10"
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
        <p className="text-[13px] font-medium text-rose-200">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-white/40">{description}</p>
      </div>

      <button
        type="button"
        className="shrink-0 rounded-lg border border-rose-500/30 px-3 py-1.5 text-xs font-medium text-rose-300 transition-colors hover:bg-rose-500/15 hover:text-rose-200"
      >
        {actionLabel}
      </button>
    </div>
  );
}
