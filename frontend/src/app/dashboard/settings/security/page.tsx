"use client";

import { Monitor, Smartphone } from "lucide-react";

import {
  DangerRow,
  SettingsSection,
  ToggleRow,
} from "@/components/dashboard/settings/Settings-ui";
import { PasswordInput } from "@/components/forms";

const SESSIONS = [
  {
    id: "current",
    device: "Chrome on macOS",
    location: "Mumbai, IN",
    lastActive: "Active now",
    icon: Monitor,
    isCurrent: true,
  },
  {
    id: "phone",
    device: "Safari on iPhone",
    location: "Mumbai, IN",
    lastActive: "2 days ago",
    icon: Smartphone,
    isCurrent: false,
  },
];

export default function SettingsSecurityPage() {
  return (
    <>
      <SettingsSection
        title="Password"
        description="Use at least 8 characters, mixing letters and numbers."
      >
        <div className="space-y-2">
          <label
            htmlFor="current-password"
            className="block text-[13px] font-medium text-white/70"
          >
            Current password
          </label>
          <PasswordInput
            id="current-password"
            autoComplete="current-password"
            placeholder="Enter your current password"
            className="border-white/10 bg-white/5 text-white placeholder:text-white/25"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="new-password"
            className="block text-[13px] font-medium text-white/70"
          >
            New password
          </label>
          <PasswordInput
            id="new-password"
            autoComplete="new-password"
            placeholder="Enter a new password"
            className="border-white/10 bg-white/5 text-white placeholder:text-white/25"
          />
        </div>
      </SettingsSection>

      <SettingsSection
        title="Two-factor authentication"
        description="An extra code at login, in case your password leaks."
        footer={null}
      >
        <ToggleRow
          label="Authenticator app"
          description="Use a TOTP app such as 1Password or Authy."
        />
      </SettingsSection>

      <SettingsSection title="Active sessions" footer={null}>
        <ul className="space-y-3">
          {SESSIONS.map((session) => {
            const Icon = session.icon;

            return (
              <li
                key={session.id}
                className="flex items-center gap-3 rounded-lg border border-white/7 bg-white/2 p-3"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
                  <Icon className="size-4 text-white/50" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-white/80">
                    {session.device}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-white/35">
                    {session.location} · {session.lastActive}
                  </p>
                </div>

                {session.isCurrent ? (
                  // Status never rides on color alone — the dot always carries
                  // this label with it.
                  <span className="flex shrink-0 items-center gap-1.5 text-xs text-white/40">
                    <span aria-hidden className="size-1.5 rounded-full bg-[#0ca30c]" />
                    This device
                  </span>
                ) : (
                  <button
                    type="button"
                    className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium text-white/40 transition-colors hover:text-rose-300"
                  >
                    Revoke
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </SettingsSection>

      <SettingsSection title="Danger zone" footer={null}>
        <DangerRow
          title="Delete account"
          description="Removes your account and every workspace you own. This cannot be undone."
          actionLabel="Delete account"
        />
      </SettingsSection>
    </>
  );
}
