import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { LottieMascot } from "@/app/components/lottie-mascot";
import { PublicAuthActions, PublicAuthFooterLinks } from "@/app/components/public-auth-actions";
import { Icon, BrandMark, cn } from "@/app/components/ui";

export const metadata: Metadata = {
  title: "Aceley | AI study coach for exam season",
  description:
    "Aceley helps students turn questions, notes, and exam dates into tutoring, study plans, flashcards, focus sessions, and progress tracking.",
};

const features = [
  {
    label: "Smart notes",
    headline: "Paste your notes. Get a complete study pack.",
    description:
      "Drop in your lecture notes, textbook highlights, or messy scribbles. Aceley turns them into flashcards, quizzes, summaries, and likely exam questions — instantly.",
    image: "/images%20/visuals/paste-notes.svg",
    bullets: [
      "Auto-generates flashcards and practice questions",
      "Summarises key concepts into revision-ready formats",
      "Works with pasted text or uploaded documents",
    ],
  },
  {
    label: "Scan & upload",
    headline: "Snap a photo. Aceley does the rest.",
    description:
      "Take a photo of your textbook, worksheet, or handwritten notes. Aceley reads it, extracts the content, and builds study materials around it.",
    image: "/images%20/visuals/scan-upload.svg",
    bullets: [
      "Camera scan with instant text extraction",
      "Supports handwritten and printed content",
      "Generates study packs from any image",
    ],
  },
  {
    label: "Study smarter",
    headline: "One dashboard. Zero wasted time.",
    description:
      "Your tutor, flashcards, quizzes, focus timer, and study plan all live in one place. No more switching between five different apps.",
    image: "/images%20/visuals/study-smart.svg",
    bullets: [
      "Everything in one unified workspace",
      "AI adapts content to your weak spots",
      "Track progress and stay on schedule",
    ],
  },
];

const tools = [
  { name: "AI Tutor", icon: "chat" as const, color: "bg-indigo-100 text-indigo-700", description: "Get instant explanations" },
  { name: "Quiz", icon: "bolt" as const, color: "bg-amber-100 text-amber-700", description: "Test your knowledge" },
  { name: "Flashcards", icon: "book" as const, color: "bg-emerald-100 text-emerald-700", description: "Memorise key concepts" },
  { name: "Scan", icon: "scan" as const, color: "bg-rose-100 text-rose-700", description: "Photo to study pack" },
  { name: "Explain", icon: "brain" as const, color: "bg-violet-100 text-violet-700", description: "Break down tough topics" },
  { name: "Focus", icon: "clock" as const, color: "bg-sky-100 text-sky-700", description: "Timed study sessions" },
  { name: "Plans", icon: "target" as const, color: "bg-orange-100 text-orange-700", description: "Sprint to your deadline" },
  { name: "Ask", icon: "spark" as const, color: "bg-fuchsia-100 text-fuchsia-700", description: "Ask anything, anytime" },
];

const howItWorks = [
  { title: "Tell Aceley what you\u2019re studying", description: "Add your subject, exam date, and upload your notes or snap a photo." },
  { title: "Get a personalised study plan", description: "Aceley builds a sprint with flashcards, quizzes, and focus sessions tailored to you." },
  { title: "Study, review, repeat", description: "Work through your plan, track progress, and let Aceley adapt as you improve." },
];

const trustItems = [
  { icon: "school" as const, text: "Built for university students" },
  { icon: "bolt" as const, text: "AI-powered in seconds" },
  { icon: "calendar" as const, text: "Study plans in under 2 minutes" },
  { icon: "brain" as const, text: "Adapts to how you learn" },
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

function LandingFooter() {
  const allLinks = footerGroups.flatMap((g) => g.links);

  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:gap-4">
        {/* Top row: brand + nav links inline */}
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <BrandMark tone="light" />
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2" aria-label="Footer navigation">
            {allLinks.map((link) => (
              <Link className="text-xs font-semibold text-slate-500 transition hover:text-[#CA8A04]" href={link.href} key={link.label}>
                {link.label}
              </Link>
            ))}
            <PublicAuthFooterLinks linkClassName="text-xs font-semibold text-slate-500 transition hover:text-[#CA8A04]" />
            <Link className="text-xs font-semibold text-slate-500 transition hover:text-[#CA8A04]" href="/pricing">
              Pricing
            </Link>
          </nav>
        </div>

        {/* Bottom row: copyright + legal */}
        <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 Aceley. All rights reserved.</p>
          <div className="flex gap-4 font-semibold">
            <Link className="transition hover:text-[#CA8A04]" href="/paywall">Terms</Link>
            <Link className="transition hover:text-[#CA8A04]" href="/paywall">Privacy</Link>
            <Link className="transition hover:text-[#CA8A04]" href="/paywall">Restore</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#1E1B4B]">
      {/* ───── 1. Hero (full viewport) ───── */}
      <section
        className="relative flex min-h-screen flex-col overflow-hidden px-4 text-white sm:px-6 lg:px-8"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 100%, #312E81 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 80% 0%, #4338CA 0%, transparent 50%), #1E1B4B",
        }}
      >
        <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between gap-4 py-5">
          <BrandMark tone="dark" />
          <nav className="hidden items-center gap-6 text-sm font-bold text-white/74 md:flex" aria-label="Landing navigation">
            <a className="transition hover:text-[#FACC15]" href="#features">Features</a>
            <a className="transition hover:text-[#FACC15]" href="#tools">Tools</a>
            <a className="transition hover:text-[#FACC15]" href="#how-it-works">How it works</a>
          </nav>
          <PublicAuthActions tone="dark" />
        </header>

        <div className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Stop cramming.{" "}
              <span className="text-[#FACC15]">Start studying smarter.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg font-semibold leading-8 text-white/78 lg:mx-0">
              Aceley is the AI study coach that turns your notes, photos, and deadlines into flashcards, quizzes, and personalised study plans — so you can ace your exams without the all-nighters.
            </p>
            <PublicAuthActions tone="dark" variant="hero" className="mt-8" />
            <p className="mt-4 text-sm font-semibold text-white/50">
              Free to start. No credit card required.
            </p>

            <div className="mt-8 border-t border-white/10 pt-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">Available on</p>
              <div className="flex gap-3">
                <a
                  href="#app-store"
                  className="inline-flex items-center gap-2.5 rounded-lg border border-white/15 bg-white/8 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                  App Store
                </a>
                <a
                  href="#play-store"
                  className="inline-flex items-center gap-2.5 rounded-lg border border-white/15 bg-white/8 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3.61 1.814L13.793 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .61-.92zm10.893 9.476l2.56-2.56 3.48 2.005c.63.362.63 1.168 0 1.53l-3.48 2.006-2.56-2.56-.53-.53.53-.42v-.47zm-1.06 1.06L4.38 21.414l8.78-5.064.283-.283zm0-2.7L4.38 2.586l9.063 5.064.283.283-.283.283z" /></svg>
                  Google Play
                </a>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-xs lg:max-w-sm">
            <LottieMascot name="mascot_Hi" className="h-64 w-full sm:h-80 lg:h-96" />
          </div>
        </div>

        <a href="#features" className="mx-auto mb-8 flex flex-col items-center gap-1 text-xs font-semibold text-white/50 transition hover:text-white/80">
          <span>Scroll to explore</span>
          <Icon name="arrowUp" className="h-4 w-4 rotate-180" />
        </a>
      </section>

      {/* ───── 2. Trust bar ───── */}
      <section className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {trustItems.map((item) => (
            <div className="flex items-center gap-2 text-sm font-bold text-slate-600" key={item.text}>
              <Icon name={item.icon} className="h-4.5 w-4.5 text-[#312E81]" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ───── 3. Features showcase ───── */}
      <section className="px-4 py-16 sm:px-6 lg:px-8" id="features">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#CA8A04]">Features</p>
            <h2 className="mx-auto mt-3 max-w-xl text-3xl font-black tracking-tight sm:text-4xl">
              Everything you need to ace your exams
            </h2>
          </div>

          <div className="mt-14 space-y-20">
            {features.map((feature, index) => (
              <div
                className="grid items-center gap-10 lg:grid-cols-2"
                key={feature.label}
              >
                <div className={cn("flex justify-center", index % 2 === 1 && "lg:order-2")}>
                  <Image
                    alt={feature.label}
                    className="w-full max-w-md"
                    height={400}
                    src={feature.image}
                    width={500}
                  />
                </div>
                <div className={cn(index % 2 === 1 && "lg:order-1")}>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-[#CA8A04]">{feature.label}</p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{feature.headline}</h3>
                  <p className="mt-4 text-base leading-7 text-slate-600">{feature.description}</p>
                  <ul className="mt-5 space-y-3">
                    {feature.bullets.map((bullet) => (
                      <li className="flex items-start gap-3 text-sm leading-6 text-slate-700" key={bullet}>
                        <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-[#312E81]" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── 4. Tool grid ───── */}
      <section className="bg-[#F8FAFC] px-4 py-16 sm:px-6 lg:px-8" id="tools">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#CA8A04]">Your toolkit</p>
            <h2 className="mx-auto mt-3 max-w-md text-3xl font-black tracking-tight sm:text-4xl">
              8 tools. One study workspace.
            </h2>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((tool) => (
              <div
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                key={tool.name}
              >
                <span className={cn("grid h-11 w-11 place-items-center rounded-full", tool.color)}>
                  <Icon name={tool.icon} />
                </span>
                <h3 className="mt-4 text-sm font-black">{tool.name}</h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── 5. How it works ───── */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8" id="how-it-works">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#CA8A04]">How it works</p>
            <h2 className="mx-auto mt-3 max-w-lg text-3xl font-black tracking-tight sm:text-4xl">
              From signup to study session in minutes.
            </h2>
          </div>

          {/* Mobile: vertical timeline */}
          <div className="relative mt-12 space-y-10 pl-10 lg:hidden">
            <div className="absolute bottom-0 left-4 top-0 w-0.5 bg-gradient-to-b from-[#FACC15] to-[#312E81]" />
            {howItWorks.map((step, index) => (
              <div className="relative" key={step.title}>
                <span className="absolute -left-10 grid h-8 w-8 place-items-center rounded-full bg-[#1E1B4B] text-sm font-black text-[#FACC15]">
                  {index + 1}
                </span>
                <h3 className="text-lg font-black tracking-tight">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>

          {/* Desktop: horizontal timeline */}
          <div className="relative mt-12 hidden lg:block">
            <div className="absolute left-0 right-0 top-4 h-0.5 bg-gradient-to-r from-[#FACC15] to-[#312E81]" />
            <div className="grid grid-cols-3 gap-8">
              {howItWorks.map((step, index) => (
                <div className="relative pt-12" key={step.title}>
                  <span className="absolute left-0 top-0 grid h-8 w-8 place-items-center rounded-full bg-[#1E1B4B] text-sm font-black text-[#FACC15]">
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-black tracking-tight">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── 6. CTA banner ───── */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-[#1E1B4B] p-8 text-white sm:p-10 lg:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[auto_1fr_auto]">
            <div className="mx-auto w-32 lg:mx-0">
              <LottieMascot name="mascot_celebrate" className="h-32 w-32" />
            </div>
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                Your next exam doesn&apos;t have to be stressful.
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Join students who study smarter with Aceley. Start for free — no credit card needed.
              </p>
            </div>
            <PublicAuthActions tone="dark" variant="stack" />
          </div>
        </div>
      </section>

      {/* ───── 7. Footer ───── */}
      <LandingFooter />
    </main>
  );
}
