/**
 * Shared frame for /dashboard/settings/*.
 *
 * Navigation between the sub-pages lives in the sidebar's Settings dropdown,
 * so this only supplies the page header and a reading-width column — settings
 * forms get unusable when they stretch across a wide screen.
 */
export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <header className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-white">Settings</h1>
        <p className="mt-1 text-sm text-white/45">
          Manage your workspace, profile, and how Beacon reaches you.
        </p>
      </header>

      <div className="space-y-6">{children}</div>
    </div>
  );
}
