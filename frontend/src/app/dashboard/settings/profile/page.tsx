"use client";

import {
  Field,
  PageHeader,
  SettingsSection,
} from "@/components/dashboard/settings/Settings-ui";

export default function SettingsProfilePage() {
  return (
    <>
      <PageHeader
        title="Profile"
        description="How you appear to the rest of your workspace."
      />

      <SettingsSection
        title="Your details"
        description="This is what teammates see on incidents you acknowledge."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="first-name" label="First name" placeholder="Shivam" />
          <Field id="last-name" label="Last name" placeholder="Kumar" />
        </div>

        <Field
          id="email"
          label="Email address"
          type="email"
          placeholder="you@company.com"
          hint="Changing this requires verifying the new address."
        />
      </SettingsSection>

      <SettingsSection
        title="Avatar"
        description="A square image works best — at least 128×128."
      >
        <div className="flex items-center gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-linear-to-b from-[#6366f1] to-[#4f46e5] text-xl font-semibold text-white ring-2 ring-indigo-400/30">
            S
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              Upload image
            </button>
            <button
              type="button"
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-white/40 transition-colors hover:text-white/70"
            >
              Remove
            </button>
          </div>
        </div>
      </SettingsSection>
    </>
  );
}
