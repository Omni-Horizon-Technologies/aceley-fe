import Image from "next/image";
import Link from "next/link";
import { LottieMascot } from "@/app/components/lottie-mascot";
import { SiteFooter } from "@/app/components/site-footer";
import {
  BrandMark,
  Icon,
  MockDashboardPreview,
  PrimaryButton,
  SecondaryButton,
} from "@/app/components/ui";

const visualFeatures = [
  {
    description:
      "Drop class notes into a clean editor and generate a study-ready deck.",
    href: "/auth",
    image: "/visuals/paste-notes.svg",
    imageAlt: "Study desk with notes, flashcards, and a laptop",
    title: "Paste Notes",
  },
  {
    description:
      "Bring in a file or image and keep everything in one simple flow.",
    href: "/auth",
    image: "/visuals/scan-upload.svg",
    imageAlt: "Tablet scanning paper notes into flashcards",
    title: "Scan or Upload",
  },
  {
    description:
      "Mark each card hard, good, or easy and keep moving through the deck.",
    href: "/study",
    image: "/visuals/study-smart.svg",
    imageAlt: "Flashcard study screen with progress and rating buttons",
    title: "Study Smart",
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <section className="bg-gradient-to-br from-[#312E81] to-[#1E1B4B] text-white">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <BrandMark tone="dark" />
          <nav className="flex items-center gap-2" aria-label="Landing navigation">
            <Link
              className="hidden px-3 py-2 text-sm font-bold text-white/76 transition hover:text-white sm:inline-flex"
              href="/pricing"
            >
              Pricing
            </Link>
            <SecondaryButton href="/dashboard" className="hidden sm:inline-flex">
              Try Demo
            </SecondaryButton>
            <PrimaryButton href="/auth" className="bg-[#FB7185] hover:bg-white hover:text-[#312E81]">
              Get Started
            </PrimaryButton>
          </nav>
        </header>

        <div className="mx-auto max-w-6xl px-4 pb-14 pt-10 sm:px-6 sm:pb-16 lg:px-8 lg:pt-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center">
            <div className="max-w-3xl">
              <p className="inline-flex rounded-lg bg-white/10 px-3 py-2 text-sm font-bold text-[#FB7185] ring-1 ring-white/15">
                Notes to flashcards in under 30 seconds
              </p>
              <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Turn your notes into flashcards instantly
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/78">
                Create, study, and remember faster with a simple flashcard app
                built for students.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <PrimaryButton href="/auth" className="bg-[#FB7185] hover:bg-white hover:text-[#312E81]">
                  <Icon name="spark" />
                  Get Started
                </PrimaryButton>
                <SecondaryButton href="/study" className="border-white/20 bg-white/10 text-white hover:bg-white hover:text-[#312E81]">
                  <Icon name="play" />
                  Try Demo
                </SecondaryButton>
              </div>
            </div>
            <div className="mx-auto w-full max-w-52 rounded-lg border border-white/15 bg-white/10 p-4 shadow-2xl shadow-[#1E1B4B]/25 sm:max-w-60 lg:mx-0">
              <LottieMascot className="mx-auto aspect-square w-full" />
            </div>
          </div>

          <MockDashboardPreview />
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#FB7185]">
              Simple workflow
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#1E1B4B]">
              Study from the notes you already have
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-slate-600">
            Paste, upload, or scan notes, then review clean cards without
            extra modes or crowded menus.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {visualFeatures.map((feature) => (
            <Link
              className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#FB7185]/50 hover:shadow-md"
              href={feature.href}
              key={feature.title}
            >
              <div className="relative aspect-[4/3] bg-[#EEF2FF]">
                <Image
                  alt={feature.imageAlt}
                  className="object-cover"
                  fill
                  loading="eager"
                  sizes="(min-width: 768px) 33vw, 100vw"
                  src={feature.image}
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-bold text-[#1E1B4B]">
                    {feature.title}
                  </h3>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#312E81]/10 text-[#312E81] transition group-hover:bg-[#FB7185]/10 group-hover:text-[#FB7185]">
                    <Icon name="spark" className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#312E81] transition group-hover:text-[#FB7185]">
                  Try it now
                  <span aria-hidden="true">-&gt;</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <SecondaryButton href="/pricing">View Pricing</SecondaryButton>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
