"use client";

import { useState } from "react";
import { isAxiosError } from "axios";
import {
  History,
  KeyRound,
  MailCheck,
  MonitorSmartphone,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast"
import {
  ComingSoonPill,
  PageHeader,
  SettingsSection,
  StatusDot,
} from "@/components/dashboard/settings/Settings-ui";
import { PasswordInput } from "@/components/forms";
import { Button } from "@/components/ui";
import {
  changePasswordSchema,
  type changePasswordFormData,
} from "@/schemas/auth/auth.schema";
import { cn } from "@/lib/utils";
import { readApiError } from "@/lib/api-error";
import { authService } from "@/services/auth/auth.service";
import { useRouter } from "next/navigation";

/**
 * DRF's snake_case error keys → the react-hook-form field they belong on.
 * Anything not in here has no field to attach to and becomes a banner.
 */
const FIELD_MAP: Record<string, keyof changePasswordFormData> = {
  current_password: "currentPassword",
  password: "password",
  confirm_password: "confirmPassword",
};

// Placeholder account state. Swap these for the real values off /auth/me/ —
// `is_email_verified` is already on the User type.
const ACCOUNT = {
  email: "you@company.com",
  isEmailVerified: true,
};

/** 0–4 strength score. Advisory only — the backend validators decide. */
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

export default function SettingsSecurityPage() {
  return (
    <>
      <PageHeader title="Security" description="Manage your account security." />

      <ChangePasswordSection />

      <EmailVerificationSection />

      {/* Everything below is announced, not faked. Each panel says what the
         feature will do so the page reads as a roadmap rather than as broken
         controls — no dead toggles, no invented session rows. */}
      <SettingsSection
        icon={ShieldCheck}
        title="Two-Factor Authentication"
        badge={<ComingSoonPill />}
        description="Require a one-time code from an authenticator app in addition to your password."
        footer={null}
        muted
      />

      <SettingsSection
        icon={MonitorSmartphone}
        title="Active Sessions"
        badge={<ComingSoonPill />}
        description="See every device signed in to your account, and sign out the ones you don't recognise."
        footer={null}
        muted
      />

      <SettingsSection
        icon={History}
        title="Login Activity"
        badge={<ComingSoonPill />}
        description="A record of recent sign-ins with time, location, and device."
        footer={null}
        muted
      />
    </>
  );
}

function ChangePasswordSection() {
  const form = useForm<changePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onTouched",
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter()

  // Failures that aren't tied to one field (throttling, 5xx, network) land here
  // and render as a banner above the fields.
  const [formError, setFormError] = useState<string | null>(null);

  const password = form.watch("password");
  const score = scorePassword(password);
  const strength = STRENGTH[score];

  const onSubmit = async (data: changePasswordFormData) => {
    // Clear first, or a failure from the previous attempt stays on screen
    // while this one is in flight.
    setFormError(null);

    try {
      await authService.changePassword(data);

      toast.success("Password changed successfully");

      await authService.logout()

      router.replace("/login")
    } catch (error) {
      const body = isAxiosError(error)
        ? (error.response?.data as Record<string, string | string[]> | undefined)
        : undefined;

      // A field-specific rejection belongs on that field. "Current password is
      // incorrect" in a banner at the top reads as a general outage.
      let placedOnField = false;

      for (const [key, field] of Object.entries(FIELD_MAP)) {
        const message = body?.[key];

        if (!message) continue;

        form.setError(field, {
          message: Array.isArray(message) ? message[0] : message,
        });

        placedOnField = true;
      }

      if (placedOnField) return;

      const message = readApiError(error, Object.keys(FIELD_MAP));

      setFormError(message);
      toast.error(message);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <SettingsSection
        icon={KeyRound}
        title="Change Password"
        description="Use at least 8 characters. You'll be signed out and asked to log in again."
        footer={
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => form.reset()}
              className="h-9 text-white/50 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="white"
              size="sm"
              loading={form.formState.isSubmitting}
              className="h-9"
            >
              Update password
            </Button>
          </>
        }
      >
        {/* Announced politely so the failure reaches anyone not watching this
           part of the page — the submit button gives no other signal. */}
        {formError && (
          <div
            role="alert"
            aria-live="polite"
            className="flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3.5 py-3"
          >
            <ShieldAlert className="mt-px size-4 shrink-0 text-red-400" />
            <p className="text-[13px] leading-relaxed text-red-300">{formError}</p>
          </div>
        )}

        <PasswordField
          id="current-password"
          label="Current password"
          autoComplete="current-password"
          placeholder="Enter your current password"
          error={form.formState.errors.currentPassword?.message}
          registration={form.register("currentPassword")}
        />

        <div className="space-y-2">
          <PasswordField
            id="new-password"
            label="New password"
            autoComplete="new-password"
            placeholder="Enter a new password"
            error={form.formState.errors.password?.message}
            registration={form.register("password")}
          />

          {/* Only mounts once there's something to score, so the resting form
             stays clean. */}
          {password.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex flex-1 gap-1.5">
                {[0, 1, 2, 3].map((index) => (
                  <span
                    key={index}
                    className="h-1 flex-1 overflow-hidden rounded-full bg-white/10"
                  >
                    <span
                      className={cn(
                        "block h-full origin-left rounded-full transition-transform duration-300",
                        strength.bar,
                        index < score ? "scale-x-100" : "scale-x-0"
                      )}
                    />
                  </span>
                ))}
              </div>

              <span
                className={cn("w-16 text-right text-[11px] font-medium", strength.text)}
              >
                {strength.label}
              </span>
            </div>
          )}
        </div>

        <PasswordField
          id="confirm-password"
          label="Confirm new password"
          autoComplete="new-password"
          placeholder="Re-enter your new password"
          error={form.formState.errors.confirmPassword?.message}
          registration={form.register("confirmPassword")}
        />
      </SettingsSection>
    </form>
  );
}

function PasswordField({
  id,
  label,
  error,
  registration,
  ...props
}: {
  id: string;
  label: string;
  error?: string;
  registration: ReturnType<ReturnType<typeof useForm>["register"]>;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-[13px] font-medium text-white/70">
        {label}
      </label>

      <PasswordInput
        id={id}
        error={Boolean(error)}
        className="border-white/10 bg-white/5 text-white placeholder:text-white/25"
        {...props}
        {...registration}
      />

      <p className="min-h-4 text-xs leading-4 text-red-400">{error}</p>
    </div>
  );
}

function EmailVerificationSection() {
  const [resent, setResent] = useState(false);

  const { email, isEmailVerified } = ACCOUNT;

  return (
    <SettingsSection
      icon={MailCheck}
      title="Email Verification"
      badge={
        isEmailVerified ? (
          <StatusDot label="Verified" tone="good" />
        ) : (
          <StatusDot label="Unverified" tone="warning" />
        )
      }
      description={
        isEmailVerified
          ? "Your email address is confirmed. Password resets and alerts are delivered here."
          : "Confirm your address to receive password resets and downtime alerts."
      }
      footer={null}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/7 bg-white/2 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-[13px] text-white/80">{email}</p>
          <p className="mt-0.5 text-xs text-white/35">
            {isEmailVerified ? "Confirmed" : "Awaiting confirmation"}
          </p>
        </div>

        {!isEmailVerified && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={resent}
            onClick={() => setResent(true)}
            className="h-9 shrink-0"
          >
            {resent ? "Email sent" : "Resend verification"}
          </Button>
        )}
      </div>
    </SettingsSection>
  );
}
