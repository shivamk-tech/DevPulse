import Image from "next/image";
import Link from "next/link";

const COLUMNS: { heading: string; links: [string, string][] }[] = [
  {
    heading: "Product",
    links: [
      ["Monitors", "/dashboard/monitors"],
      ["Status pages", "#features"],
      ["Alerts", "#benefits"],
      ["Pricing", "#pricing"],
    ],
  },
  {
    heading: "Resources",
    links: [
      ["Docs", "/docs"],
      ["API reference", "/docs/api"],
      ["Changelog", "/changelog"],
      ["Support", "/support"],
    ],
  },
  {
    heading: "Company",
    links: [
      ["About", "/about"],
      ["Blog", "/blog"],
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/8 bg-black">
      <div className="relative z-10 mx-auto max-w-7xl px-5 pt-16 sm:px-8 sm:pt-20">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/brand/beacon-mark.png"
                alt=""
                width={256}
                height={256}
                className="size-6 w-auto mix-blend-screen"
              />
              <span className="font-mono text-[13px] font-medium uppercase tracking-[0.2em] text-white">
                Beacon
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/40">
              Uptime monitoring for people who would rather hear it from a
              machine than from a customer.
            </p>

            {/* Status line. Honest about being a link rather than a live
               indicator — a hardcoded green dot claiming "all systems
               operational" is the one thing a monitoring company cannot fake. */}
            <Link
              href="/status"
              className="group mt-6 inline-flex items-center gap-2 rounded-sm border border-white/10 px-3 py-1.5 transition-colors hover:border-white/25"
            >
              <span aria-hidden className="size-1.5 rounded-full bg-[#0ca30c]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/50 transition-colors group-hover:text-white/80">
                System status
              </span>
            </Link>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.heading}>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/30">
                {column.heading}
              </p>

              <ul className="mt-5 flex flex-col gap-3.5">
                {column.links.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-white/50 transition-colors duration-200 hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal row */}
        <div className="mt-16 flex flex-col gap-4 border-t border-white/8 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] text-white/30">
            © {new Date().getFullYear()} Beacon. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {[
              ["GitHub", "https://github.com"],
              ["X", "https://x.com"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                className="font-mono text-[11px] text-white/30 transition-colors hover:text-white/70"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Oversized wordmark, bleeding off the bottom edge.
         Two things make this work rather than look like a stray image: it is
         cropped by the footer's own overflow so it reads as type set larger
         than the page, and it is masked to fade upward so it dissolves into
         black instead of ending on a hard baseline. Low opacity keeps it as
         texture — at full strength it would out-shout the links above it. */}
      <div
        aria-hidden
        className="pointer-events-none relative mb-[-3%] select-none px-5 opacity-[0.13] sm:px-8"
        style={{
          // Fades in early (by 20%) rather than half way down, so most of the
          // letterform survives. Combined with a low opacity, a late fade left
          // almost nothing on screen.
          maskImage: "linear-gradient(to bottom, transparent, black 20%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 20%)",
        }}
      >
        <Image
          src="/brand/wordmark.png"
          alt=""
          width={1200}
          height={358}
          sizes="100vw"
          className="mx-auto w-full max-w-7xl"
        />
      </div>
    </footer>
  );
}
