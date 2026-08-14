"use client";

import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
  className?: string;
}

/**
 * Controlled on/off switch.
 *
 * Controlled by design — the settings pages use an uncontrolled toggle that
 * owns its own state, which cannot participate in a form. This one takes its
 * value from the caller so react-hook-form can drive it.
 *
 * `role="switch"` + `aria-checked` rather than a styled checkbox: assistive
 * tech announces "on/off" instead of "checked", which matches what the control
 * actually means.
 */
export function Switch({
  checked,
  onCheckedChange,
  disabled = false,
  id,
  className,
  ...props
}: SwitchProps) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101015]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-indigo-500" : "bg-white/10",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform duration-200",
          checked ? "translate-x-4.5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}
