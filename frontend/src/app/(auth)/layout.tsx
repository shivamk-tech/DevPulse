"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { GuestGuard } from "@/components/auth/GuestGuard";
import { swap } from "@/lib/motion";

/**
 * Brand panel backdrop. Point this at an image in /public/auth to replace the
 * CSS halftone below — the overlay and centred content stay as they are.
 */
const PANEL_IMAGE: string | null = "/auth/loginPage.png";

/**
 * Shared shell for /signup, /login, /forgot-password, /reset-password.
 *
 * A full-bleed split rather than a floating card: the form gets the whole right
 * half, so fields can breathe instead of being squeezed into a fixed box, and
 * the brand panel is free to bleed to the edges. The shell stays mounted across
 * these sibling routes — only the form swaps.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const isSignup = pathname?.includes("signup") ?? false;
  const isForgotPassword = pathname?.includes("forgot-password") ?? false;
  const isResetPassword = pathname?.includes("reset-password") ?? false;

  const copy = isResetPassword
    ? {
        title: "Set a new password",
        subtitle: "Choose a strong password you haven't used before.",
      }
    : isForgotPassword
      ? {
          title: "Reset your password",
          subtitle: "We'll email you a link to set a new one.",
        }
      : isSignup
        ? { title: "Create your Beacon account", subtitle: "Sign up with:" }
        : { title: "Log in to Beacon", subtitle: "Connect to Beacon with:" };

  return (
    <GuestGuard>
      <div className="flex min-h-svh bg-black">
        {/* ---- Brand panel ---- */}
        {/* Content is bottom-anchored, not centred: the photograph's beam and
           lamp fill the middle of the frame, and type over the brightest part
           of an image is the one place it can't be made to read. The lower
           third is rock and fog — dark, quiet, and exactly where copy belongs. */}
        <aside className="relative hidden w-1/2 overflow-hidden border-r border-white/8 lg:flex lg:items-end lg:justify-center">
          {PANEL_IMAGE ? (
            <Image
              src={PANEL_IMAGE}
              alt=""
              fill
              priority
              sizes="50vw"
              quality={90}
              // Pulled toward neutral to sit with the monochrome theme — the
              // beam is strongly golden at source and would be the only warm
              // thing left in the product.
              className="object-cover saturate-[0.55]"
            />
          ) : (
            /* Halftone: a dot grid whose density is faked by masking a single
               uniform pattern with a diagonal gradient. Cheaper and sharper at
               any DPI than shipping an image of dots. */
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at center, rgba(255,255,255,0.16) 1px, transparent 1.2px)",
                backgroundSize: "10px 10px",
                maskImage:
                  "radial-gradient(130% 110% at 15% 40%, black 0%, transparent 68%)",
                WebkitMaskImage:
                  "radial-gradient(130% 110% at 15% 40%, black 0%, transparent 68%)",
              }}
            />
          )}

          {/* Heavier at the foot than the hero's, since the copy sits right on
             it rather than over empty water. */}
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/45 to-black/25" />

          <div className="relative flex flex-col items-center px-12 pb-16 text-center">
            <Image
              src="/brand/beacon-mark.png"
              alt=""
              width={256}
              height={256}
              priority
              className="size-12 w-auto mix-blend-screen"
            />

            <p className="mt-6 max-w-sm text-[26px] font-normal leading-tight tracking-[-0.03em] text-white">
              Know it&apos;s down
              <br />
              before your users do.
            </p>
          </div>
        </aside>

        {/* ---- Form column ---- */}
        <div className="relative flex w-full flex-col lg:w-1/2">
          <div className="px-6 pt-6 sm:px-10 sm:pt-8">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
            >
              <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Home
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
            <div className="w-full max-w-sm">
              <h1 className="text-center text-[26px] font-medium tracking-[-0.02em] text-white">
                {copy.title}
              </h1>
              <p className="mt-2.5 text-center text-sm text-white/45">
                {copy.subtitle}
              </p>

              <div className="mt-8">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={pathname}
                    variants={swap}
                    initial={reduce ? false : "hidden"}
                    animate="show"
                    exit={reduce ? undefined : "exit"}
                  >
                    {children}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GuestGuard>
  );
}
