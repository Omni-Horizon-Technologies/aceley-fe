import Link from "next/link";
import { SiteFooter } from "@/app/components/site-footer";
import {
  BrandMark,
  Icon,
  MockDashboardPreview,
  PrimaryButton,
  QuickActionCard,
  SecondaryButton,
} from "@/app/components/ui";

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

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <QuickActionCard
            description="Drop class notes into a clean editor and generate a study-ready deck."
            href="/auth"
            icon="notes"
            title="Paste Notes"
          />
          <QuickActionCard
            description="Bring in a file or image and keep everything in one simple flow."
            href="/auth"
            icon="scan"
            title="Scan or Upload"
          />
          <QuickActionCard
            description="Mark each card hard, good, or easy and keep moving through the deck."
            href="/study"
            icon="study"
            title="Study Smart"
          />
        </div>
        <div className="mt-8 text-center">
          <SecondaryButton href="/pricing">View Pricing</SecondaryButton>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
