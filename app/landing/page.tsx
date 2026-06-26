import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PublicAuthActions, PublicAuthFooterLinks } from "@/app/components/public-auth-actions";
import { Icon, PrimaryButton, SecondaryButton, cn } from "@/app/components/ui";

export const metadata: Metadata = {
  title: "Aceley | AI study coach for exam season",
  description:
    "Aceley helps students turn questions, notes, and exam dates into tutoring, study plans, flashcards, focus sessions, and progress tracking.",
};

const featureCards = [
  {
    title: "AI tutoring",
    description: "Get clear explanations, revision prompts, and guided help when a question gets stuck.",
    icon: "chat" as const,
    image: "/3dicons-chat-bubble-dynamic-gradient.png",
  },
  {
    title: "Study plans",
    description: "Build a focused sprint from your subject, deadline, confidence, and uploaded material.",
    icon: "target" as const,
    image: "/3dicons-target-dynamic-gradient.png",
  },
  {
    title: "Smart notes",
    description: "Turn pasted notes or documents into summaries, flashcards, quizzes, and likely exam questions.",
    icon: "notes" as const,
    image: "/3dicons-copy-dynamic-gradient.png",
  },
  {
    title: "Focus mode",
    description: "Start quiet timed sessions with ambient settings and keep your study hours moving.",
    icon: "clock" as const,
    image: "/3dicons-rocket-dynamic-gradient.png",
  },
];

const outcomes = [
  { value: "6", label: "Core study tools" },
  { value: "14", label: "Day plan view" },
  { value: "24/7", label: "Mock tutor help" },
];

const steps = [
  {
    title: "Tell Aceley what you are studying",
    description: "Add your school, major, exam date, and confidence so the workspace starts with context.",
  },
  {
    title: "Create a sprint or ask a question",
    description: "Upload a document, scan a prompt, paste notes, or open the coach to build a plan.",
  },
  {
    title: "Study from one dashboard",
    description: "Move between tutoring, flashcards, quizzes, focus sessions, and progress without losing momentum.",
  },
];

const footerGroups = [
  {
    title: "Product",
    links: [
      { href: "/tutor", label: "AI tutoring" },
      { href: "/coach", label: "Coach" },
      { href: "/ask", label: "Ask anything" },
      { href: "/study-pack", label: "Study pack" },
    ],
  },
  {
    title: "Study",
    links: [
      { href: "/plan/new", label: "Create plan" },
      { href: "/focus", label: "Focus mode" },
      { href: "/quiz", label: "Practice quiz" },
      { href: "/flashcards", label: "Flashcards" },
    ],
  },
];

function LogoLink() {
  return (
    <Link className="flex items-center gap-3 font-black text-white" href="/landing">
      <Image
        alt=""
        className="h-10 w-10 rounded-lg object-cover shadow-sm"
        height={40}
        priority
        src="/images%20/files/profile%20p.jpeg"
        width={40}
      />
      <span>Aceley</span>
    </Link>
  );
}

function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1.4fr]">
          <div>
            <Link className="flex items-center gap-3 font-black text-[#1E1B4B]" href="/landing">
              <Image
                alt=""
                className="h-10 w-10 rounded-lg object-cover shadow-sm"
                height={40}
                src="/images%20/files/profile%20p.jpeg"
                width={40}
              />
              <span>Aceley</span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
              AI tutoring, study plans, flashcards, focus sessions, and progress tracking for exam-ready students.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Student-ready", "Mock AI flows", "Local progress"].map((item) => (
                <span className="inline-flex items-center gap-2 rounded-lg bg-[#F8FAFC] px-3 py-2 text-xs font-black text-[#1E1B4B]" key={item}>
                  <Icon name="check" className="h-3.5 w-3.5 text-[#312E81]" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <nav className="grid gap-8 sm:grid-cols-3" aria-label="Footer navigation">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h2 className="text-sm font-black text-[#1E1B4B]">{group.title}</h2>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={`${group.title}-${link.label}`}>
                      <Link className="text-sm font-semibold text-slate-600 transition hover:text-[#CA8A04]" href={link.href}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h2 className="text-sm font-black text-[#1E1B4B]">Account</h2>
              <ul className="mt-4 space-y-3">
                <PublicAuthFooterLinks linkClassName="text-sm font-semibold text-slate-600 transition hover:text-[#CA8A04]" />
                <li>
                  <Link className="text-sm font-semibold text-slate-600 transition hover:text-[#CA8A04]" href="/pricing">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Aceley. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 font-semibold">
            <Link className="transition hover:text-[#CA8A04]" href="/paywall">
              Terms
            </Link>
            <Link className="transition hover:text-[#CA8A04]" href="/paywall">
              Privacy
            </Link>
            <Link className="transition hover:text-[#CA8A04]" href="/paywall">
              Restore
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function HeroPreview() {
  return (
    <div className="pointer-events-none relative z-10 mx-auto mt-10 h-[30rem] max-w-6xl overflow-hidden rounded-lg border border-white/12 bg-white/8 p-3 shadow-2xl shadow-black/20 backdrop-blur md:h-[31rem] md:p-4">
      <div className="grid h-full gap-3 md:grid-cols-[0.9fr_1.1fr_0.9fr]">
        <div className="hidden min-h-0 flex-col gap-3 md:flex">
          <div className="rounded-lg bg-white p-4 text-[#1E1B4B] shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#CA8A04]">Daily focus</p>
            <h2 className="mt-2 text-lg font-black">Cell Biology</h2>
            <p className="mt-1 text-xs font-bold text-slate-500">Day 4 of 14 · 42 min left</p>
          </div>
          <div className="grid flex-1 place-items-center rounded-lg bg-[#FACC15] p-5">
            <Image
              alt=""
              className="h-28 w-28 object-contain"
              height={128}
              src="/3dicons-target-dynamic-gradient.png"
              width={128}
            />
          </div>
        </div>

        <div className="min-h-0 rounded-lg bg-[#F8FAFC] p-4 text-[#1E1B4B] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="rounded-lg bg-[#312E81]/10 px-3 py-2 text-xs font-black text-[#312E81]">
              Coach
            </span>
            <span className="rounded-lg bg-[#FEF3C7] px-3 py-2 text-xs font-black text-[#92400E]">
              Active plan
            </span>
          </div>
          <h2 className="mt-5 text-2xl font-black tracking-tight">Plan a new sprint</h2>
          <div className="mt-5 space-y-3">
            {["Upload document", "Build flashcards", "Practice weak spots"].map((item, index) => (
              <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3" key={item}>
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#FACC15]/20 text-[#CA8A04]">
                  {index + 1}
                </span>
                <span className="text-sm font-black">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden min-h-0 flex-col gap-3 md:flex">
          <div className="grid flex-1 place-items-center rounded-lg bg-white p-5">
            <Image
              alt=""
              className="h-28 w-28 object-contain"
              height={128}
              src="/3dicons-chat-text-dynamic-gradient.png"
              width={128}
            />
          </div>
          <div className="rounded-lg bg-[#111827] p-4 text-white shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#FACC15]">Focus mode</p>
            <h2 className="mt-2 text-lg font-black">25-min session</h2>
            <p className="mt-1 text-xs font-bold text-white/60">Soft rain · no distractions</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#1E1B4B]">
      <section className="relative overflow-hidden bg-[#1E1B4B] px-4 pb-10 text-white sm:px-6 lg:px-8">
        <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between gap-4 py-5">
          <LogoLink />
          <nav className="hidden items-center gap-6 text-sm font-bold text-white/74 md:flex" aria-label="Landing navigation">
            <a className="transition hover:text-[#FACC15]" href="#features">Features</a>
            <a className="transition hover:text-[#FACC15]" href="#plans">Plans</a>
            <a className="transition hover:text-[#FACC15]" href="#how-it-works">How it works</a>
          </nav>
          <PublicAuthActions tone="dark" />
        </header>

        <Image
          alt=""
          className="absolute left-3 top-24 h-20 w-20 rotate-[-10deg] object-contain opacity-80 sm:left-10 sm:h-28 sm:w-28"
          height={112}
          priority
          src="/3dicons-chat-bubble-dynamic-gradient.png"
          width={112}
        />
        <Image
          alt=""
          className="absolute right-6 top-28 h-20 w-20 rotate-12 object-contain opacity-80 sm:right-16 sm:h-28 sm:w-28"
          height={112}
          priority
          src="/3dicons-rocket-dynamic-gradient.png"
          width={112}
        />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center pt-10 text-center sm:pt-14 lg:pt-16">
          <p className="inline-flex rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#FACC15]">
            AI study coach
          </p>
          <h1 className="mt-5 text-5xl font-black leading-[0.96] tracking-tight sm:text-6xl lg:text-7xl">
            Aceley
          </h1>
          <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-white/78 sm:text-xl">
            Become exam-ready, your way. Turn questions, notes, and deadlines into tutoring, revision plans, flashcards, and focused study sessions.
          </p>
          <PublicAuthActions tone="dark" variant="hero" className="mt-8" />
          <Link className="mt-4 text-sm font-black text-white/70 transition hover:text-[#FACC15]" href="#features">
            See what Aceley can do
          </Link>
        </div>

        <HeroPreview />
      </section>

      <section className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-3">
          {outcomes.map((item) => (
            <div className="rounded-lg bg-[#F8FAFC] px-5 py-4" key={item.label}>
              <p className="text-3xl font-black text-[#312E81]">{item.value}</p>
              <p className="mt-1 text-sm font-bold text-slate-600">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8" id="features">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#CA8A04]">Study workspace</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              One place for the work students actually do.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Aceley keeps the daily flow simple: get unstuck, make a plan, revise from your notes, and protect focused time.
            </p>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-2">
            {featureCards.map((feature) => (
              <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" key={feature.title}>
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#312E81]/10 text-[#312E81]">
                    <Icon name={feature.icon} />
                  </span>
                  <Image
                    alt=""
                    className="h-16 w-16 object-contain"
                    height={72}
                    src={feature.image}
                    width={72}
                  />
                </div>
                <h3 className="mt-5 text-xl font-black tracking-tight">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8" id="plans">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#CA8A04]">Coach section</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Build a sprint from a deadline, a document, or a weak spot.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              The coach area is designed around study planning: your current plan, active progress, how Aceley plans work, and a fast route to create the next sprint.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="/coach">
                Open coach
                <Icon name="chevronRight" className="h-4 w-4" />
              </PrimaryButton>
              <SecondaryButton href="/plan/new">Create plan</SecondaryButton>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-4 shadow-sm">
            <div className="rounded-lg bg-[#312E81] p-5 text-white">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-lg bg-white/12 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#FACC15]">
                  Your study plan
                </span>
                <Icon name="target" className="text-[#FACC15]" />
              </div>
              <h3 className="mt-5 text-2xl font-black tracking-tight">Biology exam sprint</h3>
              <p className="mt-2 text-sm font-semibold text-white/70">14 days · 2 hours/day · confidence rising</p>
              <div className="mt-5 h-2 rounded-lg bg-white/14">
                <div className="h-full w-[58%] rounded-lg bg-[#FACC15]" />
              </div>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {["Build a plan", "Active plan", "How plans work"].map((label) => (
                <div className="rounded-lg border border-slate-200 bg-white p-4" key={label}>
                  <Icon name="check" className="text-[#312E81]" />
                  <p className="mt-3 text-sm font-black">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8" id="how-it-works">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#CA8A04]">How it works</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                From signup to study session in minutes.
              </h2>
            </div>
            <SecondaryButton href="/pricing">View pricing</SecondaryButton>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" key={step.title}>
                <span
                  className={cn(
                    "grid h-11 w-11 place-items-center rounded-lg text-sm font-black",
                    index === 1 ? "bg-[#FACC15] text-[#1E1B4B]" : "bg-[#312E81]/10 text-[#312E81]",
                  )}
                >
                  {index + 1}
                </span>
                <h3 className="mt-5 text-lg font-black tracking-tight">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-lg bg-[#111827] p-6 text-white sm:p-8 lg:p-10">
          <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#FACC15]">Ready when exam season starts</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Start with one question, one note, or one deadline.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
                Aceley will turn it into the next useful action: an explanation, a quiz, a study pack, or a focused plan.
              </p>
            </div>
            <PublicAuthActions tone="dark" variant="stack" />
          </div>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
