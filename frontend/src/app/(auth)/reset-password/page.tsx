// Landing page for the link emailed by POST /api/auth/forget-password/.
// The link carries `uid` and `token` as query params; both are posted back
// untouched alongside the new password.
//
// Like forgot-password/page.tsx this renders ONLY the form — AuthLayout
// supplies the card, the image panel, and the heading, so everything here is
// styled to sit inside that dark glass card.
//
// Three terminal states, all handled in-file:
//   invalid — link is missing uid/token, or the server rejected them
//   success — password changed, auto-bounce to /login
//   form    — the default
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { isAxiosError } from "axios";
import { Check, KeyRound, ShieldAlert, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui";
import { Label } from "@/components/ui";
import { PasswordInput } from "@/components/forms";
import { authService } from "@/services/auth/auth.service";
import { readApiError } from "@/lib/api-error";
import { fadeInUpSm, staggerContainer, transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters."),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/** Live checklist under the password field. Mirrors the backend validators. */
const RULES = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "Upper & lowercase letters", test: (v: string) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
  { label: "At least one number", test: (v: string) => /\d/.test(v) },
] as const;

/** 0–4, drives the segmented strength meter. Advisory only — the server decides. */
function scorePassword(value: string) {
  if (!value) return 0;

  let score = 0;

  if (value.length >= 8) score += 1;
  if (value.length >= 12) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;

  return Math.min(score, 4);
}

const STRENGTH = [
  { label: "Too weak", bar: "bg-red-500", text: "text-red-400" },
  { label: "Weak", bar: "bg-orange-500", text: "text-orange-400" },
  { label: "Fair", bar: "bg-amber-400", text: "text-amber-300" },
  { label: "Good", bar: "bg-lime-400", text: "text-lime-300" },
  { label: "Strong", bar: "bg-emerald-400", text: "text-emerald-300" },
] as const;

/** Field keys this endpoint can attach errors to, in the order we surface them. */
const ERROR_KEYS = ["token", "uid", "password", "confirm_password"];

export default function ResetPasswordPage() {
  // useSearchParams() opts the tree into client rendering, so it needs a
  // Suspense boundary above it or the whole route fails to prerender.
  return (
    <React.Suspense fallback={<div className="h-72" />}>
      <ResetPasswordForm />
    </React.Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const searchParams = useSearchParams();

  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const [status, setStatus] = React.useState<"form" | "success" | "invalid">(
    uid && token ? "form" : "invalid"
  );
  const [formError, setFormError] = React.useState<string | null>(null);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onTouched",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");

  const score = scorePassword(password);
  const strength = STRENGTH[score];
  const matches = confirmPassword.length > 0 && password === confirmPassword;

  const onSubmit = async (data: ResetPasswordFormData) => {
    setFormError(null);

    try {
      await authService.resetPassword({
        uid: uid as string,
        token: token as string,
        password: data.password,
        confirm_password: data.confirmPassword,
      });

      setStatus("success");
      localStorage.setItem("password-reset", "true");
    } catch (error) {
      // A 400 here almost always means the token is spent or expired — that's
      // not something retyping the password fixes, so send them back to the
      // start of the flow instead of leaving the form up.
      if (isAxiosError(error) && error.response?.status === 400) {
        const message = readApiError(error, ERROR_KEYS);

        const isFieldError =
          typeof (error.response?.data as Record<string, unknown>)?.password !== "undefined" ||
          typeof (error.response?.data as Record<string, unknown>)?.confirm_password !== "undefined";

        if (isFieldError) {
          setFormError(message);
          return;
        }

        setStatus("invalid");
        setFormError(message);
        return;
      }

      setFormError(readApiError(error, ERROR_KEYS));
    }
  };

  if (status === "invalid") {
    return <InvalidLinkState message={formError} reduce={reduce} />;
  }

  if (status === "success") {
    return <SuccessState router={router} reduce={reduce} />;
  }

  return (
    <motion.form
      className="space-y-5"
      onSubmit={form.handleSubmit(onSubmit)}
      variants={staggerContainer}
      initial={reduce ? false : "hidden"}
      animate="show"
      noValidate
    >
      {/* New password */}
      <motion.div variants={fadeInUpSm} className="space-y-2">
        <Label htmlFor="password" className="text-white/70">
          New password
        </Label>

        <PasswordInput
          id="password"
          autoFocus
          autoComplete="new-password"
          placeholder="Enter a new password"
          error={Boolean(form.formState.errors.password)}
          className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
          {...form.register("password")}
        />

        {/* Segmented strength meter — four bars that fill and tint as the
           score climbs. Only mounts once there's something to score, so the
           empty state stays clean. */}
        <AnimatePresence initial={false}>
          {password.length > 0 && (
            <motion.div
              initial={reduce ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={reduce ? undefined : { opacity: 0, height: 0 }}
              transition={transition}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 pt-1">
                <div className="flex flex-1 gap-1.5">
                  {[0, 1, 2, 3].map((index) => (
                    <span
                      key={index}
                      className="h-1 flex-1 overflow-hidden rounded-full bg-white/10"
                    >
                      <motion.span
                        className={cn("block h-full origin-left rounded-full", strength.bar)}
                        initial={false}
                        animate={{ scaleX: index < score ? 1 : 0 }}
                        transition={reduce ? { duration: 0 } : transition}
                      />
                    </span>
                  ))}
                </div>

                <span className={cn("w-16 text-right text-[11px] font-medium", strength.text)}>
                  {strength.label}
                </span>
              </div>

              <ul className="mt-3 space-y-1.5">
                {RULES.map((rule) => {
                  const passed = rule.test(password);

                  return (
                    <li key={rule.label} className="flex items-center gap-2 text-[12.5px]">
                      <span
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
                          passed ? "bg-emerald-500/15 text-emerald-400" : "bg-white/5 text-white/30"
                        )}
                      >
                        {passed ? (
                          <Check className="size-3" strokeWidth={3} />
                        ) : (
                          <span className="size-1 rounded-full bg-current" />
                        )}
                      </span>

                      <span className={passed ? "text-white/70" : "text-white/40"}>
                        {rule.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="min-h-4 text-xs leading-4 text-red-400">
          {form.formState.errors.password?.message}
        </p>
      </motion.div>

      {/* Confirm password */}
      <motion.div variants={fadeInUpSm} className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-white/70">
          Confirm new password
        </Label>

        <PasswordInput
          id="confirmPassword"
          autoComplete="new-password"
          placeholder="Re-enter your new password"
          error={Boolean(form.formState.errors.confirmPassword)}
          className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
          {...form.register("confirmPassword")}
        />

        <div className="min-h-4 text-xs leading-4">
          {form.formState.errors.confirmPassword ? (
            <span className="text-red-400">
              {form.formState.errors.confirmPassword.message}
            </span>
          ) : matches ? (
            <motion.span
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center gap-1.5 text-emerald-400"
            >
              <Check className="size-3.5" strokeWidth={3} />
              Passwords match
            </motion.span>
          ) : null}
        </div>
      </motion.div>

      {/* Server-side failures that the form can recover from */}
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

      {/* Submit */}
      <motion.div variants={fadeInUpSm}>
        <Button
          type="submit"
          variant="gradient"
          size="lg"
          fullWidth
          loading={form.formState.isSubmitting}
          leftSection={<KeyRound className="size-4" />}
          className="h-11"
        >
          {form.formState.isSubmitting ? "Updating password..." : "Reset Password"}
        </Button>
      </motion.div>

      <motion.div variants={fadeInUpSm} className="text-center">
        <Link
          href="/login"
          className="text-[13.5px] font-medium text-white/50 transition-colors hover:text-white"
        >
          ← Back to Login
        </Link>
      </motion.div>
    </motion.form>
  );
}

/** Shown when the link is malformed, already used, or past its expiry. */
function InvalidLinkState({
  message,
  reduce,
}: {
  message: string | null;
  reduce: boolean | null;
}) {
  return (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-red-500/10 ring-1 ring-red-500/20">
        <X className="size-7 text-red-400" strokeWidth={2.5} />
      </div>

      <h2 className="mt-5 text-lg font-semibold text-white">This link is no longer valid</h2>

      <p className="mt-2.5 max-w-sm text-[14.5px] leading-relaxed text-white/50">
        {message ??
          "Password reset links expire after a short while and can only be used once. Request a fresh one and we'll email it straight over."}
      </p>

      <Link href="/forgot-password" className="mt-6 w-full">
        <Button variant="gradient" size="lg" fullWidth className="h-11">
          Request a new link
        </Button>
      </Link>

      <div className="mt-6">
        <Link
          href="/login"
          className="text-[13.5px] font-medium text-white/50 transition-colors hover:text-white"
        >
          ← Back to Login
        </Link>
      </div>
    </motion.div>
  );
}

/**
 * Password changed. The old refresh token is still live server-side, so this
 * deliberately doesn't try to sign anyone in — it hands off to /login, with a
 * visible countdown so the redirect never feels like a glitch.
 */
function SuccessState({
  router,
  reduce,
}: {
  router: ReturnType<typeof useRouter>;
  reduce: boolean | null;
}) {
  const [secondsLeft, setSecondsLeft] = React.useState(5);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    if (secondsLeft > 0) return;

    router.push("/login?reset=true");
  }, [secondsLeft, router]);

  return (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
    >
      <motion.div
        className="relative flex size-16 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/20"
        initial={reduce ? false : { scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 18 }}
      >
        {/* One-shot halo that expands and fades on mount */}
        {!reduce && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-2xl ring-2 ring-emerald-400/40"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.45, opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        )}

        <Check className="size-8 text-emerald-400" strokeWidth={2.5} />
      </motion.div>

      <h2 className="mt-5 text-lg font-semibold text-white">Password updated</h2>

      <p className="mt-2.5 max-w-sm text-[14.5px] leading-relaxed text-white/50">
        Your password has been changed. You can now log in to Beacon with your new credentials.
      </p>

      <Link href="/login?reset=true" className="mt-6 w-full">
        <Button variant="gradient" size="lg" fullWidth className="h-11">
          Continue to Login
        </Button>
      </Link>

      <p className="mt-4 text-[12.5px] text-white/35">
        Redirecting in {Math.max(secondsLeft, 0)}s…
      </p>
    </motion.div>
  );
}
