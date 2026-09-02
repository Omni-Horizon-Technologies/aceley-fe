"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Icon, PrimaryButton, cn } from "@/app/components/ui";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

type Status = "idle" | "loading" | "sent" | "error";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) {
      setStatus("error");
      setErrorMessage("Enter a valid email address.");
      return;
    }
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/email/request-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      if (res.status !== 202 && !res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }
      setStatus("sent");
    } catch {
      setStatus("error");
      setErrorMessage("We couldn't send your link. Please try again.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-10">
      <div className="w-full max-w-sm">
        {status === "sent" ? (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-lg shadow-[#1E1B4B]/8">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-600">
              <Icon name="mail" />
            </span>
            <h1 className="mt-4 text-2xl font-black tracking-tight text-[#1E1B4B]">
              Check your email
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              We sent a sign-in link to{" "}
              <span className="font-semibold text-[#1E1B4B]">{email.trim()}</span>.
              Open it on this device to continue.
            </p>
            <button
              className="mt-6 text-sm font-semibold text-[#312E81] hover:text-[#CA8A04]"
              onClick={() => {
                setStatus("idle");
                setErrorMessage("");
              }}
              type="button"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-center text-2xl font-black tracking-tight text-[#1E1B4B]">
              Sign in to Aceley
            </h1>
            <p className="mt-2 text-center text-sm text-slate-500">
              Enter your email and we&apos;ll send you a magic link.
            </p>

            <form
              className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-lg shadow-[#1E1B4B]/8 sm:p-6"
              onSubmit={handleSubmit}
              noValidate
            >
              <label className="block">
                <span className="text-sm font-semibold text-[#1E1B4B]">Email</span>
                <input
                  autoComplete="email"
                  className="mt-2 min-h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-[#1E1B4B] outline-none transition placeholder:text-slate-400 focus:border-[#312E81] focus:ring-4 focus:ring-[#312E81]/10"
                  disabled={status === "loading"}
                  inputMode="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@school.edu"
                  required
                  type="email"
                  value={email}
                />
              </label>

              <PrimaryButton
                className="mt-5 w-full"
                disabled={status === "loading"}
                type="submit"
              >
                {status === "loading" ? "Sending link..." : "Send magic link"}
              </PrimaryButton>

              <p
                aria-live="polite"
                className={cn(
                  "mt-4 rounded-lg px-3 py-2 text-sm leading-6",
                  status === "error" && "bg-[#FACC15]/10 text-[#CA8A04]",
                  status !== "error" && "bg-[#F8FAFC] text-slate-600",
                )}
              >
                {status === "error"
                  ? errorMessage
                  : "We'll email you a one-tap sign-in link. No password needed."}
              </p>
            </form>
          </>
        )}

        <div className="mt-8 text-center">
          <Link
            className="text-xs font-semibold text-slate-400 transition hover:text-slate-600"
            href="/"
          >
            &larr; Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
