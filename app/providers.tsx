"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { AppStateProvider } from "@/lib/state";
import { AuthProvider } from "@/lib/auth";
import type { ReactNode } from "react";

const rawGoogleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

export const isGoogleAuthConfigured = rawGoogleClientId.length > 0;

// GoogleOAuthProvider throws synchronously if clientId is empty. Use a
// placeholder in dev when the env var isn't set so pages that mount
// useGoogleLogin don't crash — the button UX is gated separately via
// isGoogleAuthConfigured.
const googleClientId = isGoogleAuthConfigured
  ? rawGoogleClientId
  : "unset.apps.googleusercontent.com";

if (!isGoogleAuthConfigured && process.env.NODE_ENV === "development") {
  console.warn(
    "[aceley] NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set — Google sign-in is disabled. Copy .env.example to .env.local and fill it in.",
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <AppStateProvider>{children}</AppStateProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
