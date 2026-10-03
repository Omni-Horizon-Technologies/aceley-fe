import type { Metadata } from "next";
import { AppLayout } from "@/app/components/app-layout";
import { PricingPlanCta } from "@/app/components/public-auth-actions";
import { Icon, cn } from "@/app/components/ui";

export const metadata: Metadata = {
  title: "Pricing | Aceley",
  description:
    "Pick the Aceley plan that fits your study load. Credits, study plans, test prep, and uploads — priced for students.",
};

type PricingPlan = {
  name: string;
  badge?: string;
  price: string;
  cadence: string;
  description: string;
  billing: string;
  savings?: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
};

const plans: PricingPlan[] = [
  {
    name: "Small",
    price: "$9.99",
    cadence: "/mo",
    description: "2,000 credits a month for steady weekly study.",
    billing: "Billed monthly",
    features: [
      "2,000 monthly credits",
      "10 study plans",
      "10 test prep tracks",
      "Ask My Docs: 20 docs",
      "20 uploads / month",
    ],
    cta: "Choose Small",
    href: "/paywall",
  },
  {
    name: "Best",
    badge: "Most Popular",
    price: "$5.83",
    cadence: "/mo",
    description: "4,000 credits a month at the best per-credit price.",
    billing: "Billed $69.99/year",
    savings: "Save 42%",
    features: [
      "4,000 monthly credits",
      "20 study plans",
      "20 test prep tracks",
      "Ask My Docs: 50 docs",
      "50 uploads / month",
    ],
    cta: "Choose Best",
    href: "/paywall",
    highlighted: true,
  },
  {
    name: "Unlimited",
    price: "$23",
    cadence: "/mo",
    description: "No caps on credits, uploads, plans, or test prep.",
    billing: "Billed monthly",
    features: [
      "Unlimited credits",
      "Unlimited study plans",
      "Unlimited test prep tracks",
      "Unlimited Ask My Docs",
      "Unlimited uploads",
      "Priority support",
    ],
    cta: "Choose Unlimited",
    href: "/paywall",
  },
];

type ComparisonRow = {
  feature: string;
  free: string;
  small: string;
  best: string;
  unlimited: string;
};

const comparison: ComparisonRow[] = [
  {
    feature: "Monthly credits",
    free: "10",
    small: "2,000",
    best: "4,000",
    unlimited: "∞",
  },
  {
    feature: "Study plans",
    free: "1",
    small: "10",
    best: "20",
    unlimited: "Unlimited",
  },
  {
    feature: "Test prep tracks",
    free: "1",
    small: "10",
    best: "20",
    unlimited: "Unlimited",
  },
  {
    feature: "Ask My Docs library",
    free: "3 docs",
    small: "20 docs",
    best: "50 docs",
    unlimited: "Unlimited",
  },
  {
    feature: "Uploads",
    free: "3 / mo",
    small: "20 / mo",
    best: "50 / mo",
    unlimited: "Unlimited",
  },
  {
    feature: "Priority support",
    free: "—",
    small: "—",
    best: "—",
    unlimited: "✓",
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
          <span className="text-5xl font-black tracking-tight">
            {plan.price}
          </span>
          <span
            className={cn(
              "pb-2 text-sm font-bold",
              plan.highlighted ? "text-white/70" : "text-slate-500",
            )}
          >
            {plan.cadence}
          </span>
        </div>
        <p
          className={cn(
            "mt-3 text-sm font-semibold",
            plan.highlighted ? "text-white/80" : "text-slate-600",
          )}
        >
          {plan.billing}
        </p>
        {plan.savings ? (
          <p className="mt-2 inline-flex rounded-lg bg-[#FACC15]/10 px-3 py-1 text-sm font-black text-[#CA8A04]">
            {plan.savings}
          </p>
        ) : null}
      </div>

      <div className="mt-7">
        <PricingPlanCta
          cta={plan.cta}
          highlighted={plan.highlighted}
          href={plan.href}
        />
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
            <span
              className={plan.highlighted ? "text-white/86" : "text-slate-700"}
            >
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
    <AppLayout>
      <div className="mx-auto max-w-3xl text-center">
        <p className="inline-flex rounded-lg bg-[#FACC15]/10 px-3 py-2 text-sm font-black uppercase tracking-[0.16em] text-[#CA8A04]">
          Pricing
        </p>
        <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-[#1E1B4B] sm:text-5xl">
          Simple pricing for serious students
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          Credits power everything — AI tutor answers, generated flashcards,
          quizzes, and scans. Pick a tier below or start free with 10 credits a
          month.
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

      <div className="mt-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex rounded-lg bg-[#312E81]/10 px-3 py-2 text-sm font-black uppercase tracking-[0.16em] text-[#312E81]">
            Compare plans
          </p>
          <h2 className="mt-5 text-3xl font-black tracking-tight text-[#1E1B4B] sm:text-4xl">
            Everything, side by side
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Here&rsquo;s what Free, Small, Best, and Unlimited include every
            month.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="bg-[#F8FAFC] text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                  <th className="px-5 py-4">Feature</th>
                  <th className="px-5 py-4 text-center">Free</th>
                  <th className="px-5 py-4 text-center">Small</th>
                  <th className="bg-[#FEF3C7] px-5 py-4 text-center text-[#1E1B4B]">
                    Best
                  </th>
                  <th className="px-5 py-4 text-center">Unlimited</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {comparison.map((row) => (
                  <tr key={row.feature} className="text-[#1E1B4B]">
                    <th
                      scope="row"
                      className="px-5 py-4 text-left font-black text-slate-700"
                    >
                      {row.feature}
                    </th>
                    <td className="px-5 py-4 text-center font-semibold text-slate-600">
                      {row.free}
                    </td>
                    <td className="px-5 py-4 text-center font-semibold text-slate-700">
                      {row.small}
                    </td>
                    <td className="bg-[#FEF3C7]/40 px-5 py-4 text-center font-black text-[#1E1B4B]">
                      {row.best}
                    </td>
                    <td className="px-5 py-4 text-center font-semibold text-slate-700">
                      {row.unlimited}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-5 text-center text-xs font-semibold text-slate-500">
          Credits refresh at the start of each billing period. Unused credits
          don&rsquo;t roll over.
        </p>
      </div>
    </AppLayout>
  );
}
