"use client";

import Link from "next/link";
import { AuthForm } from "@/app/components/auth-form";
import { AceleyAPlusIcon } from "@/app/components/icons/icons";
import { LottieMascot } from "@/app/components/lottie-mascot";
import { Icon, PrimaryButton } from "@/app/components/ui";
import { useAppState } from "@/lib/state";
import { useAuth } from "@/lib/auth";

const SIGN_IN_PARTICLES: Array<{ left: number; dur: number; delay: number; color: string }> = [
  { left: 8, dur: 18, delay: 0, color: "rgba(250,204,21,0.5)" },
  { left: 22, dur: 12, delay: 6, color: "rgba(147,51,234,0.4)" },
  { left: 31, dur: 20, delay: 1, color: "rgba(250,204,21,0.4)" },
  { left: 42, dur: 16, delay: 8, color: "rgba(236,72,153,0.4)" },
  { left: 53, dur: 22, delay: 4, color: "rgba(67,56,202,0.4)" },
  { left: 62, dur: 14, delay: 10, color: "rgba(250,204,21,0.5)" },
  { left: 71, dur: 18, delay: 2, color: "rgba(147,51,234,0.4)" },
  { left: 82, dur: 16, delay: 7, color: "rgba(236,72,153,0.35)" },
  { left: 91, dur: 20, delay: 5, color: "rgba(67,56,202,0.4)" },
];

export default function SignInPage() {
  const { hydrated, onboarded } = useAppState();
  const { isAuthenticated } = useAuth();
  const isLoggedIn = hydrated && onboarded && isAuthenticated;

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-white text-[#1E1B4B]">
      {/* Rotating conic-gradient beam */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[1200px] w-[1200px] rounded-full opacity-70 [animation:ace-conic-spin_60s_linear_infinite]"
        style={{
          filter: "blur(52px)",
          background:
            "conic-gradient(from 0deg, transparent 0deg, rgba(250,204,21,0.22) 40deg, transparent 90deg, rgba(67,56,202,0.22) 160deg, transparent 210deg, rgba(236,72,153,0.18) 260deg, transparent 300deg, rgba(147,51,234,0.20) 340deg, transparent 360deg)",
          WebkitMaskImage: "radial-gradient(circle, #000 30%, transparent 70%)",
          maskImage: "radial-gradient(circle, #000 30%, transparent 70%)",
        }}
      />

      {/* Aurora blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[-160px] right-[-120px] h-[440px] w-[440px] rounded-full [animation:ace-blob-drift-a_18s_ease-in-out_infinite]"
        style={{
          background: "radial-gradient(circle, rgba(250,204,21,0.42), transparent 60%)",
          filter: "blur(60px)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-180px] left-[-140px] h-[460px] w-[460px] rounded-full [animation:ace-blob-drift-b_22s_ease-in-out_infinite]"
        style={{
          background: "radial-gradient(circle, rgba(67,56,202,0.35), transparent 60%)",
          filter: "blur(64px)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[35%] right-[-80px] h-[300px] w-[300px] rounded-full [animation:ace-blob-drift-c_20s_ease-in-out_infinite]"
        style={{
          background: "radial-gradient(circle, rgba(147,51,234,0.24), transparent 62%)",
          filter: "blur(56px)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[10%] right-[-100px] h-[280px] w-[280px] rounded-full [animation:ace-blob-drift-d_24s_ease-in-out_infinite]"
        style={{
          background: "radial-gradient(circle, rgba(236,72,153,0.20), transparent 62%)",
          filter: "blur(54px)",
        }}
      />

      {/* Drifting dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [animation:ace-grid-drift_10s_linear_infinite]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(30,27,75,0.08) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 40% at 50% 40%, transparent 40%, #000 75%)",
          maskImage:
            "radial-gradient(ellipse 60% 40% at 50% 40%, transparent 40%, #000 75%)",
        }}
      />

      {/* Floating particles */}
      {SIGN_IN_PARTICLES.map((p, i) => (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute h-1 w-1 rounded-full"
          key={i}
          style={{
            left: `${p.left}%`,
            bottom: "-12px",
            background: p.color,
            animation: `ace-particle-rise ${p.dur}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      <div className="relative flex min-h-[100dvh] items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm [animation:ace-rise_0.4s_ease-out_both]">
          {!hydrated ? (
            <div className="h-48 animate-pulse rounded-3xl bg-slate-100" />
          ) : isLoggedIn ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-[0_20px_50px_rgba(30,27,75,0.10)]">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                <Icon name="check" />
              </span>
              <h1 className="mt-4 text-2xl font-black tracking-tight text-[#1E1B4B]">You&apos;re signed in</h1>
              <p className="mt-2 text-sm text-slate-500">Continue to your study workspace.</p>
              <PrimaryButton href="/home" className="mt-6 w-full !rounded-2xl">
                Open app
              </PrimaryButton>
            </div>
          ) : (
            <>
              <div className="mx-auto flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
                <LottieMascot name="mascot_Hi" className="h-full w-full" sizeLabel="Aceley waving mascot" />
              </div>
              <h1 className="mt-2 text-center text-3xl font-black tracking-tight text-[#1E1B4B]">Welcome back</h1>
              <p className="mx-auto mt-2 max-w-xs text-center text-sm font-semibold text-slate-500">
                Pick up your streak and finish exam prep faster.
              </p>
              <div className="relative mt-10">
                <AceleyAPlusIcon
                  className="pointer-events-none absolute -top-14 -right-16 z-[3] h-20 w-20 text-[#ff604b] drop-shadow-[0_12px_28px_rgba(255,96,75,0.35)] sm:-top-16 sm:-right-24 sm:h-24 sm:w-24"
                />
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
            <Link
              className="text-xs font-semibold text-slate-400 transition hover:text-slate-600"
              href="/"
            >
              &larr; Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
