"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ApiError } from "@/services/apiClient";
import { patchProfile, completeOnboarding } from "@/services/modules/auth";
import { useAuthStore } from "@/services/context/auth";
import type {
  DailyStudyFrequency,
  MainGoal,
  ReferralSource,
  StudyLevel,
} from "@/services/dtos/auth";
import { useAppState } from "@/lib/state";
import { BackButton } from "@/app/components/back-button";
import { HydrationGate } from "@/app/components/hydration-gate";

// ---------------------------------------------------------------------------
// Shared shell
// ---------------------------------------------------------------------------

const TOTAL_STEPS = 8;

const PARTICLES: Array<{ left: number; dur: number; delay: number; color: string }> = [
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

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Progress({ current }: { current: number }) {
  return (
    <div
      aria-label={`Step ${current} of ${TOTAL_STEPS}`}
      aria-valuemax={TOTAL_STEPS}
      aria-valuemin={1}
      aria-valuenow={current}
      className="flex flex-1 items-center gap-1.5"
      role="progressbar"
    >
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
        const step = i + 1;
        const done = step < current;
        const cur = step === current;
        return (
          <span key={i} className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
            {done ? <span className="absolute inset-0 rounded-full bg-[#1E1B4B]" /> : null}
            {cur ? (
              <>
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#312E81] to-[#1E1B4B] [animation:ace-fill-bar_0.7s_cubic-bezier(0.22,1,0.36,1)_both]" />
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

function Shell({
  step,
  backHref,
  children,
}: {
  step: number;
  backHref: string;
  children: ReactNode;
}) {
  return (
    <HydrationGate>
      <main className="relative min-h-[100dvh] overflow-hidden bg-white text-[#1E1B4B]">
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
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[-160px] right-[-120px] h-[440px] w-[440px] rounded-full [animation:ace-blob-drift-a_18s_ease-in-out_infinite]"
          style={{ background: "radial-gradient(circle, rgba(250,204,21,0.42), transparent 60%)", filter: "blur(60px)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-180px] left-[-140px] h-[460px] w-[460px] rounded-full [animation:ace-blob-drift-b_22s_ease-in-out_infinite]"
          style={{ background: "radial-gradient(circle, rgba(67,56,202,0.35), transparent 60%)", filter: "blur(64px)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [animation:ace-grid-drift_10s_linear_infinite]"
          style={{
            backgroundImage: "radial-gradient(rgba(30,27,75,0.08) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            WebkitMaskImage: "radial-gradient(ellipse 60% 40% at 50% 40%, transparent 40%, #000 75%)",
            maskImage: "radial-gradient(ellipse 60% 40% at 50% 40%, transparent 40%, #000 75%)",
          }}
        />
        {PARTICLES.map((p, i) => (
          <span
            aria-hidden="true"
            key={i}
            className="pointer-events-none absolute h-1 w-1 rounded-full"
            style={{
              left: `${p.left}%`,
              bottom: "-12px",
              background: p.color,
              animation: `ace-particle-rise ${p.dur}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}

        <div className="relative mx-auto flex min-h-[100dvh] max-w-md flex-col px-5 pb-8 pt-5 sm:px-6">
          <header className="flex items-center gap-4 pb-8">
            <BackButton fallbackHref={backHref} />
            <Progress current={step} />
            <span
              aria-live="polite"
              className="shrink-0 text-xs font-black tabular-nums text-slate-500"
              key={step}
              style={{ animation: "ace-rise 0.4s ease-out both" }}
            >
              {step}/{TOTAL_STEPS}
            </span>
          </header>
          <section className="flex flex-1 flex-col [animation:ace-rise_0.4s_ease-out_both]">{children}</section>
        </div>
      </main>
    </HydrationGate>
  );
}

function Heading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
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
        <p className="mt-4 text-[16px] font-semibold leading-[1.55] text-slate-500">{description}</p>
      ) : null}
    </div>
  );
}

function Cta({
  label,
  loadingLabel,
  disabled,
  loading,
  onClick,
}: {
  label: string;
  loadingLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
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
        </span>
      </button>
    </div>
  );
}

const inputCls =
  "min-h-14 w-full rounded-2xl border-2 border-transparent bg-slate-50 px-5 text-[17px] font-bold text-[#1E1B4B] outline-none transition placeholder:text-slate-400 hover:bg-slate-100 focus:border-[#1E1B4B]/30 focus:bg-white focus:shadow-[0_0_0_6px_rgba(30,27,75,0.06)]";

function Choice({
  label,
  hint,
  selected,
  onClick,
}: {
  label: string;
  hint?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-2xl border-2 px-5 py-4 text-left transition",
        selected
          ? "border-[#1E1B4B] bg-white shadow-[0_10px_30px_rgba(30,27,75,0.12)]"
          : "border-transparent bg-slate-50 hover:bg-slate-100",
      )}
    >
      <span>
        <span className="block text-[16px] font-black text-[#1E1B4B]">{label}</span>
        {hint ? <span className="mt-0.5 block text-[13px] font-semibold text-slate-500">{hint}</span> : null}
      </span>
      <span
        className={cn(
          "grid h-6 w-6 place-items-center rounded-full border-2 transition",
          selected ? "border-[#1E1B4B] bg-[#1E1B4B] text-white" : "border-slate-300 bg-white text-transparent",
        )}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="h-3 w-3">
          <path d="m5 12 5 5 9-11" />
        </svg>
      </span>
    </button>
  );
}

function ErrorLine({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3 rounded-2xl bg-[#FACC15]/10 px-4 py-3 text-sm font-semibold text-[#CA8A04]">{children}</p>
  );
}

function humanizeError(err: unknown, fallback: string) {
  if (err instanceof ApiError) {
    return err.message || fallback;
  }
  return "Network error. Try again.";
}

// ---------------------------------------------------------------------------
// Enums / label maps
// ---------------------------------------------------------------------------

const LANGUAGES: Array<{ value: string; label: string }> = [
  { value: "en_US", label: "English (US)" },
  { value: "en_GB", label: "English (UK)" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "pt", label: "Portuguese" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "ar", label: "Arabic" },
];

const STUDY_LEVELS: Array<{ value: StudyLevel; label: string }> = [
  { value: "elementary", label: "Elementary" },
  { value: "middle_school", label: "Middle school" },
  { value: "high_school", label: "High school" },
  { value: "high_school_diploma", label: "High-school diploma" },
  { value: "first_year_college", label: "1st year college" },
  { value: "second_year_college", label: "2nd year college" },
  { value: "third_year_college", label: "3rd year college" },
  { value: "fourth_year_college", label: "4th year college" },
  { value: "masters", label: "Master’s" },
  { value: "phd", label: "PhD" },
  { value: "other", label: "Other" },
];

const MAIN_GOALS: Array<{ value: MainGoal; label: string; hint: string }> = [
  { value: "pass_exams", label: "Pass my exams", hint: "Cram, revise, ace tests." },
  { value: "upgrade_skills", label: "Upgrade my skills", hint: "Level up in what I already do." },
  { value: "general_learning", label: "Learn something new", hint: "Curious about a topic." },
  { value: "career_switch", label: "Switch careers", hint: "Prep for a new field." },
];

const FREQUENCIES: Array<{ value: DailyStudyFrequency; label: string }> = [
  { value: "mins_15", label: "15 minutes" },
  { value: "mins_30", label: "30 minutes" },
  { value: "mins_45", label: "45 minutes" },
  { value: "mins_60", label: "1 hour" },
  { value: "mins_90", label: "1.5 hours" },
  { value: "mins_120_plus", label: "2+ hours" },
];

const REFERRALS: Array<{ value: ReferralSource; label: string }> = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "google", label: "Google search" },
  { value: "other", label: "Other" },
];

function hourLabel(h: number) {
  if (h === 0) return "12:00 AM";
  if (h < 12) return `${h}:00 AM`;
  if (h === 12) return "12:00 PM";
  return `${h - 12}:00 PM`;
}

// ---------------------------------------------------------------------------
// Step pages
// ---------------------------------------------------------------------------

export function OnboardingLanguagePage() {
  const router = useRouter();
  const { answers, updateAnswers } = useAppState();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const value = answers.studyLanguage || "en_US";

  async function handleContinue() {
    setSaving(true);
    setError("");
    try {
      const updated = await patchProfile({ study_language: value });
      useAuthStore.getState().updateProfile(updated);
      router.push("/onboarding/name");
    } catch (err) {
      setError(humanizeError(err, "Couldn’t save your language. Try again."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Shell step={1} backHref="/sign-in">
      <Heading
        eyebrow="Preferred language"
        title="What language should we teach in?"
        description="We’ll generate flashcards, explanations, and quizzes in this language."
      />
      <div className="mt-8 space-y-2">
        {LANGUAGES.map((l) => (
          <Choice
            key={l.value}
            label={l.label}
            selected={value === l.value}
            onClick={() => updateAnswers({ studyLanguage: l.value })}
          />
        ))}
        {error ? <ErrorLine>{error}</ErrorLine> : null}
      </div>
      <Cta label="Continue" loading={saving} onClick={handleContinue} />
    </Shell>
  );
}

export function OnboardingNamePage() {
  const router = useRouter();
  const { answers, updateAnswers } = useAppState();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const value = answers.name;

  async function handleContinue() {
    const nickname = value.trim();
    if (!nickname) return;
    setSaving(true);
    setError("");
    try {
      const updated = await patchProfile({ nickname });
      useAuthStore.getState().updateProfile(updated);
      router.push("/onboarding/age");
    } catch (err) {
      setError(humanizeError(err, "Couldn’t save your name. Try again."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Shell step={2} backHref="/onboarding/language">
      <Heading
        eyebrow="Nice to meet you"
        title="What should we call you?"
        description="This is how Aceley will greet you every day."
      />
      <div className="mt-10">
        <input
          autoFocus
          className={inputCls}
          disabled={saving}
          onChange={(e) => updateAnswers({ name: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim() && !saving) void handleContinue();
          }}
          placeholder="e.g. Maya"
          value={value}
        />
        {error ? <ErrorLine>{error}</ErrorLine> : null}
      </div>
      <Cta label="Continue" loading={saving} disabled={!value.trim()} onClick={handleContinue} />
    </Shell>
  );
}

export function OnboardingAgePage() {
  const router = useRouter();
  const { answers, updateAnswers } = useAppState();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const value = answers.age;
  const num = Number(value);
  const valid = value.trim().length > 0 && Number.isFinite(num) && num >= 5 && num <= 120;

  async function handleContinue() {
    if (!valid) return;
    setSaving(true);
    setError("");
    try {
      const updated = await patchProfile({ age: num });
      useAuthStore.getState().updateProfile(updated);
      router.push("/onboarding/study-level");
    } catch (err) {
      setError(humanizeError(err, "Couldn’t save your age. Try again."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Shell step={3} backHref="/onboarding/name">
      <Heading
        eyebrow="A bit about you"
        title="How old are you?"
        description="This helps us match reading level and content to your stage."
      />
      <div className="mt-10">
        <input
          autoFocus
          inputMode="numeric"
          pattern="[0-9]*"
          className={inputCls}
          disabled={saving}
          onChange={(e) => updateAnswers({ age: e.target.value.replace(/[^0-9]/g, "").slice(0, 3) })}
          onKeyDown={(e) => {
            if (e.key === "Enter" && valid && !saving) void handleContinue();
          }}
          placeholder="e.g. 17"
          value={value}
        />
        {error ? <ErrorLine>{error}</ErrorLine> : null}
      </div>
      <Cta label="Continue" loading={saving} disabled={!valid} onClick={handleContinue} />
    </Shell>
  );
}

export function OnboardingStudyLevelPage() {
  const router = useRouter();
  const { answers, updateAnswers } = useAppState();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const value = answers.studyLevel;

  async function handleContinue() {
    if (!value) return;
    setSaving(true);
    setError("");
    try {
      const updated = await patchProfile({ study_level: value as StudyLevel });
      useAuthStore.getState().updateProfile(updated);
      router.push("/onboarding/goal");
    } catch (err) {
      setError(humanizeError(err, "Couldn’t save your study level. Try again."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Shell step={4} backHref="/onboarding/age">
      <Heading eyebrow="Where you are" title="What’s your study level?" description="Choose the closest match." />
      <div className="mt-8 space-y-2">
        {STUDY_LEVELS.map((s) => (
          <Choice
            key={s.value}
            label={s.label}
            selected={value === s.value}
            onClick={() => updateAnswers({ studyLevel: s.value })}
          />
        ))}
        {error ? <ErrorLine>{error}</ErrorLine> : null}
      </div>
      <Cta label="Continue" loading={saving} disabled={!value} onClick={handleContinue} />
    </Shell>
  );
}

export function OnboardingGoalPage() {
  const router = useRouter();
  const { answers, updateAnswers } = useAppState();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const value = answers.mainGoal;

  async function handleContinue() {
    if (!value) return;
    setSaving(true);
    setError("");
    try {
      const updated = await patchProfile({ main_goal: value as MainGoal });
      useAuthStore.getState().updateProfile(updated);
      router.push("/onboarding/frequency");
    } catch (err) {
      setError(humanizeError(err, "Couldn’t save your goal. Try again."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Shell step={5} backHref="/onboarding/study-level">
      <Heading eyebrow="Why you’re here" title="What’s your main goal?" description="We’ll shape your plan around this." />
      <div className="mt-8 space-y-2">
        {MAIN_GOALS.map((g) => (
          <Choice
            key={g.value}
            label={g.label}
            hint={g.hint}
            selected={value === g.value}
            onClick={() => updateAnswers({ mainGoal: g.value })}
          />
        ))}
        {error ? <ErrorLine>{error}</ErrorLine> : null}
      </div>
      <Cta label="Continue" loading={saving} disabled={!value} onClick={handleContinue} />
    </Shell>
  );
}

export function OnboardingFrequencyPage() {
  const router = useRouter();
  const { answers, updateAnswers } = useAppState();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const value = answers.dailyFrequency;

  async function handleContinue() {
    if (!value) return;
    setSaving(true);
    setError("");
    try {
      const updated = await patchProfile({ daily_study_frequency: value as DailyStudyFrequency });
      useAuthStore.getState().updateProfile(updated);
      router.push("/onboarding/reminder");
    } catch (err) {
      setError(humanizeError(err, "Couldn’t save your target. Try again."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Shell step={6} backHref="/onboarding/goal">
      <Heading
        eyebrow="Daily target"
        title="How much can you study per day?"
        description="Pick a target you can keep."
      />
      <div className="mt-8 grid grid-cols-2 gap-2">
        {FREQUENCIES.map((f) => (
          <Choice
            key={f.value}
            label={f.label}
            selected={value === f.value}
            onClick={() => updateAnswers({ dailyFrequency: f.value })}
          />
        ))}
      </div>
      {error ? <ErrorLine>{error}</ErrorLine> : null}
      <Cta label="Continue" loading={saving} disabled={!value} onClick={handleContinue} />
    </Shell>
  );
}

export function OnboardingReminderPage() {
  const router = useRouter();
  const { answers, updateAnswers } = useAppState();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const raw = answers.reminderHour;
  const hourNum = raw === "" ? null : Number(raw);
  const valid = hourNum !== null && Number.isInteger(hourNum) && hourNum >= 0 && hourNum <= 23;

  async function handleContinue() {
    if (!valid) return;
    setSaving(true);
    setError("");
    try {
      const updated = await patchProfile({ study_reminder_hour: hourNum });
      useAuthStore.getState().updateProfile(updated);
      router.push("/onboarding/referral");
    } catch (err) {
      setError(humanizeError(err, "Couldn’t save your reminder. Try again."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Shell step={7} backHref="/onboarding/frequency">
      <Heading
        eyebrow="Daily reminder"
        title="When should we nudge you?"
        description="We’ll ping you once a day around this time."
      />
      <div className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {Array.from({ length: 24 }).map((_, h) => {
          const selected = hourNum === h;
          return (
            <button
              key={h}
              type="button"
              onClick={() => updateAnswers({ reminderHour: String(h) })}
              className={cn(
                "rounded-2xl border-2 px-2 py-3 text-center text-xs font-black tabular-nums transition",
                selected
                  ? "border-[#1E1B4B] bg-white text-[#1E1B4B] shadow-[0_8px_20px_rgba(30,27,75,0.12)]"
                  : "border-transparent bg-slate-50 text-slate-600 hover:bg-slate-100",
              )}
            >
              {hourLabel(h)}
            </button>
          );
        })}
      </div>
      {error ? <ErrorLine>{error}</ErrorLine> : null}
      <Cta label="Continue" loading={saving} disabled={!valid} onClick={handleContinue} />
    </Shell>
  );
}

export function OnboardingReferralPage() {
  const router = useRouter();
  const { answers, updateAnswers, completeOnboarding: markLocalOnboarded } = useAppState();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const value = answers.referralSource;
  const otherText = answers.referralOtherText;
  const needsOther = value === "other";
  const valid = Boolean(value) && (!needsOther || otherText.trim().length > 0);

  async function handleContinue() {
    if (!valid) return;
    setSaving(true);
    setError("");
    try {
      // Write referral fields to profile, then mark onboarding complete.
      await patchProfile({});
      const finalProfile = await completeOnboarding({
        referral_source: value as ReferralSource,
        referral_other_text: needsOther ? otherText.trim() : null,
      });
      useAuthStore.getState().updateProfile(finalProfile);
      markLocalOnboarded();
      // NOTE: intentionally a hard replace to /home to avoid resumeStep races
      // (any focused effect reading a mid-write profile could bounce us back here).
      router.replace("/home");
    } catch (err) {
      setError(humanizeError(err, "Couldn’t finish onboarding. Try again."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Shell step={8} backHref="/onboarding/reminder">
      <Heading
        eyebrow="Almost done"
        title="How did you hear about us?"
        description="Just curious — this helps us know where to invest."
      />
      <div className="mt-8 space-y-2">
        {REFERRALS.map((r) => (
          <Choice
            key={r.value}
            label={r.label}
            selected={value === r.value}
            onClick={() =>
              updateAnswers({ referralSource: r.value, referralOtherText: r.value === "other" ? otherText : "" })
            }
          />
        ))}
        {needsOther ? (
          <input
            autoFocus
            className={cn(inputCls, "mt-2")}
            disabled={saving}
            onChange={(e) => updateAnswers({ referralOtherText: e.target.value })}
            placeholder="Tell us where…"
            value={otherText}
          />
        ) : null}
        {error ? <ErrorLine>{error}</ErrorLine> : null}
      </div>
      <Cta label="Finish" loadingLabel="Finishing…" loading={saving} disabled={!valid} onClick={handleContinue} />
    </Shell>
  );
}
