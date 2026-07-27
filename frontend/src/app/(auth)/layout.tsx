"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui";

/**
 * Shared shell for /signup and /login. It stays mounted while you navigate
 * between the two sibling routes, so the image panel, brand, and toggle never
 * re-mount — only the form (children) swaps. Mode is derived from the URL, so
 * there's no useState: the pathname IS the state.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSignup = pathname?.includes("signup") ?? false;

  return (
    <Card className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border-white/10 bg-[#0B0F14] p-0 shadow-2xl sm:rounded-3xl">
      {/* Mobile-only brand header (image panel is hidden below lg) */}
      <div className="flex items-center gap-2 border-b border-white/10 px-6 py-4 text-white lg:hidden">
        <span className="text-sm font-semibold tracking-wide">DevPulse</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left panel — image. Always the same; stretches to the form's height. */}
        <div className="relative hidden lg:block">
          {/*
            Drop your image in /public and swap the src below, e.g.
            <Image src="/your-image.jpg" alt="" fill className="object-cover" />
          */}
          <div className="absolute inset-0 flex items-center justify-center border-r border-white/10 bg-gradient-to-br from-[#111826] to-[#0B0F14]">
            <div className="flex h-40 w-40 items-center justify-center rounded-2xl border border-dashed border-white/20 text-xs text-white/40">
              Your image here
            </div>
          </div>

          {/* Bottom scrim + copy (changes with mode) */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-10 pt-24">
            <h2 className="text-4xl font-semibold tracking-tight text-white">
              {isSignup ? "Ship Faster, Together" : "Welcome Back"}
            </h2>
            <p className="mt-3 max-w-sm text-sm text-white/60">
              {isSignup
                ? "DevPulse keeps your whole team in sync, from first commit to production deploy."
                : "Pick up right where you left off with your team's workflow."}
            </p>
          </div>

          {/* Brand mark */}
          <div className="absolute left-8 top-8 flex items-center gap-2 text-white">
            <span className="text-sm font-semibold tracking-wide">DevPulse</span>
          </div>
        </div>

        {/* Right panel — toggle + heading (shared) + form (children) */}
        <CardContent className="flex flex-col justify-center px-5 py-4 sm:px-10 sm:py-8 lg:px-14">
          {/* Mode toggle — real navigation between the two routes.
             `replace` so hammering the toggle doesn't stack up history. */}
          <div className="mx-auto mb-6 flex rounded-full border border-white/10 bg-white/5 p-1 sm:mb-8">
            <Link
              href="/signup"
              replace
              className={`rounded-full px-4 py-1.5 text-center text-sm font-medium transition-colors sm:px-5 ${
                isSignup ? "bg-[#4f46e5] text-white" : "text-white/60 hover:text-white"
              }`}
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              replace
              className={`rounded-full px-4 py-1.5 text-center text-sm font-medium transition-colors sm:px-5 ${
                !isSignup ? "bg-[#4f46e5] text-white" : "text-white/60 hover:text-white"
              }`}
            >
              Log In
            </Link>
          </div>

          <h1 className="text-center text-2xl font-semibold text-white sm:text-3xl">
            {isSignup ? "Create Your Account" : "Log In to DevPulse"}
          </h1>
          <p className="mt-2 text-center text-sm text-white/50">
            {isSignup
              ? "Start managing your developer workflow with DevPulse."
              : "Enter your details to access your workspace."}
          </p>

          {/* Form slot. key={pathname} re-fires the fade on each swap.
             min-h reserves the taller (signup) form's height so the card
             never resizes when toggling — tune the value to your forms. */}
          <div key={pathname} className="auth-swap mt-6 min-h-[520px] sm:mt-8">
            {children}
          </div>
        </CardContent>
      </div>

      <style>{`
        @keyframes authSwap {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: none; }
        }
        .auth-swap { animation: authSwap 0.3s cubic-bezier(0.22, 1, 0.36, 1); }
      `}</style>
    </Card>
  );
}