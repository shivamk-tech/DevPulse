"use client";

import {
  DangerRow,
  Field,
  SettingsSection,
} from "@/components/dashboard/settings/Settings-ui";

// The default page for /dashboard/settings — the "General" entry in the
// sidebar's Settings dropdown points here.
export default function SettingsGeneralPage() {
  return (
    <>
      <SettingsSection
        title="Workspace"
        description="How this workspace appears across Beacon and on public status pages."
      >
        <Field
          id="workspace-name"
          label="Workspace name"
          defaultValue="Personal Workspace"
          placeholder="Acme Inc."
        />

        <Field
          id="workspace-slug"
          label="Workspace URL"
          defaultValue="personal"
          hint="beacon.dev/personal — used for your public status page."
        />
      </SettingsSection>

      <SettingsSection
        title="Regional"
        description="Controls how timestamps are shown in incidents and reports."
      >
        <Field
          id="timezone"
          label="Timezone"
          defaultValue="Asia/Kolkata (GMT+5:30)"
        />
      </SettingsSection>

      <SettingsSection title="Danger zone" footer={null}>
        <DangerRow
          title="Delete workspace"
          description="Permanently removes all monitors, incidents, and history. This cannot be undone."
          actionLabel="Delete workspace"
        />
      </SettingsSection>
    </>
  );
}
