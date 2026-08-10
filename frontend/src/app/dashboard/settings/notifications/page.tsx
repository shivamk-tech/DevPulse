"use client";

import {
  Field,
  PageHeader,
  SettingsSection,
  ToggleRow,
} from "@/components/dashboard/settings/Settings-ui";

export default function SettingsNotificationsPage() {
  return (
    <>
      <PageHeader
        title="Notifications"
        description="Choose what Beacon tells you about, and where."
      />

      <SettingsSection
        title="Alerts"
        description="What Beacon tells you about, and how quickly."
      >
        <ToggleRow
          label="Downtime alerts"
          description="Notify me the moment a monitor stops responding."
          defaultChecked
        />
        <ToggleRow
          label="Recovery alerts"
          description="Notify me when a monitor comes back up."
          defaultChecked
        />
        <ToggleRow
          label="Slow response warnings"
          description="Notify me when response time exceeds the configured threshold."
        />
        <ToggleRow
          label="SSL certificate expiry"
          description="Warn me 14 days before a certificate expires."
          defaultChecked
        />
      </SettingsSection>

      <SettingsSection
        title="Channels"
        description="Where those alerts are delivered."
      >
        <ToggleRow
          label="Email"
          description="Sent to your account address."
          defaultChecked
        />

        <Field
          id="webhook"
          label="Webhook URL"
          placeholder="https://hooks.slack.com/services/…"
          hint="Beacon POSTs a JSON payload here on every alert."
        />
      </SettingsSection>

      <SettingsSection
        title="Digest"
        description="A periodic summary, separate from real-time alerts."
      >
        <ToggleRow
          label="Weekly uptime report"
          description="Delivered Monday mornings in your workspace timezone."
          defaultChecked
        />
      </SettingsSection>
    </>
  );
}
