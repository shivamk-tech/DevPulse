// components/dashboard/tips-card.tsx
import Link from "next/link";
import { ArrowRight, Lightbulb } from "lucide-react";

import { Panel } from "@/components/dashboard/ui/Panel";

interface TipsCardProps {
    title?: string;
    body?: string;
    linkLabel?: string;
    linkHref?: string;
}

export function TipsCard({
    title = "Did you know?",
    body = "Checking every minute surfaces an outage roughly five times faster than a five-minute interval.",
    linkLabel = "Read best practices",
    linkHref = "/dashboard/docs/best-practices",
}: TipsCardProps) {
    return (
        <Panel className="p-5">
            <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-md bg-amber-500/10">
                    <Lightbulb className="size-3.5 text-amber-300" />
                </span>
                <h2 className="text-sm font-medium text-white">{title}</h2>
            </div>

            <p className="mt-2.5 text-xs leading-relaxed text-white/45">{body}</p>

            <Link
                href={linkHref}
                className="group mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-indigo-300 transition-colors hover:text-indigo-200"
            >
                {linkLabel}
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
        </Panel>
    );
}
