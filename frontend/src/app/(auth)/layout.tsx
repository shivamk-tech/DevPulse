"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Card, CardContent } from "@/components/ui";
import { AuthShowcase } from "@/components/auth/AuthShowcase";
import { EASE, swap } from "@/lib/motion";

/**
 * Shared shell for /signup, /login, and /forgot-password. It stays mounted
 * while you navigate between these sibling routes, so the image panel,
 * brand, and toggle never re-mount — only the form (children) swaps. Mode is
 * derived from the URL, so there's no useState: the pathname IS the state.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSignup = pathname?.includes("signup") ?? false;
  const isForgotPassword = pathname?.includes("forgot-password") ?? false;
  const reduce = useReducedMotion();

  return (
    <div className="relative flex min-h-screen w-full items-start justify-center p-4 sm:items-center sm:p-6">
      {/* Ambient page background — soft indigo glow behind the card */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[32rem] w-[32rem] rounded-full bg-[#4f46e5]/20 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-[32rem] w-[32rem] rounded-full bg-[#7c3aed]/20 blur-[120px]" />
      </div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="relative w-full max-w-5xl"
      >
        <Card className="relative mx-auto w-full overflow-hidden rounded-3xl border-white/10 bg-[#0B0F14]/95 p-0 shadow-2xl backdrop-blur-xl ring-1 ring-white/5">
          {/* Mobile-only brand header (image panel is hidden below lg) */}
          <div className="flex items-center gap-2 border-b border-white/10 px-6 py-4 text-white lg:hidden">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#6366f1] to-[#4f46e5] shadow-lg shadow-indigo-500/30">
              <Activity className="size-4" strokeWidth={2.5} />
            </span>
            <span className="text-sm font-semibold tracking-wide">Beacon</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left panel — animated brand showcase (carousel). Self-contained;
               swap in photographic slides via /public + the `image` field. */}
            <AuthShowcase />

            {/* Right panel — toggle (hidden on forgot-password) + heading (shared) + form (children) */}
            <CardContent className="flex flex-col justify-center px-5 py-6 sm:px-10 sm:py-10 lg:px-14">
              {/* Mode toggle — real navigation between the two routes.
                 `replace` so hammering the toggle doesn't stack up history.
                 The active pill is a shared layout element, so it slides
                 between the two tabs instead of hard-cutting.
                 Not relevant on forgot-password, so it's hidden there rather
                 than rendered mid-transition with neither tab active. */}
              {!isForgotPassword && (
                <div className="mx-auto mb-6 flex rounded-full border border-white/10 bg-white/5 p-1 sm:mb-8">
                  <Link
                    href="/signup"
                    replace
                    className="relative rounded-full px-4 py-1.5 text-center text-sm font-medium sm:px-5"
                  >
                    {isSignup && (
                      <motion.span
                        layoutId="authTogglePill"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-[#6366f1] to-[#4f46e5] shadow-md shadow-indigo-500/30"
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span
                      className={`relative z-10 transition-colors ${
                        isSignup ? "text-white" : "text-white/60 hover:text-white"
                      }`}
                    >
                      Sign Up
                    </span>
                  </Link>
                  <Link
                    href="/login"
                    replace
                    className="relative rounded-full px-4 py-1.5 text-center text-sm font-medium sm:px-5"
                  >
                    {!isSignup && (
                      <motion.span
                        layoutId="authTogglePill"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-[#6366f1] to-[#4f46e5] shadow-md shadow-indigo-500/30"
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span
                      className={`relative z-10 transition-colors ${
                        !isSignup ? "text-white" : "text-white/60 hover:text-white"
                      }`}
                    >
                      Log In
                    </span>
                  </Link>
                </div>
              )}

              <h1 className="text-center text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {isForgotPassword
                  ? "Forgot your password?"
                  : isSignup
                    ? "Create your account"
                    : "Log in to Beacon"}
              </h1>
              <p className="mt-2 text-center text-sm text-white/50">
                {isForgotPassword
                  ? "Enter the email associated with your account and we'll send you a password reset link."
                  : isSignup
                    ? "Start managing your developer workflow with Beacon."
                    : "Enter your details to access your workspace."}
              </p>

              {/* Form slot. AnimatePresence swaps the old form out and the new
                 one in on each route change.

                 Keeping the card the same size across login/signup:
                 - At `sm`+ (tablet/desktop) both forms fit in ~540px once the
                   name/password rows go two-up, so `sm:min-h-[548px]` pins the
                   slot and the card is pixel-identical between the two modes.
                 - On mobile the fields stack, so signup is much taller than
                   login. We let the slot take each form's natural height there
                   (no big reserved void under login); the one height change on
                   swap is hidden behind the fade-out/fade-in, so it reads as a
                   smooth transition rather than a jump. */}
              <div className="mt-6 flex flex-col justify-center sm:mt-8 sm:min-h-[548px]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={pathname}
                    className="w-full"
                    variants={swap}
                    initial={reduce ? false : "hidden"}
                    animate="show"
                    exit={reduce ? undefined : "exit"}
                  >
                    {children}
                  </motion.div>
                </AnimatePresence>
              </div>
            </CardContent>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}