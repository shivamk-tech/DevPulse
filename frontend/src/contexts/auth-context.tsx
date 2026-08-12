"use client";

import { createContext } from "react";

import type { User } from "@/types/auth";

/**
 * Auth is a three-state machine, not two booleans.
 *
 * `loading` + `isAuthenticated` gives four combinations, one of which is
 * nonsense (loading && authenticated) and one of which is the source of nearly
 * every auth bug: on the first render, before /auth/me answers, a logged-in
 * user is indistinguishable from a logged-out one. A guard reading
 * `!isAuthenticated` there redirects someone who is perfectly well signed in.
 *
 * One union makes that state unrepresentable — you cannot check "not
 * authenticated" without deciding what to do about "don't know yet".
 */
export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface AuthContextValue {
  /** The signed-in user, or null when unauthenticated / still loading. */
  user: User | null;

  status: AuthStatus;

  /**
   * Re-reads the session from the server and returns the user (or null).
   * Call after login/signup so state reflects the new session without a
   * full page reload.
   */
  refreshUser: () => Promise<User | null>;

  /** Clears the server session and local state. Navigation is the guards' job. */
  logout: () => Promise<void>;
}

// `undefined` (not a default object) so `useAuth` can tell "no provider above
// me" apart from "provider present, nobody signed in".
export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);
