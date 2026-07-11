import { ApiError, apiClient } from "@/services/apiClient";
import type { SchoolSearchResult } from "@/services/dtos/identity";

export const IDENTITY_PATHS = {
  schoolSearch: "/api/v1/identity/schools/search",
} as const;

/**
 * Search schools by (English) country name and optional partial name.
 * Backend proxies Hipolabs; auth optional. Returns [] on any backend
 * failure so callers can render a "type it manually" fallback.
 */
export async function searchSchools(
  country: string,
  q = "",
  limit = 20,
): Promise<SchoolSearchResult[]> {
  try {
    return await apiClient.get<SchoolSearchResult[]>(IDENTITY_PATHS.schoolSearch, {
      query: { country, q, limit },
      skipAuth: true,
    });
  } catch (err) {
    if (err instanceof ApiError) return [];
    throw err;
  }
}
