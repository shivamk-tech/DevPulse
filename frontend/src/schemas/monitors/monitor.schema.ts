import { z } from "zod";

/**
 * Frontend-only validation for the Create Monitor form.
 *
 * Field names, bounds, and defaults mirror the existing Moniters model so the
 * payload lines up when this is wired to the API later — `url` is capped at 100
 * to match the model's max_length, and the method choices are exactly the two
 * the model allows. Nothing here talks to the backend; the server remains the
 * authority on what it accepts.
 */

export const HTTP_METHODS = ["GET", "HEAD"] as const;

/** Interval presets, in seconds. Values match the model's PositiveIntegerField. */
export const INTERVAL_PRESETS = [
  { label: "30s", value: 30 },
  { label: "1 min", value: 60 },
  { label: "5 min", value: 300 },
  { label: "15 min", value: 900 },
] as const;

export const MIN_INTERVAL = 30;
export const MAX_INTERVAL = 86_400; // 24h
export const MIN_TIMEOUT = 1;
export const MAX_TIMEOUT = 120;

export const createMonitorSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Give the monitor a name of at least 2 characters.")
      .max(100, "Name cannot exceed 100 characters."),

    url: z
      .string()
      .trim()
      .min(1, "A URL is required.")
      .max(100, "URL cannot exceed 100 characters.")
      .url("Enter a full URL, including https://")
      // z.url() accepts any scheme — ftp://, javascript:, mailto:. An uptime
      // check only makes sense over HTTP(S), so narrow it explicitly.
      .refine(
        (value) => /^https?:\/\//i.test(value),
        "URL must start with http:// or https://"
      ),

    method: z.enum(HTTP_METHODS),

    interval: z
      .number({ message: "Choose a check interval." })
      .int("Interval must be a whole number of seconds.")
      .min(MIN_INTERVAL, `Checks can run at most once every ${MIN_INTERVAL} seconds.`)
      .max(MAX_INTERVAL, "Interval cannot exceed 24 hours."),

    timeout: z
      .number({ message: "Enter a timeout in seconds." })
      .int("Timeout must be a whole number of seconds.")
      .min(MIN_TIMEOUT, `Timeout must be at least ${MIN_TIMEOUT} second.`)
      .max(MAX_TIMEOUT, `Timeout cannot exceed ${MAX_TIMEOUT} seconds.`),

  })
  // A timeout longer than the interval means a check is still waiting when the
  // next one is due — checks pile up. Cross-field, so it lives here rather than
  // on either field.
  .refine((data) => data.timeout < data.interval, {
    path: ["timeout"],
    message: "Timeout must be shorter than the check interval.",
  });

export type CreateMonitorFormData = z.infer<typeof createMonitorSchema>;

/** Matches the model's own defaults, so an untouched form mirrors the server. */
export const CREATE_MONITOR_DEFAULTS: CreateMonitorFormData = {
  name: "",
  url: "",
  method: "GET",
  interval: 60,
  timeout: 10,
};

/** Human phrasing for an interval in seconds — "60" reads worse than "1 minute". */
export function formatInterval(seconds: number) {
  if (!Number.isFinite(seconds)) return "—";
  if (seconds < 60) return `${seconds} seconds`;

  const minutes = Math.round(seconds / 60);

  if (minutes < 60) return minutes === 1 ? "minute" : `${minutes} minutes`;

  const hours = Math.round(minutes / 60);

  return hours === 1 ? "hour" : `${hours} hours`;
}
