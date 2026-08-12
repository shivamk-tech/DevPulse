import { Spinner } from "@/components/ui";

/**
 * Shown while the session is being resolved, and while a guard is redirecting.
 *
 * Deliberately plain: it stands in for content the viewer may not be allowed to
 * see, so it must not leak layout, counts, or names from the page behind it. A
 * skeleton of the real dashboard would do exactly that.
 */
export function AuthSplash() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#08080B]">
      <Spinner size="lg" aria-label="Checking your session" className="text-white/40" />
    </div>
  );
}
