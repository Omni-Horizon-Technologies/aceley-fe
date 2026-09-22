import type { AnalyticsPeriod, Platform, PushTarget } from "./types";

export const qk = {
  me: ["admin", "me"] as const,
  analytics: (period: AnalyticsPeriod) => ["admin", "analytics", period] as const,
  usersList: (search: string) => ["admin", "users", "list", search] as const,
  user: (id: string) => ["admin", "users", id] as const,
  appVersions: ["admin", "app-versions"] as const,
  appVersion: (platform: Platform) => ["admin", "app-versions", platform] as const,
  pushEstimate: (target: PushTarget) => ["admin", "push", "estimate", target] as const,
  pushHistory: (limit: number, skip: number) => ["admin", "push", "history", { limit, skip }] as const,
  pushNotification: (id: string) => ["admin", "push", id] as const,
};
