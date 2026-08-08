// components/dashboard/workspace-summary.tsx
interface WorkspaceSummaryProps {
  workspaceName?: string;
  plan?: string;
  members?: number;
  timezone?: string;
}

export function WorkspaceSummary({
  workspaceName = "Personal Workspace",
  plan = "Free",
  members = 1,
  timezone = "Asia/Kolkata (GMT+5:30)",
}: WorkspaceSummaryProps) {
  const rows = [
    { label: "Workspace", value: workspaceName },
    { label: "Plan", value: plan, isPill: true },
    { label: "Members", value: members },
    { label: "Timezone", value: timezone },
  ];

  return (
    <section className="rounded-lg border border-white/10 bg-[#0F0F14] p-3.5">
      <h2 className="mb-2 text-[12px] font-normal text-white">
        Workspace Summary
      </h2>

      <dl className="flex flex-col">
        {rows.map((row, index) => (
          <div
            key={row.label}
            className={
              index > 0
                ? "flex items-center justify-between border-t border-white/[0.06] py-1.5"
                : "flex items-center justify-between py-1.5"
            }
          >
            <dt className="text-[11px] font-light text-zinc-400">
              {row.label}
            </dt>
            <dd>
              {row.isPill ? (
                <span className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[9.5px] font-light text-zinc-200">
                  {row.value}
                </span>
              ) : (
                <span className="text-[11px] font-light text-white">
                  {row.value}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}