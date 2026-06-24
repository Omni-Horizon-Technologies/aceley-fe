import Link from "next/link";
import type { Metadata } from "next";
import { BackButton } from "@/app/components/back-button";
import { SiteFooter } from "@/app/components/site-footer";
import {
  BrandMark,
  Icon,
  PrimaryButton,
  SecondaryButton,
  cn,
} from "@/app/components/ui";

export const metadata: Metadata = {
  title: "Pricing | Aceley",
  description:
    "Simple student-friendly pricing for Aceley flashcards, AI generation, and smart study tools.",
};

type PricingPlan = {
  name: string;
  badge?: string;
  price: string;
  cadence: string;
  description: string;
  note?: string;
  savings?: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
};

const plans: PricingPlan[] = [
  {
    name: "Free",
    price: "£0",
    cadence: "/month",
    description: "Perfect for students trying the platform.",
    features: [
      "3 Decks",
      "Up to 100 Flashcards",
      "Basic Study Mode",
      "Basic AI Flashcard Generation",
      "Progress Tracking",
      "Standard Support",
    ],
    cta: "Start Free",
    href: "/auth",
  },
  {
    name: "Student Pro",
    badge: "Most Popular",
    price: "£4.99",
    cadence: "/month",
    description: "For students who study regularly and want unlimited access.",
    features: [
      "Unlimited Decks",
      "Unlimited Flashcards",
      "Unlimited AI Flashcard Generation",
      "PDF Uploads",
      "Image-to-Flashcard Generation",
      "Smart Review System",
      "Progress Tracking",
      "Study Streaks",
      "Priority Support",
    ],
    cta: "Upgrade to Pro",
    href: "/auth",
    highlighted: true,
  },
  {
    name: "Student Pro Annual",
    badge: "Best Value",
    price: "£39.99",
    cadence: "/year",
    description: "The best plan for students who want the full year covered.",
    note: "Equivalent to approx. £3.33/month",
    savings: "Save 33% annually",
    features: [
      "Everything in Student Pro",
      "Annual Savings",
      "Priority Access to New Features",
      "Best Value Plan",
    ],
    cta: "Get Annual Plan",
    href: "/auth",
  },
];

const trustMessages = [
  { label: "No hidden fees", icon: "check" as const },
  { label: "Cancel anytime", icon: "check" as const },
  { label: "Student-friendly pricing", icon: "check" as const },
  { label: "Secure payments", icon: "lock" as const },
];

function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-lg border bg-white p-6 shadow-sm transition md:p-7",
        plan.highlighted
          ? "border-[#312E81] bg-gradient-to-br from-[#312E81] to-[#1E1B4B] text-white shadow-xl shadow-[#1E1B4B]/18"
          : "border-slate-200 text-[#1E1B4B]",
      )}
    >
      {plan.badge ? (
        <div className="absolute right-5 top-5">
          <span
            className={cn(
              "rounded-lg px-3 py-1 text-xs font-black uppercase tracking-[0.14em]",
              plan.highlighted
                ? "bg-[#FACC15] text-[#1E1B4B]"
                : "bg-[#FACC15]/10 text-[#CA8A04]",
            )}
          >
            {plan.badge}
          </span>
        </div>
      ) : null}

      <div className="pr-24">
        <h2
          className={cn(
            "text-xl font-black tracking-tight",
            plan.highlighted ? "text-white" : "text-[#1E1B4B]",
          )}
        >
          {plan.name}
        </h2>
        <p
          className={cn(
            "mt-3 min-h-12 text-sm leading-6",
            plan.highlighted ? "text-white/74" : "text-slate-600",
          )}
        >
          {plan.description}
        </p>
      </div>

      <div className="mt-6">
        <div className="flex items-end gap-1">
          <span className="text-5xl font-black tracking-tight">{plan.price}</span>
          <span
            className={cn(
              "pb-2 text-sm font-bold",
              plan.highlighted ? "text-white/70" : "text-slate-500",
            )}
          >
            {plan.cadence}
          </span>
        </div>
        {plan.note ? (
          <p
            className={cn(
              "mt-3 text-sm font-semibold",
              plan.highlighted ? "text-white/80" : "text-slate-600",
            )}
          >
            {plan.note}
          </p>
        ) : null}
        {plan.savings ? (
          <p className="mt-2 inline-flex rounded-lg bg-[#FACC15]/10 px-3 py-1 text-sm font-black text-[#CA8A04]">
            {plan.savings}
          </p>
        ) : null}
      </div>

      <div className="mt-7">
        {plan.highlighted ? (
          <PrimaryButton
            href={plan.href}
            className="w-full bg-[#FACC15] !text-[#1E1B4B] hover:bg-white hover:!text-[#312E81]"
          >
            {plan.cta}
          </PrimaryButton>
        ) : (
          <SecondaryButton href={plan.href} className="w-full">
            {plan.cta}
          </SecondaryButton>
        )}
      </div>

      <ul className="mt-7 flex flex-1 flex-col gap-3">
        {plan.features.map((feature) => (
          <li className="flex gap-3 text-sm leading-6" key={feature}>
            <span
              className={cn(
                "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-lg",
                plan.highlighted
                  ? "bg-white/12 text-[#FACC15]"
                  : "bg-[#312E81]/10 text-[#312E81]",
              )}
            >
              <Icon name="check" className="h-3.5 w-3.5" />
            </span>
            <span className={plan.highlighted ? "text-white/86" : "text-slate-700"}>
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#1E1B4B]">
      <header className="border-b border-slate-200 bg-white/90 px-4 py-5 backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BackButton className="h-10 w-10" fallbackHref="/" />
            <BrandMark />
          </div>
          <nav className="flex items-center gap-4" aria-label="Pricing navigation">
            <Link
              className="hidden text-sm font-bold text-slate-600 transition hover:text-[#312E81] sm:inline-flex"
              href="/"
            >
              Home
            </Link>
            <SecondaryButton href="/dashboard" className="hidden sm:inline-flex">
              Try Demo
            </SecondaryButton>
            <PrimaryButton href="/auth" className="bg-[#FACC15] !text-[#1E1B4B] hover:bg-[#312E81] hover:!text-white">
              Start Free
            </PrimaryButton>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex rounded-lg bg-[#FACC15]/10 px-3 py-2 text-sm font-black uppercase tracking-[0.16em] text-[#CA8A04]">
            Pricing
          </p>
          <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-[#1E1B4B] sm:text-5xl">
            Simple Pricing for Serious Students
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Start free and upgrade only when you need unlimited flashcards, AI
            generation, and smarter study tools.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3 lg:items-stretch">
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {trustMessages.map((message) => (
              <div
                className="flex items-center gap-3 rounded-lg bg-[#F8FAFC] px-4 py-3"
                key={message.label}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#312E81]/10 text-[#312E81]">
                  <Icon name={message.icon} className="h-4 w-4" />
                </span>
                <span className="text-sm font-bold text-[#1E1B4B]">
                  {message.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
