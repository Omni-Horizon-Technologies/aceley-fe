import { apiClient } from "@/services/apiClient";
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
 * Resume-check: given a profile, return the route the user should be on.
 * Mirrors the mobile spec exactly:
 *   onboarded_at → /dashboard
 *   !nickname    → step 1
 *   !country || age == null → step 2
 *   !school_name → step 3
 *   !major       → step 4
 *   else         → step 5
 */
export function nextOnboardingStep(profile: Profile): string {
  if (profile.onboarded_at) return "/dashboard";
  if (!profile.nickname) return "/onboarding/name";
  if (!profile.country || profile.age === null || profile.age === undefined) {
    return "/onboarding/about";
  }
  if (!profile.school_name) return "/onboarding/school";
  if (!profile.major) return "/onboarding/major";
  return "/onboarding/source";
}
