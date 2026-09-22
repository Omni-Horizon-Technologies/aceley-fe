export type CreditTier = "none" | "small" | "best" | "unlimited";

export interface CreditsSnapshot {
  balance: number;
  is_unlimited: boolean;
  tier: CreditTier;
  next_refresh_at: string | null;
  subscription_expires_at: string | null;
  payment_provider: "stripe" | "revenuecat" | null;
}
