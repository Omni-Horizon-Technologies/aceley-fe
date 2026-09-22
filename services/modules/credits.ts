import { apiClient } from "@/services/apiClient";
import type { CreditsSnapshot } from "@/services/dtos/credits";

export const CREDITS_PATH = "/api/v1/me/credits";

export function getCredits(): Promise<CreditsSnapshot> {
  return apiClient.get<CreditsSnapshot>(CREDITS_PATH);
}
