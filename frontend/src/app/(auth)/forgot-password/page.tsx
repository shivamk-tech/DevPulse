// Step one of password recovery: collect an email, ask the backend to send a
// reset link, then hand off to /reset-password (the route the emailed link
// points at).
//
// Renders ONLY the form — AuthLayout supplies the card, the image panel, and
// the "Forgot your password?" heading.
"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, MailCheck, ShieldAlert } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Button, Input } from "@/components/ui";
import { authService } from "@/services/auth/auth.service";
import { readApiError } from "@/lib/api-error";
import { fadeInUpSm, staggerContainer, transition } from "@/lib/motion";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/schemas/auth/auth.schema";

/** Seconds the resend button stays locked after a send. */
const RESEND_COOLDOWN = 30;

export default function ForgotPasswordPage() {
  const reduce = useReducedMotion();

  // The address we actually sent to, captured at submit time. Kept separate
  // from the live field value so the confirmation screen can't drift if the
  // user edits the input afterwards.
  const [sentTo, setSentTo] = React.useState<string | null>(null);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [emailSent, setEmailSent] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const handler = () => {
        if (localStorage.getItem("password-reset-completed")) {
            setEmailSent(false);
            localStorage.removeItem("password-reset-completed");
        }
    };

    window.addEventListener("storage", handler);

    return () => {
        window.removeEventListener("storage", handler);
    };
}, []);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onTouched",
    defaultValues: { email: "" },
  });

  const requestReset = async (email: string) => {
    setFormError(null);

    try {
      await authService.forgotPassword(email);

      setSentTo(email);
    } catch (error) {
      setFormError(readApiError(error, ["email"]));
    }
  };

  if (sentTo) {
    return (
      <SentState
        email={sentTo}
        reduce={reduce}
        onResend={() => requestReset(sentTo)}
        onUseDifferentEmail={() => {
          setSentTo(null);
          form.setFocus("email");
        }}
      />
    );
  }

  return (
    <motion.form
      className="space-y-5"
      onSubmit={form.handleSubmit((data) => requestReset(data.email))}
      variants={staggerContainer}
      initial={reduce ? false : "hidden"}
      animate="show"
      noValidate
    >
      <motion.div variants={fadeInUpSm} className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-white/70">
          Email
        </label>

        <Input
          id="email"
          type="email"
          autoFocus
          autoComplete="email"
          placeholder="you@company.com"
          leftSection={<Mail className="size-4" />}
          error={Boolean(form.formState.errors.email)}
          className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
          {...form.register("email")}
        />

        <p className="min-h-4 text-xs leading-4 text-red-400">
          {form.formState.errors.email?.message}
        </p>
      </motion.div>

      <AnimatePresence initial={false}>
        {formError && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -4 }}
            transition={transition}
            className="flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3.5 py-3"
          >
            <ShieldAlert className="mt-px size-4 shrink-0 text-red-400" />
            <p className="text-[13px] leading-relaxed text-red-300">{formError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={fadeInUpSm}>
        <Button
          type="submit"
          variant="gradient"
          size="lg"
          fullWidth
          loading={form.formState.isSubmitting}
          className="h-11"
        >
          {form.formState.isSubmitting ? "Sending link..." : "Send reset link"}
        </Button>
      </motion.div>

      <motion.p variants={fadeInUpSm} className="text-center text-sm text-white/50">
        Remembered it?{" "}
        <Link
          href="/login"
          className="font-medium text-[#818cf8] transition-colors hover:text-[#a5b4fc] hover:underline"
        >
          Back to login
        </Link>
      </motion.p>
    </motion.form>
  );
}

function SentState({
  email,
  reduce,
  onResend,
  onUseDifferentEmail,
}: {
  email: string;
  reduce: boolean | null;
  onResend: () => Promise<void>;
  onUseDifferentEmail: () => void;
}) {
  const [secondsLeft, setSecondsLeft] = React.useState(RESEND_COOLDOWN);
  const [resending, setResending] = React.useState(false);

  React.useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleResend = async () => {
    setResending(true);

    try {
      await onResend();

      setSecondsLeft(RESEND_COOLDOWN);
    } finally {
      setResending(false);
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
      // The heading above this is static, so announce the state change for
      // anyone who won't see the layout swap.
      role="status"
      aria-live="polite"
    >
      <motion.div
        className="relative flex size-16 items-center justify-center rounded-2xl bg-indigo-500/10 ring-1 ring-indigo-400/20"
        initial={reduce ? false : { scale: 0.85 }}
        animate={{ scale: 1 }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 20 }}
      >
        {!reduce && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-2xl ring-2 ring-indigo-400/30"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        )}

        <MailCheck className="size-7 text-indigo-300" strokeWidth={2} />
      </motion.div>

      <h2 className="mt-5 text-lg font-semibold text-white">Check your inbox</h2>

      {/* Phrased so it never confirms whether the address is registered. */}
      <p className="mt-2.5 max-w-sm text-[14.5px] leading-relaxed text-white/50">
        If an account exists for{" "}
        <span className="font-medium text-white">{email}</span>, a password reset
        link is on its way. It expires in 30 minutes.
      </p>

      <div className="mt-6 w-full space-y-3">
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          loading={resending}
          disabled={secondsLeft > 0}
          onClick={handleResend}
          className="h-11"
        >
          {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : "Resend email"}
        </Button>

        <button
          type="button"
          onClick={onUseDifferentEmail}
          className="w-full text-[13.5px] font-medium text-white/50 transition-colors hover:text-white"
        >
          Use a different email
        </button>
      </div>

      <p className="mt-6 text-[12.5px] leading-relaxed text-white/35">
        Nothing yet? Check your spam folder — the link comes from{" "}
        <span className="text-white/50">no-reply@beacon.dev</span>.
      </p>

      <div className="mt-6">
        <Link
          href="/login"
          className="text-[13.5px] font-medium text-white/50 transition-colors hover:text-white"
        >
          ← Back to login
        </Link>
      </div>
    </motion.div>
  );
}
