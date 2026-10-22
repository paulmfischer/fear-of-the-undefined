import type { SiteData } from "../types.ts";

export function validateSite(value: unknown): SiteData {
  const data = value as Record<string, unknown>;
  for (const key of ["siteTitle", "siteDescription", "author", "github", "email", "mastodon", "linkedin"]) {
    if (!data || typeof data[key] !== "string") throw new Error(`Missing site metadata: ${key}`);
  }
  return data as unknown as SiteData;
}
