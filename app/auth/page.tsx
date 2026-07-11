"use client";

import Link from "next/link";
import { AuthForm } from "@/app/components/auth-form";
import { Icon, PrimaryButton } from "@/app/components/ui";
import { useAppState } from "@/lib/state";
import { useAuth } from "@/lib/auth";

export default function AuthPage() {
  const { hydrated, onboarded } = useAppState();
  const { isAuthenticated } = useAuth();
  const isLoggedIn = hydrated && onboarded && isAuthenticated;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-10">
      <div className="w-full max-w-sm">
        {!hydrated ? (
          <div className="h-48 animate-pulse rounded-xl bg-slate-100" />
        ) : isLoggedIn ? (
          <div className="text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-600">
              <Icon name="check" />
            </span>
            <h1 className="mt-4 text-2xl font-black tracking-tight text-[#1E1B4B]">You&apos;re signed in</h1>
            <p className="mt-2 text-sm text-slate-500">Continue to your study workspace.</p>
            <PrimaryButton href="/home" className="mt-6 w-full">
              Open app
            </PrimaryButton>
          </div>
        ) : (
          <>
            <h1 className="text-center text-3xl font-black tracking-tight text-[#1E1B4B]">Welcome back</h1>
            <p className="mx-auto mt-2 max-w-xs text-center text-sm font-semibold text-slate-500">
              Pick up your streak and finish exam prep faster.
            </p>
            <div className="mt-6">
              <AuthForm />
            </div>
            <p className="mt-5 text-center text-sm font-semibold text-slate-500">
              Don&rsquo;t have an account?{" "}
              <Link className="font-black text-[#312E81] transition hover:text-[#CA8A04]" href="/sign-up">
                Sign up
              </Link>
            </p>
          </>
        )}

        <div className="mt-8 text-center">
          <Link className="text-xs font-semibold text-slate-400 transition hover:text-slate-600" href="/">
            &larr; Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
