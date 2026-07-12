"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
  type TouchEvent,
} from "react";
import { BackButton } from "@/app/components/back-button";
import { LottieMascot } from "@/app/components/lottie-mascot";
import {
  BrandMark,
  cn,
  Icon,
  PrimaryButton,
  ProgressBar,
  SecondaryButton,
} from "@/app/components/ui";
import {
  COUNTRIES,
  EXPLAIN_STYLES,
  FOCUS_AUDIO,
  FOCUS_PRESETS,
  MAJOR_SUGGESTIONS,
  PAYWALL_FEATURES,
  PAYWALL_PLANS,
  SOURCE_OPTIONS,
} from "@/lib/constants";
import {
  askQuestion,
  completePlanDay,
  createConversation,
  createPlan,
  explainTopic,
  fetchPlan,
  fetchPlans,
  fetchProgress,
  fetchSpaces,
  generateFlashcards,
  generateQuiz,
  generateStudyPack,
  recordStudySession,
  scanUpload,
  sendTutorMessage,
  submitQuiz,
  uploadFile,
  type BackendPlan,
  type BackendProgress,
  type BackendScanResult,
  type BackendSpace,
} from "@/lib/services";
import {
  daysUntil,
  planProgress,
  useAppState,
  type Plan,
  type ThemePreference,
} from "@/lib/state";
import { useAuth } from "@/lib/auth";
import { AuthForm } from "@/app/components/auth-form";
import { HydrationGate } from "@/app/components/hydration-gate";
import { completeOnboarding as completeOnboardingApi, patchProfile } from "@/services/modules/auth";
import {
  AppleBrandTile,
  FriendIcon,
  GoogleBrandTile,
  InstagramIcon,
  OtherSourceIcon,
  TikTokIcon,
  YoutubeIcon,
} from "@/app/components/icons/icons";
import { searchSchools } from "@/services/modules/identity";
import type { SchoolSearchResult } from "@/services/dtos/identity";
import { ApiError } from "@/services/apiClient";
import { useAuthStore } from "@/services/context/auth";
import type { ReferralSource } from "@/services/dtos/auth";

const inputClass =
  "min-h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-[#1E1B4B] outline-none transition placeholder:text-slate-400 focus:border-[#312E81] focus:ring-4 focus:ring-[#312E81]/10";
const textAreaClass =
  "min-h-36 w-full resize-y rounded-lg border border-slate-200 bg-white px-4 py-4 text-sm font-semibold leading-6 text-[#1E1B4B] outline-none transition placeholder:text-slate-400 focus:border-[#312E81] focus:ring-4 focus:ring-[#312E81]/10";
type FocusPreset = (typeof FOCUS_PRESETS)[number];
type FocusAudio = (typeof FOCUS_AUDIO)[number];

function dismissKeyboard() {
  if (typeof window === "undefined") {
    return;
  }

  if (window.matchMedia("(pointer: coarse)").matches) {
    (document.activeElement as HTMLElement | null)?.blur();
  }
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] ?? "A") + (parts[1]?.[0] ?? "");
}

function formatDate(value: string) {
  if (!value) {
    return "No date set";
  }

  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(`${value}T00:00:00`),
  );
}

function activePlan(plans: Plan[]) {
  return plans.find((plan) => plan.completedDays < plan.totalDays) ?? plans[0];
}


/**
 * Deterministic particle field for the onboarding background. Hand-tuned
 * positions/durations so the SSR + client output match, and the particles
 * feel organic instead of grid-aligned.
 */
const ONBOARDING_PARTICLES: Array<{ left: number; dur: number; delay: number; color: string }> = [
  { left: 6, dur: 14, delay: 0, color: "rgba(250,204,21,0.55)" },
  { left: 14, dur: 18, delay: 3, color: "rgba(67,56,202,0.45)" },
  { left: 22, dur: 12, delay: 6, color: "rgba(147,51,234,0.4)" },
  { left: 31, dur: 20, delay: 1, color: "rgba(250,204,21,0.4)" },
  { left: 42, dur: 16, delay: 8, color: "rgba(236,72,153,0.4)" },
  { left: 53, dur: 22, delay: 4, color: "rgba(67,56,202,0.4)" },
  { left: 62, dur: 14, delay: 10, color: "rgba(250,204,21,0.5)" },
  { left: 71, dur: 18, delay: 2, color: "rgba(147,51,234,0.4)" },
  { left: 82, dur: 16, delay: 7, color: "rgba(236,72,153,0.35)" },
  { left: 91, dur: 20, delay: 5, color: "rgba(67,56,202,0.4)" },
];

function OnboardingProgress({ current, total }: { current: number; total: number }) {
  return (
    <div
      aria-label={`Step ${current} of ${total}`}
      aria-valuemax={total}
      aria-valuemin={1}
      aria-valuenow={current}
      className="flex flex-1 items-center gap-1.5"
      role="progressbar"
    >
      {Array.from({ length: total }).map((_, index) => {
        const stepIndex = index + 1;
        const isDone = stepIndex < current;
        const isCurrent = stepIndex === current;
        return (
          <span
            key={index}
            className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200"
          >
            {isDone ? (
              <span className="absolute inset-0 rounded-full bg-[#1E1B4B]" />
            ) : null}
            {isCurrent ? (
              <>
                <span
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#312E81] to-[#1E1B4B] [animation:ace-fill-bar_0.7s_cubic-bezier(0.22,1,0.36,1)_both]"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent [animation:ace-bar-shimmer_2.4s_ease-in-out_infinite]"
                />
              </>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}

function OnboardingShell({
  children,
  step,
  totalSteps = 5,
  backHref,
}: {
  children: ReactNode;
  step?: number;
  totalSteps?: number;
  backHref?: string;
}) {
  return (
    <HydrationGate>
      <main className="relative min-h-[100dvh] overflow-hidden bg-white text-[#1E1B4B]">
        {/* Rotating conic-gradient beam — the "premium" background flourish */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 h-[1200px] w-[1200px] rounded-full opacity-70 [animation:ace-conic-spin_60s_linear_infinite]"
          style={{
            filter: "blur(52px)",
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(250,204,21,0.22) 40deg, transparent 90deg, rgba(67,56,202,0.22) 160deg, transparent 210deg, rgba(236,72,153,0.18) 260deg, transparent 300deg, rgba(147,51,234,0.20) 340deg, transparent 360deg)",
            WebkitMaskImage:
              "radial-gradient(circle, #000 30%, transparent 70%)",
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
        {/* Warm 4th blob (pink) — bottom-right, balances the palette */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[10%] right-[-100px] h-[280px] w-[280px] rounded-full [animation:ace-blob-drift-d_24s_ease-in-out_infinite]"
          style={{
            background: "radial-gradient(circle, rgba(236,72,153,0.20), transparent 62%)",
            filter: "blur(54px)",
          }}
        />

        {/* Drifting dot grid, masked to fade in around the edges */}
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

        {/* Floating particle field — tiny dots drifting upward */}
        {ONBOARDING_PARTICLES.map((p, i) => (
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

        <div className="relative mx-auto flex min-h-[100dvh] max-w-md flex-col px-5 pb-8 pt-5 sm:px-6">
          {backHref || step ? (
            <header className="flex items-center gap-4 pb-8">
              {backHref ? (
                <BackButton fallbackHref={backHref} />
              ) : (
                <span className="h-11 w-11 shrink-0" />
              )}
              {step ? (
                <>
                  <OnboardingProgress current={step} total={totalSteps} />
                  <span
                    aria-live="polite"
                    className="shrink-0 text-xs font-black tabular-nums text-slate-500"
                    key={step}
                    style={{ animation: "ace-rise 0.4s ease-out both" }}
                  >
                    {step}/{totalSteps}
                  </span>
                </>
              ) : null}
            </header>
          ) : null}
          <section className="flex flex-1 flex-col [animation:ace-rise_0.4s_ease-out_both]">
            {children}
          </section>
        </div>
      </main>
    </HydrationGate>
  );
}


function OnboardingHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      {eyebrow ? (
        <div className="inline-flex items-center gap-2 rounded-full bg-[#FACC15]/15 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-[#CA8A04]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FACC15]" />
          {eyebrow}
        </div>
      ) : null}
      <h1 className="mt-4 text-[36px] font-black leading-[1.02] tracking-[-0.02em] text-[#1E1B4B] sm:text-[40px]">
        {title}
      </h1>
      {description ? (
        <p className="mt-4 text-[16px] font-semibold leading-[1.55] text-slate-500">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function OnboardingCta({
  label,
  loadingLabel,
  disabled,
  loading,
  onClick,
  secondary,
}: {
  label: string;
  loadingLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
  secondary?: { label: string; onClick: () => void };
}) {
  return (
    <div className="sticky bottom-6 mt-auto flex flex-col gap-2 pt-8 pb-2 sm:bottom-10">
      <button
        className={cn(
          "group relative flex min-h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-full px-6 text-[15px] font-black text-white transition",
          "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1E1B4B]/20",
          "disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none",
          !(disabled || loading) &&
            "bg-gradient-to-r from-[#1E1B4B] to-[#312E81] shadow-[0_12px_30px_rgba(30,27,75,0.28)] hover:shadow-[0_18px_40px_rgba(30,27,75,0.35)]",
          (disabled || loading) && "bg-slate-200",
        )}
        disabled={disabled || loading}
        onClick={onClick}
        type="button"
      >
        <span className="relative z-[1] inline-flex items-center gap-2">
          {loading ? loadingLabel ?? "Saving…" : label}
          {!loading ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="transition group-hover:translate-x-0.5"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          ) : null}
        </span>
      </button>
      {secondary ? (
        <button
          className="min-h-11 text-sm font-black text-slate-500 transition hover:text-[#312E81]"
          onClick={secondary.onClick}
          type="button"
        >
          {secondary.label}
        </button>
      ) : null}
    </div>
  );
}

const OnboardingInputClass =
  "min-h-14 w-full rounded-2xl border-2 border-transparent bg-slate-50 px-5 text-[17px] font-bold text-[#1E1B4B] outline-none transition placeholder:text-slate-400 hover:bg-slate-100 focus:border-[#1E1B4B]/30 focus:bg-white focus:shadow-[0_0_0_6px_rgba(30,27,75,0.06)]";

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-rose-600">
      <span className="grid h-5 w-5 place-items-center rounded-full bg-rose-500 text-white">
        <Icon name="check" className="h-3 w-3" />
      </span>
      Verified Explanation
    </span>
  );
}

function HeroGradient({ eyebrow, title, children }: { eyebrow?: string; title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg bg-gradient-to-br from-[#312E81] to-[#1E1B4B] p-6 text-white shadow-sm">
      {eyebrow ? <p className="text-xs font-black uppercase tracking-[0.18em] text-[#FACC15]">{eyebrow}</p> : null}
      <h1 className="mt-2 text-3xl font-black tracking-tight">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-white/76">{children}</p>
    </section>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div>
      {eyebrow ? <p className="text-xs font-black uppercase tracking-[0.18em] text-[#CA8A04]">{eyebrow}</p> : null}
      <h1 className="mt-1 text-3xl font-black tracking-tight text-[#1E1B4B]">{title}</h1>
    </div>
  );
}

export function OnboardingProfileReadyPage() {
  return (
    <OnboardingShell>
      <div className="text-center">
        <h1 className="text-3xl font-black tracking-tight text-[#1E1B4B]">Welcome to Aceley</h1>
        <p className="mx-auto mt-2 max-w-xs text-center text-sm font-semibold text-slate-500">
          Snap notes, run flashcards, and ace exams faster.
        </p>
      </div>
      <div className="mt-6">
        <AuthForm mode="signup" />
      </div>
      <p className="mt-5 text-center text-xs leading-5 text-slate-500">
        By continuing, you accept Aceley&apos;s{" "}
        <span className="font-bold text-[#312E81]">Terms</span> /{" "}
        <span className="font-bold text-[#312E81]">Privacy</span>
      </p>
      <p className="mt-4 text-center text-sm font-semibold text-slate-500">
        Already have an account?{" "}
        <Link className="font-black text-[#312E81] transition hover:text-[#CA8A04]" href="/auth">
          Log in
        </Link>
      </p>
    </OnboardingShell>
  );
}

export function OnboardingNamePage() {
  const router = useRouter();
  const { answers, updateAnswers } = useAppState();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleContinue() {
    const nickname = answers.name.trim();
    if (!nickname) return;
    setSaving(true);
    setError("");
    try {
      const updated = await patchProfile({ nickname });
      useAuthStore.getState().updateProfile(updated);
      dismissKeyboard();
      router.push("/onboarding/about");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? "Couldn’t save your name. Try again."
          : "Network error. Try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <OnboardingShell backHref="/sign-up" step={1}>
      <OnboardingHeading
        eyebrow="Nice to meet you"
        title="What should we call you?"
        description="This is how Aceley will greet you every day."
      />
      <div className="mt-10">
        <input
          autoFocus
          className={OnboardingInputClass}
          disabled={saving}
          onChange={(event) => updateAnswers({ name: event.target.value })}
          onKeyDown={(event) => {
            if (event.key === "Enter" && answers.name.trim() && !saving) {
              void handleContinue();
            }
          }}
          placeholder="e.g. Maya"
          value={answers.name}
        />
        {error ? (
          <p className="mt-3 rounded-2xl bg-[#FACC15]/10 px-4 py-3 text-sm font-semibold text-[#CA8A04]">
            {error}
          </p>
        ) : null}
      </div>
      <OnboardingCta
        label="Continue"
        loading={saving}
        disabled={!answers.name.trim()}
        onClick={handleContinue}
      />
    </OnboardingShell>
  );
}

export function OnboardingAboutPage() {
  const router = useRouter();
  const { answers, updateAnswers } = useAppState();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const valid = answers.country.trim() && answers.age.trim();

  async function handleContinue() {
    if (!valid) return;
    const age = Number.parseInt(answers.age, 10);
    if (Number.isNaN(age)) {
      setError("Enter a valid age.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const updated = await patchProfile({
        country: answers.country.trim(),
        age,
      });
      useAuthStore.getState().updateProfile(updated);
      dismissKeyboard();
      router.push("/onboarding/school");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? "Couldn’t save. Try again."
          : "Network error. Try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <OnboardingShell backHref="/onboarding/name" step={2}>
      <OnboardingHeading
        eyebrow="A bit about you"
        title="Where are you studying?"
        description="Helps us surface classmates and study spaces near you."
      />
      <div className="mt-10 space-y-3">
        <button
          className={cn(
            OnboardingInputClass,
            "flex items-center justify-between text-left",
            !answers.country && "text-slate-400",
          )}
          disabled={saving}
          onClick={() => setOpen(true)}
          type="button"
        >
          <span className={cn(!answers.country && "font-semibold")}>
            {answers.country || "Choose your country"}
          </span>
          <Icon name="chevronRight" className="h-4 w-4 text-slate-400" />
        </button>
        <input
          className={OnboardingInputClass}
          disabled={saving}
          inputMode="numeric"
          maxLength={3}
          onChange={(event) => updateAnswers({ age: event.target.value.replace(/\D/g, "").slice(0, 3) })}
          onKeyDown={(event) => {
            if (event.key === "Enter" && valid && !saving) {
              void handleContinue();
            }
          }}
          placeholder="Your age"
          value={answers.age}
        />
        {error ? (
          <p className="rounded-2xl bg-[#FACC15]/10 px-4 py-3 text-sm font-semibold text-[#CA8A04]">
            {error}
          </p>
        ) : null}
      </div>
      <OnboardingCta
        label="Continue"
        loading={saving}
        disabled={!valid}
        onClick={handleContinue}
      />

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end bg-[#1E1B4B]/50 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="max-h-[80vh] w-full overflow-hidden rounded-t-3xl bg-white shadow-[0_-24px_60px_rgba(15,13,41,0.28)] [animation:ace-rise_0.28s_ease-out_both]">
            <div className="flex items-center justify-between px-5 py-4">
              <h2 className="text-lg font-black">Choose your country</h2>
              <button
                aria-label="Close"
                className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 transition hover:bg-slate-200"
                onClick={() => setOpen(false)}
                type="button"
              >
                <Icon name="x" className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[62vh] overflow-y-auto px-3 pb-6">
              {COUNTRIES.map((country) => {
                const selected = answers.country === country;
                return (
                  <button
                    className={cn(
                      "flex min-h-12 w-full items-center justify-between rounded-xl px-4 text-left text-[15px] font-bold transition",
                      selected ? "bg-[#1E1B4B] text-white" : "text-[#1E1B4B] hover:bg-slate-100",
                    )}
                    key={country}
                    onClick={() => {
                      updateAnswers({ country });
                      setOpen(false);
                    }}
                    type="button"
                  >
                    {country}
                    {selected ? <Icon name="check" className="h-4 w-4 text-[#FACC15]" /> : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </OnboardingShell>
  );
}

export function OnboardingSchoolPage() {
  const router = useRouter();
  const { answers, updateAnswers } = useAppState();
  const [query, setQuery] = useState(answers.school);
  const [manual, setManual] = useState(false);
  const [results, setResults] = useState<SchoolSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [schoolError, setSchoolError] = useState("");

  async function saveAndContinue() {
    const school = answers.school.trim();
    if (!school) return;
    setSaving(true);
    setSchoolError("");
    try {
      const updated = await patchProfile({
        school_name: school,
        school_country: answers.schoolCountry?.trim() || answers.country?.trim() || null,
      });
      useAuthStore.getState().updateProfile(updated);
      dismissKeyboard();
      router.push("/onboarding/major");
    } catch (err) {
      setSchoolError(
        err instanceof ApiError
          ? "Couldn’t save your school. Try again."
          : "Network error. Try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (manual || query.trim().length < 2 || answers.school === query) {
      return;
    }

    const country = answers.country && answers.country !== "Other" ? answers.country.trim() : "";
    if (!country) {
      // Backend requires a country. Nudge the user back if they skipped it.
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const data = await searchSchools(country, query.trim(), 25);
        if (!cancelled) setResults(data);
      } catch {
        if (!cancelled) setError("School search is unavailable right now.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [answers.country, answers.school, manual, query]);

  const canShowSchoolResults = !manual && query.trim().length >= 2 && answers.school !== query;

  return (
    <OnboardingShell backHref="/onboarding/about" step={3}>
      <OnboardingHeading
        eyebrow="Your school"
        title="Where do you study?"
        description="Search your university, or type it in manually."
      />
      <div className="mt-10 space-y-3">
        {answers.school && !manual ? (
          <div className="rounded-2xl bg-[#1E1B4B] p-5 text-white">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#FACC15]">Selected</p>
            <div className="mt-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black">{answers.school}</h2>
                <p className="mt-1 text-sm font-semibold text-white/60">
                  {answers.schoolCountry || answers.country}
                </p>
              </div>
              <button
                aria-label="Change school"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                onClick={() => {
                  updateAnswers({ school: "", schoolCountry: "" });
                  setQuery("");
                }}
                type="button"
              >
                <Icon name="x" className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <Icon name="search" className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className={cn(OnboardingInputClass, "pl-12")}
              onChange={(event) => {
                setQuery(event.target.value);
                if (manual) {
                  updateAnswers({ school: event.target.value, schoolCountry: answers.country });
                }
              }}
              placeholder={manual ? "Type your school" : "Search universities"}
              value={query}
            />
          </div>
        )}

        {loading && canShowSchoolResults ? (
          <p className="pt-1 text-sm font-semibold text-slate-500">Searching…</p>
        ) : null}
        {error ? (
          <div className="rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-800">
            {error} You can enter your school manually below.
          </div>
        ) : null}

        {!answers.school && !manual ? (
          <button
            className="text-sm font-black text-[#312E81] transition hover:text-[#CA8A04]"
            onClick={() => {
              setManual(true);
              updateAnswers({ school: query, schoolCountry: answers.country });
            }}
            type="button"
          >
            Can&apos;t find it? Type it manually
          </button>
        ) : null}

        {canShowSchoolResults && results.length ? (
          <div className="mt-2 max-h-72 space-y-2 overflow-y-auto pr-1">
            {results.map((school) => (
              <button
                className="flex w-full items-start gap-3 rounded-2xl bg-slate-50 p-4 text-left transition hover:bg-slate-100"
                key={`${school.name}-${school.country}`}
                onClick={() => {
                  updateAnswers({ school: school.name, schoolCountry: school.country });
                  setQuery(school.name);
                  dismissKeyboard();
                }}
                type="button"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#1E1B4B] text-[#FACC15]">
                  <Icon name="school" className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-[15px] font-black leading-tight">{school.name}</span>
                  <span className="mt-1 block text-xs font-bold text-slate-500">
                    {[school.country, school.domains[0]].filter(Boolean).join(" · ")}
                  </span>
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {schoolError ? (
        <p className="mt-3 rounded-2xl bg-[#FACC15]/10 px-4 py-3 text-sm font-semibold text-[#CA8A04]">
          {schoolError}
        </p>
      ) : null}
      <OnboardingCta
        label="Continue"
        loading={saving}
        disabled={!answers.school.trim()}
        onClick={saveAndContinue}
      />
    </OnboardingShell>
  );
}

export function OnboardingMajorPage() {
  const router = useRouter();
  const { answers, updateAnswers } = useAppState();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleContinue() {
    const major = answers.major.trim();
    if (!major) return;
    setSaving(true);
    setError("");
    try {
      const updated = await patchProfile({ major });
      useAuthStore.getState().updateProfile(updated);
      dismissKeyboard();
      router.push("/onboarding/source");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? "Couldn’t save your major. Try again."
          : "Network error. Try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <OnboardingShell backHref="/onboarding/school" step={4}>
      <OnboardingHeading
        eyebrow="Your major"
        title="What are you studying?"
        description="Pick a suggestion or type your own."
      />
      <div className="mt-10 space-y-4">
        <input
          autoCapitalize="words"
          className={OnboardingInputClass}
          disabled={saving}
          onChange={(event) => updateAnswers({ major: event.target.value })}
          placeholder="e.g. Computer Science"
          value={answers.major}
        />
        <div className="flex max-h-64 flex-wrap gap-2 overflow-y-auto pb-1">
          {MAJOR_SUGGESTIONS.map((major) => {
            const selected = answers.major === major;
            return (
              <button
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-bold transition",
                  selected
                    ? "bg-[#1E1B4B] text-white"
                    : "bg-slate-100 text-[#1E1B4B] hover:bg-slate-200",
                )}
                disabled={saving}
                key={major}
                onClick={() => updateAnswers({ major })}
                type="button"
              >
                {major}
              </button>
            );
          })}
        </div>
        {error ? (
          <p className="rounded-2xl bg-[#FACC15]/10 px-4 py-3 text-sm font-semibold text-[#CA8A04]">
            {error}
          </p>
        ) : null}
      </div>
      <OnboardingCta
        label="Continue"
        loading={saving}
        disabled={!answers.major.trim()}
        onClick={handleContinue}
        secondary={{ label: "Skip for now", onClick: () => router.push("/onboarding/source") }}
      />
    </OnboardingShell>
  );
}

const REFERRAL_ENUM: Record<string, ReferralSource> = {
  instagram: "instagram",
  tiktok: "tiktok",
  youtube: "youtube",
  google: "google",
  friend: "other",
  "app-store": "other",
  other: "other",
};

const SOURCE_BRAND_TILE: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  youtube: YoutubeIcon,
  google: GoogleBrandTile,
  "app-store": AppleBrandTile,
  friend: FriendIcon,
  other: OtherSourceIcon,
};

export function OnboardingSourcePage() {
  const router = useRouter();
  const { answers, updateAnswers, completeOnboarding } = useAppState();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selected = SOURCE_OPTIONS.find((s) => s.label === answers.source);

  async function handleContinue() {
    if (!selected) return;
    const referral_source = REFERRAL_ENUM[selected.id] ?? "other";
    const referral_other_text =
      referral_source === "other" ? selected.label : null;
    setSaving(true);
    setError("");
    try {
      const updated = await completeOnboardingApi({
        referral_source,
        referral_other_text,
      });
      useAuthStore.getState().updateProfile(updated);
      completeOnboarding();
      router.push("/paywall");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? "Couldn’t finish onboarding. Try again."
          : "Network error. Try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <OnboardingShell backHref="/onboarding/major" step={5}>
      <OnboardingHeading
        eyebrow="Last step"
        title="How did you hear about Aceley?"
        description="Helps us keep making the app better."
      />
      <div className="mt-10 space-y-2 pb-2">
        {SOURCE_OPTIONS.map((source) => {
          const active = answers.source === source.label;
          const BrandTile = SOURCE_BRAND_TILE[source.id];
          return (
            <button
              className={cn(
                "flex min-h-16 w-full items-center gap-4 rounded-2xl p-3.5 text-left transition",
                active ? "bg-[#1E1B4B] text-white" : "bg-slate-50 text-[#1E1B4B] hover:bg-slate-100",
              )}
              disabled={saving}
              key={source.id}
              onClick={() => updateAnswers({ source: source.label })}
              type="button"
            >
              {BrandTile ? (
                <BrandTile className="h-11 w-11 shrink-0" height={44} width={44} />
              ) : (
                <span
                  className={cn(
                    "grid h-11 w-11 shrink-0 place-items-center rounded-xl",
                    source.color,
                    source.id === "google" ? "text-[#1E1B4B] ring-1 ring-slate-200" : "text-white",
                  )}
                >
                  <Icon name={source.icon} className="h-4 w-4" />
                </span>
              )}
              <span className="flex-1 text-[15px] font-black">{source.label}</span>
              {active ? (
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[#FACC15] text-[#1E1B4B]">
                  <Icon name="check" className="h-3 w-3" />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      {error ? (
        <p className="rounded-2xl bg-[#FACC15]/10 px-4 py-3 text-sm font-semibold text-[#CA8A04]">
          {error}
        </p>
      ) : null}
      <OnboardingCta
        label="Finish"
        loadingLabel="Finishing…"
        loading={saving}
        disabled={!selected}
        onClick={handleContinue}
      />
    </OnboardingShell>
  );
}

export function PaywallPage() {
  const router = useRouter();
  const { hydrated, onboarded } = useAppState();
  const [selected, setSelected] = useState("yearly");
  const goHome = () => router.replace("/dashboard");

  return (
    <main className="fixed inset-0 z-50 flex items-end bg-[#1E1B4B]/45 text-[#1E1B4B]">
      <section className="paywall-panel flex max-h-[94vh] w-full flex-col rounded-t-lg bg-[#F8FAFC] shadow-2xl">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6">
          <BrandMark />
          <button
            aria-label="Close paywall"
            className="grid h-10 w-10 place-items-center rounded-lg bg-white shadow-sm"
            onClick={goHome}
            type="button"
          >
            <Icon name="x" className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-6 sm:px-6">
          <div className="mx-auto max-w-md">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#CA8A04]">Aceley Pro</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">Get exam-ready faster</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Unlimited answers, study packs, quizzes, and revision tools in one place.
            </p>
            <div className="mt-7 grid gap-3">
              {PAYWALL_PLANS.map((plan) => (
                <button
                  className={cn(
                    "relative rounded-lg border bg-white p-4 text-left shadow-sm transition",
                    selected === plan.id ? "border-[#312E81] ring-4 ring-[#312E81]/10" : "border-slate-200",
                  )}
                  key={plan.id}
                  onClick={() => setSelected(plan.id)}
                  type="button"
                >
                  {"badge" in plan && plan.badge ? (
                    <span className="absolute -top-3 right-4 rounded-lg bg-[#FACC15] px-3 py-1 text-xs font-black text-[#1E1B4B]">
                      {plan.badge}
                    </span>
                  ) : null}
                  <span className="flex items-center justify-between gap-3">
                    <span>
                      <span className="block font-black">{plan.label}</span>
                      <span className="mt-1 block text-xs font-semibold text-slate-500">{plan.cadence}</span>
                    </span>
                    <span className="text-xl font-black">{plan.price}</span>
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-8 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="grid grid-cols-[1fr_5rem_5rem] text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                <span>Feature</span>
                <span className="text-center">Free</span>
                <span className="rounded-t-lg bg-[#FEF3C7] py-2 text-center text-[#1E1B4B]">Pro</span>
              </div>
              {PAYWALL_FEATURES.map((feature) => (
                <div className="grid grid-cols-[1fr_5rem_5rem] items-center border-t border-slate-100 py-3 text-sm" key={feature}>
                  <span className="font-bold">{feature}</span>
                  <span className="text-center text-slate-400">-</span>
                  <span className="grid min-h-10 place-items-center bg-[#FEF3C7] font-black text-[#1E1B4B]">
                    <Icon name="check" className="h-4 w-4" />
                  </span>
                </div>
              ))}
              <div className="ml-auto h-3 w-20 rounded-b-lg bg-[#FEF3C7]" />
            </div>
          </div>
        </div>
        <footer className="sticky bottom-0 border-t border-slate-200 bg-white px-4 py-4 shadow-[0_-8px_24px_rgba(30,27,75,0.08)] sm:px-6">
          <div className="mx-auto max-w-md">
            <button className="min-h-12 w-full rounded-lg bg-[#FACC15] px-5 py-3 text-sm font-black text-[#1E1B4B] shadow-sm" type="button">
              Start your 7 day free trial
            </button>
            <button
              className="mt-3 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-black text-[#1E1B4B] shadow-sm transition hover:border-[#312E81]/30 hover:bg-slate-50"
              onClick={goHome}
              type="button"
            >
              Continue without Pro
            </button>
            {hydrated && !onboarded ? (
              <button
                className="mt-3 min-h-11 w-full rounded-lg bg-[#F8FAFC] px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-100 hover:text-[#312E81]"
                onClick={() => router.push("/auth")}
                type="button"
              >
                Already have an account? Log in
              </button>
            ) : null}
            <div className="mt-3 flex justify-center gap-4 text-xs font-bold text-slate-500">
              <span>Privacy</span>
              <span>Restore</span>
              <span>Terms</span>
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}

export function HomePage() {
  const router = useRouter();
  const state = useAppState();
  const { isAuthenticated, profile } = useAuth();
  const [backendPlans, setBackendPlans] = useState<BackendPlan[]>([]);
  const backendPlan = backendPlans.find((p) => p.status === "active") ?? backendPlans[0];
  const localPlan = activePlan(state.plans);
  const examDays = daysUntil(state.answers.examDate);
  const hasProgress = backendPlans.length || state.plans.length || state.savedQuizzes.length || state.askHistory.length || state.studySessions.length;

  useEffect(() => {
    fetchPlans()
      .then(setBackendPlans)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    if (!state.onboarded) {
      // Returning user with a backend profile — auto-mark onboarded
      if (isAuthenticated && profile) {
        state.completeOnboarding();
      } else if (!isAuthenticated) {
        router.replace("/sign-up");
      }
    }
  }, [router, state, isAuthenticated, profile]);

  const focus = backendPlan
    ? {
        overline: "TODAY'S FOCUS",
        title: backendPlan.subject,
        sub: `Day ${Math.min(backendPlan.completed_days + 1, backendPlan.total_days)} of ${backendPlan.total_days} · pick up where you left off`,
        icon: "target" as const,
        href: `/plan/${backendPlan.id}`,
      }
    : localPlan
      ? {
          overline: "TODAY'S FOCUS",
          title: localPlan.subject,
          sub: `Day ${Math.min(localPlan.completedDays + 1, localPlan.totalDays)} of ${localPlan.totalDays} · pick up where you left off`,
          icon: "target" as const,
          href: `/plan/${localPlan.id}`,
        }
    : state.answers.weakTopics[0]
      ? {
          overline: "WEAK SPOT",
          title: state.answers.weakTopics[0],
          sub: "A quick refresher to keep it fresh.",
          icon: "warning" as const,
          href: `/explain?topic=${encodeURIComponent(state.answers.weakTopics[0])}&style=lecturer`,
        }
      : {
          overline: "QUICK START",
          title: "Try a 15-min session",
          sub: "Quiet timer, ambient audio - start strong.",
          icon: "bolt" as const,
          href: "/focus",
        };

  const actions = [
    { title: "Start AI tutoring", sub: "Get guidance", href: "/tutor", image: "/3dicons-chat-bubble-dynamic-gradient.png" },
    { title: "Ace exams", sub: "Start test prep", href: "/test-prep", image: "/3dicons-target-dynamic-gradient.png" },
    { title: "Stay focused", sub: "Start session", href: "/focus", image: "/3dicons-rocket-dynamic-gradient.png" },
    { title: "Ask anything", sub: "Get answers", href: "/ask", image: "/3dicons-chat-text-dynamic-gradient.png" },
    { title: "Smart notes", sub: "Cop notes", href: "/study-pack", image: "/3dicons-copy-dynamic-gradient.png" },
    { title: "Scan to solve", sub: "Open camera", href: "/scan", image: "/3dicons-target-dynamic-gradient.png" },
  ];

  return (
      <div className="space-y-6">
        <button className="flex w-full items-center gap-4 text-left" onClick={() => router.push("/profile")} type="button">
          <LottieMascot className="h-[100px] w-[100px] shrink-0" name="mascot_Hi" />
          <span>
            <span className="block text-2xl font-black tracking-tight">Hi {state.answers.name || "there"}!</span>
            <span className="mt-1 block text-sm font-semibold text-slate-600">How can I help you get an A+?</span>
          </span>
        </button>
        <div className="flex flex-wrap gap-2">
          {state.streak > 0 ? (
            <span className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-black shadow-sm">
              <Icon name="flame" className="h-4 w-4 text-[#FACC15]" />
              {state.streak}-day streak
            </span>
          ) : null}
          {examDays !== null ? (
            <span className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-black shadow-sm">
              <Icon name="calendar" className="h-4 w-4 text-[#312E81]" />
              {examDays}d to {state.answers.exam || "exam"}
            </span>
          ) : null}
        </div>
        <Link className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm" href={focus.href}>
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-[#FACC15]/20 text-[#CA8A04]">
            <Icon name={focus.icon} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-black uppercase tracking-[0.16em] text-[#CA8A04]">{focus.overline}</span>
            <span className="mt-1 block truncate text-lg font-black">{focus.title}</span>
            <span className="mt-1 block text-sm font-semibold text-slate-500">{focus.sub}</span>
          </span>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-[#CA8A04] shadow-sm">
            <Icon name="chevronRight" className="h-4 w-4" />
          </span>
        </Link>
        <section className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Link className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#FACC15]/70" href={action.href} key={action.title}>
              <Image alt="" className="h-16 w-16 object-contain" height={64} src={action.image} width={64} />
              <h2 className="mt-3 text-sm font-black">{action.title}</h2>
              <p className="mt-1 text-xs font-semibold text-slate-500">{action.sub}</p>
            </Link>
          ))}
        </section>
        <Link className="block rounded-lg border border-slate-200 bg-white p-5 shadow-sm" href={hasProgress ? "/progress" : "/plan/new"}>
          {hasProgress ? (
            <>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#CA8A04]">Keep the progress going</p>
              {backendPlan ? (
                <div className="mt-3">
                  <div className="mb-2 flex justify-between text-sm font-bold">
                    <span>{backendPlan.subject}</span>
                    <span>{backendPlan.total_days ? Math.round((backendPlan.completed_days / backendPlan.total_days) * 100) : 0}%</span>
                  </div>
                  <ProgressBar value={backendPlan.total_days ? (backendPlan.completed_days / backendPlan.total_days) * 100 : 0} />
                </div>
              ) : (
                <p className="mt-3 text-sm font-semibold text-slate-600">
                  {state.savedQuizzes.length} quizzes · {state.askHistory.length} questions answered
                </p>
              )}
            </>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-lg font-black">Build your first plan</p>
                <p className="mt-1 text-sm font-semibold text-slate-500">Start with an exam date and a daily target.</p>
              </div>
              <span className="rounded-lg bg-[#FACC15] px-4 py-2 text-sm font-black text-[#1E1B4B]">Start</span>
            </div>
          )}
        </Link>
      </div>
  );
}

type ChatMessage = {
  id: string;
  role: "tutor" | "student";
  text: string;
};

/** Strip markdown bold/italic markers so chat text renders cleanly. */
function cleanMarkdown(raw: string): string {
  return raw
    .replace(/\*\*\*(.+?)\*\*\*/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/_(.+?)_/g, "$1");
}

export function TutorPage() {
  const { answers } = useAppState();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "seed",
      role: "tutor",
      text:
        "Hey 👋 I'm here to help you understand, not just answer. What are we working on right now — a topic, a question, or revision for a specific exam?",
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function send(value = text) {
    const clean = value.trim();
    if (!clean || sending) {
      return;
    }

    dismissKeyboard();
    setSending(true);
    setMessages((current) => [
      ...current,
      { id: `student-${Date.now()}`, role: "student", text: clean },
    ]);
    setText("");

    try {
      let convId = conversationId;
      if (!convId) {
        const conv = await createConversation(answers.subject || "General");
        convId = conv.id;
        setConversationId(convId);
      }
      const reply = await sendTutorMessage(convId!, clean);
      setMessages((current) => [
        ...current,
        { id: reply.id, role: "tutor", text: cleanMarkdown(reply.content) },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { id: `error-${Date.now()}`, role: "tutor", text: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
      <div className="flex min-h-[calc(100vh-11rem)] flex-col">
        <div className="flex items-center justify-between">
          <SectionTitle eyebrow="AI Tutor" title="Start AI tutoring" />
          <Link
            href="/tutor/history"
            className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200"
          >
            Chat History
          </Link>
        </div>
        <div className="mt-6 flex-1 space-y-4">
          {messages.map((message) => (
            <div className={cn("flex gap-3", message.role === "student" && "justify-end")} key={message.id}>
              {message.role === "tutor" ? (
                <img alt="" className="h-9 w-9 shrink-0 rounded-lg object-cover" src="/icons/icon-192.png" />
              ) : null}
              <div
                className={cn(
                  "max-w-[82%] whitespace-pre-line rounded-lg px-4 py-3 text-sm font-semibold leading-6 shadow-sm",
                  message.role === "tutor" ? "bg-white text-[#1E1B4B]" : "bg-[#312E81] text-white",
                )}
              >
                {message.text}
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#FACC15] text-sm font-black">A</span>
              <div className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-3 shadow-sm">
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
        <div className="sticky bottom-20 mt-6 rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
          <div className="mb-3 flex gap-2 overflow-x-auto">
            {["Explain a topic", "Help with a question", "Quiz me on something", "Build me a revision plan"].map((chip) => (
              <button
                className="shrink-0 rounded-lg bg-[#FEFCE8] px-3 py-2 text-xs font-black text-[#CA8A04] disabled:opacity-50"
                disabled={sending}
                key={chip}
                onClick={() => send(chip)}
                type="button"
              >
                {chip}
              </button>
            ))}
          </div>
          <div className="flex items-end gap-2">
            <button className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500" type="button">
              <Icon name="paperclip" className="h-4 w-4" />
            </button>
            <textarea
              className="min-h-11 flex-1 resize-none rounded-lg border border-slate-200 px-3 py-3 text-sm font-semibold outline-none focus:border-[#312E81]"
              onChange={(event) => setText(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your tutor..."
              rows={1}
              value={text}
            />
            <button
              className={cn(
                "grid h-11 w-11 shrink-0 place-items-center rounded-lg transition",
                sending ? "bg-slate-200 text-slate-400" : "bg-[#FACC15] text-[#1E1B4B]",
              )}
              disabled={sending}
              onClick={() => send()}
              type="button"
            >
              <Icon name="arrowUp" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
  );
}

export function AskPage() {
  const router = useRouter();
  const { askHistory, addAskHistory } = useAppState();
  const [subject, setSubject] = useState("Maths");
  const [question, setQuestion] = useState("");
  const subjects = ["Maths", "Biology", "Chemistry", "Physics", "English", "CS", "Economics"];

  function submit(event: FormEvent) {
    event.preventDefault();
    const clean = question.trim();
    if (!clean) {
      return;
    }

    addAskHistory({ question: clean, subject, verified: true });
    dismissKeyboard();
    router.push(`/ask/result?question=${encodeURIComponent(clean)}&subject=${encodeURIComponent(subject)}`);
  }

  return (
      <div className="space-y-6">
        <SectionTitle eyebrow="Homework Help" title="Ask Anything" />
        <HeroGradient title="Get a clean answer you can learn from.">
          Paste the question, pick a subject, and Aceley will turn it into a verified step-by-step explanation.
        </HeroGradient>
        <form className="space-y-5" onSubmit={submit}>
          <div className="flex gap-2 overflow-x-auto">
            {subjects.map((item) => (
              <button
                className={cn(
                  "shrink-0 rounded-lg border px-3 py-2 text-sm font-black",
                  subject === item ? "border-[#312E81] bg-[#312E81] text-white" : "border-slate-200 bg-white",
                )}
                key={item}
                onClick={() => setSubject(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
          <textarea
            className={textAreaClass}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Type your question..."
            value={question}
          />
          <div className="grid grid-cols-2 gap-3">
            {[
              ["camera", "Scan it"],
              ["upload", "Upload image"],
            ].map(([icon, label]) => (
              <button className="rounded-lg border border-dashed border-slate-300 bg-white p-5 text-center shadow-sm" key={label} type="button">
                <Icon name={icon as "camera" | "upload"} className="mx-auto text-[#312E81]" />
                <span className="mt-2 block text-sm font-black">{label}</span>
                <span className="mt-1 block text-xs font-semibold text-slate-500">PNG/JPG/PDF</span>
              </button>
            ))}
          </div>
          <PrimaryButton className="w-full" disabled={!question.trim()} type="submit">
            Get answer
          </PrimaryButton>
        </form>
        <section>
          <h2 className="text-lg font-black">Recent questions</h2>
          <div className="mt-3 space-y-2">
            {askHistory.slice(0, 10).length ? (
              askHistory.slice(0, 10).map((item) => (
                <Link
                  className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                  href={`/ask/result?question=${encodeURIComponent(item.question)}&subject=${encodeURIComponent(item.subject)}`}
                  key={item.id}
                >
                  <p className="line-clamp-2 text-sm font-bold">{item.question}</p>
                  <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-[#CA8A04]">{item.subject}</p>
                </Link>
              ))
            ) : (
              <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-500">No recent questions yet.</p>
            )}
          </div>
        </section>
      </div>
  );
}

export function AskResultPage({ question, subject }: { question: string; subject: string }) {
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { savedExplanations, saveExplanation, removeSavedExplanation } = useAppState();
  const id = `ask-${subject}-${question}`.slice(0, 90);
  const saved = savedExplanations.some((item) => item.id === id);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    askQuestion(question, subject)
      .then((data) => setAnswer(data.answer))
      .catch(() => setAnswer("Sorry, something went wrong. Please try again."))
      .finally(() => setLoading(false));
  }, [question, subject]);

  if (loading) {
    return (
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-sm font-black text-slate-400 animate-pulse">Thinking...</p>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <SectionTitle title="Step-by-step answer" />
          <button
            className={cn("grid h-11 w-11 place-items-center rounded-lg border shadow-sm", saved ? "border-[#FACC15] bg-[#FACC15]" : "border-slate-200 bg-white")}
            onClick={() =>
              saved
                ? removeSavedExplanation(id)
                : saveExplanation({ id, topic: question, style: "ask", preview: (answer || "").slice(0, 100) })
            }
            type="button"
          >
            <Icon name="bookmark" className="h-4 w-4" />
          </button>
        </div>
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Question</p>
          <h2 className="mt-2 text-lg font-black">{question || "How do I solve this?"}</h2>
          <span className="mt-4 inline-flex rounded-lg bg-[#312E81]/10 px-3 py-1 text-xs font-black text-[#312E81]">{subject || "General"}</span>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#CA8A04]">Answer</p>
          <p className="mt-3 whitespace-pre-line text-sm font-semibold leading-6">{answer}</p>
        </section>
        <div className="grid gap-3 sm:grid-cols-3">
          <PrimaryButton href="/quiz">Practice this question</PrimaryButton>
          <SecondaryButton href="/tutor">Ask follow-up</SecondaryButton>
          <SecondaryButton href="/flashcards">Make flashcards</SecondaryButton>
        </div>
      </div>
  );
}

function ResultBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#CA8A04]">{label}</p>
      <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">{children}</p>
    </div>
  );
}

export function ScanPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const upload = await uploadFile(file);
      // Navigate to result page with upload ID
      router.push(`/scan/result?uploadId=${upload.id}&filename=${encodeURIComponent(file.name)}`);
    } catch {
      setError("Failed to upload file. Please try again.");
      setUploading(false);
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
      <div className="flex min-h-[calc(100vh-12rem)] flex-col">
        <SectionTitle title="Scan to solve" />
        <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={onFileChange} />
        <div className="mt-8 flex flex-1 flex-col justify-center">
          {preview ? (
            <div className="relative min-h-[320px] overflow-hidden rounded-lg bg-[#111827] shadow-xl">
              <img src={preview} alt="Preview" className="h-full w-full object-contain" />
              {uploading && (
                <div className="absolute inset-0 grid place-items-center bg-black/60">
                  <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-[#FACC15]" />
                    <p className="mt-3 text-sm font-black text-[#FACC15]">Uploading...</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              className="relative min-h-[320px] cursor-pointer rounded-lg bg-[#111827] p-6 text-white shadow-xl transition hover:bg-[#1a2030]"
              onClick={() => fileRef.current?.click()}
            >
              <div className="absolute left-5 top-5 h-14 w-14 border-l-4 border-t-4 border-[#FACC15]" />
              <div className="absolute right-5 top-5 h-14 w-14 border-r-4 border-t-4 border-[#FACC15]" />
              <div className="absolute bottom-5 left-5 h-14 w-14 border-b-4 border-l-4 border-[#FACC15]" />
              <div className="absolute bottom-5 right-5 h-14 w-14 border-b-4 border-r-4 border-[#FACC15]" />
              <div className="grid h-full min-h-[260px] place-items-center text-center">
                <div>
                  <Icon name="upload" className="mx-auto h-8 w-8 text-[#FACC15]" />
                  <p className="mt-4 text-sm font-black uppercase tracking-[0.18em] text-[#FACC15]">
                    Tap to upload a photo or PDF
                  </p>
                  <p className="mt-2 text-xs text-white/50">Take a photo of your question, worksheet, or textbook page</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-center text-sm font-semibold text-red-600">{error}</p>
          )}

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              className="flex items-center justify-center gap-2 rounded-lg bg-[#FACC15] px-4 py-3 text-sm font-black text-[#1E1B4B] shadow-sm transition hover:bg-[#f5c518]"
              onClick={() => { fileRef.current?.setAttribute("capture", "environment"); fileRef.current?.click(); }}
              disabled={uploading}
              type="button"
            >
              <Icon name="camera" className="h-4 w-4" />
              Take Photo
            </button>
            <button
              className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-black text-[#1E1B4B] shadow-sm transition hover:bg-slate-50"
              onClick={() => { fileRef.current?.removeAttribute("capture"); fileRef.current?.click(); }}
              disabled={uploading}
              type="button"
            >
              <Icon name="file" className="h-4 w-4" />
              Choose File
            </button>
          </div>
        </div>
      </div>
  );
}

export function ScanResultPage() {
  const searchParams = useSearchParams();
  const uploadId = searchParams.get("uploadId");
  const filename = searchParams.get("filename") || "Uploaded file";

  const [result, setResult] = useState<BackendScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!uploadId) {
      setError("No file uploaded. Please scan a document first.");
      setLoading(false);
      return;
    }
    let cancelled = false;
    scanUpload(uploadId)
      .then((data) => { if (!cancelled) setResult(data); })
      .catch((err: Error) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [uploadId]);

  if (loading) {
    return (
        <div className="space-y-5">
          <SectionTitle title="Scanned answer" />
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#312E81]" />
            <p className="mt-4 text-sm font-black text-slate-500">Reading and analysing your document...</p>
          </div>
        </div>
    );
  }

  if (error || !result) {
    return (
        <div className="space-y-5">
          <SectionTitle title="Scanned answer" />
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-center">
            <p className="text-sm font-black text-red-700">{error || "Failed to process scan"}</p>
          </div>
          <SecondaryButton href="/scan">Try again</SecondaryButton>
        </div>
    );
  }

  return (
      <div className="space-y-5">
        <SectionTitle title="Scanned answer" />
        <VerifiedBadge />

        {/* OCR extracted text */}
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#CA8A04]">Extracted Text</p>
          <p className="mt-1 text-xs text-slate-400">from {filename} · {Math.round(result.ocr.confidence * 100)}% confidence</p>
          <p className="mt-3 max-h-48 overflow-y-auto text-sm font-semibold leading-6 whitespace-pre-wrap">{result.ocr.text || "No text detected"}</p>
        </section>

        {/* AI explanation */}
        <ResultBlock label="Explanation">{result.explanation}</ResultBlock>

        <div className="grid gap-3 sm:grid-cols-3">
          <PrimaryButton href={`/study-pack/result?uploadId=${uploadId}&filename=${encodeURIComponent(filename)}`}>
            Study Pack
          </PrimaryButton>
          <SecondaryButton href={`/quiz?topic=${encodeURIComponent(result.ocr.text.slice(0, 2000))}`}>
            Quiz me
          </SecondaryButton>
          <SecondaryButton href="/tutor">Ask follow-up</SecondaryButton>
        </div>
      </div>
  );
}

export function StudyPackPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [source, setSource] = useState("paste");
  const [notes, setNotes] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const sources = [
    ["paste", "Paste notes", "notes"],
    ["upload", "Upload file", "file"],
  ] as const;

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  }

  async function handleGenerate() {
    setError("");
    if (source === "paste") {
      const text = notes.trim();
      if (!text) { setError("Please paste your notes first."); return; }
      router.push(`/study-pack/result?source=${encodeURIComponent(text)}`);
    } else if (source === "upload") {
      if (!selectedFile) { setError("Please select a file to upload."); return; }
      setUploading(true);
      try {
        const upload = await uploadFile(selectedFile);
        router.push(`/study-pack/result?uploadId=${upload.id}&filename=${encodeURIComponent(selectedFile.name)}`);
      } catch {
        setError("Failed to upload file. Please try again.");
        setUploading(false);
      }
    }
  }

  return (
      <div className="space-y-6">
        <SectionTitle eyebrow="Notes → Study Pack" title="Turn anything into revision" />
        <input ref={fileRef} type="file" accept="image/*,application/pdf,.txt,.md" className="hidden" onChange={onFileChange} />
        <div className="grid grid-cols-2 gap-3">
          {sources.map(([id, label, icon]) => (
            <button
              className={cn(
                "rounded-lg border bg-white p-4 text-left shadow-sm",
                source === id ? "border-[#312E81] ring-4 ring-[#312E81]/10" : "border-slate-200",
              )}
              key={id}
              onClick={() => setSource(id)}
              type="button"
            >
              <Icon name={icon} className="text-[#312E81]" />
              <span className="mt-3 block text-sm font-black">{label}</span>
            </button>
          ))}
        </div>
        {source === "paste" ? (
          <textarea className={textAreaClass} onChange={(event) => setNotes(event.target.value)} placeholder="Paste your notes..." value={notes} />
        ) : (
          <div
            className="cursor-pointer rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm transition hover:border-[#312E81]/40"
            onClick={() => fileRef.current?.click()}
          >
            <Icon name="upload" className="mx-auto text-[#312E81]" />
            {selectedFile ? (
              <>
                <p className="mt-3 text-sm font-black">{selectedFile.name}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">{(selectedFile.size / 1024).toFixed(0)} KB · Tap to change</p>
              </>
            ) : (
              <>
                <p className="mt-3 text-sm font-black">Tap to select a file</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">PDF, image, or text file</p>
              </>
            )}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {["Summary", "Key points", "Flashcards", "Quiz", "Study guide", "Likely exam Qs"].map((chip) => (
            <span className="rounded-lg bg-[#FEFCE8] px-3 py-2 text-xs font-black text-[#CA8A04]" key={chip}>
              {chip}
            </span>
          ))}
        </div>
        {error && <p className="rounded-lg bg-red-50 p-3 text-center text-sm font-semibold text-red-600">{error}</p>}
        <button
          className="w-full rounded-lg bg-[#312E81] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#1E1B4B] disabled:opacity-50"
          onClick={handleGenerate}
          disabled={uploading}
          type="button"
        >
          {uploading ? "Uploading..." : "Generate Study Pack"}
        </button>
      </div>
  );
}

export function StudyPackResultPage({ source }: { source: string }) {
  const searchParams = useSearchParams();
  const uploadId = searchParams.get("uploadId");
  const filename = searchParams.get("filename") || source;

  const [summary, setSummary] = useState("");
  const [flashcards, setFlashcards] = useState<{ front: string; back: string }[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<{ question: string; options: string[]; correct_index: number; explanation: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("Summary");
  const tabs = ["Summary", "Flashcards", "Quiz"];

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        if (uploadId) {
          // Real upload → generate study pack via backend OCR + LLM
          const result = await generateStudyPack(uploadId, filename);
          if (!cancelled) {
            setSummary(result.summary);
            setFlashcards(result.flashcards);
            setQuizQuestions(result.quiz_questions);
          }
        } else {
          // Text-based fallback — use ask + flashcards endpoints
          const [askRes, fcRes] = await Promise.all([
            askQuestion(`Summarise the following topic in detail with key points: ${source}`),
            generateFlashcards(source, 8),
          ]);
          if (!cancelled) {
            setSummary(askRes.answer);
            setFlashcards(fcRes.cards);
          }
        }
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to generate study pack");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [source, uploadId, filename]);

  if (loading) {
    return (
        <div className="space-y-5">
          <SectionTitle title="Study pack" />
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#312E81]" />
            <p className="mt-4 text-sm font-black text-slate-500">
              {uploadId ? "Reading your document and generating study materials..." : "Generating your study pack..."}
            </p>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="space-y-5">
          <SectionTitle title="Study pack" />
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-center">
            <p className="text-sm font-black text-red-700">{error}</p>
          </div>
          <SecondaryButton href="/study-pack">Try again</SecondaryButton>
        </div>
    );
  }

  const activeTabs = quizQuestions.length > 0 ? tabs : tabs.filter((t) => t !== "Quiz");

  return (
      <div className="space-y-5">
        <SectionTitle title="Study pack" />
        <div className="grid grid-cols-3 gap-2">
          {[
            ["Flashcards", flashcards.length],
            ["Quiz Qs", quizQuestions.length],
            ["Source", (filename || source).slice(0, 16)],
          ].map(([label, value]) => (
            <div className="rounded-lg border border-slate-200 bg-white p-3 text-center shadow-sm" key={String(label)}>
              <p className="text-xl font-black">{value}</p>
              <p className="mt-1 text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">{label}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {activeTabs.map((item) => (
            <button
              className={cn("shrink-0 rounded-lg px-3 py-2 text-sm font-black", tab === item ? "bg-[#312E81] text-white" : "bg-white text-[#1E1B4B]")}
              key={item}
              onClick={() => setTab(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          {tab === "Summary" ? <p className="text-sm font-semibold leading-6 whitespace-pre-wrap">{summary}</p> : null}
          {tab === "Flashcards" ? (
            <div className="space-y-3">
              {flashcards.map((card, i) => (
                <div className="rounded-lg bg-[#F8FAFC] p-4" key={i}>
                  <p className="font-black">{card.front}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-600">{card.back}</p>
                </div>
              ))}
            </div>
          ) : null}
          {tab === "Quiz" ? (
            <div className="space-y-4">
              {quizQuestions.map((q, i) => (
                <div className="rounded-lg bg-[#F8FAFC] p-4" key={i}>
                  <p className="font-black">{i + 1}. {q.question}</p>
                  <div className="mt-2 space-y-1">
                    {q.options.map((opt, j) => (
                      <p key={j} className={cn("text-sm font-semibold", j === q.correct_index ? "text-emerald-600" : "text-slate-600")}>
                        {String.fromCharCode(65 + j)}. {opt} {j === q.correct_index ? " ✓" : ""}
                      </p>
                    ))}
                  </div>
                  {q.explanation && <p className="mt-2 text-xs text-slate-500">{q.explanation}</p>}
                </div>
              ))}
            </div>
          ) : null}
        </section>
      </div>
  );
}

export function TestPrepPage() {
  const exams = ["SAT", "ACT", "MCAT", "GRE", "GMAT", "JAMB", "WAEC", "A-Level", "IB", "NEET"];

  return (
      <div className="space-y-6">
        <HeroGradient title="Pick an exam. Walk in ready.">
          Build a prep track around your date, confidence level, and daily study time.
        </HeroGradient>
        <section>
          <h2 className="text-lg font-black">Your prep tracks</h2>
          <div className="mt-3 rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
            <Icon name="target" className="mx-auto text-[#312E81]" />
            <h3 className="mt-3 font-black">No prep tracks yet</h3>
            <p className="mt-2 text-sm font-semibold text-slate-500">Pick an exam below to create your first track.</p>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-black">Pick your exam</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {exams.map((exam) => (
              <Link className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-black shadow-sm" href={`/plan/new?exam=${encodeURIComponent(exam)}`} key={exam}>
                {exam}
              </Link>
            ))}
          </div>
        </section>
        <PrimaryButton href="/plan/new" className="w-full">Set up new prep track</PrimaryButton>
      </div>
  );
}

export function FocusPage() {
  const [preset, setPreset] = useState<FocusPreset>(FOCUS_PRESETS[0]);
  const [audio, setAudio] = useState<FocusAudio>(FOCUS_AUDIO[0]);

  return (
      <div className="space-y-6">
        <section className="rounded-lg bg-gradient-to-br from-[#312E81] to-[#1E1B4B] p-6 text-white shadow-sm">
          <div className="flex items-center justify-between gap-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#FACC15]">Focus Mode</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight">Breathe in. Breathe out.</h1>
              <p className="mt-3 text-sm leading-6 text-white/76">Choose a session, settle in, and let the timer do the keeping.</p>
            </div>
            <span className="pulse-circle h-24 w-24 shrink-0 rounded-full bg-[#FACC15]/80" />
          </div>
        </section>
        <section>
          <h2 className="text-lg font-black">Session length</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {FOCUS_PRESETS.map((item) => (
              <button
                className={cn("rounded-lg border bg-white p-4 text-left shadow-sm", preset.id === item.id ? "border-[#312E81] ring-4 ring-[#312E81]/10" : "border-slate-200")}
                key={item.id}
                onClick={() => setPreset(item)}
                type="button"
              >
                <p className="font-black">{item.label}</p>
                <p className="mt-1 text-sm font-semibold text-slate-500">{item.minutes}min</p>
              </button>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-lg font-black">Ambient audio</h2>
          <div className="mt-3 space-y-2">
            {FOCUS_AUDIO.map((item) => (
              <button
                className="flex min-h-12 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-4 text-left text-sm font-black shadow-sm"
                key={item.id}
                onClick={() => setAudio(item)}
                type="button"
              >
                {item.label}
                <span className={cn("h-4 w-4 rounded-full border", audio.id === item.id ? "border-[#312E81] bg-[#FACC15]" : "border-slate-300")} />
              </button>
            ))}
          </div>
        </section>
        <PrimaryButton
          className="w-full"
          href={`/focus/session?minutes=${preset.minutes}&preset=${encodeURIComponent(preset.label)}&audio=${encodeURIComponent(audio.label)}`}
        >
          Start {preset.minutes}-min session
        </PrimaryButton>
      </div>
  );
}

export function FocusSessionPage({
  minutes,
  preset,
  audio,
}: {
  minutes: number;
  preset: string;
  audio: string;
}) {
  const { recordSession } = useAppState();
  const initialSeconds = Math.max(1, minutes * 60);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(true);
  const recorded = useRef(false);

  useEffect(() => {
    if (!running || seconds <= 0) {
      return;
    }

    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [running, seconds]);

  useEffect(() => {
    if (seconds === 0 && !recorded.current) {
      recorded.current = true;
      recordSession({ minutes, preset, audio });
      recordStudySession({ minutes, preset, audio }).catch(() => {});
    }
  }, [audio, minutes, preset, recordSession, seconds]);

  const mm = Math.floor(seconds / 60).toString().padStart(2, "0");
  const ss = (seconds % 60).toString().padStart(2, "0");
  const progress = 100 - Math.round((seconds / initialSeconds) * 100);

  return (
      <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center text-center">
        <div className="timer-ring grid h-72 w-72 place-items-center rounded-full" style={{ "--timer-progress": `${progress}%` } as CSSProperties}>
          <div className="grid h-56 w-56 place-items-center rounded-full bg-white shadow-sm">
            <div>
              <p className="text-5xl font-black tracking-tight">{mm}:{ss}</p>
              <p className="mt-3 rounded-lg bg-[#FEFCE8] px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#CA8A04]">{audio}</p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-center gap-3">
          <button className="grid h-12 w-12 place-items-center rounded-lg bg-[#FACC15] text-[#1E1B4B]" onClick={() => setRunning((value) => !value)} type="button">
            <Icon name={running ? "pause" : "play"} />
          </button>
          <button
            className="grid h-12 w-12 place-items-center rounded-lg border border-slate-200 bg-white text-[#1E1B4B] shadow-sm"
            onClick={() => {
              setSeconds(initialSeconds);
              setRunning(false);
              recorded.current = false;
            }}
            type="button"
          >
            <Icon name="reset" />
          </button>
        </div>
      </div>
  );
}

export function CoachPage() {
  const { answers } = useAppState();
  const [backendPlans, setBackendPlans] = useState<BackendPlan[]>([]);
  const plan = backendPlans.find((p) => p.status === "active") ?? backendPlans[0] ?? null;

  useEffect(() => {
    fetchPlans().then(setBackendPlans).catch(() => {});
  }, []);

  const guideItems = [
    {
      icon: "target" as const,
      title: "Set the target",
      body: "Start with the subject, exam date, confidence, and time you can actually study each day.",
    },
    {
      icon: "upload" as const,
      title: "Add material",
      body: "Upload a syllabus, past paper, or notes so your sprint can follow the right topics.",
    },
    {
      icon: "flash" as const,
      title: "Work the sprint",
      body: "Each day becomes a short focus block with tasks and quick flashcards.",
    },
  ];

  return (
      <div className="space-y-6">
        <SectionTitle eyebrow="Coach" title="Your study plan" />
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-[#312E81] text-lg font-black text-white">
              C
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#CA8A04]">
                Study Coach
              </p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-[#1E1B4B]">
                {plan ? "Keep your sprint moving" : "Build a plan that fits your exam"}
              </h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                {plan
                  ? `Coach is tracking ${plan.subject} and keeping today focused.`
                  : "Coach turns your goal, time, and materials into a simple sprint you can follow."}
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link
              className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-4 shadow-sm transition hover:border-[#FACC15]/70"
              href="/plan/new"
            >
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#FACC15]/20 text-[#CA8A04]">
                <Icon name="create" />
              </span>
              <h3 className="mt-4 text-lg font-black text-[#1E1B4B]">Build a plan</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                Plan a new sprint around an upcoming exam or subject.
              </p>
            </Link>
            <Link
              className={cn(
                "rounded-lg border border-slate-200 bg-[#F8FAFC] p-4 shadow-sm transition",
                plan ? "hover:border-[#FACC15]/70" : "pointer-events-none opacity-70",
              )}
              href={plan ? `/plan/${plan.id}` : "/plan/new"}
            >
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#312E81]/10 text-[#312E81]">
                <Icon name="target" />
              </span>
              <h3 className="mt-4 text-lg font-black text-[#1E1B4B]">Active plan</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                {plan
                  ? `${plan.subject} · ${plan.completed_days}/${plan.total_days} days · ${plan.total_days ? Math.round((plan.completed_days / plan.total_days) * 100) : 0}% complete`
                  : "No active plan yet. Create one to start tracking."}
              </p>
            </Link>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#CA8A04]">
                How Aceley plans work
              </p>
              <h2 className="mt-1 text-xl font-black text-[#1E1B4B]">Short sprint, clear next step</h2>
            </div>
            <Link
              className="shrink-0 rounded-lg bg-[#FACC15] px-4 py-2 text-sm font-black text-[#1E1B4B] shadow-sm"
              href="/plan/new"
            >
              Create plan
            </Link>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {guideItems.map((item) => (
              <article className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-4" key={item.title}>
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#FACC15]/20 text-[#CA8A04]">
                  <Icon name={item.icon === "flash" ? "bolt" : item.icon} className="h-4 w-4" />
                </span>
                <h3 className="mt-4 text-sm font-black text-[#1E1B4B]">{item.title}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        {answers.major || answers.school ? (
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#CA8A04]">Profile context</p>
            <h2 className="mt-2 text-lg font-black text-[#1E1B4B]">
              {[answers.major, answers.school].filter(Boolean).join(" · ")}
            </h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
              Coach will use this context when you create your next sprint.
            </p>
          </section>
        ) : null}
      </div>
  );
}

export function PlansPage() {
  const [plans, setPlans] = useState<BackendPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchPlans()
      .then((data) => { if (!cancelled) setPlans(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
        <div className="space-y-6">
          <SectionTitle title="Study plans" />
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-black text-slate-500">Loading your plans...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <SectionTitle title="Study plans" />
          <PrimaryButton href="/plan/new">New</PrimaryButton>
        </div>
        {plans.length ? (
          <div className="space-y-3">
            {plans.map((plan) => {
              const progress = plan.total_days ? Math.round((plan.completed_days / plan.total_days) * 100) : 0;
              return (
                <Link className="block rounded-lg border border-slate-200 bg-white p-5 shadow-sm" href={`/plan/${plan.id}`} key={plan.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-black">{plan.subject}</h2>
                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        {plan.completed_days}/{plan.total_days} days{plan.exam_date ? ` · ${formatDate(plan.exam_date)}` : ""}
                      </p>
                    </div>
                    <span className="rounded-lg bg-[#FEFCE8] px-3 py-2 text-sm font-black text-[#CA8A04]">{progress}%</span>
                  </div>
                  <div className="mt-4">
                    <ProgressBar value={progress} />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
            <Icon name="target" className="mx-auto text-[#312E81]" />
            <h2 className="mt-3 text-lg font-black">No study plans yet</h2>
            <p className="mt-2 text-sm font-semibold text-slate-500">Create a plan around your exam date and daily target.</p>
            <PrimaryButton href="/plan/new" className="mt-5">Build your first plan</PrimaryButton>
          </div>
        )}
      </div>
  );
}

export function PlanNewPage({ exam = "" }: { exam?: string }) {
  const router = useRouter();
  const { addPlan, updateAnswers } = useAppState();
  const [subject, setSubject] = useState(exam || "Biology");
  const [examDate, setExamDate] = useState("");
  const [confidence, setConfidence] = useState("Medium");
  const [hoursPerDay, setHoursPerDay] = useState("1");
  const [documentName, setDocumentName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!subject.trim() || !examDate || creating) return;

    setCreating(true);
    setError("");
    try {
      const plan = await createPlan({
        subject: subject.trim(),
        topic: subject.trim(),
        exam_date: examDate,
        total_days: 14,
        confidence,
        hours_per_day: hoursPerDay,
      });
      // Also save locally for dashboard widgets
      addPlan({ subject: subject.trim(), examDate, confidence, hoursPerDay, totalDays: 14 });
      updateAnswers({ exam: exam || subject.trim(), examDate, hoursPerDay });
      dismissKeyboard();
      router.push(`/plan/${plan.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create plan");
      setCreating(false);
    }
  }

  return (
      <form className="space-y-5" onSubmit={submit}>
        <SectionTitle eyebrow="Create plan" title="Plan a new sprint" />
        <label className="block">
          <span className="text-sm font-black">Subject or exam</span>
          <input className={cn(inputClass, "mt-2")} onChange={(event) => setSubject(event.target.value)} value={subject} />
        </label>
        <label className="block">
          <span className="text-sm font-black">Exam date</span>
          <input className={cn(inputClass, "mt-2")} onChange={(event) => setExamDate(event.target.value)} type="date" value={examDate} />
        </label>
        <label className="block">
          <span className="text-sm font-black">Confidence</span>
          <select className={cn(inputClass, "mt-2")} onChange={(event) => setConfidence(event.target.value)} value={confidence}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-black">Hours/day</span>
          <input className={cn(inputClass, "mt-2")} inputMode="decimal" onChange={(event) => setHoursPerDay(event.target.value)} value={hoursPerDay} />
        </label>
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#CA8A04]">Sprint material</p>
              <h2 className="mt-1 text-lg font-black text-[#1E1B4B]">Upload document</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                Add a syllabus, past paper, notes, or screenshot so your sprint can follow the right material.
              </p>
            </div>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-[#FACC15]/20 text-[#CA8A04]">
              <Icon name="upload" />
            </span>
          </div>
          <label className="mt-4 flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-dashed border-slate-300 bg-[#F8FAFC] p-4 transition hover:border-[#FACC15]/70">
            <span>
              <span className="block text-sm font-black text-[#1E1B4B]">
                {documentName || "Choose document"}
              </span>
              <span className="mt-1 block text-xs font-semibold text-slate-500">
                PDF, DOC, DOCX, PNG, or JPG
              </span>
            </span>
            <span className="rounded-lg bg-white px-3 py-2 text-xs font-black text-[#312E81] shadow-sm">
              Browse
            </span>
            <input
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              className="sr-only"
              onChange={(event) => setDocumentName(event.target.files?.[0]?.name ?? "")}
              type="file"
            />
          </label>
        </section>
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-black text-red-700">{error}</p>}
        <PrimaryButton className="w-full" disabled={!subject.trim() || !examDate || creating} type="submit">
          {creating ? "Generating your plan..." : "Create plan"}
        </PrimaryButton>
      </form>
  );
}

export function PlanDetailPage({ id }: { id: string }) {
  const [plan, setPlan] = useState<BackendPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [day, setDay] = useState(1);
  const [showCards, setShowCards] = useState(false);
  const [flashcards, setFlashcards] = useState<{ front: string; back: string }[]>([]);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchPlan(id)
      .then((data) => { if (!cancelled) setPlan(data); })
      .catch((err: Error) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-black text-slate-500">Loading plan...</p>
        </div>
    );
  }

  if (error || !plan) {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-black">{error || "Plan not found"}</h1>
          <PrimaryButton href="/plan/new" className="mt-5">Create a plan</PrimaryButton>
        </div>
    );
  }

  const countdown = plan.exam_date ? daysUntil(plan.exam_date) : null;
  const dayData = plan.daily_tasks.find((t) => t.day === day);
  const tasks = dayData?.tasks ?? [];
  const dayFocus = dayData?.focus ?? plan.subject;

  function openDayCards(nextDay: number) {
    setDay(nextDay);
    setCardIndex(0);
    setCardFlipped(false);

    // Generate flashcards for this day's focus topic
    const focus = plan!.daily_tasks.find((t) => t.day === nextDay)?.focus ?? plan!.subject;
    setCardsLoading(true);
    setShowCards(true);
    generateFlashcards(`${plan!.subject}: ${focus}`, 5)
      .then((data) => setFlashcards(data.cards))
      .catch(() => setFlashcards([{ front: "Error generating cards", back: "Try again later" }]))
      .finally(() => setCardsLoading(false));
  }

  function movePlanCard(delta: number) {
    if (!flashcards.length) return;
    setCardIndex((value) => (value + delta + flashcards.length) % flashcards.length);
    setCardFlipped(false);
  }

  async function toggleDayComplete(targetDay: number) {
    const current = plan!.daily_tasks.find((t) => t.day === targetDay);
    const newCompleted = !(current?.completed);
    try {
      const updated = await completePlanDay(plan!.id, targetDay, newCompleted);
      setPlan(updated);
    } catch {
      // ignore
    }
  }

  const currentCard = flashcards[cardIndex];

  return (
    <>
      <div className="space-y-6">
        <section className="rounded-lg bg-gradient-to-br from-[#312E81] to-[#1E1B4B] p-6 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#FACC15]">{countdown ?? 0} days to exam</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">{plan.subject}</h1>
          {plan.exam_date && <p className="mt-3 text-sm font-semibold text-white/76">Exam date: {formatDate(plan.exam_date)}</p>}
        </section>
        <div className="flex gap-2 overflow-x-auto">
          {Array.from({ length: plan.total_days }, (_, index) => index + 1).map((item) => {
            const itemData = plan.daily_tasks.find((t) => t.day === item);
            const isDone = itemData?.completed ?? false;
            return (
              <button
                aria-pressed={day === item}
                className={cn(
                  "min-h-20 w-24 shrink-0 rounded-lg border p-3 text-left shadow-sm transition",
                  day === item
                    ? "border-[#FACC15] bg-[#FACC15] text-[#1E1B4B] shadow-md"
                    : isDone
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-500 hover:border-[#FACC15]/70 hover:text-[#1E1B4B]",
                )}
                key={item}
                onClick={() => { setDay(item); }}
                type="button"
              >
                <span className="block text-xs font-black uppercase tracking-[0.12em]">Day</span>
                <span className="mt-1 block text-2xl font-black">{item}</span>
                <span className="mt-1 block text-[11px] font-black uppercase tracking-[0.08em]">
                  {isDone ? "Done" : "Cards"}
                </span>
              </button>
            );
          })}
        </div>
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#CA8A04]">Day {day} — {dayFocus}</p>
          <h2 className="mt-2 text-xl font-black">Today&apos;s tasks</h2>
          <div className="mt-4 space-y-3">
            {tasks.length ? tasks.map((task: string) => (
              <label className="flex items-center gap-3 rounded-lg bg-[#F8FAFC] p-3 text-sm font-semibold" key={task}>
                <input
                  className="h-4 w-4 accent-[#FACC15]"
                  type="checkbox"
                  checked={dayData?.completed ?? false}
                  onChange={() => toggleDayComplete(day)}
                />
                {task}
              </label>
            )) : (
              <p className="text-sm font-semibold text-slate-500">No tasks for this day.</p>
            )}
          </div>
          <button
            className="mt-4 w-full rounded-lg border border-slate-200 bg-[#F8FAFC] px-4 py-3 text-sm font-black text-[#312E81] shadow-sm transition hover:border-[#FACC15]"
            onClick={() => openDayCards(day)}
            type="button"
          >
            Generate flashcards for Day {day}
          </button>
        </section>
      </div>

      {showCards ? (
        <div className="fixed inset-0 z-50 flex items-end bg-[#1E1B4B]/50 px-3 pb-3 sm:items-center sm:justify-center sm:p-6" role="dialog" aria-modal="true">
          <section className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-4 shadow-2xl sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#CA8A04]">
                  Day {day} Flashcards
                </p>
                <h2 className="mt-1 text-xl font-black text-[#1E1B4B]">{dayFocus}</h2>
              </div>
              <button
                aria-label="Close flashcards"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#F8FAFC] text-[#1E1B4B]"
                onClick={() => setShowCards(false)}
                type="button"
              >
                <Icon name="x" className="h-4 w-4" />
              </button>
            </div>
            {cardsLoading ? (
              <div className="mt-5 grid min-h-72 place-items-center rounded-lg border border-slate-200 bg-[#F8FAFC]">
                <p className="text-sm font-black text-slate-500">Generating flashcards...</p>
              </div>
            ) : currentCard ? (
              <>
                <button
                  aria-label={cardFlipped ? "Show flashcard front" : "Show flashcard back"}
                  className={cn(
                    "mt-5 min-h-72 w-full rounded-lg border p-6 text-center shadow-sm transition",
                    cardFlipped ? "border-[#FACC15] bg-[#FEFCE8]" : "border-slate-200 bg-[#F8FAFC]",
                  )}
                  onClick={() => setCardFlipped((value) => !value)}
                  type="button"
                >
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#CA8A04]">
                    {cardFlipped ? "Back" : "Front"} · {cardIndex + 1}/{flashcards.length}
                  </p>
                  <p className="mt-12 text-2xl font-black leading-tight text-[#1E1B4B]">
                    {cardFlipped ? currentCard.back : currentCard.front}
                  </p>
                </button>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <button
                    className="min-h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm font-black text-[#1E1B4B] shadow-sm"
                    onClick={() => movePlanCard(-1)}
                    type="button"
                  >
                    Prev
                  </button>
                  <button
                    className="min-h-11 rounded-lg bg-[#FACC15] px-3 text-sm font-black text-[#1E1B4B] shadow-sm"
                    onClick={() => setCardFlipped((value) => !value)}
                    type="button"
                  >
                    Flip
                  </button>
                  <button
                    className="min-h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm font-black text-[#1E1B4B] shadow-sm"
                    onClick={() => movePlanCard(1)}
                    type="button"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : null}
          </section>
        </div>
      ) : null}
    </>
  );
}

export function SpacesPage() {
  const { answers } = useAppState();
  const [spaces, setSpaces] = useState<BackendSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchSpaces()
      .then((data) => { if (!cancelled) setSpaces(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filtered = spaces.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
      <div className="space-y-6">
        <SectionTitle title="Class spaces" />
        {answers.major ? (
          <section className="rounded-lg bg-[#1E1B4B] p-5 text-white shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#FACC15]">Your Major</p>
            <div className="mt-3 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black">{answers.major}</h2>
                <p className="mt-1 text-sm font-semibold text-white/70">{answers.school || "School not set"}</p>
              </div>
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-[#FACC15] text-[#1E1B4B]">
                <Icon name="school" />
              </span>
            </div>
          </section>
        ) : null}
        <input className={inputClass} onChange={(event) => setSearch(event.target.value)} placeholder="Search spaces" value={search} />
        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-black text-slate-500">Loading spaces...</p>
          </div>
        ) : filtered.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {filtered.map((space) => (
              <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" key={space.id}>
                <span className="rounded-lg bg-[#312E81] px-3 py-2 text-sm font-black text-white">{space.space_type}</span>
                <h3 className="mt-4 text-lg font-black">{space.name}</h3>
                {space.description && <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{space.description}</p>}
                <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-slate-400">{space.member_count} members</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
            <Icon name="school" className="mx-auto text-[#312E81]" />
            <h2 className="mt-3 text-lg font-black">No spaces yet</h2>
            <p className="mt-2 text-sm font-semibold text-slate-500">Spaces will appear here when you or your classmates create them.</p>
          </div>
        )}
      </div>
  );
}

export function ProfilePageClient() {
  const router = useRouter();
  const state = useAppState();
  const { user, profile, isPremium, logout, refreshProfile } = useAuth();
  const profileLine = [state.answers.country, state.answers.age, state.answers.level, state.answers.subject].filter(Boolean).join(" · ");
  const displayName = profile?.display_name || state.answers.name || "Aceley Student";
  const displayEmail = profile?.email || user?.email || "";

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  function resetOnboarding() {
    state.resetOnboarding();
    logout();
    router.push("/sign-up");
  }

  function signOut() {
    state.resetOnboarding();
    logout();
    router.replace("/landing");
  }

  return (
      <div className="space-y-6">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="grid h-20 w-20 place-items-center rounded-lg bg-[#312E81] text-2xl font-black text-white">{initials(displayName)}</div>
            <div>
              <h1 className="text-2xl font-black">{displayName}</h1>
              {displayEmail ? <p className="mt-0.5 text-sm font-semibold text-[#312E81]">{displayEmail}</p> : null}
              <p className="mt-1 text-sm font-semibold text-slate-500">{profileLine || "Profile details not set"}</p>
              <span className={cn(
                "mt-2 inline-block rounded-lg px-3 py-1 text-xs font-black uppercase tracking-[0.12em]",
                isPremium ? "bg-[#FACC15] text-[#1E1B4B]" : "bg-slate-100 text-slate-600",
              )}>
                {isPremium ? "Premium" : "Free plan"}
              </span>
            </div>
          </div>
        </section>
        <div className="grid grid-cols-3 gap-3">
          {[
            ["Streak", state.streak],
            ["Hours", state.hoursStudied],
            ["Quizzes", state.savedQuizzes.length],
          ].map(([label, value]) => (
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm" key={String(label)}>
              <p className="text-2xl font-black">{value}</p>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-slate-400">{label}</p>
            </div>
          ))}
        </div>
        <TopicList title="Strong topics" topics={state.strongTopics} empty="No strong topics saved yet." />
        <TopicList title="Weak topics" topics={state.answers.weakTopics} empty="No weak topics marked yet." />
        <ListSection title="Saved explanations" items={state.savedExplanations.map((item) => `${item.topic} · ${item.style}`)} empty="No saved explanations yet." />
        <ListSection title="Recent quizzes" items={state.savedQuizzes.map((item) => `${item.title} · ${item.score}`)} empty="No quizzes yet." />
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black">Appearance</h2>
          <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-[#F8FAFC] p-1">
            {(["auto", "light", "dark"] as ThemePreference[]).map((mode) => (
              <button
                className={cn("rounded-lg px-3 py-2 text-sm font-black capitalize", state.themePreference === mode ? "bg-white text-[#312E81] shadow-sm" : "text-slate-500")}
                key={mode}
                onClick={() => state.setThemePreference(mode)}
                type="button"
              >
                {mode}
              </button>
            ))}
          </div>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
          {[
            ["Notifications", "profile", undefined],
            ["Privacy", "lock", undefined],
            ["Sign out", "arrowLeft", signOut],
            ["Reset onboarding", "reset", resetOnboarding],
            ["Clear all data", "delete", state.clearAllData],
          ].map(([label, icon, action]) => (
            <button
              className={cn("flex min-h-12 w-full items-center justify-between rounded-lg px-3 text-left text-sm font-black", label === "Clear all data" ? "text-red-600" : "text-[#1E1B4B]")}
              key={label as string}
              onClick={action as (() => void) | undefined}
              type="button"
            >
              <span className="flex items-center gap-3">
                <Icon name={icon as "profile" | "lock" | "arrowLeft" | "reset" | "delete"} className="h-4 w-4" />
                {label as string}
              </span>
              <Icon name="chevronRight" className="h-4 w-4 text-slate-300" />
            </button>
          ))}
        </section>
      </div>
  );
}

function TopicList({ title, topics, empty }: { title: string; topics: string[]; empty: string }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black">{title}</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {topics.length ? topics.map((topic) => <span className="rounded-lg bg-[#FEFCE8] px-3 py-2 text-xs font-black text-[#CA8A04]" key={topic}>{topic}</span>) : <p className="text-sm font-semibold text-slate-500">{empty}</p>}
      </div>
    </section>
  );
}

function ListSection({ title, items, empty }: { title: string; items: string[]; empty: string }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black">{title}</h2>
      <div className="mt-3 space-y-2">
        {items.length ? items.map((item) => <p className="rounded-lg bg-[#F8FAFC] p-3 text-sm font-semibold" key={item}>{item}</p>) : <p className="text-sm font-semibold text-slate-500">{empty}</p>}
      </div>
    </section>
  );
}

export function QuizPage({ topic: topicProp }: { topic?: string } = {}) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<{
    id: string;
    topic: string;
    questions: { question: string; options: string[]; correct_index: number; explanation: string }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const resolvedTopic = topicProp || "General Knowledge";

  useEffect(() => {
    let cancelled = false;
    generateQuiz(resolvedTopic, 5)
      .then((data) => { if (!cancelled) setQuiz(data); })
      .catch((err: Error) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [resolvedTopic]);

  if (loading) {
    return (
        <div className="space-y-5">
          <SectionTitle title="Quiz" />
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-black text-slate-500">Generating quiz on {resolvedTopic}...</p>
          </div>
        </div>
    );
  }

  if (error || !quiz || !quiz.questions.length) {
    return (
        <div className="space-y-5">
          <SectionTitle title="Quiz" />
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-center">
            <p className="text-sm font-black text-red-700">{error || "No questions generated"}</p>
          </div>
          <SecondaryButton href="/">Back to home</SecondaryButton>
        </div>
    );
  }

  const current = quiz.questions[index];

  function choose(optionIndex: number) {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === current.correct_index) {
      setScore((value) => value + 1);
    }
  }

  function next() {
    if (index + 1 >= quiz!.questions.length) {
      const finalScore = score + (selected === current.correct_index ? 1 : 0);
      router.push(`/quiz/result?score=${finalScore}&total=${quiz!.questions.length}&title=${encodeURIComponent(quiz!.topic)}`);
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
  }

  return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <SectionTitle title={quiz.topic} />
          <span className="rounded-lg bg-white px-3 py-2 text-sm font-black shadow-sm">{index + 1}/{quiz.questions.length}</span>
        </div>
        <ProgressBar value={(index / quiz.questions.length) * 100} />
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black leading-tight">{current.question}</h2>
          <div className="mt-5 space-y-3">
            {current.options.map((option: string, optionIndex: number) => {
              const correct = optionIndex === current.correct_index;
              const chosen = selected === optionIndex;
              return (
                <button
                  className={cn(
                    "min-h-12 w-full rounded-lg border px-4 text-left text-sm font-black",
                    selected === null && "border-slate-200 bg-[#F8FAFC]",
                    selected !== null && correct && "border-emerald-300 bg-emerald-50 text-emerald-700",
                    selected !== null && chosen && !correct && "border-red-300 bg-red-50 text-red-700",
                    selected !== null && !chosen && !correct && "border-slate-200 bg-white text-slate-500",
                  )}
                  key={option}
                  onClick={() => choose(optionIndex)}
                  type="button"
                >
                  {option}
                </button>
              );
            })}
          </div>
          {selected !== null ? (
            <div className="mt-5 rounded-lg bg-[#FEFCE8] p-4 text-sm font-semibold text-[#1E1B4B]">
              {selected === current.correct_index ? "Correct. " : "Not quite. "}
              {current.explanation}
            </div>
          ) : null}
        </section>
        <PrimaryButton className="w-full" disabled={selected === null} onClick={next}>
          {index + 1 >= quiz.questions.length ? "Finish" : "Next"}
        </PrimaryButton>
      </div>
  );
}

export function QuizResultPage({ score, total, title }: { score: number; total: number; title: string }) {
  const { recordQuiz, addStrongTopic } = useAppState();
  const recorded = useRef(false);
  const percent = total ? Math.round((score / total) * 100) : 0;

  useEffect(() => {
    if (!recorded.current) {
      recorded.current = true;
      recordQuiz({ id: `quiz-${title}-${score}-${total}`, title, score: `${score} / ${total}` });
      if (percent >= 80 && title) {
        addStrongTopic(title);
      }
    }
  }, [addStrongTopic, percent, recordQuiz, score, title, total]);

  return (
      <div className="space-y-6 text-center">
        {percent >= 80 ? <LottieMascot className="mx-auto h-40 w-40" name="mascot_winner" /> : percent < 50 ? <LottieMascot className="mx-auto h-40 w-40" name="mascot_lost" /> : <Icon name="medal" className="mx-auto h-20 w-20 text-[#FACC15]" />}
        <div className="mx-auto grid h-44 w-44 place-items-center rounded-full bg-white shadow-sm ring-8 ring-[#FACC15]/30">
          <div>
            <p className="text-4xl font-black">{percent}%</p>
            <p className="mt-1 text-sm font-black text-slate-500">{score} / {total}</p>
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-black">{percent >= 80 ? "Excellent work" : percent < 50 ? "Review and retry" : "Solid progress"}</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">Focus next on explanations you missed, then retry under time.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <PrimaryButton href="/quiz">Retry</PrimaryButton>
          <SecondaryButton href="/flashcards">Open flashcards</SecondaryButton>
          <SecondaryButton href="/">Back to home</SecondaryButton>
        </div>
      </div>
  );
}

export function FlashcardsPage({ topic: topicProp }: { topic?: string } = {}) {
  const [cards, setCards] = useState<{ front: string; back: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const touchStart = useRef<number | null>(null);
  const resolvedTopic = topicProp || "General Knowledge";

  useEffect(() => {
    let cancelled = false;
    generateFlashcards(resolvedTopic, 10)
      .then((data) => { if (!cancelled) setCards(data.cards); })
      .catch((err: Error) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [resolvedTopic]);

  if (loading) {
    return (
        <div className="space-y-6">
          <SectionTitle title="Flashcards" />
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-black text-slate-500">Generating flashcards on {resolvedTopic}...</p>
          </div>
        </div>
    );
  }

  if (error || !cards.length) {
    return (
        <div className="space-y-6">
          <SectionTitle title="Flashcards" />
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-center">
            <p className="text-sm font-black text-red-700">{error || "No flashcards generated"}</p>
          </div>
          <SecondaryButton href="/">Back to home</SecondaryButton>
        </div>
    );
  }

  const card = cards[index];

  function move(delta: number) {
    setIndex((value) => (value + delta + cards.length) % cards.length);
    setFlipped(false);
  }

  function onTouchEnd(event: TouchEvent) {
    if (touchStart.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(delta) > 50) move(delta < 0 ? 1 : -1);
    touchStart.current = null;
  }

  return (
      <div className="space-y-6">
        <SectionTitle title="Flashcards" />
        <button
          className={cn("min-h-[24rem] w-full rounded-lg border p-8 text-center shadow-lg transition", flipped ? "border-[#FACC15] bg-[#FEFCE8]" : "border-slate-200 bg-white")}
          onClick={() => setFlipped((value) => !value)}
          onTouchEnd={onTouchEnd}
          onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }}
          type="button"
        >
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#CA8A04]">{flipped ? "Back" : "Front"} · {index + 1}/{cards.length}</p>
          <p className="mt-16 text-3xl font-black leading-tight">{flipped ? card.back : card.front}</p>
        </button>
        <div className="grid grid-cols-2 gap-3">
          <SecondaryButton onClick={() => move(-1)}>Previous</SecondaryButton>
          <PrimaryButton onClick={() => move(1)}>Next</PrimaryButton>
        </div>
      </div>
  );
}

export function ExplainPage({ initialTopic = "", initialStyle = "lecturer" }: { initialTopic?: string; initialStyle?: string }) {
  const router = useRouter();
  const [topic, setTopic] = useState(initialTopic);
  const [style, setStyle] = useState(initialStyle);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!topic.trim()) {
      return;
    }

    router.push(`/explain/result?topic=${encodeURIComponent(topic.trim())}&style=${encodeURIComponent(style)}`);
  }

  return (
      <form className="space-y-5" onSubmit={submit}>
        <SectionTitle title="Explain a topic" />
        <input className={inputClass} onChange={(event) => setTopic(event.target.value)} placeholder="Topic" value={topic} />
        <div className="grid gap-3 sm:grid-cols-2">
          {EXPLAIN_STYLES.map((item) => (
            <button
              className={cn("rounded-lg border bg-white p-4 text-left shadow-sm", style === item.id ? "border-[#312E81] ring-4 ring-[#312E81]/10" : "border-slate-200")}
              key={item.id}
              onClick={() => setStyle(item.id)}
              type="button"
            >
              <p className="font-black">{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-slate-500">{item.description}</p>
            </button>
          ))}
        </div>
        <PrimaryButton className="w-full" disabled={!topic.trim()} type="submit">Explain it</PrimaryButton>
      </form>
  );
}

export function ExplainResultPage({ topic, style }: { topic: string; style: string }) {
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { savedExplanations, saveExplanation, removeSavedExplanation } = useAppState();
  const id = `explain-${style}-${topic}`.slice(0, 90);
  const saved = savedExplanations.some((item) => item.id === id);

  useEffect(() => {
    let cancelled = false;
    explainTopic(topic, style)
      .then((data) => { if (!cancelled) setExplanation(data.explanation); })
      .catch((err: Error) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [topic, style]);

  if (loading) {
    return (
        <div className="space-y-5">
          <SectionTitle title={`Explaining: ${topic}`} />
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-black text-slate-500">Generating explanation...</p>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="space-y-5">
          <SectionTitle title={`Explaining: ${topic}`} />
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-center">
            <p className="text-sm font-black text-red-700">{error}</p>
          </div>
          <SecondaryButton href="/explain">Try again</SecondaryButton>
        </div>
    );
  }

  const preview = explanation.slice(0, 120);

  return (
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <SectionTitle title={`${topic} (${style})`} />
          <button
            className={cn("grid h-11 w-11 place-items-center rounded-lg border shadow-sm", saved ? "border-[#FACC15] bg-[#FACC15]" : "border-slate-200 bg-white")}
            onClick={() => (saved ? removeSavedExplanation(id) : saveExplanation({ id, topic, style, preview }))}
            type="button"
          >
            <Icon name="bookmark" className="h-4 w-4" />
          </button>
        </div>
        <ResultBlock label="Explanation">
          <span className="whitespace-pre-wrap">{explanation}</span>
        </ResultBlock>
      </div>
  );
}

export function ProgressPage() {
  const [progress, setProgress] = useState<BackendProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchProgress()
      .then((data) => { if (!cancelled) setProgress(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-black text-slate-500">Loading progress...</p>
        </div>
    );
  }

  if (!progress || (!progress.quizzes_taken && !progress.flashcards_reviewed && !progress.streak_days)) {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <Icon name="progress" className="mx-auto text-[#312E81]" />
          <h1 className="mt-3 text-xl font-black">No progress yet</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">Finish a quiz, ask a question, or complete a focus session to see your stats.</p>
          <PrimaryButton href="/quiz" className="mt-5">Start a quiz</PrimaryButton>
        </div>
    );
  }

  const avgPercent = Math.round(progress.average_score * 100);
  const readiness = Math.min(100, Math.round(avgPercent * 0.6 + Math.min(progress.quizzes_taken * 5, 25) + Math.min(progress.streak_days * 5, 15)));

  return (
      <div className="space-y-6">
        <section className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#CA8A04]">Exam readiness</p>
          <p className="mt-3 text-6xl font-black">{readiness}%</p>
        </section>
        <div className="grid grid-cols-2 gap-3">
          {[
            ["Quizzes taken", progress.quizzes_taken],
            ["Avg score", `${avgPercent}%`],
            ["Flashcards reviewed", progress.flashcards_reviewed],
            ["Streak", `${progress.streak_days}d`],
          ].map(([label, value]) => (
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" key={String(label)}>
              <p className="text-2xl font-black">{value}</p>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-slate-400">{label}</p>
            </div>
          ))}
        </div>
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black">Topics studied</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {progress.topics_studied.length ? (
              progress.topics_studied.map((topic: string) => (
                <span className="rounded-lg bg-[#FEFCE8] px-3 py-2 text-xs font-black text-[#CA8A04]" key={topic}>{topic}</span>
              ))
            ) : (
              <p className="text-sm font-semibold text-slate-500">Topics will appear as you take quizzes and review flashcards.</p>
            )}
          </div>
        </section>
      </div>
  );
}
