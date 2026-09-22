export type ApiEnvelopeError = {
  message: string;
  code: string;
  details: Record<string, unknown>;
};

export type LoginRequest = {
  username_or_email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
  admin: AdminOut;
};

export type AdminOut = {
  id: string;
  email: string;
  username: string;
};

export type AnalyticsPeriod = "7d" | "30d" | "90d" | "365d";

export type UserGrowthPoint = { date: string; users: number; new_users: number };
export type RevenuePoint = { date: string; revenue: number; subscriptions: number };
export type UsagePoint = { date: string; requests: number; humanized_texts: number };
export type PlanDistribution = { plan: "free" | "pro" | "premium"; users: number; percentage: number };
export type TopUser = { email: string; requests: number; plan_type: string; last_activity: string | null };
export type SubscriptionStatus = { status: "active" | "expired" | "free"; count: number; percentage: number };

export type AnalyticsData = {
  user_growth: UserGrowthPoint[];
  revenue_data: RevenuePoint[];
  usage_data: UsagePoint[];
  plan_distribution: PlanDistribution[];
  top_users: TopUser[];
  subscription_status: SubscriptionStatus[];
};

export type Tier = "none" | "small" | "best" | "unlimited";

export type AdminUserSummary = {
  id?: string;
  _id?: string;
  email: string;
  nickname: string | null;
  tier: Tier;
  credits_balance: number;
  is_unlimited: boolean;
  is_premium: boolean;
  payment_provider: "stripe" | "revenuecat" | null;
  created_at: string;
  onboarded_at: string | null;
  subscription_expires_at: string | null;
  last_activity_date: string | null;
};

export type AdminUserDetail = AdminUserSummary & {
  quizzes_taken_count: number;
  questions_answered: number;
  study_days_count: number;
  current_streak_days: number;
  country: string | null;
  age: number | null;
  study_level: string | null;
  main_goal: string | null;
};

export type UsersListResponse = {
  items: AdminUserSummary[];
  next_cursor: string | null;
};

export type CreditAdjustRequest = { amount: number; reason: string };
export type TierOverrideRequest = { tier: Tier; expires_at: string | null };

export type Platform = "ios" | "android";

export type AppVersionConfig = {
  platform: Platform;
  enabled: boolean;
  minimum_supported_version: string;
  latest_version: string;
  force_update_message: string;
  optional_update_message: string;
  update_url: string;
  release_notes: string;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
};

export type AppVersionUpdate = Partial<
  Pick<
    AppVersionConfig,
    | "enabled"
    | "minimum_supported_version"
    | "latest_version"
    | "force_update_message"
    | "optional_update_message"
    | "update_url"
    | "release_notes"
  >
>;

export type PushTarget =
  | { type: "all" }
  | { type: "platform"; platform: "ios" | "android" | "web" }
  | { type: "tier"; tier: "free" | "pro" | "premium" }
  | { type: "device_ids"; device_ids: string[] };

export type PushTicket =
  | { status: "ok"; id: string }
  | { status: "error"; message: string; details: { error: string; [key: string]: unknown } };

export type PushNotification = {
  notification_id: string;
  sent_at: string;
  sent_by_admin: string;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  target_filter: PushTarget;
  target_count: number;
  sent_count: number;
  error_count: number;
  skipped_count: number;
  tickets: PushTicket[];
};

export type PushEstimateResponse = { target_count: number };

export type PushSendRequest = {
  title: string;
  body: string;
  target: PushTarget;
  data?: Record<string, unknown>;
};

export type PushTestRequest = {
  device_id: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
};
