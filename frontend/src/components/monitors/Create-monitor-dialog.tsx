"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Clock, Link2, TriangleAlert } from "lucide-react";
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
} from "@/components/ui";
import {
  CREATE_MONITOR_DEFAULTS,
  createMonitorSchema,
  formatInterval,
  HTTP_METHODS,
  type CreateMonitorFormData,
} from "@/schemas/monitors/monitor.schema";
import { transition } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Monitor } from "@/types/monitor";

interface CreateMonitorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  monitor?:Monitor | null;
  onSubmit?: (values: CreateMonitorFormData) => Promise<void>;
}

/** How long the success panel stays up before the dialog closes itself. */
const SUCCESS_DWELL_MS = 1400;

export function CreateMonitorDialog({
  open,
  monitor,
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

  // Reset on close, not open, so fields don't visibly clear while the dialog is
  // still animating out.
  useEffect(() => {
    if (open) return;

    const timer = window.setTimeout(() => {
      form.reset(CREATE_MONITOR_DEFAULTS);
      setSucceeded(false);
    }, 200);

    return () => window.clearTimeout(timer);
  }, [open, form]);

  useEffect(() => {
    if (open && monitor) {
      form.reset({
        name:monitor.name,
        url:monitor.url,
        method:monitor.method,
        interval:monitor.interval,
        timeout:monitor.timeout,
      })
    }
  }, [open, monitor, form])

  const handleSubmit = async (values: CreateMonitorFormData) => {
    form.clearErrors("root");

    try {
      if (onSubmit) {
        await onSubmit(values);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 900));
      }

      setSucceeded(true);

      window.setTimeout(() => onOpenChange(false), SUCCESS_DWELL_MS);
    } catch (error) {
      console.error("Failed to create monitor:", error);

      form.setError("root", {
        type: "server",
        message: `Couldn't ${monitor ? "update" : "create"} monitor. Please try again.`,
      });
    }
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
              className="flex flex-col items-center px-6 py-10 text-center"
              role="status"
              aria-live="polite"
            >
              <motion.span
                className="relative flex size-14 items-center justify-center rounded-md bg-white/8 ring-1 ring-white/20"
                initial={reduce ? false : { scale: 0.85 }}
                animate={{ scale: 1 }}
                transition={
                  reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 18 }
                }
              >
                {!reduce && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-md ring-2 ring-white/25"
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 1.4, opacity: 0 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                  />
                )}
                <Check className="size-7 text-white" strokeWidth={2.5} />
              </motion.span>

              <p className="mt-5 text-sm font-semibold text-white">Monitor ready</p>
              <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-white/45">
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
                <DialogTitle className="text-base">{monitor ? "Edit monitor" : "Create a new monitor"}</DialogTitle>
                <DialogDescription className="text-xs">
                  {monitor ? "Update how Beacon checks this endpoint." : "Add a website or API endpoint to start monitoring"}
                </DialogDescription>
              </DialogHeader>

              <DialogBody className="space-y-4">
                <Field
                  id="monitor-name"
                  label="Monitor name"
                  description="A friendly name to identify this monitor."
                  error={form.formState.errors.name?.message}
                >
                  <input
                    id="monitor-name"
                    autoFocus
                    placeholder="e.g. Production API"
                    className={fieldClass(Boolean(form.formState.errors.name))}
                    {...form.register("name")}
                  />
                </Field>

                <Field
                  id="monitor-url"
                  label="URL"
                  description="The website or API endpoint you want to monitor."
                  error={form.formState.errors.url?.message}
                >
                  {/* Icon lives in its own bordered cell rather than floating
                     inside the field — it reads as a fixed affordance instead
                     of decoration sitting on the text. */}
                  <div
                    className={cn(
                      "flex items-stretch overflow-hidden rounded-sm border transition-colors",
                      form.formState.errors.url
                        ? "border-red-500/50"
                        : "border-white/12 focus-within:border-white/35"
                    )}
                  >
                    <span className="flex w-9 shrink-0 items-center justify-center border-r border-white/12 text-white/35">
                      <Link2 className="size-4" />
                    </span>
                    <input
                      id="monitor-url"
                      inputMode="url"
                      placeholder="https://example.com/api/health"
                      className="min-w-0 flex-1 bg-transparent px-3 py-2 text-xs text-white outline-none placeholder:text-white/25"
                      {...form.register("url")}
                    />
                  </div>
                </Field>

                <Controller
                  name="method"
                  control={form.control}
                  render={({ field }) => (
                    <Field
                      id="monitor-method"
                      label="HTTP method"
                      description="The method Beacon will use to check your endpoint."
                      error={form.formState.errors.method?.message}
                    >
                      {/* Segmented rather than a select: with two options both
                         stay visible and it is one click instead of two. */}
                      <div
                        role="radiogroup"
                        aria-label="HTTP method"
                        className="inline-flex rounded-sm border border-white/12 p-1"
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
                                "relative rounded-[3px] px-4 py-1 text-[11px] font-medium transition-colors",
                                selected ? "text-black" : "text-white/45 hover:text-white/80"
                              )}
                            >
                              {selected && (
                                <motion.span
                                  layoutId="monitorMethodPill"
                                  className="absolute inset-0 rounded-[3px] bg-white"
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

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Controller
                    name="interval"
                    control={form.control}
                    render={({ field }) => (
                      <Field
                        id="monitor-interval"
                        label="Check interval"
                        description="How often we should check this endpoint."
                        error={form.formState.errors.interval?.message}
                      >
                        <NumberField
                          id="monitor-interval"
                          field={field}
                          min={30}
                          invalid={Boolean(form.formState.errors.interval)}
                        />
                      </Field>
                    )}
                  />

                  <Controller
                    name="timeout"
                    control={form.control}
                    render={({ field }) => (
                      <Field
                        id="monitor-timeout"
                        label="Timeout"
                        description="How long to wait for a response."
                        error={form.formState.errors.timeout?.message}
                      >
                        <NumberField
                          id="monitor-timeout"
                          field={field}
                          min={1}
                          invalid={Boolean(form.formState.errors.timeout)}
                        />
                      </Field>
                    )}
                  />
                </div>

                {/* Restates the form in one sentence. Five controls are hard to
                   hold in your head at once; reading the result back catches a
                   bad combination before the server has to. */}
                <div className="flex items-start gap-3 rounded-sm border border-white/10 bg-white/2 px-3.5 py-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-white/12">
                    <Image
                      src="/brand/beacon-mark.png"
                      alt=""
                      width={256}
                      height={256}
                      className="size-4 w-auto mix-blend-screen"
                    />
                  </span>
                  <p className="text-[11px] leading-relaxed text-white/55">
                    Beacon will check this endpoint every{" "}
                    <span className="text-white">{formatInterval(interval)}</span> and
                    alert you if it goes down.
                  </p>
                </div>

                <AnimatePresence initial={false}>
                  {form.formState.errors.root && (
                    <motion.div
                      initial={reduce ? false : { opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, y: -4 }}
                      transition={transition}
                      role="alert"
                      className="flex items-start gap-2.5 rounded-sm border border-red-500/20 bg-red-500/10 px-3.5 py-3"
                    >
                      <TriangleAlert className="mt-px size-4 shrink-0 text-red-400" />
                      <p className="text-xs leading-relaxed text-red-300">
                        {form.formState.errors.root.message}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </DialogBody>

              <DialogFooter>
                <DialogClose
                  disabled={form.formState.isSubmitting}
                  className="inline-flex h-9 items-center justify-center rounded-sm border border-white/12 px-5 text-[13px] font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white disabled:pointer-events-none disabled:opacity-50"
                >
                  Cancel
                </DialogClose>

                <Button
                  type="submit"
                  variant="white"
                  loading={form.formState.isSubmitting}
                  className="h-9 rounded-sm px-5"
                >
                  {form.formState.isSubmitting ? (monitor ? "Saving..." : "Creating...") : (monitor ? "Save changes" : "Create monitor")}
                </Button>
              </DialogFooter>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */

/** Shared input surface, so every control in the dialog matches exactly. */
function fieldClass(invalid: boolean) {
  return cn(
    "w-full rounded-sm border bg-transparent px-3 py-2 text-xs text-white outline-none transition-colors placeholder:text-white/25",
    invalid ? "border-red-500/50" : "border-white/12 focus:border-white/35"
  );
}

/** Number input with a leading icon cell and a trailing unit. */
function NumberField({
  id,
  field,
  min,
  invalid,
}: {
  id: string;
  min: number;
  invalid: boolean;
  field: {
    value: number;
    onChange: (value: number) => void;
    onBlur: () => void;
  };
}) {
  return (
    <div
      className={cn(
        "flex items-stretch overflow-hidden rounded-sm border transition-colors",
        invalid ? "border-red-500/50" : "border-white/12 focus-within:border-white/35"
      )}
    >
      <span className="flex w-9 shrink-0 items-center justify-center border-r border-white/12 text-white/35">
        <Clock className="size-4" />
      </span>

      <input
        id={id}
        type="number"
        min={min}
        inputMode="numeric"
        // `appearance-none` kills the spinner arrows — they crowd the unit
        // label and nobody nudges an interval one second at a time.
        className="min-w-0 flex-1 appearance-none bg-transparent px-3 py-2 text-xs text-white outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        value={Number.isNaN(field.value) ? "" : field.value}
        onChange={(event) =>
          field.onChange(
            event.target.value === "" ? NaN : event.target.valueAsNumber
          )
        }
        onBlur={field.onBlur}
      />

      <span className="flex shrink-0 items-center pr-3.5 font-mono text-[11px] text-white/35">
        seconds
      </span>
    </div>
  );
}

/** Label, description, control, and a reserved error slot. */
function Field({
  id,
  label,
  description,
  error,
  children,
}: {
  id: string;
  label: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block font-mono text-xs font-medium tracking-tight text-white">
        {label}
      </label>

      {description && (
        <p className="mt-0.5 text-[11px] leading-relaxed text-white/40">{description}</p>
      )}

      <div className="mt-2">{children}</div>

      <p className="min-h-3 pt-1 text-[10px] leading-3 text-red-400">{error}</p>
    </div>
  );
}
