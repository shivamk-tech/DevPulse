import type { Variants, Transition } from "motion/react";

/**
 * One shared motion vocabulary for the whole app. Import these instead of
 * hand-writing durations/easings per component so everything feels consistent.
 *
 * Rules of thumb baked in here:
 *  - animate only `transform` / `opacity` (GPU-friendly, no layout thrash)
 *  - one easing curve, three durations
 *  - components should also honor `useReducedMotion()` from motion/react
 */

/** The single easing curve used everywhere (matches the auth CSS keyframe). */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Three durations: micro taps, standard moves, larger reveals. */
export const DURATION = {
  micro: 0.15,
  standard: 0.25,
  large: 0.4,
} as const;

export const transition: Transition = {
  duration: DURATION.standard,
  ease: EASE,
};

/** Parent that reveals its children one after another. */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

/** Standard child: fade up into place. Pairs with `staggerContainer`. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition },
};

/** Slightly smaller travel, for dense form fields. */
export const fadeInUpSm: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition },
};

/** Route/panel swap: out and in in the same spot. */
export const swap: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition },
  exit: { opacity: 0, y: -8, transition: { duration: DURATION.micro, ease: EASE } },
};
