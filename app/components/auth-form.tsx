"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { GoogleLogin } from "@react-oauth/google";
import { Icon, cn } from "@/app/components/ui";
import { AppleIcon, GoogleIcon } from "@/app/components/icons/icons";
import { isGoogleAuthConfigured } from "@/app/providers";
import { useAuth } from "@/services/hooks/useAuth";
import {
  ACCOUNT_DELETED_MESSAGE,
  isAccountDeletedError,
  nextOnboardingStep,
  requestMagicLink,
  signInWithApple,
  signInWithGoogle,
} from "@/services/modules/auth";
import { ApiError } from "@/services/apiClient";
import type { AppleUserInfo, SignInResponse } from "@/services/dtos/auth";

type Status =
  | "idle"
  | "google-loading"
  | "apple-loading"
  | "email-loading"
  | "email-sent"
  | "error";

const APPLE_SDK_SRC =
  "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";

const APPLE_SERVICE_ID = process.env.NEXT_PUBLIC_APPLE_SERVICE_ID ?? "";
const APPLE_REDIRECT_URI =
  typeof window !== "undefined"
    ? `${window.location.origin}/auth/apple-callback`
    : "https://www.tryaceley.com/auth/apple-callback";

const isAppleConfigured = APPLE_SERVICE_ID.length > 0;

const APPLE_ALLOWED_HOSTS = new Set([
  "tryaceley.com",
  "www.tryaceley.com",
]);

function isAppleAllowedOnHost() {
  return (
    typeof window !== "undefined" &&
    APPLE_ALLOWED_HOSTS.has(window.location.hostname)
  );
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

type AppleIDNamespace = {
  auth: {
    init: (opts: {
      clientId: string;
      scope: string;
      redirectURI: string;
      usePopup: boolean;
    }) => void;
    signIn: () => Promise<{
      authorization: { id_token: string; code: string; state?: string };
      user?: { name?: { firstName?: string; lastName?: string }; email?: string };
    }>;
  };
};

declare global {
  interface Window {
    AppleID?: AppleIDNamespace;
  }
}

export function AuthForm({ mode = "login" }: { mode?: "login" | "signup" }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [sentToEmail, setSentToEmail] = useState("");
  const router = useRouter();
  const { applySignIn } = useAuth();
  const appleReady = useRef(false);

  const routeAfterSignIn = useCallback(
    (response: SignInResponse) => {
      applySignIn(response);
      router.push(nextOnboardingStep(response.profile));
    },
    [applySignIn, router],
  );

  const initApple = useCallback(() => {
    if (appleReady.current) return;
    if (typeof window === "undefined" || !window.AppleID) return;
    window.AppleID.auth.init({
      clientId: APPLE_SERVICE_ID,
      scope: "name email",
      redirectURI: APPLE_REDIRECT_URI,
      usePopup: true,
    });
    appleReady.current = true;
  }, []);

  useEffect(() => {
    if (isAppleConfigured) initApple();
  }, [initApple]);

  const isLoading =
    status === "google-loading" ||
    status === "apple-loading" ||
    status === "email-loading";

  const handleGoogleIdToken = useCallback(
    async (idToken: string) => {
      setStatus("google-loading");
      setErrorMessage("");
      try {
        const response = await signInWithGoogle({ idToken });
        routeAfterSignIn(response);
      } catch (err) {
        setStatus("error");
        if (isAccountDeletedError(err)) {
          setErrorMessage(ACCOUNT_DELETED_MESSAGE);
        } else {
          setErrorMessage(
            err instanceof ApiError
              ? "Google sign-in failed. Please try again."
              : "Couldn’t reach the server. Check your connection and try again.",
          );
        }
      }
    },
    [routeAfterSignIn],
  );

  async function handleAppleClick() {
    if (!isAppleConfigured) {
      setStatus("error");
      setErrorMessage(
        "Apple sign-in isn’t configured. Set NEXT_PUBLIC_APPLE_SERVICE_ID in .env.local and restart the dev server.",
      );
      return;
    }
    if (!isAppleAllowedOnHost()) {
      setStatus("error");
      setErrorMessage(
        "Apple sign-in isn’t available on this domain. Use Google or magic link instead.",
      );
      return;
    }
    initApple();
    if (typeof window === "undefined" || !window.AppleID) {
      setStatus("error");
      setErrorMessage("Apple sign-in is still loading. Try again in a moment.");
      return;
    }
    setStatus("apple-loading");
    setErrorMessage("");
    try {
      const result = await window.AppleID.auth.signIn();
      const appleUser: AppleUserInfo | undefined = result.user?.name
        ? {
            first_name: result.user.name.firstName,
            last_name: result.user.name.lastName,
          }
        : undefined;
      const response = await signInWithApple({
        idToken: result.authorization.id_token,
        user: appleUser,
      });
      routeAfterSignIn(response);
    } catch (err) {
      // Apple errors on unregistered origins (e.g. localhost) — surface a
      // friendly message instead of silently returning to idle.
      const message = err instanceof Error ? err.message : String(err);
      console.error("[apple-signin]", err);
      if (isAccountDeletedError(err)) {
        setStatus("error");
        setErrorMessage(ACCOUNT_DELETED_MESSAGE);
      } else if (err instanceof ApiError) {
        setStatus("error");
        setErrorMessage("Apple sign-in failed. Please try again.");
      } else if (message.includes("popup_closed_by_user") || message.includes("user_cancelled_authorize")) {
        setStatus("idle");
      } else {
        setStatus("error");
        setErrorMessage(
          "Apple sign-in failed. Please try again or use Google / magic link instead.",
        );
      }
    }
  }

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
      await requestMagicLink(trimmed);
      setSentToEmail(trimmed);
      setStatus("email-sent");
    } catch (err) {
      setStatus("error");
      if (isAccountDeletedError(err)) {
        setErrorMessage(ACCOUNT_DELETED_MESSAGE);
      } else {
        setErrorMessage("We couldn’t send your link. Please try again.");
      }
    }
  }

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
      {isAppleConfigured ? (
        <Script src={APPLE_SDK_SRC} strategy="afterInteractive" onLoad={initApple} />
      ) : null}

      {/* Google — our styled button overlays the real Google button which
          catches the click, opens Google's popup, and returns the id_token. */}
      {isGoogleAuthConfigured ? (
        <div className="relative min-h-12 w-full">
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-[#1E1B4B] shadow-[0_2px_6px_rgba(15,13,41,0.04)]",
              isLoading && "opacity-50",
            )}
          >
            <GoogleIcon />
            {status === "google-loading"
              ? "Signing in…"
              : mode === "signup"
                ? "Sign up with Google"
                : "Continue with Google"}
          </div>
          <div
            className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-0"
            style={{ colorScheme: "light" }}
          >
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                if (credentialResponse.credential) {
                  void handleGoogleIdToken(credentialResponse.credential);
                } else {
                  setStatus("error");
                  setErrorMessage("Google didn’t return a credential. Try again.");
                }
              }}
              onError={() => {
                setStatus("error");
                setErrorMessage("Google sign-in was cancelled.");
              }}
              text={mode === "signup" ? "signup_with" : "continue_with"}
              shape="rectangular"
              theme="outline"
              size="large"
              width="400"
              logo_alignment="left"
            />
          </div>
        </div>
      ) : (
        <button
          className="flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-[#1E1B4B] shadow-[0_2px_6px_rgba(15,13,41,0.04)] transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
          disabled={isLoading}
          onClick={() => {
            setStatus("error");
            setErrorMessage(
              "Google sign-in isn’t configured. Set NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID in .env.local and restart the dev server.",
            );
          }}
          type="button"
        >
          <GoogleIcon />
          Continue with Google
        </button>
      )}

      {/* Apple */}
      <button
        className="mt-3 flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl bg-[#0F0F10] px-5 py-3 text-sm font-black text-white shadow-[0_8px_20px_rgba(15,15,16,0.18)] transition hover:bg-[#1E1B4B] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#0F0F10]/25 disabled:opacity-50"
        disabled={isLoading}
        onClick={handleAppleClick}
        type="button"
      >
        <AppleIcon />
        {status === "apple-loading" ? "Signing in…" : "Continue with Apple"}
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
            className="min-h-13 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#1E1B4B] shadow-[0_2px_6px_rgba(15,13,41,0.04)] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#312E81] focus:ring-4 focus:ring-[#312E81]/12 disabled:opacity-50"
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
          className="mt-3 flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#FACC15] px-5 py-3 text-sm font-black text-[#1E1B4B] shadow-[0_10px_28px_rgba(250,204,21,0.32)] transition hover:-translate-y-0.5 hover:bg-[#312E81] hover:text-white hover:shadow-[0_16px_36px_rgba(30,27,75,0.28)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FACC15]/30 disabled:pointer-events-none disabled:opacity-50"
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
