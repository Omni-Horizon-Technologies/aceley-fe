"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppStateProvider } from "@/lib/state";
import { AuthProvider as LegacyAuthProvider } from "@/lib/auth";
import { InsufficientCreditsSheet } from "@/app/components/insufficient-credits-sheet";
import { useState, type ReactNode } from "react";

const rawGoogleClientId =
  process.env.NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID ??
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ??
  "";

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
    "[aceley] NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID is not set — Google sign-in is disabled. Copy .env.example to .env.local and fill it in.",
  );
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <LegacyAuthProvider>
          <AppStateProvider>
            {children}
            <InsufficientCreditsSheet />
          </AppStateProvider>
        </LegacyAuthProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}
