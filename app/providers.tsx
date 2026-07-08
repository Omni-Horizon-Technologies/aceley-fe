"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { AppStateProvider } from "@/lib/state";
import { AuthProvider } from "@/lib/auth";
import type { ReactNode } from "react";

const googleClientId =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <AppStateProvider>{children}</AppStateProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
