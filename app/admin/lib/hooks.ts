"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest, saveSession } from "./api";
import { qk } from "./query-keys";
import type {
  AdminOut,
  AdminUserDetail,
  AnalyticsData,
  AnalyticsPeriod,
  AppVersionConfig,
  AppVersionUpdate,
  CreditAdjustRequest,
  LoginRequest,
  LoginResponse,
  Platform,
  PushEstimateResponse,
  PushNotification,
  PushSendRequest,
  PushTarget,
  PushTestRequest,
  TierOverrideRequest,
  UsersListResponse,
} from "./types";

export function useLogin() {
  return useMutation({
    mutationFn: async (body: LoginRequest) => {
      const res = await apiRequest<LoginResponse>("/admin/auth/login", {
        method: "POST",
        body,
        auth: false,
      });
      saveSession(res.access_token, res.expires_in, res.admin);
      return res;
    },
  });
}

export function useMe(enabled = true) {
  return useQuery({
    queryKey: qk.me,
    queryFn: () => apiRequest<AdminOut>("/admin/me"),
    enabled,
    staleTime: 60_000,
  });
}

export function useAnalytics(period: AnalyticsPeriod) {
  return useQuery({
    queryKey: qk.analytics(period),
    queryFn: () => apiRequest<AnalyticsData>("/admin/analytics", { query: { period } }),
    staleTime: 5 * 60_000,
  });
}

export function useUsersList(search: string) {
  return useInfiniteQuery({
    queryKey: qk.usersList(search),
    queryFn: ({ pageParam }) =>
      apiRequest<UsersListResponse>("/admin/users", {
        query: { search, cursor: pageParam, limit: 25 },
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.next_cursor ?? undefined,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: qk.user(id),
    queryFn: () => apiRequest<AdminUserDetail>(`/admin/users/${id}`),
    enabled: Boolean(id),
  });
}

export function useAdjustCredits(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreditAdjustRequest) =>
      apiRequest<AdminUserDetail>(`/admin/users/${userId}/credits`, { method: "POST", body }),
    onSuccess: (data) => {
      qc.setQueryData(qk.user(userId), data);
    },
  });
}

export function useOverrideTier(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: TierOverrideRequest) =>
      apiRequest<AdminUserDetail>(`/admin/users/${userId}/tier`, { method: "POST", body }),
    onSuccess: (data) => {
      qc.setQueryData(qk.user(userId), data);
    },
  });
}

export function useAppVersions() {
  return useQuery({
    queryKey: qk.appVersions,
    queryFn: () => apiRequest<{ ios: AppVersionConfig; android: AppVersionConfig }>("/admin/app-versions"),
  });
}

export function useUpdateAppVersion(platform: Platform) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: AppVersionUpdate) =>
      apiRequest<AppVersionConfig>(`/admin/app-versions/${platform}`, { method: "PUT", body }),
    onSuccess: (data) => {
      qc.setQueryData(qk.appVersion(platform), data);
      qc.setQueryData<{ ios: AppVersionConfig; android: AppVersionConfig } | undefined>(
        qk.appVersions,
        (prev) => (prev ? { ...prev, [platform]: data } : prev),
      );
    },
  });
}

export function usePushEstimate(target: PushTarget, enabled: boolean) {
  return useQuery({
    queryKey: qk.pushEstimate(target),
    queryFn: () => apiRequest<PushEstimateResponse>("/admin/push/estimate", { method: "POST", body: target }),
    enabled,
    staleTime: 15_000,
  });
}

export function useSendTestPush() {
  return useMutation({
    mutationFn: (body: PushTestRequest) =>
      apiRequest<PushNotification>("/admin/push/test", { method: "POST", body }),
  });
}

export function useSendPush() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ body, idempotencyKey }: { body: PushSendRequest; idempotencyKey: string }) =>
      apiRequest<PushNotification>("/admin/push/send", {
        method: "POST",
        body,
        headers: { "Idempotency-Key": idempotencyKey },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "push", "history"] });
    },
  });
}

export function usePushHistory(limit = 50, skip = 0) {
  return useQuery({
    queryKey: qk.pushHistory(limit, skip),
    queryFn: () => apiRequest<PushNotification[]>("/admin/push/history", { query: { limit, skip } }),
  });
}

export function usePushNotification(id: string) {
  return useQuery({
    queryKey: qk.pushNotification(id),
    queryFn: () => apiRequest<PushNotification>(`/admin/push/${id}`),
    enabled: Boolean(id),
  });
}

// Cron / ops — shared-secret header, admin JWT NOT sent.
async function cronRequest<T>(path: string, secret: string, query?: Record<string, string | undefined>) {
  return apiRequest<T>(path, {
    method: "POST",
    auth: false,
    headers: { "X-Admin-Secret": secret },
    query,
  });
}

export function useCronRefreshCredits() {
  return useMutation({
    mutationFn: (secret: string) => cronRequest<{ refreshed: number }>("/admin/credits/refresh", secret),
  });
}

export function useCronZeroStreaks() {
  return useMutation({
    mutationFn: (secret: string) => cronRequest<{ zeroed: number }>("/admin/streaks/zero-stale", secret),
  });
}

export function useCronBackfillCounters() {
  return useMutation({
    mutationFn: ({ secret, userId }: { secret: string; userId?: string }) =>
      cronRequest<{ backfilled: number }>("/admin/counters/backfill", secret, { user_id: userId }),
  });
}
