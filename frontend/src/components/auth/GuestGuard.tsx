"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AuthSplash } from "@/components/auth/Auth-splash";
import { useAuth } from "@/hooks/useAuth";

const DEFAULT_AUTHENTICATED_ROUTE = "/dashboard";

interface GuestGuardProps {
  children: React.ReactNode;
}

/**
 * Mirror image of AuthGuard, for pages that only make sense when signed out —
 * login, signup, forgot-password, reset-password.
 *
 * The two guards cannot fight each other, and that is by construction rather
 * than by luck: both read the same single `status` value, and each acts on a
 * different terminal state. AuthGuard redirects only on "unauthenticated",
 * GuestGuard only on "authenticated". No value of `status` satisfies both, so
 * there is no A→B→A ping-pong to defend against.
 *
 * The classic loop comes from two sources of truth — a guard trusting local
 * state while an interceptor trusts the server, each undoing the other. One
 * provider owning the answer removes the possibility.
 */
export function GuestGuard({ children }: GuestGuardProps) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") return;

    router.replace(resolveNextParam());
  }, [status, router]);

  // Same inversion as AuthGuard: render only on the settled state this page is
  // for. Showing a login form to someone already signed in, then yanking it
  // away, is the same flash bug wearing different clothes.
  if (status !== "unauthenticated") {
    return <AuthSplash />;
  }

  return <>{children}</>;
}

/**
 * Reads `?next=` from the URL and returns a safe destination.
 *
 * Read from `window.location` inside the effect rather than via
 * `useSearchParams()` on purpose: that hook opts the whole subtree into
 * client-side rendering and demands a Suspense boundary for static generation.
 * This value is only ever needed at redirect time, which is already
 * client-only, so the hook buys nothing and costs the prerender.
 */
function resolveNextParam() {
  if (typeof window === "undefined") return DEFAULT_AUTHENTICATED_ROUTE;

  const next = new URLSearchParams(window.location.search).get("next");

  // Open-redirect guard. Only same-origin absolute paths are honoured: `//evil.com`
  // and `https://evil.com` are both valid `next` values a link could carry, and
  // both would hand an authenticated user straight to an attacker's page.
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return DEFAULT_AUTHENTICATED_ROUTE;
  }

  return next;
}
