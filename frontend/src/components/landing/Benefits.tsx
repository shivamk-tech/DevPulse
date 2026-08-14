"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  BellRing,
  Globe2,
  History,
  PlugZap,
  ShieldCheck,
  Timer,
} from "lucide-react";

import { EASE } from "@/lib/motion";

/**
 * Benefits grid — six short claims, no imagery.
 *
 * Deliberately the flattest section on the page. It follows three
 * photograph-heavy blocks, and a fourth would turn the whole thing into
 * wallpaper. Plain cards give the eye somewhere to rest and let the copy carry
 * it, which is also why every card is exactly two lines long.
 */
export function Benefits() {
  const reduce = useReducedMotion();

  return (
    <section id="benefits" className="relative bg-black py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.14em] text-white/45"
        >
          <span className="size-1.5 rounded-full bg-white/50" />
          Benefits
        </motion.p>

        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
          className="mt-6 max-w-4xl text-balance text-[clamp(1.875rem,6vw,4rem)] font-normal leading-[1.06] tracking-[-0.03em] text-white sm:leading-[1.02] sm:tracking-[-0.035em]"
        >
          Everything you need to sleep{" "}
          <span className="text-white/35">through the night.</span>
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <motion.div
                key={benefit.title}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.6,
                  ease: EASE,
                  // Stagger runs along the row, not the column, so the reveal
                  // follows reading order.
                  delay: reduce ? 0 : index * 0.07,
                }}
                className="group rounded-sm border border-white/8 bg-white/2 p-7 transition-colors duration-500 hover:border-white/20 hover:bg-white/4 sm:p-8"
              >
                {/* Outlined circle, not a filled tile — keeps the card quiet
                   and stops six icons turning the grid into a colour chart. */}
                <span className="flex size-12 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors duration-500 group-hover:border-white/30 group-hover:text-white">
                  <Icon className="size-5" strokeWidth={1.5} />
                </span>

                <h3 className="mt-7 font-mono text-[15px] tracking-tight text-white">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-white/45 transition-colors duration-500 group-hover:text-white/60">
                  {benefit.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const BENEFITS = [
  {
    title: "Sixty-Second Checks",
    body: "Every monitor is polled once a minute, so downtime is measured in seconds rather than guessed at.",
    icon: Timer,
  },
  {
    title: "Checked Everywhere",
    body: "Requests leave from separate regions, so one bad network path never fires a false alarm.",
    icon: Globe2,
  },
  {
    title: "Alerts That Land",
    body: "Email, Slack, or your own webhook — with the status code and region already attached.",
    icon: BellRing,
  },
  {
    title: "Public Proof",
    body: "Publish a status page and let customers check for themselves instead of filling your inbox.",
    icon: ShieldCheck,
  },
  {
    title: "Full History",
    body: "Every check is kept, so you can show exactly what broke, when, and for how long.",
    icon: History,
  },
  {
    title: "Nothing To Install",
    body: "No agent, no DNS change, no deploy. Paste a URL and the first check runs immediately.",
    icon: PlugZap,
  },
];
