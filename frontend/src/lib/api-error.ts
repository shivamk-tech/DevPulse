import { isAxiosError } from "axios";

/**
 * Pulls the first human-readable string out of a DRF error body.
 *
 * The auth services return a few different shapes — `{detail}`, `{details}`,
 * or `{field: ["msg"]}` — so probe rather than assume. Pass `fieldKeys` to
 * check form fields before falling back to the generic message.
 */
export function readApiError(error: unknown, fieldKeys: string[] = []) {
  if (!isAxiosError(error)) {
    return "Something went wrong. Please try again.";
  }

  // No response at all: the request never landed, so nothing the user typed
  // is at fault. Say so rather than blaming the form.
  if (!error.response) {
    return "We couldn't reach the server. Check your connection and try again.";
  }

  const data = error.response.data as Record<string, unknown> | undefined;

  if (data) {
    for (const key of ["detail", "details", "non_field_errors", ...fieldKeys]) {
      const value = data[key];

      if (typeof value === "string") return value;
      if (Array.isArray(value) && typeof value[0] === "string") return value[0];
    }
  }

  if (error.response.status >= 500) {
    return "Our server had a problem. Please try again in a moment.";
  }

  return "Something went wrong. Please try again.";
}
