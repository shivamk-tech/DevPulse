import { cn } from "@/lib/utils";

/**
 * The dashboard's one card surface. Every section and widget is built from
 * this, so the elevation ladder lives in exactly one place:
 *
 *   shell   #08080B  — the page behind everything
 *   chrome  #0B0B0F  — sidebar + top bar
 *   panel   #101015  — content cards (this file)
 *
 * Each step is a touch lighter than the one behind it, which is what makes the
 * layout read as layered rather than as one flat black rectangle.
 */
export function Panel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-white/7 bg-black",
        className
      )}
    >
      {children}
    </section>
  );
}

/**
 * Title row for a Panel. `action` sits opposite the title — use it for a
 * "View all" link, not a second primary button.
 */
export function PanelHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        <h2 className="text-sm font-medium text-white">{title}</h2>

        {description && (
          <p className="mt-1 text-xs leading-relaxed text-white/45">{description}</p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
