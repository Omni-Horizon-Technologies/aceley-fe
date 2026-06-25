"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  DUMMY_SPACES,
  EXPLAIN_STYLES,
  FOCUS_AUDIO,
  FOCUS_PRESETS,
  MAJOR_SUGGESTIONS,
  PAYWALL_FEATURES,
  PAYWALL_PLANS,
  SAMPLE_DECK,
  SAMPLE_QUIZ,
  SOURCE_OPTIONS,
} from "@/lib/constants";
import { buildAskAnswer } from "@/lib/mock/ask";
import { buildExplanation } from "@/lib/mock/explain";
import { buildScanAnswer } from "@/lib/mock/scan";
import { buildStudyPack } from "@/lib/mock/study-pack";
import { buildTutorReply } from "@/lib/mock/tutor";
import {
  daysUntil,
  planProgress,
  useAppState,
  type Plan,
  type ThemePreference,
} from "@/lib/state";

const inputClass =
  "min-h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-[#1E1B4B] outline-none transition placeholder:text-slate-400 focus:border-[#312E81] focus:ring-4 focus:ring-[#312E81]/10";
const textAreaClass =
  "min-h-36 w-full resize-y rounded-lg border border-slate-200 bg-white px-4 py-4 text-sm font-semibold leading-6 text-[#1E1B4B] outline-none transition placeholder:text-slate-400 focus:border-[#312E81] focus:ring-4 focus:ring-[#312E81]/10";
type Space = (typeof DUMMY_SPACES)[number];
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

function HydrationGate({ children }: { children: ReactNode }) {
  const { hydrated } = useAppState();

  if (!hydrated) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#F8FAFC] px-4 text-[#1E1B4B]">
        <div className="h-12 w-12 animate-pulse rounded-lg bg-[#FACC15]" />
      </main>
    );
  }

  return children;
}

function AppShell({ children, showBack = true }: { children: ReactNode; showBack?: boolean }) {
  const pathname = usePathname();
  const navItems = [
    { href: "/", label: "Home", icon: "home" as const },
    { href: "/coach", label: "Coach", icon: "brain" as const },
    { href: "/spaces", label: "Spaces", icon: "spaces" as const },
    { href: "/progress", label: "Progress", icon: "progress" as const },
    { href: "/profile", label: "Profile", icon: "profile" as const },
  ];

  return (
    <HydrationGate>
      <div className="min-h-screen bg-[#F8FAFC] text-[#1E1B4B]">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/92 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {showBack ? <BackButton className="h-10 w-10" fallbackHref="/" /> : null}
              <BrandMark />
            </div>
            <Link
              className="grid h-10 w-10 place-items-center rounded-lg bg-[#FACC15] text-[#1E1B4B] shadow-sm"
              href="/paywall"
              aria-label="Open Aceley Pro"
            >
              <Icon name="spark" className="h-4 w-4" />
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6 pb-28 sm:px-6 lg:px-8">{children}</main>
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-3 py-2 shadow-[0_-8px_30px_rgba(30,27,75,0.08)] backdrop-blur">
          <div className="mx-auto grid max-w-lg grid-cols-5 gap-1 sm:gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-xs font-bold transition",
                    active
                      ? "bg-[#FACC15] text-[#1E1B4B]"
                      : "text-slate-500 hover:bg-[#FEFCE8] hover:text-[#1E1B4B]",
                  )}
                  href={item.href}
                  key={item.href}
                >
                  <Icon name={item.icon} className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </HydrationGate>
  );
}

function OnboardingShell({
  children,
  step,
  backHref,
}: {
  children: ReactNode;
  step?: string;
  backHref?: string;
}) {
  return (
    <HydrationGate>
      <main className="min-h-screen bg-[#F8FAFC] px-4 py-6 text-[#1E1B4B] sm:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-md flex-col">
          <div className="flex items-center justify-between">
            {backHref ? <BackButton fallbackHref={backHref} /> : <BrandMark />}
            {step ? <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">{step}</span> : null}
          </div>
          <section className="flex flex-1 flex-col justify-center py-8">{children}</section>
        </div>
      </main>
    </HydrationGate>
  );
}

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
  const router = useRouter();

  return (
    <OnboardingShell>
      <div className="text-center">
        <LottieMascot
          className="mx-auto h-[300px] w-[300px]"
          name="mascot_celebrate"
          sizeLabel="Aceley celebrating mascot"
        />
        <div className="mt-2 flex justify-center">
          <BrandMark />
        </div>
        <p className="mt-3 text-base font-semibold text-slate-600">Become exam-ready, your way.</p>
      </div>
      <div className="mt-9 space-y-3">
        {[
          ["google", "Continue with Google"],
          ["apple", "Continue with Apple"],
          ["mail", "Continue with Email"],
        ].map(([icon, label]) => (
          <button
            className="flex min-h-12 w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-black text-[#1E1B4B] shadow-sm transition hover:border-[#FACC15]/70"
            key={label}
            onClick={() => router.push("/onboarding/name")}
            type="button"
          >
            <Icon name={icon as "google" | "apple" | "mail"} />
            {label}
          </button>
        ))}
      </div>
      <p className="mt-7 text-center text-xs leading-5 text-slate-500">
        By continuing, you accept Aceley&apos;s <span className="font-bold text-[#312E81]">Terms</span> /{" "}
        <span className="font-bold text-[#312E81]">Privacy</span>
      </p>
    </OnboardingShell>
  );
}

export function OnboardingNamePage() {
  const router = useRouter();
  const { answers, updateAnswers } = useAppState();

  return (
    <OnboardingShell backHref="/onboarding/profile-ready" step="1 of 6">
      <h1 className="text-3xl font-black tracking-tight">What should we call you?</h1>
      <input
        autoFocus
        className="mt-8 min-h-14 w-full rounded-full border border-slate-200 bg-white px-6 text-lg font-black text-[#1E1B4B] outline-none shadow-sm placeholder:text-slate-300 focus:border-[#312E81] focus:ring-4 focus:ring-[#312E81]/10"
        onChange={(event) => updateAnswers({ name: event.target.value })}
        onKeyDown={(event) => {
          if (event.key === "Enter" && answers.name.trim()) {
            dismissKeyboard();
            router.push("/onboarding/about");
          }
        }}
        placeholder="Your name"
        value={answers.name}
      />
      <PrimaryButton
        className="mt-8 w-full"
        disabled={!answers.name.trim()}
        onClick={() => {
          dismissKeyboard();
          router.push("/onboarding/about");
        }}
      >
        Continue
      </PrimaryButton>
    </OnboardingShell>
  );
}

export function OnboardingAboutPage() {
  const router = useRouter();
  const { answers, updateAnswers } = useAppState();
  const [open, setOpen] = useState(false);
  const valid = answers.country.trim() && answers.age.trim();

  return (
    <OnboardingShell backHref="/onboarding/name" step="2 of 6">
      <h1 className="text-3xl font-black tracking-tight">Tell us about yourself</h1>
      <div className="mt-8 space-y-4">
        <button
          className="flex min-h-12 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-4 text-left text-sm font-black text-[#1E1B4B] shadow-sm"
          onClick={() => setOpen(true)}
          type="button"
        >
          <span>{answers.country || "Choose country"}</span>
          <Icon name="chevronRight" className="h-4 w-4 text-slate-400" />
        </button>
        <input
          className={inputClass}
          inputMode="numeric"
          maxLength={3}
          onChange={(event) => updateAnswers({ age: event.target.value.replace(/\D/g, "").slice(0, 3) })}
          onKeyDown={(event) => {
            if (event.key === "Enter" && valid) {
              dismissKeyboard();
              router.push("/onboarding/school");
            }
          }}
          placeholder="Age"
          value={answers.age}
        />
      </div>
      <PrimaryButton
        className="mt-8 w-full"
        disabled={!valid}
        onClick={() => {
          dismissKeyboard();
          router.push("/onboarding/school");
        }}
      >
        Continue
      </PrimaryButton>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end bg-[#1E1B4B]/40 px-3 pb-3" role="dialog" aria-modal="true">
          <div className="max-h-[78vh] w-full overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h2 className="font-black">Country</h2>
              <button className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100" onClick={() => setOpen(false)} type="button">
                <Icon name="x" className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[62vh] overflow-y-auto p-3">
              {COUNTRIES.map((country) => (
                <button
                  className="flex min-h-11 w-full items-center justify-between rounded-lg px-3 text-left text-sm font-bold hover:bg-[#FEFCE8]"
                  key={country}
                  onClick={() => {
                    updateAnswers({ country });
                    setOpen(false);
                  }}
                  type="button"
                >
                  {country}
                  {answers.country === country ? <Icon name="check" className="h-4 w-4 text-[#CA8A04]" /> : null}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </OnboardingShell>
  );
}

type University = {
  name: string;
  country: string;
  "state-province"?: string | null;
};

export function OnboardingSchoolPage() {
  const router = useRouter();
  const { answers, updateAnswers } = useAppState();
  const [query, setQuery] = useState(answers.school);
  const [manual, setManual] = useState(false);
  const [results, setResults] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (manual || query.trim().length < 2 || answers.school === query) {
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({ name: query.trim() });
      if (answers.country && answers.country !== "Other") {
        params.set("country", answers.country);
      }

      fetch(`https://universities.hipolabs.com/search?${params.toString()}`, {
        signal: controller.signal,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("School search failed.");
          }

          return response.json() as Promise<University[]>;
        })
        .then((data) => setResults(data.slice(0, 25)))
        .catch((searchError: Error) => {
          if (searchError.name !== "AbortError") {
            setError("School search is unavailable right now.");
          }
        })
        .finally(() => setLoading(false));
    }, 350);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [answers.country, answers.school, manual, query]);

  const canShowSchoolResults = !manual && query.trim().length >= 2 && answers.school !== query;

  return (
    <OnboardingShell backHref="/onboarding/about" step="3 of 6">
      <h1 className="text-3xl font-black tracking-tight">What school do you go to?</h1>
      <div className="mt-7 space-y-4">
        {answers.school && !manual ? (
          <div className="rounded-lg border border-[#FACC15]/60 bg-[#FEFCE8] p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#CA8A04]">Selected</p>
                <h2 className="mt-2 font-black">{answers.school}</h2>
                <p className="mt-1 text-sm text-slate-600">{answers.schoolCountry || answers.country}</p>
              </div>
              <button
                className="grid h-9 w-9 place-items-center rounded-lg bg-white text-[#1E1B4B]"
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
        ) : null}
        <div className="relative">
          <Icon name="search" className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
          <input
            className={cn(inputClass, "pl-11")}
            onChange={(event) => {
              setQuery(event.target.value);
              if (manual) {
                updateAnswers({ school: event.target.value, schoolCountry: answers.country });
              }
            }}
            placeholder={manual ? "Type school manually" : "Search universities"}
            value={query}
          />
        </div>
        {loading && canShowSchoolResults ? <p className="text-sm font-semibold text-slate-500">Searching...</p> : null}
        {error ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
            {error} You can enter your school manually.
          </div>
        ) : null}
        <button
          className="text-sm font-black text-[#312E81]"
          onClick={() => {
            setManual(true);
            updateAnswers({ school: query, schoolCountry: answers.country });
          }}
          type="button"
        >
          Can&apos;t find it? Type it manually
        </button>
        {canShowSchoolResults && results.length ? (
          <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
            {results.map((school) => (
              <button
                className="flex w-full items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-[#FACC15]/70"
                key={`${school.name}-${school.country}`}
                onClick={() => {
                  updateAnswers({ school: school.name, schoolCountry: school.country });
                  setQuery(school.name);
                  dismissKeyboard();
                }}
                type="button"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#312E81]/10 text-[#312E81]">
                  <Icon name="school" className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-black">{school.name}</span>
                  <span className="mt-1 block text-xs font-semibold text-slate-500">
                    {[school["state-province"], school.country].filter(Boolean).join(" · ")}
                  </span>
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <PrimaryButton
        className="mt-8 w-full"
        disabled={!answers.school.trim()}
        onClick={() => {
          dismissKeyboard();
          router.push("/onboarding/major");
        }}
      >
        Continue
      </PrimaryButton>
    </OnboardingShell>
  );
}

export function OnboardingMajorPage() {
  const router = useRouter();
  const { answers, updateAnswers } = useAppState();

  return (
    <OnboardingShell backHref="/onboarding/school" step="4 of 6">
      <h1 className="text-3xl font-black tracking-tight">What&apos;s your major?</h1>
      <input
        autoCapitalize="words"
        className={cn(inputClass, "mt-8")}
        onChange={(event) => updateAnswers({ major: event.target.value })}
        placeholder="Major or subject area"
        value={answers.major}
      />
      <div className="mt-5 flex max-h-56 flex-wrap gap-2 overflow-y-auto">
        {MAJOR_SUGGESTIONS.map((major) => (
          <button
            className={cn(
              "rounded-lg border px-3 py-2 text-sm font-bold transition",
              answers.major === major
                ? "border-[#312E81] bg-[#312E81] text-white"
                : "border-slate-200 bg-white text-[#1E1B4B]",
            )}
            key={major}
            onClick={() => updateAnswers({ major })}
            type="button"
          >
            {major}
          </button>
        ))}
      </div>
      <PrimaryButton
        className="mt-8 w-full"
        disabled={!answers.major.trim()}
        onClick={() => {
          dismissKeyboard();
          router.push("/onboarding/source");
        }}
      >
        Continue
      </PrimaryButton>
      <button
        className="mt-4 min-h-11 text-sm font-black text-slate-500"
        onClick={() => router.push("/onboarding/source")}
        type="button"
      >
        Skip for now
      </button>
    </OnboardingShell>
  );
}

export function OnboardingSourcePage() {
  const { answers, updateAnswers, completeOnboarding } = useAppState();

  return (
    <OnboardingShell backHref="/onboarding/major" step="5 of 6">
      <h1 className="text-3xl font-black tracking-tight">How did you hear about Aceley?</h1>
      <div className="mt-7 max-h-[52vh] space-y-2 overflow-y-auto pr-1">
        {SOURCE_OPTIONS.map((source) => (
          <button
            className={cn(
              "flex min-h-14 w-full items-center gap-3 rounded-lg border bg-white p-3 text-left shadow-sm transition",
              answers.source === source.label ? "border-[#312E81] ring-4 ring-[#312E81]/10" : "border-slate-200",
            )}
            key={source.id}
            onClick={() => updateAnswers({ source: source.label })}
            type="button"
          >
            <span className={cn("grid h-10 w-10 place-items-center rounded-lg", source.color, source.id === "google" ? "text-[#1E1B4B] ring-1 ring-slate-200" : "text-white")}>
              <Icon name={source.icon} className="h-4 w-4" />
            </span>
            <span className="font-black">{source.label}</span>
          </button>
        ))}
      </div>
      {answers.source ? (
        <Link
          className="mt-8 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#FACC15] px-5 py-3 text-sm font-semibold text-[#1E1B4B] shadow-sm transition hover:bg-[#312E81] hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FACC15]/25"
          href="/paywall"
          onClick={() => completeOnboarding()}
        >
          Continue
        </Link>
      ) : (
        <button
          className="mt-8 inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-[#FACC15] px-5 py-3 text-sm font-semibold text-[#1E1B4B] opacity-60 shadow-sm"
          disabled
          type="button"
        >
          Continue
        </button>
      )}
    </OnboardingShell>
  );
}

export function PaywallPage() {
  const router = useRouter();
  const [selected, setSelected] = useState("yearly");

  return (
    <main className="fixed inset-0 z-50 flex items-end bg-[#1E1B4B]/45 text-[#1E1B4B]">
      <section className="paywall-panel flex max-h-[94vh] w-full flex-col rounded-t-lg bg-[#F8FAFC] shadow-2xl">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6">
          <BrandMark />
          <button
            aria-label="Close paywall"
            className="grid h-10 w-10 place-items-center rounded-lg bg-white shadow-sm"
            onClick={() => router.push("/")}
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
  const plan = activePlan(state.plans);
  const examDays = daysUntil(state.answers.examDate);
  const hasProgress = state.plans.length || state.savedQuizzes.length || state.askHistory.length || state.studySessions.length;

  useEffect(() => {
    if (state.hydrated && !state.onboarded) {
      router.replace("/onboarding/profile-ready");
    }
  }, [router, state.hydrated, state.onboarded]);

  const focus = plan
    ? {
        overline: "TODAY'S FOCUS",
        title: plan.subject,
        sub: `Day ${Math.min(plan.completedDays + 1, plan.totalDays)} of ${plan.totalDays} · pick up where you left off`,
        icon: "target" as const,
        href: `/plan/${plan.id}`,
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
    <AppShell showBack={false}>
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
              {plan ? (
                <div className="mt-3">
                  <div className="mb-2 flex justify-between text-sm font-bold">
                    <span>{plan.subject}</span>
                    <span>{planProgress(plan)}%</span>
                  </div>
                  <ProgressBar value={planProgress(plan)} />
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
    </AppShell>
  );
}

type ChatMessage = {
  id: string;
  role: "tutor" | "student";
  text: string;
};

export function TutorPage() {
  const { answers } = useAppState();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "seed",
      role: "tutor",
      text:
        "Hey 👋 I'm here to help you understand, not just answer. What are we working on right now — a topic, a question, or revision for a specific exam?",
    },
  ]);

  function send(value = text) {
    const clean = value.trim();
    if (!clean) {
      return;
    }

    dismissKeyboard();
    setMessages((current) => [
      ...current,
      { id: `student-${Date.now()}`, role: "student", text: clean },
      { id: `tutor-${Date.now()}`, role: "tutor", text: buildTutorReply(clean, answers.level) },
    ]);
    setText("");
  }

  return (
    <AppShell>
      <div className="flex min-h-[calc(100vh-11rem)] flex-col">
        <SectionTitle eyebrow="AI Tutor" title="Start AI tutoring" />
        <div className="mt-6 flex-1 space-y-4">
          {messages.map((message) => (
            <div className={cn("flex gap-3", message.role === "student" && "justify-end")} key={message.id}>
              {message.role === "tutor" ? (
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#FACC15] text-sm font-black">A</span>
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
        </div>
        <div className="sticky bottom-20 mt-6 rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
          <div className="mb-3 flex gap-2 overflow-x-auto">
            {["Explain a topic", "Help with a question", "Quiz me on something", "Build me a revision plan"].map((chip) => (
              <button
                className="shrink-0 rounded-lg bg-[#FEFCE8] px-3 py-2 text-xs font-black text-[#CA8A04]"
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
              placeholder="Ask your tutor..."
              rows={1}
              value={text}
            />
            <button
              className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#FACC15] text-[#1E1B4B]"
              onClick={() => send()}
              type="button"
            >
              <Icon name="arrowUp" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </AppShell>
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
    <AppShell>
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
    </AppShell>
  );
}

export function AskResultPage({ question, subject }: { question: string; subject: string }) {
  const answer = useMemo(() => buildAskAnswer(question), [question]);
  const { savedExplanations, saveExplanation, removeSavedExplanation } = useAppState();
  const id = `ask-${subject}-${question}`.slice(0, 90);
  const saved = savedExplanations.some((item) => item.id === id);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <SectionTitle title="Step-by-step answer" />
          <button
            className={cn("grid h-11 w-11 place-items-center rounded-lg border shadow-sm", saved ? "border-[#FACC15] bg-[#FACC15]" : "border-slate-200 bg-white")}
            onClick={() =>
              saved
                ? removeSavedExplanation(id)
                : saveExplanation({ id, topic: question, style: "ask", preview: answer.understand })
            }
            type="button"
          >
            <Icon name="bookmark" className="h-4 w-4" />
          </button>
        </div>
        <VerifiedBadge />
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Question</p>
          <h2 className="mt-2 text-lg font-black">{question || "How do I solve this?"}</h2>
          <span className="mt-4 inline-flex rounded-lg bg-[#312E81]/10 px-3 py-1 text-xs font-black text-[#312E81]">{subject || "Biology"}</span>
        </section>
        <section className="space-y-4">
          <ResultBlock label="Understand">{answer.understand}</ResultBlock>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#CA8A04]">Step By Step</p>
            <ol className="mt-4 space-y-3">
              {answer.steps.map((step, index) => (
                <li className="flex gap-3 text-sm font-semibold leading-6" key={step}>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#FACC15] text-xs font-black">{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <ResultBlock label="Key Concept">{answer.keyConcept}</ResultBlock>
          <ResultBlock label="Try Something Similar">{answer.similar}</ResultBlock>
        </section>
        <div className="grid gap-3 sm:grid-cols-3">
          <PrimaryButton href="/quiz">Practice this question</PrimaryButton>
          <SecondaryButton href="/tutor">Ask follow-up</SecondaryButton>
          <SecondaryButton href="/flashcards">Make flashcards</SecondaryButton>
        </div>
      </div>
    </AppShell>
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
  const [reading, setReading] = useState(false);

  function capture() {
    setReading(true);
    window.setTimeout(() => router.push("/scan/result"), 1400);
  }

  return (
    <AppShell>
      <div className="flex min-h-[calc(100vh-12rem)] flex-col">
        <SectionTitle title="Scan to solve" />
        <div className="mt-8 flex flex-1 flex-col justify-center">
          <div className="relative min-h-[420px] rounded-lg bg-[#111827] p-6 text-white shadow-xl">
            <div className="absolute left-5 top-5 h-14 w-14 border-l-4 border-t-4 border-[#FACC15]" />
            <div className="absolute right-5 top-5 h-14 w-14 border-r-4 border-t-4 border-[#FACC15]" />
            <div className="absolute bottom-5 left-5 h-14 w-14 border-b-4 border-l-4 border-[#FACC15]" />
            <div className="absolute bottom-5 right-5 h-14 w-14 border-b-4 border-r-4 border-[#FACC15]" />
            <div className="grid h-full min-h-[360px] place-items-center text-center">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#FACC15]">
                {reading ? "Reading the question..." : "Fit the question inside the frame"}
              </p>
            </div>
          </div>
          <button
            className="mx-auto mt-8 grid h-20 w-20 place-items-center rounded-full border-4 border-white bg-[#FACC15] text-[#1E1B4B] shadow-lg"
            disabled={reading}
            onClick={capture}
            type="button"
          >
            <span className="h-12 w-12 rounded-full bg-white/60" />
          </button>
          <button className="mt-6 text-sm font-black text-slate-500" onClick={() => router.push("/scan/result")} type="button">
            Skip - try with a demo question
          </button>
        </div>
      </div>
    </AppShell>
  );
}

export function ScanResultPage() {
  const result = buildScanAnswer();

  return (
    <AppShell>
      <div className="space-y-5">
        <SectionTitle title="Scanned answer" />
        <VerifiedBadge />
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#CA8A04]">Extracted Text</p>
          <p className="mt-3 text-sm font-semibold leading-6">{result.extractedText}</p>
          <span className="mt-4 inline-flex rounded-lg bg-[#312E81]/10 px-3 py-1 text-xs font-black text-[#312E81]">{result.subject}</span>
        </section>
        <ResultBlock label="Explanation">{result.explanation}</ResultBlock>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#CA8A04]">Step By Step</p>
          <ol className="mt-4 space-y-3">
            {result.steps.map((step, index) => (
              <li className="flex gap-3 text-sm font-semibold leading-6" key={step}>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#FACC15] text-xs font-black">{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
        <ResultBlock label="Key Term">{result.keyTerm}</ResultBlock>
        <ResultBlock label="Practice This Next">{result.practice}</ResultBlock>
        <div className="grid gap-3 sm:grid-cols-2">
          <PrimaryButton href="/quiz">Try it now</PrimaryButton>
          <SecondaryButton href="/tutor">Ask follow-up</SecondaryButton>
        </div>
      </div>
    </AppShell>
  );
}

export function StudyPackPage() {
  const [source, setSource] = useState("paste");
  const [notes, setNotes] = useState("");
  const sources = [
    ["paste", "Paste notes", "notes"],
    ["pdf", "Upload PDF", "file"],
    ["photo", "Photo or screenshot", "camera"],
    ["voice", "Voice memo", "music"],
  ] as const;
  const selectedLabel = sources.find(([id]) => id === source)?.[1] ?? "Paste notes";
  const query = source === "paste" ? notes || "Cell biology notes" : selectedLabel;

  return (
    <AppShell>
      <div className="space-y-6">
        <SectionTitle eyebrow="Notes → Study Pack" title="Turn anything into revision" />
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
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
            <Icon name="upload" className="mx-auto text-[#312E81]" />
            <p className="mt-3 text-sm font-black">{selectedLabel}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">Upload support is coming soon.</p>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {["Summary", "Key points", "Flashcards", "Quiz", "Study guide", "Likely exam Qs"].map((chip) => (
            <span className="rounded-lg bg-[#FEFCE8] px-3 py-2 text-xs font-black text-[#CA8A04]" key={chip}>
              {chip}
            </span>
          ))}
        </div>
        <PrimaryButton className="w-full" href={`/study-pack/result?source=${encodeURIComponent(query)}`}>
          Buy pack
        </PrimaryButton>
      </div>
    </AppShell>
  );
}

export function StudyPackResultPage({ source }: { source: string }) {
  const pack = useMemo(() => buildStudyPack(source), [source]);
  const [tab, setTab] = useState("Summary");
  const tabs = ["Summary", "Flashcards", "Quiz", "Study guide", "Exam Qs"];

  return (
    <AppShell>
      <div className="space-y-5">
        <SectionTitle title="Study pack" />
        <div className="grid grid-cols-4 gap-2">
          {[
            ["Key points", pack.stats.keyPoints],
            ["Flashcards", pack.stats.flashcards],
            ["Quiz Qs", pack.stats.quizQs],
            ["Exam Qs", pack.stats.examQs],
          ].map(([label, value]) => (
            <div className="rounded-lg border border-slate-200 bg-white p-3 text-center shadow-sm" key={label}>
              <p className="text-xl font-black">{value}</p>
              <p className="mt-1 text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">{label}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((item) => (
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
          {tab === "Summary" ? <p className="text-sm font-semibold leading-6">{pack.summary}</p> : null}
          {tab === "Flashcards" ? (
            <div className="space-y-3">
              {pack.flashcards.map((card) => (
                <div className="rounded-lg bg-[#F8FAFC] p-4" key={card.front}>
                  <p className="font-black">{card.front}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-600">{card.back}</p>
                </div>
              ))}
            </div>
          ) : null}
          {tab === "Quiz" ? (
            <ol className="space-y-3">
              {pack.quiz.map((item) => (
                <li className="text-sm font-semibold" key={item.question}>
                  <span className="font-black">{item.number}. </span>
                  {item.question}
                  <p className="mt-1 text-slate-500">{item.answer}</p>
                </li>
              ))}
            </ol>
          ) : null}
          {tab === "Study guide" ? (
            <ol className="space-y-3">
              {pack.studyGuide.map((item, index) => (
                <li className="flex gap-3 text-sm font-semibold" key={item}>
                  <span className="font-black text-[#CA8A04]">{index + 1}</span>
                  {item}
                </li>
              ))}
            </ol>
          ) : null}
          {tab === "Exam Qs" ? (
            <div className="space-y-3">
              {pack.examQs.map((item) => (
                <p className="rounded-lg bg-[#F8FAFC] p-4 text-sm font-semibold" key={item}>{item}</p>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </AppShell>
  );
}

export function TestPrepPage() {
  const exams = ["SAT", "ACT", "MCAT", "GRE", "GMAT", "JAMB", "WAEC", "A-Level", "IB", "NEET"];

  return (
    <AppShell>
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
    </AppShell>
  );
}

export function FocusPage() {
  const [preset, setPreset] = useState<FocusPreset>(FOCUS_PRESETS[0]);
  const [audio, setAudio] = useState<FocusAudio>(FOCUS_AUDIO[0]);

  return (
    <AppShell>
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
    </AppShell>
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
    }
  }, [audio, minutes, preset, recordSession, seconds]);

  const mm = Math.floor(seconds / 60).toString().padStart(2, "0");
  const ss = (seconds % 60).toString().padStart(2, "0");
  const progress = 100 - Math.round((seconds / initialSeconds) * 100);

  return (
    <AppShell>
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
    </AppShell>
  );
}

export function CoachPage() {
  const { plans, answers } = useAppState();
  const plan = activePlan(plans);

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
    <AppShell showBack={false}>
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
                  ? `${plan.subject} · ${plan.completedDays}/${plan.totalDays} days · ${planProgress(plan)}% complete`
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
    </AppShell>
  );
}

export function PlansPage() {
  const { plans } = useAppState();

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <SectionTitle title="Study plans" />
          <PrimaryButton href="/plan/new">New</PrimaryButton>
        </div>
        {plans.length ? (
          <div className="space-y-3">
            {plans.map((plan) => (
              <Link className="block rounded-lg border border-slate-200 bg-white p-5 shadow-sm" href={`/plan/${plan.id}`} key={plan.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black">{plan.subject}</h2>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      {plan.completedDays}/{plan.totalDays} days · {formatDate(plan.examDate)}
                    </p>
                  </div>
                  <span className="rounded-lg bg-[#FEFCE8] px-3 py-2 text-sm font-black text-[#CA8A04]">{planProgress(plan)}%</span>
                </div>
                <div className="mt-4">
                  <ProgressBar value={planProgress(plan)} />
                </div>
              </Link>
            ))}
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
    </AppShell>
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

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!subject.trim() || !examDate) {
      return;
    }

    const plan = addPlan({ subject: subject.trim(), examDate, confidence, hoursPerDay, totalDays: 14 });
    updateAnswers({ exam: exam || subject.trim(), examDate, hoursPerDay });
    dismissKeyboard();
    router.push(`/plan/${plan.id}`);
  }

  return (
    <AppShell>
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
        <PrimaryButton className="w-full" disabled={!subject.trim() || !examDate} type="submit">Create plan</PrimaryButton>
      </form>
    </AppShell>
  );
}

function planTasks(plan: Plan, day: number) {
  return [
    `Review ${plan.subject} fundamentals for 20 minutes.`,
    `Complete ${Math.max(3, Math.min(8, day + 2))} practice questions.`,
    "Mark weak spots and save one explanation.",
  ];
}

function planFlashcards(plan: Plan, day: number) {
  const focus = day <= 4 ? "foundation" : day <= 9 ? "practice" : "exam strategy";

  return [
    {
      front: `Day ${day}: What is today's ${plan.subject} focus?`,
      back: `Build ${focus} confidence with one focused review block, then test recall immediately.`,
    },
    {
      front: `What should you do before practice questions?`,
      back: `Write the rule, formula, or definition first so the method is clear before you start solving.`,
    },
    {
      front: `How do you mark a weak spot today?`,
      back: `Save the exact subtopic, note the mistake pattern, and revisit it in the next session.`,
    },
  ];
}

export function PlanDetailPage({ id }: { id: string }) {
  const { plans } = useAppState();
  const plan = plans.find((item) => item.id === id) ?? plans[0];
  const [day, setDay] = useState(1);
  const [showCards, setShowCards] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);

  if (!plan) {
    return (
      <AppShell>
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-black">Plan not found</h1>
          <PrimaryButton href="/plan/new" className="mt-5">Create a plan</PrimaryButton>
        </div>
      </AppShell>
    );
  }

  const countdown = daysUntil(plan.examDate);
  const flashcards = planFlashcards(plan, day);
  const currentCard = flashcards[cardIndex];

  function openDayCards(nextDay: number) {
    setDay(nextDay);
    setCardIndex(0);
    setCardFlipped(false);
    setShowCards(true);
  }

  function movePlanCard(delta: number) {
    setCardIndex((value) => (value + delta + flashcards.length) % flashcards.length);
    setCardFlipped(false);
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="rounded-lg bg-gradient-to-br from-[#312E81] to-[#1E1B4B] p-6 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#FACC15]">{countdown ?? 0} days to exam</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">{plan.subject}</h1>
          <p className="mt-3 text-sm font-semibold text-white/76">Exam date: {formatDate(plan.examDate)}</p>
        </section>
        <div className="flex gap-2 overflow-x-auto">
          {Array.from({ length: 14 }, (_, index) => index + 1).map((item) => (
            <button
              aria-pressed={day === item}
              className={cn(
                "min-h-20 w-24 shrink-0 rounded-lg border p-3 text-left shadow-sm transition",
                day === item
                  ? "border-[#FACC15] bg-[#FACC15] text-[#1E1B4B] shadow-md"
                  : "border-slate-200 bg-white text-slate-500 hover:border-[#FACC15]/70 hover:text-[#1E1B4B]",
              )}
              key={item}
              onClick={() => openDayCards(item)}
              type="button"
            >
              <span className="block text-xs font-black uppercase tracking-[0.12em]">Day</span>
              <span className="mt-1 block text-2xl font-black">{item}</span>
              <span className="mt-1 block text-[11px] font-black uppercase tracking-[0.08em]">
                {item <= plan.completedDays ? "Done" : "Cards"}
              </span>
            </button>
          ))}
        </div>
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#CA8A04]">Day {day}</p>
          <h2 className="mt-2 text-xl font-black">Today&apos;s tasks</h2>
          <div className="mt-4 space-y-3">
            {planTasks(plan, day).map((task) => (
              <label className="flex items-center gap-3 rounded-lg bg-[#F8FAFC] p-3 text-sm font-semibold" key={task}>
                <input className="h-4 w-4 accent-[#FACC15]" type="checkbox" />
                {task}
              </label>
            ))}
          </div>
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
                <h2 className="mt-1 text-xl font-black text-[#1E1B4B]">{plan.subject}</h2>
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
          </section>
        </div>
      ) : null}
    </AppShell>
  );
}

export function SpacesPage() {
  const { answers, joinedSpaces, toggleSpace } = useAppState();
  const [search, setSearch] = useState("");
  const filtered = DUMMY_SPACES.filter((space) => `${space.code} ${space.title}`.toLowerCase().includes(search.toLowerCase()));
  const joined = filtered.filter((space) => joinedSpaces.includes(space.code));
  const discover = filtered.filter((space) => !joinedSpaces.includes(space.code));

  return (
    <AppShell>
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
        <SpaceSection spaces={joined} title="Joined" joinedSpaces={joinedSpaces} onToggle={toggleSpace} />
        <SpaceSection spaces={discover} title="Discover" joinedSpaces={joinedSpaces} onToggle={toggleSpace} />
      </div>
    </AppShell>
  );
}

function SpaceSection({
  title,
  spaces,
  joinedSpaces,
  onToggle,
}: {
  title: string;
  spaces: Space[];
  joinedSpaces: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <section>
      <h2 className="text-lg font-black">{title}</h2>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {spaces.length ? (
          spaces.map((space) => (
            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" key={space.code}>
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-lg px-3 py-2 text-sm font-black text-white" style={{ backgroundColor: space.color }}>{space.code}</span>
                <button className="rounded-lg bg-[#FACC15] px-3 py-2 text-xs font-black text-[#1E1B4B]" onClick={() => onToggle(space.code)} type="button">
                  {joinedSpaces.includes(space.code) ? "Leave" : "Join"}
                </button>
              </div>
              <h3 className="mt-4 text-lg font-black">{space.title}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{space.description}</p>
              <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-slate-400">{space.members} members</p>
            </article>
          ))
        ) : (
          <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-500">No spaces here yet.</p>
        )}
      </div>
    </section>
  );
}

export function ProfilePageClient() {
  const router = useRouter();
  const state = useAppState();
  const profileLine = [state.answers.country, state.answers.age, state.answers.level, state.answers.subject].filter(Boolean).join(" · ");

  function resetOnboarding() {
    state.resetOnboarding();
    router.push("/onboarding/profile-ready");
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="grid h-20 w-20 place-items-center rounded-lg bg-[#312E81] text-2xl font-black text-white">{initials(state.answers.name)}</div>
            <div>
              <h1 className="text-2xl font-black">{state.answers.name || "Aceley Student"}</h1>
              <p className="mt-1 text-sm font-semibold text-slate-500">{profileLine || "Profile details not set"}</p>
            </div>
          </div>
        </section>
        <div className="grid grid-cols-3 gap-3">
          {[
            ["Streak", state.streak],
            ["Hours", state.hoursStudied],
            ["Quizzes", state.savedQuizzes.length],
          ].map(([label, value]) => (
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm" key={label}>
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
                <Icon name={icon as "profile" | "lock" | "reset" | "delete"} className="h-4 w-4" />
                {label as string}
              </span>
              <Icon name="chevronRight" className="h-4 w-4 text-slate-300" />
            </button>
          ))}
        </section>
      </div>
    </AppShell>
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

export function QuizPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const current = SAMPLE_QUIZ.questions[index];

  function choose(optionIndex: number) {
    if (selected !== null) {
      return;
    }

    setSelected(optionIndex);
    if (optionIndex === current.answer) {
      setScore((value) => value + 1);
    }
  }

  function next() {
    if (index + 1 >= SAMPLE_QUIZ.questions.length) {
      const finalScore = score + (selected === current.answer ? 1 : 0);
      router.push(`/quiz/result?score=${finalScore}&total=${SAMPLE_QUIZ.questions.length}&title=${encodeURIComponent(SAMPLE_QUIZ.title)}`);
      return;
    }

    setIndex((value) => value + 1);
    setSelected(null);
  }

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <SectionTitle title={SAMPLE_QUIZ.title} />
          <span className="rounded-lg bg-white px-3 py-2 text-sm font-black shadow-sm">{index + 1}/{SAMPLE_QUIZ.questions.length}</span>
        </div>
        <ProgressBar value={(index / SAMPLE_QUIZ.questions.length) * 100} />
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black leading-tight">{current.question}</h2>
          <div className="mt-5 space-y-3">
            {current.options.map((option, optionIndex) => {
              const correct = optionIndex === current.answer;
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
              {selected === current.answer ? "Correct. " : "Not quite. "}
              {current.explanation}
            </div>
          ) : null}
        </section>
        <PrimaryButton className="w-full" disabled={selected === null} onClick={next}>
          {index + 1 >= SAMPLE_QUIZ.questions.length ? "Finish" : "Next"}
        </PrimaryButton>
      </div>
    </AppShell>
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
      if (percent >= 80) {
        addStrongTopic("Cell Biology");
      }
    }
  }, [addStrongTopic, percent, recordQuiz, score, title, total]);

  return (
    <AppShell>
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
    </AppShell>
  );
}

export function FlashcardsPage() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const touchStart = useRef<number | null>(null);
  const card = SAMPLE_DECK[index];

  function move(delta: number) {
    setIndex((value) => (value + delta + SAMPLE_DECK.length) % SAMPLE_DECK.length);
    setFlipped(false);
  }

  function onTouchEnd(event: TouchEvent) {
    if (touchStart.current === null) {
      return;
    }

    const delta = event.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(delta) > 50) {
      move(delta < 0 ? 1 : -1);
    }
    touchStart.current = null;
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <SectionTitle title="Flashcards" />
        <button
          className={cn("min-h-[24rem] w-full rounded-lg border p-8 text-center shadow-lg transition", flipped ? "border-[#FACC15] bg-[#FEFCE8]" : "border-slate-200 bg-white")}
          onClick={() => setFlipped((value) => !value)}
          onTouchEnd={onTouchEnd}
          onTouchStart={(event) => {
            touchStart.current = event.touches[0].clientX;
          }}
          type="button"
        >
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#CA8A04]">{flipped ? "Back" : "Front"} · {index + 1}/{SAMPLE_DECK.length}</p>
          <p className="mt-16 text-3xl font-black leading-tight">{flipped ? card.back : card.front}</p>
        </button>
        <div className="grid grid-cols-2 gap-3">
          <SecondaryButton onClick={() => move(-1)}>Previous</SecondaryButton>
          <PrimaryButton onClick={() => move(1)}>Next</PrimaryButton>
        </div>
      </div>
    </AppShell>
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
    <AppShell>
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
    </AppShell>
  );
}

export function ExplainResultPage({ topic, style }: { topic: string; style: string }) {
  const result = useMemo(() => buildExplanation(topic, style), [style, topic]);
  const { savedExplanations, saveExplanation, removeSavedExplanation } = useAppState();
  const id = `explain-${style}-${topic}`.slice(0, 90);
  const saved = savedExplanations.some((item) => item.id === id);

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <SectionTitle title={result.title} />
          <button
            className={cn("grid h-11 w-11 place-items-center rounded-lg border shadow-sm", saved ? "border-[#FACC15] bg-[#FACC15]" : "border-slate-200 bg-white")}
            onClick={() => (saved ? removeSavedExplanation(id) : saveExplanation({ id, topic, style, preview: result.preview }))}
            type="button"
          >
            <Icon name="bookmark" className="h-4 w-4" />
          </button>
        </div>
        <ResultBlock label="Summary">{result.summary}</ResultBlock>
        {result.sections.map((section) => (
          <ResultBlock label={section.heading} key={section.heading}>{section.body}</ResultBlock>
        ))}
      </div>
    </AppShell>
  );
}

export function ProgressPage() {
  const state = useAppState();
  const hasAny = state.savedQuizzes.length || state.askHistory.length || state.studySessions.length;

  if (!hasAny) {
    return (
      <AppShell>
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <Icon name="progress" className="mx-auto text-[#312E81]" />
          <h1 className="mt-3 text-xl font-black">No progress yet</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">Finish a quiz, ask a question, or complete a focus session to see your stats.</p>
          <PrimaryButton href="/quiz" className="mt-5">Start a quiz</PrimaryButton>
        </div>
      </AppShell>
    );
  }

  const answered = state.askHistory.length;
  const quizScores = state.savedQuizzes
    .map((quiz) => {
      const [score, total] = quiz.score.split("/").map((part) => Number(part.trim()));
      return Number.isFinite(score) && Number.isFinite(total) && total ? score / total : 0;
    })
    .filter(Boolean);
  const correctRate = quizScores.length ? Math.round((quizScores.reduce((sum, item) => sum + item, 0) / quizScores.length) * 100) : 0;
  const readiness = Math.min(100, Math.round(correctRate * 0.55 + Math.min(state.hoursStudied * 8, 30) + Math.min(answered * 3, 15)));
  const bars = Array.from({ length: 7 }, (_, index) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - index));
    const key = day.toISOString().slice(0, 10);
    return state.studySessions
      .filter((session) => session.endedAt.slice(0, 10) === key)
      .reduce((sum, session) => sum + session.minutes, 0);
  });
  const maxBar = Math.max(30, ...bars);
  const topics = [...state.strongTopics, ...state.answers.weakTopics].slice(0, 6);

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#CA8A04]">Exam readiness</p>
          <p className="mt-3 text-6xl font-black">{readiness}%</p>
        </section>
        <div className="grid grid-cols-2 gap-3">
          {[
            ["Questions answered", answered],
            ["Correct rate", `${correctRate}%`],
            ["Hours studied", state.hoursStudied],
            ["Streak", state.streak],
          ].map(([label, value]) => (
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" key={label}>
              <p className="text-2xl font-black">{value}</p>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-slate-400">{label}</p>
            </div>
          ))}
        </div>
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black">Weekly study</h2>
          <div className="mt-5 flex h-40 items-end gap-2">
            {bars.map((minutes, index) => (
              <div className="flex flex-1 flex-col items-center gap-2" key={index}>
                <div className="w-full rounded-t-lg bg-[#FACC15]" style={{ height: `${Math.max(8, (minutes / maxBar) * 100)}%` }} />
                <span className="text-[10px] font-black text-slate-400">{minutes}m</span>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black">Topic mastery</h2>
          <div className="mt-4 space-y-3">
            {topics.length ? (
              topics.map((topic, index) => (
                <div key={topic}>
                  <div className="mb-2 flex justify-between text-sm font-black">
                    <span>{topic}</span>
                    <span>{index < state.strongTopics.length ? "Strong" : "Needs work"}</span>
                  </div>
                  <ProgressBar value={index < state.strongTopics.length ? 86 : 42} />
                </div>
              ))
            ) : (
              <p className="text-sm font-semibold text-slate-500">Mastery rows will appear as you save explanations and finish quizzes.</p>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
