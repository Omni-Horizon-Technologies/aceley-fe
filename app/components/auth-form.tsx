"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { Icon, cn } from "@/app/components/ui";
import { isGoogleAuthConfigured } from "@/app/providers";
import { useAuth } from "@/lib/auth";
import { useAppState } from "@/lib/state";

const MAGIC_API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

type Status = "idle" | "google-loading" | "email-loading" | "email-sent" | "error";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function AuthForm({ mode = "login" }: { mode?: "login" | "signup" }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [sentToEmail, setSentToEmail] = useState("");
  const router = useRouter();
  const { loginWithAccessToken, createBackendProfile } = useAuth();
  const { completeOnboarding, updateAnswers } = useAppState();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setStatus("google-loading");
      const success = await loginWithAccessToken(tokenResponse.access_token);
      if (!success) {
        setStatus("error");
        setErrorMessage("Google sign-in failed. Please try again.");
        return;
      }

      let userName = "";
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const info = await res.json();
        userName = info.name || info.email || "";
        updateAnswers({ name: userName });
      } catch {
        // best-effort
      }

      // Signup: if this is a genuinely new user (no backend profile),
      // continue into onboarding instead of jumping to /home.
      if (mode === "signup") {
        const raw = typeof window !== "undefined" ? window.localStorage.getItem("aceley:v1:auth") : null;
        const hasProfile = raw ? Boolean(JSON.parse(raw).profile) : false;
        if (!hasProfile) {
          router.push("/onboarding/name");
          return;
        }
      }

      try {
        await createBackendProfile({
          display_name: userName,
          role: "student",
        });
      } catch {
        // best-effort
      }

      completeOnboarding();
      router.push("/home");
    },
    onError: () => {
      setStatus("error");
      setErrorMessage("Google sign-in was cancelled.");
    },
  });

  async function handleMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) {
      setStatus("error");
      setErrorMessage("Enter a valid email address.");
      return;
    }
    setStatus("email-loading");
    setErrorMessage("");
    try {
      const res = await fetch(`${MAGIC_API_URL}/api/v1/auth/email/request-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      if (res.status !== 202 && !res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }
      setSentToEmail(trimmed);
      setStatus("email-sent");
    } catch {
      setStatus("error");
      setErrorMessage("We couldn’t send your link. Please try again.");
    }
  }

  const isLoading = status === "google-loading" || status === "email-loading";

  if (status === "email-sent") {
    return (
      <div className="text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <Icon name="mail" />
        </span>
        <h2 className="mt-4 text-xl font-black tracking-tight text-[#1E1B4B]">
          Check your email
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          We sent a sign-in link to{" "}
          <span className="font-semibold text-[#1E1B4B]">{sentToEmail}</span>. Open it on this device to continue.
        </p>
        <button
          className="mt-6 text-sm font-black text-[#312E81] transition hover:text-[#CA8A04]"
          onClick={() => {
            setStatus("idle");
            setErrorMessage("");
            setSentToEmail("");
          }}
          type="button"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Google */}
      <button
        className="flex min-h-12 w-full items-center justify-center gap-3 rounded-lg bg-white px-5 py-3 text-sm font-black text-[#1E1B4B] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FACC15]/20 disabled:opacity-50"
        disabled={isLoading}
        onClick={() => {
          if (!isGoogleAuthConfigured) {
            setStatus("error");
            setErrorMessage(
              "Google sign-in isn’t configured. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID in .env.local and restart the dev server.",
            );
            return;
          }
          setStatus("idle");
          setErrorMessage("");
          googleLogin();
        }}
        type="button"
      >
        <Icon name="google" />
        {status === "google-loading" ? "Signing in…" : "Continue with Google"}
      </button>

      {/* Apple */}
      <button
        className="mt-3 flex min-h-12 w-full items-center justify-center gap-3 rounded-lg bg-[#0F0F10] px-5 py-3 text-sm font-black text-white transition hover:bg-[#1E1B4B] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#0F0F10]/25 disabled:opacity-50"
        disabled={isLoading}
        onClick={() => {
          setStatus("error");
          setErrorMessage("Apple sign-in is coming soon. Use Google or your email in the meantime.");
        }}
        type="button"
      >
        <Icon name="apple" />
        Continue with Apple
      </button>

      {/* OR divider */}
      <div className="my-5 flex items-center gap-4" aria-hidden="true">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">or</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {/* Email → magic link */}
      <form onSubmit={handleMagicLink} noValidate>
        <label className="block">
          <span className="sr-only">Email</span>
          <input
            autoComplete="email"
            className="min-h-12 w-full rounded-lg bg-white px-4 text-sm font-semibold text-[#1E1B4B] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none transition placeholder:text-slate-400 focus:ring-4 focus:ring-[#312E81]/15 disabled:opacity-50"
            disabled={isLoading}
            inputMode="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@school.edu"
            required
            type="email"
            value={email}
          />
        </label>

        <button
          className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#FACC15] px-5 py-3 text-sm font-black text-[#1E1B4B] shadow-[0_8px_24px_rgba(250,204,21,0.28)] transition hover:bg-[#312E81] hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FACC15]/25 disabled:opacity-50"
          disabled={isLoading}
          type="submit"
        >
          <Icon name="mail" />
          {status === "email-loading" ? "Sending link…" : "Send magic link"}
        </button>
      </form>

      <p
        aria-live="polite"
        className={cn(
          "mt-4 text-sm leading-6",
          status === "error" ? "text-[#CA8A04]" : "text-slate-500",
        )}
      >
        {status === "error"
          ? errorMessage
          : "No password needed. We’ll email you a one-tap sign-in link."}
      </p>
    </div>
  );
}
