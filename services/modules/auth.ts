import { ApiError, apiClient } from "@/services/apiClient";
import type {
  AppleSignInRequest,
  AppleUserInfo,
  CompleteOnboardingRequest,
  GoogleSignInRequest,
  LogoutRequest,
  MagicLinkRequestBody,
  MagicLinkVerifyBody,
  PatchProfileRequest,
  Profile,
  RefreshTokenRequest,
  RefreshTokenResponse,
  SignInResponse,
} from "@/services/dtos/auth";

export const AUTH_PATHS = {
  googleSignIn: "/api/v1/auth/oauth/google/sign-in",
  appleSignIn: "/api/v1/auth/oauth/apple/sign-in",
  requestMagicLink: "/api/v1/auth/email/request-link",
  verifyMagicLink: "/api/v1/auth/email/verify-link",
  refreshToken: "/api/v1/auth/token/refresh",
  logout: "/api/v1/auth/logout",
  profile: "/api/v1/identity/profile",
  onboarding: "/api/v1/identity/onboarding",
} as const;

export function signInWithGoogle(
  token: { idToken?: string; accessToken?: string },
): Promise<SignInResponse> {
  const body: GoogleSignInRequest = {};
  if (token.idToken) body.id_token = token.idToken;
  if (token.accessToken) body.access_token = token.accessToken;
  return apiClient.post<SignInResponse>(AUTH_PATHS.googleSignIn, body, { skipAuth: true });
}

export function signInWithApple(params: {
  idToken: string;
  user?: AppleUserInfo;
}): Promise<SignInResponse> {
  const body: AppleSignInRequest = {
    id_token: params.idToken,
    ...(params.user ? { user: params.user } : {}),
  };
  return apiClient.post<SignInResponse>(AUTH_PATHS.appleSignIn, body, { skipAuth: true });
}

export function requestMagicLink(email: string): Promise<void> {
  const body: MagicLinkRequestBody = { email };
  return apiClient.post<void>(AUTH_PATHS.requestMagicLink, body, {
    skipAuth: true,
    parseAs: "none",
  });
}

export function verifyMagicLink(token: string): Promise<SignInResponse> {
  const body: MagicLinkVerifyBody = { token };
  return apiClient.post<SignInResponse>(AUTH_PATHS.verifyMagicLink, body, {
    skipAuth: true,
  });
}

export function refreshAccessToken(
  refreshToken: string,
): Promise<RefreshTokenResponse> {
  const body: RefreshTokenRequest = { refresh_token: refreshToken };
  return apiClient.post<RefreshTokenResponse>(AUTH_PATHS.refreshToken, body, {
    skipAuth: true,
  });
}

export function logout(
  refreshToken: string,
  options: { allDevices?: boolean } = {},
): Promise<void> {
  const body: LogoutRequest = {
    refresh_token: refreshToken,
    all_devices: options.allDevices ?? false,
  };
  return apiClient.post<void>(AUTH_PATHS.logout, body, { parseAs: "none" });
}

export function getProfile(): Promise<Profile> {
  return apiClient.get<Profile>(AUTH_PATHS.profile);
}

export function patchProfile(patch: PatchProfileRequest): Promise<Profile> {
  return apiClient.patch<Profile>(AUTH_PATHS.profile, patch);
}

export function completeOnboarding(
  payload: CompleteOnboardingRequest,
): Promise<Profile> {
  return apiClient.post<Profile>(AUTH_PATHS.onboarding, payload);
}

/**
 * Detects the backend's account_deleted 403 envelope so every sign-in path
 * (Google, Apple, magic-link request + verify) can surface the same message.
 */
export function isAccountDeletedError(err: unknown): boolean {
  if (!(err instanceof ApiError)) return false;
  if (err.status !== 403) return false;
  if (err.data && typeof err.data === "object" && (err.data as { code?: string }).code === "account_deleted") {
    return true;
  }
  return false;
}

export const ACCOUNT_DELETED_MESSAGE =
  "Account deleted — This account has been deleted. Contact support to restore.";

/**
 * Resume-check: given a profile, return the route the user should be on.
 * 8-step flow mirroring mobile:
 *   0: study_language → /onboarding/language
 *   1: nickname → /onboarding/name
 *   2: age → /onboarding/age
 *   3: study_level → /onboarding/study-level
 *   4: main_goal → /onboarding/goal
 *   5: daily_study_frequency → /onboarding/frequency
 *   6: study_reminder_hour → /onboarding/reminder
 *   7: referral_source (final; also writes onboarded_at) → /onboarding/referral
 */
export function nextOnboardingStep(profile: Profile): string {
  if (profile.onboarded_at) return "/dashboard";
  if (!profile.study_language) return "/onboarding/language";
  if (!profile.nickname) return "/onboarding/name";
  if (profile.age === null || profile.age === undefined) return "/onboarding/age";
  if (!profile.study_level) return "/onboarding/study-level";
  if (!profile.main_goal) return "/onboarding/goal";
  if (!profile.daily_study_frequency) return "/onboarding/frequency";
  if (profile.study_reminder_hour === null || profile.study_reminder_hour === undefined) {
    return "/onboarding/reminder";
  }
  return "/onboarding/referral";
}
