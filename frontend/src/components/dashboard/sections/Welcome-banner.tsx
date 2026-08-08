// components/dashboard/welcome-banner.tsx
import { ExternalLink, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface WelcomeBannerProps {
  userName?: string;
  onCreateMonitor?: () => void;
}

export function WelcomeBanner({
  userName = "Shivam",
  onCreateMonitor,
}: WelcomeBannerProps) {
  return (
    <section className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.18),transparent_60%)] bg-[#0F0F14] px-4 py-3.5">
      <div>
        <h1 className="flex items-center gap-1.5 text-[17px] font-light tracking-tight text-white">
          Welcome back, <span className="font-normal">{userName}</span>
          <span aria-hidden className="text-[17px]">
            👋
          </span>
        </h1>
        <p className="mt-0.5 text-xs font-light text-zinc-400">
          Start monitoring your infrastructure in minutes.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="gradient"
          size="sm"
          className="h-[30px] text-xs font-light"
          leftSection={<Plus className="h-3.5 w-3.5" />}
          onClick={onCreateMonitor}
        >
          Create Monitor
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-[30px] text-xs font-light"
          rightSection={<ExternalLink className="h-3.5 w-3.5" />}
        >
          View Documentation
        </Button>
      </div>
    </section>
  );
}