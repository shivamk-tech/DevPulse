import { cn } from "@/lib/utils";

/**
 * The Beacon glyph, drawn as real geometry rather than traced from an image.
 *
 * Constructed on a 24-unit grid so strokes land on whole pixels at 24px and
 * 48px — the two sizes it's actually used at. Four paths, no gradients, no
 * fills: detail is what makes a mark turn to mush when it's 28px tall in a
 * navbar.
 *
 * Colour comes from `currentColor`, so the same file is white over the landing
 * video and indigo in the dashboard without a second asset.
 */
export function BeaconMark({
  className,
  strokeWidth = 1.6,
}: {
  className?: string;
  /** Drop to ~1.4 above 48px, raise to ~1.8 below 20px, to keep optical weight even. */
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn("size-6", className)}
    >
      {/* Lamp room + roof, as one closed shape so the corners miter cleanly */}
      <path d="M9.5 7 12 4.25 14.5 7v3h-5z" />

      {/* Tower — splayed outward toward the base. The taper is what reads as
         "lighthouse" at small size; a straight column reads as a chimney. */}
      <path d="M10 10 8.25 19.5M14 10l1.75 9.5" />

      {/* Ground */}
      <path d="M6 19.5h12" />

      {/* Two beams, angled up and out from the lamp */}
      <path d="M8.75 8.5 4.5 7M15.25 8.5 19.5 7" />
    </svg>
  );
}
