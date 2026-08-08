// components/dashboard/tips-card.tsx
import { Info } from "lucide-react";

interface TipsCardProps {
    title?: string;
    body?: string;
    linkLabel?: string;
    linkHref?: string;
}

export function TipsCard({
    title = "Did you know?",
    body = "Monitoring every minute helps detect outages much faster than longer intervals.",
    linkLabel = "Read Best Practices",
    linkHref = "/dashboard/docs/best-practices",
}: TipsCardProps) {
    return (
        <section className="rounded-lg border border-white/10 bg-[#0F0F14] p-3.5">
            <h2 className="flex items-center gap-1.5 text-[12px] font-normal text-white">
                <Info className="h-3.5 w-3.5 text-zinc-400" />
                {title}
            </h2>
            <p className="mt-1.5 text-[11px] font-light leading-relaxed text-zinc-400">
                {body}
            </p>
            <a
                href={linkHref}
                className="mt-2 inline-block text-[11px] font-light text-indigo-400 transition-colors hover:text-indigo-300"
            >
                {linkLabel} →
            </a>
        </section>
    );
}