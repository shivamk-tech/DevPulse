/**
 * Shared frame for /dashboard/settings/*.
 *
 * Only a reading-width column — settings forms get unusable stretched across a
 * wide screen. Navigation lives in the sidebar's Settings dropdown, and each
 * page renders its own <PageHeader>, so a route's title says where you are
 * rather than repeating the section name.
 */

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">{children}</div>
  );
}
