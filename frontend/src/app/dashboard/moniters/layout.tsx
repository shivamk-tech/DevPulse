/**
 * Frame for /dashboard/moniters/*.
 *
 * Deliberately thin — the shell (sidebar, top bar, AuthGuard) already comes
 * from dashboard/layout.tsx, so this only sets the content column. It exists
 * because the file was already scaffolded, and an empty layout.tsx has no
 * default export and fails the build.
 */
export default function MonitorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="mx-auto max-w-350 p-6">{children}</div>;
}
