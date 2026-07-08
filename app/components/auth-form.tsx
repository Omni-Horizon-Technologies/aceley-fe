"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { Icon, cn } from "@/app/components/ui";
import { useAuth } from "@/lib/auth";
import { useAppState } from "@/lib/state";

type AuthState = "idle" | "loading" | "error";

export function AuthForm() {
  const [state, setState] = useState<AuthState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { loginWithAccessToken, createBackendProfile } = useAuth();
  const { completeOnboarding, updateAnswers } = useAppState();

  const message = useMemo(() => {
    if (state === "error") {
      return errorMessage || "Sign-in failed. Please try again.";
    }
    return "Continue with Google to get started.";
  }, [state, errorMessage]);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setState("loading");
      const success = await loginWithAccessToken(tokenResponse.access_token);
      if (!success) {
        setState("error");
        setErrorMessage("Google sign-in failed. Please try again.");
        return;
      }

      // Get user info to create backend profile and update local state
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const info = await res.json();

        // Store name/email in local app state so the UI shows it
        updateAnswers({ name: info.name || info.email || "" });

        await createBackendProfile({
          display_name: info.name || info.email,
          role: "student",
        });
      } catch {
        // Backend profile creation is best-effort on login
      }

      // Always mark onboarding complete — if the user has a backend profile
      // they are a returning user and should never see onboarding again
      completeOnboarding();
      router.push("/home");
    },
    onError: () => {
      setState("error");
      setErrorMessage("Google sign-in was cancelled.");
    },
  });

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-lg shadow-[#1E1B4B]/8 sm:p-6">
      <button
        className="flex min-h-12 w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-black text-[#1E1B4B] shadow-sm transition hover:border-[#FACC15]/60 hover:text-[#CA8A04] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FACC15]/20 disabled:opacity-50"
        onClick={() => { setState("idle"); googleLogin(); }}
        disabled={state === "loading"}
        type="button"
      >
        <Icon name="google" />
        {state === "loading" ? "Signing in..." : "Continue with Google"}
      </button>

      <p
        aria-live="polite"
        className={cn(
          "mt-4 rounded-lg px-3 py-2 text-sm leading-6",
          state === "error" && "bg-[#FACC15]/10 text-[#CA8A04]",
          state === "idle" && "bg-[#F8FAFC] text-slate-600",
          state === "loading" && "bg-[#312E81]/10 text-[#312E81]",
        )}
      >
        {message}
      </p>
    </div>
  );
}
