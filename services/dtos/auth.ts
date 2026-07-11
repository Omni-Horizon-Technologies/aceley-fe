export type AuthProvider = "google" | "apple" | "email";

export type UserRole = "student" | "teacher";

export type ReferralSource =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "google"
  | "other";

export interface Profile {
  id: string;
  email: string;
  nickname: string | null;
  role: UserRole;
  country: string | null;
  age: number | null;
  school_name: string | null;
  school_country: string | null;
  major: string | null;
  grade: string | null;
  avatar_url: string | null;
  referral_source: ReferralSource | null;
  referral_other_text: string | null;
  onboarded_at: string | null;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  provider: AuthProvider;
  sub: string;
  email: string;
  name: string;
  picture: string | null;
  email_verified: boolean;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: "Bearer";
  expires_in: number;
}

export interface SignInResponse extends AuthTokens {
  user: AuthUser;
  profile: Profile;
  is_new_user: boolean;
}

export interface GoogleSignInRequest {
  // Backend accepts either an id_token JWT (from GoogleLogin One-Tap credential)
  // or an OAuth2 access_token (from useGoogleLogin implicit flow). Send whichever
  // is available — the backend picks the one that's present.
  id_token?: string;
  access_token?: string;
}

export interface AppleUserInfo {
  first_name?: string;
  last_name?: string;
}

export interface AppleSignInRequest {
  id_token: string;
  user?: AppleUserInfo;
}

export interface MagicLinkRequestBody {
  email: string;
}

export interface MagicLinkVerifyBody {
  token: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export type RefreshTokenResponse = AuthTokens;

export interface LogoutRequest {
  refresh_token: string;
  all_devices?: boolean;
}

export interface PatchProfileRequest {
  nickname?: string | null;
  role?: UserRole;
  country?: string | null;
  age?: number | null;
  school_name?: string | null;
  school_country?: string | null;
  major?: string | null;
  grade?: string | null;
  avatar_url?: string | null;
}

export interface CompleteOnboardingRequest {
  referral_source: ReferralSource;
  referral_other_text?: string | null;
}
