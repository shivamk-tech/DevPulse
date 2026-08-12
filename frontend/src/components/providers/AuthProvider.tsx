"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AuthContext, type AuthStatus } from "@/contexts/auth-context";
import { setUnauthorizedHandler } from "@/lib/api";
import { authService } from "@/services/auth/auth.service";
import type { User } from "@/types/auth";

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Owns authentication *state* and nothing else.
 *
 * It does not redirect, does not render spinners, and does not decide what any
 * route is allowed to show. Those are the guards' concerns. Keeping them out of
 * here is what lets one provider serve both protected and public routes without
 * either having to know about the other.
 *
 * Because the tokens are httpOnly cookies, the client genuinely cannot inspect
 * them — asking the server is the only way to know whether a session exists.
 * That question is asked exactly once per full page load, here, and every
 * consumer reads the answer from context.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await authService.me();

      setUser(data);
      setStatus("authenticated");

      return data;
    } catch {
      // Any failure here means "no usable session". The axios interceptor has
      // already attempted a token refresh before this rejects, so by the time
      // we land here the session is genuinely unrecoverable.
      setUser(null);
      setStatus("unauthenticated");

      return null;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      // In `finally`: if the request fails (network down, cookie already
      // expired), the local session must still end. Leaving someone "logged in"
      // client-side after they asked to leave is the worse failure.
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  // Bootstrap. The ref keeps this to one request even under React StrictMode,
  // which deliberately double-invokes effects in development.
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    void refreshUser();
  }, [refreshUser]);

  // The HTTP layer reports a dead session; it does not act on one. When a
  // refresh fails mid-session this flips status, and whichever guard is mounted
  // decides where the user goes — so the redirect rule lives in one place.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      setStatus("unauthenticated");
    });

    return () => setUnauthorizedHandler(null);
  }, []);

  // Memoized: this provider sits above the entire app, so an unstable value
  // would re-render every consumer on each of its own renders.
  const value = useMemo(
    () => ({ user, status, refreshUser, logout }),
    [user, status, refreshUser, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
