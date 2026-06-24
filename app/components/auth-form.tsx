"use client";

import { FormEvent, useMemo, useState } from "react";
import { Icon, PrimaryButton, SecondaryButton, cn } from "@/app/components/ui";

type SubmitState = "idle" | "loading" | "sent" | "error";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:8000";

function getRedirectUrl() {
  if (typeof window === "undefined") {
    return "/dashboard";
  }

  return `${window.location.origin}/dashboard`;
}

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>("idle");

  const message = useMemo(() => {
    if (state === "sent") {
      return "Magic link sent. Check your inbox to continue.";
    }

    if (state === "error") {
      return "Could not send the link. Check your API URL and try again.";
    }

    return "Use your school email or continue with Google.";
  }, [state]);

  async function handleMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");

    try {
      const response = await fetch(`${apiBaseUrl}/auth/magic-link`, {
        body: JSON.stringify({
          email,
          redirect_url: getRedirectUrl(),
        }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Magic link request failed");
      }

      setState("sent");
    } catch {
      setState("error");
    }
  }

  function handleGoogleAuth() {
    const url = new URL(`${apiBaseUrl}/auth/google`);

    url.searchParams.set("redirect_uri", getRedirectUrl());
    window.location.href = url.toString();
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-lg shadow-[#1E1B4B]/8 sm:p-6">
      <button
        className="flex min-h-12 w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-black text-[#1E1B4B] shadow-sm transition hover:border-[#FACC15]/60 hover:text-[#CA8A04] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FACC15]/20"
        onClick={handleGoogleAuth}
        type="button"
      >
        <Icon name="google" />
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        or
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <form className="space-y-4" onSubmit={handleMagicLink}>
        <label className="block" htmlFor="email">
          <span className="text-sm font-semibold text-[#1E1B4B]">
            Email address
          </span>
          <div className="mt-2 flex min-h-12 items-center rounded-lg border border-slate-200 bg-white px-4 transition focus-within:border-[#312E81] focus-within:ring-4 focus-within:ring-[#312E81]/10">
            <Icon name="mail" className="mr-3 h-4 w-4 text-slate-400" />
            <input
              autoComplete="email"
              className="h-full min-h-12 flex-1 bg-transparent text-sm text-[#1E1B4B] outline-none placeholder:text-slate-400"
              id="email"
              onChange={(event) => {
                setEmail(event.target.value);
                if (state !== "idle") {
                  setState("idle");
                }
              }}
              placeholder="maya@student.edu"
              required
              type="email"
              value={email}
            />
          </div>
        </label>

        <PrimaryButton
          className="w-full"
          disabled={state === "loading"}
          type="submit"
        >
          <Icon name={state === "sent" ? "check" : "mail"} />
          {state === "loading" ? "Sending link..." : "Send Magic Link"}
        </PrimaryButton>
      </form>

      <p
        aria-live="polite"
        className={cn(
          "mt-4 rounded-lg px-3 py-2 text-sm leading-6",
          state === "sent" && "bg-emerald-50 text-emerald-700",
          state === "error" && "bg-[#FACC15]/10 text-[#CA8A04]",
          state === "idle" && "bg-[#F8FAFC] text-slate-600",
          state === "loading" && "bg-[#312E81]/10 text-[#312E81]",
        )}
      >
        {message}
      </p>

      <SecondaryButton href="/dashboard" className="mt-4 w-full">
        Continue to demo dashboard
      </SecondaryButton>
    </div>
  );
}
