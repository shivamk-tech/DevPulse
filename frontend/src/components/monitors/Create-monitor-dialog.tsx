"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Clock, Globe, Radio, Timer, TriangleAlert } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import {
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Switch,
} from "@/components/ui";
import {
  CREATE_MONITOR_DEFAULTS,
  createMonitorSchema,
  HTTP_METHODS,
  INTERVAL_PRESETS,
  type CreateMonitorFormData,
} from "@/schemas/monitors/monitor.schema";
import { transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface CreateMonitorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Submission hook for later. Leave it unset and the form runs a local
   * no-op that exercises the loading and success visuals without any network
   * call — there is deliberately no API wiring in this component.
   */
  onSubmit?: (values: CreateMonitorFormData) => Promise<void>;
}

/** How long the success panel stays up before the dialog closes itself. */
const SUCCESS_DWELL_MS = 1400;

export function CreateMonitorDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateMonitorDialogProps) {
  const reduce = useReducedMotion();
  const [succeeded, setSucceeded] = useState(false);

  const form = useForm<CreateMonitorFormData>({
    resolver: zodResolver(createMonitorSchema),
    mode: "onTouched",
    defaultValues: CREATE_MONITOR_DEFAULTS,
  });

  const interval = form.watch("interval");
  const isActive = form.watch("isActive");

  // Reset on close so reopening is a clean empty state rather than the last
  // attempt's values and errors. Runs on close, not open, so the fields don't
  // visibly clear while the dialog is still animating out.
  useEffect(() => {
    if (open) return;

    const timer = window.setTimeout(() => {
      form.reset(CREATE_MONITOR_DEFAULTS);
      setSucceeded(false);
    }, 200);

    return () => window.clearTimeout(timer);
  }, [open, form]);

  const handleSubmit = async (values: CreateMonitorFormData) => {
    if (onSubmit) {
      await onSubmit(values);
    } else {
      // NO API CALL. A short local delay so the submitting state is visible
      // and reviewable. Replace by passing `onSubmit` — nothing else changes.
      await new Promise((resolve) => setTimeout(resolve, 900));
    }

    setSucceeded(true);

    window.setTimeout(() => onOpenChange(false), SUCCESS_DWELL_MS);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={!succeeded}>
        <AnimatePresence mode="wait" initial={false}>
          {succeeded ? (
            <motion.div
              key="success"
              initial={reduce ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={transition}
              className="flex flex-col items-center px-6 py-14 text-center"
              role="status"
              aria-live="polite"
            >
              <motion.span
                className="relative flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-400/25"
                initial={reduce ? false : { scale: 0.85 }}
                animate={{ scale: 1 }}
                transition={
                  reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 18 }
                }
              >
                {!reduce && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-2xl ring-2 ring-emerald-400/30"
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 1.4, opacity: 0 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                  />
                )}
                <Check className="size-7 text-emerald-400" strokeWidth={2.5} />
              </motion.span>

              <p className="mt-5 text-base font-semibold text-white">Monitor ready</p>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/45">
                Everything checks out. Connect the API to start recording checks.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={form.handleSubmit(handleSubmit)}
              noValidate
              className="flex min-h-0 flex-1 flex-col"
              initial={false}
            >
              <DialogHeader>
                <div className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-b from-indigo-500/25 to-indigo-500/5 ring-1 ring-inset ring-indigo-400/30">
                    <Radio className="size-4 text-indigo-300" />
                  </span>

                  <div className="min-w-0">
                    <DialogTitle>Create monitor</DialogTitle>
                    <DialogDescription>
                      Beacon will check this endpoint on a schedule and alert you when
                      it stops responding.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <DialogBody className="space-y-5">
                {/* Name */}
                <Field
                  id="monitor-name"
                  label="Monitor name"
                  error={form.formState.errors.name?.message}
                >
                  <Input
                    id="monitor-name"
                    autoFocus
                    placeholder="Marketing site"
                    error={Boolean(form.formState.errors.name)}
                    className="border-white/10 bg-white/5 text-white placeholder:text-white/25"
                    {...form.register("name")}
                  />
                </Field>

                {/* URL */}
                <Field
                  id="monitor-url"
                  label="URL"
                  hint="The endpoint to request. HTTP and HTTPS only."
                  error={form.formState.errors.url?.message}
                >
                  <Input
                    id="monitor-url"
                    inputMode="url"
                    placeholder="https://example.com/health"
                    leftSection={<Globe className="size-4" />}
                    error={Boolean(form.formState.errors.url)}
                    className="border-white/10 bg-white/5 text-white placeholder:text-white/25"
                    {...form.register("url")}
                  />
                </Field>

                {/* Method — two options, so a segmented control beats a select:
                   both choices stay visible and it's one click, not two. */}
                <Controller
                  name="method"
                  control={form.control}
                  render={({ field }) => (
                    <Field
                      id="monitor-method"
                      label="HTTP method"
                      hint="HEAD skips the response body — lighter on the target server."
                      error={form.formState.errors.method?.message}
                    >
                      <div
                        role="radiogroup"
                        aria-label="HTTP method"
                        className="inline-flex rounded-lg border border-white/10 bg-white/3 p-1"
                      >
                        {HTTP_METHODS.map((method) => {
                          const selected = field.value === method;

                          return (
                            <button
                              key={method}
                              type="button"
                              role="radio"
                              aria-checked={selected}
                              onClick={() => field.onChange(method)}
                              className={cn(
                                "relative rounded-md px-4 py-1.5 text-[13px] font-medium transition-colors",
                                selected ? "text-white" : "text-white/45 hover:text-white/80"
                              )}
                            >
                              {selected && (
                                <motion.span
                                  layoutId="methodPill"
                                  className="absolute inset-0 rounded-md bg-linear-to-b from-[#6366f1] to-[#4f46e5] shadow-sm shadow-indigo-500/30"
                                  transition={
                                    reduce
                                      ? { duration: 0 }
                                      : { type: "spring", stiffness: 400, damping: 32 }
                                  }
                                />
                              )}
                              <span className="relative z-10">{method}</span>
                            </button>
                          );
                        })}
                      </div>
                    </Field>
                  )}
                />

                {/* Interval — presets cover the realistic choices; the custom
                   field stays available for anything else. */}
                <Controller
                  name="interval"
                  control={form.control}
                  render={({ field }) => (
                    <Field
                      id="monitor-interval"
                      label="Check interval"
                      hint="How often Beacon requests the URL."
                      error={form.formState.errors.interval?.message}
                    >
                      <div className="flex flex-wrap gap-2">
                        {INTERVAL_PRESETS.map((preset) => (
                          <button
                            key={preset.value}
                            type="button"
                            aria-pressed={field.value === preset.value}
                            onClick={() => field.onChange(preset.value)}
                            className={cn(
                              "rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-colors",
                              field.value === preset.value
                                ? "border-indigo-400/40 bg-indigo-500/15 text-indigo-200"
                                : "border-white/10 bg-white/3 text-white/50 hover:border-white/20 hover:text-white/80"
                            )}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <Input
                          id="monitor-interval"
                          type="number"
                          min={30}
                          inputMode="numeric"
                          leftSection={<Clock className="size-4" />}
                          error={Boolean(form.formState.errors.interval)}
                          className="border-white/10 bg-white/5 text-white"
                          value={Number.isNaN(field.value) ? "" : field.value}
                          onChange={(event) =>
                            field.onChange(
                              event.target.value === "" ? NaN : event.target.valueAsNumber
                            )
                          }
                          onBlur={field.onBlur}
                        />
                        <span className="shrink-0 text-xs text-white/35">seconds</span>
                      </div>
                    </Field>
                  )}
                />

                {/* Timeout */}
                <Controller
                  name="timeout"
                  control={form.control}
                  render={({ field }) => (
                    <Field
                      id="monitor-timeout"
                      label="Timeout"
                      hint="How long to wait before the check counts as failed."
                      error={form.formState.errors.timeout?.message}
                    >
                      <div className="flex items-center gap-2">
                        <Input
                          id="monitor-timeout"
                          type="number"
                          min={1}
                          inputMode="numeric"
                          leftSection={<Timer className="size-4" />}
                          error={Boolean(form.formState.errors.timeout)}
                          className="border-white/10 bg-white/5 text-white"
                          value={Number.isNaN(field.value) ? "" : field.value}
                          onChange={(event) =>
                            field.onChange(
                              event.target.value === "" ? NaN : event.target.valueAsNumber
                            )
                          }
                          onBlur={field.onBlur}
                        />
                        <span className="shrink-0 text-xs text-white/35">seconds</span>
                      </div>
                    </Field>
                  )}
                />

                {/* Active / Paused */}
                <Controller
                  name="isActive"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex items-start justify-between gap-6 rounded-lg border border-white/7 bg-white/2 p-4">
                      <div className="min-w-0">
                        <label
                          htmlFor="monitor-active"
                          className="text-[13px] font-medium text-white/80"
                        >
                          Start checking immediately
                        </label>
                        <p className="mt-0.5 text-xs leading-relaxed text-white/40">
                          {isActive
                            ? `Runs every ${formatInterval(interval)} as soon as it's created.`
                            : "Created in a paused state — you can start it whenever you're ready."}
                        </p>
                      </div>

                      <Switch
                        id="monitor-active"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-label="Start checking immediately"
                      />
                    </div>
                  )}
                />

                {/* Root-level failure slot. Nothing populates it today; it's the
                   landing spot for a server error once this is wired up. */}
                <AnimatePresence initial={false}>
                  {form.formState.errors.root && (
                    <motion.div
                      initial={reduce ? false : { opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, y: -4 }}
                      transition={transition}
                      role="alert"
                      className="flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3.5 py-3"
                    >
                      <TriangleAlert className="mt-px size-4 shrink-0 text-red-400" />
                      <p className="text-[13px] leading-relaxed text-red-300">
                        {form.formState.errors.root.message}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </DialogBody>

              <DialogFooter>
                <DialogClose
                  disabled={form.formState.isSubmitting}
                  className="inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-white disabled:pointer-events-none disabled:opacity-50"
                >
                  Cancel
                </DialogClose>

                <Button
                  type="submit"
                  variant="gradient"
                  size="sm"
                  loading={form.formState.isSubmitting}
                  className="h-9"
                >
                  {form.formState.isSubmitting ? "Creating..." : "Create monitor"}
                </Button>
              </DialogFooter>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

/** Label + control + reserved error slot, so the layout never shifts. */
function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-[13px] font-medium text-white/70">
        {label}
      </label>

      {children}

      {/* One slot for hint or error, same height either way — swapping between
         them can't nudge the fields below. */}
      <p
        className={cn(
          "min-h-4 text-xs leading-4",
          error ? "text-red-400" : "text-white/35"
        )}
      >
        {error ?? hint}
      </p>
    </div>
  );
}

function formatInterval(seconds: number) {
  if (!Number.isFinite(seconds)) return "the chosen interval";
  if (seconds < 60) return `${seconds} seconds`;

  const minutes = Math.round(seconds / 60);

  return minutes === 1 ? "minute" : `${minutes} minutes`;
}
