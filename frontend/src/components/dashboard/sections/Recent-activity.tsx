// components/dashboard/recent-activity.tsx
import { Clock } from "lucide-react";

interface ActivityItem {
  id: string;
  title: string;
  timestamp: string;
}

interface RecentActivityProps {
  items?: ActivityItem[];
}

export function RecentActivity({ items = [] }: RecentActivityProps) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#0F0F14] p-3.5">
      <h2 className="text-[13px] font-normal text-white">Recent Activity</h2>

      {items.length === 0 ? (
        <div className="flex flex-col items-center py-2 text-center">
          <div className="mb-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/5">
            <Clock className="h-3.5 w-3.5 text-zinc-400" />
          </div>
          <p className="text-[11.5px] font-light text-zinc-200">
            No activity yet.
          </p>
          <p className="mt-0.5 text-[10.5px] font-light text-zinc-500">
            Activity will appear once monitoring begins.
          </p>
        </div>
      ) : (
        <ul className="mt-2 flex flex-col gap-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0"
            >
              <span className="text-[11.5px] font-light text-zinc-200">
                {item.title}
              </span>
              <span className="text-[10.5px] font-light text-zinc-500">
                {item.timestamp}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}