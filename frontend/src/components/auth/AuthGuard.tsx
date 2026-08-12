"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { AuthSplash } from "@/components/auth/Auth-splash";
import { useAuth } from "@/hooks/useAuth";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Gate for routes that require a session. Mount it in a layout, never per page,
 * so a new route under that segment is protected simply by existing there.
 *
 * The rendering rule is deliberately inverted from the obvious one: instead of
 * "hide if unauthenticated" it is **show only if authenticated**. Those differ
 * on the `loading` tick, and that difference is the whole bug class. Redirects
 * run in an effect, which fires *after* paint — so a component that rendered
 * children while merely "not yet redirected" would put protected markup on
 * screen, in the DOM, readable in devtools, before navigation ever began.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Acts only on a settled negative. `loading` does nothing at all, which is
    // what stops a signed-in user being bounced before /auth/me answers.
    if (status !== "unauthenticated") return;

    // Remember where they were headed so login can return them there.
    const next = encodeURIComponent(pathname);

    // `replace`, not `push`: the protected URL must not stay in history, or
    // Back lands on a page that immediately kicks them out again.
    router.replace(`/login?next=${next}`);
  }, [status, pathname, router]);

  if (status !== "authenticated") {
    return <AuthSplash />;
  }

  return <>{children}</>;
}
