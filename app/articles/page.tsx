/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/app/components/site-footer";
import { PublicPrimaryCta } from "@/app/components/public-auth-actions";

export const metadata: Metadata = {
  title: "Articles | Aceley",
  description:
    "Study strategies, learning science, and product updates from the Aceley team.",
};

type Article = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
};

const featured: Article = {
  slug: "spaced-repetition-explained",
  category: "Learning science",
  title: "Spaced repetition, explained in five minutes.",
  excerpt:
    "Why reviewing a card five times over a month beats cramming it fifty times in a night — and how Aceley schedules it for you.",
  readTime: "5 min read",
  date: "October 1, 2026",
};

const articles: Article[] = [
  {
    slug: "finals-week-study-plan",
    category: "Study tips",
    title: "The seven-day finals plan that actually works.",
    excerpt:
      "A day-by-day breakdown of what to review, what to skip, and when to sleep. Built from research on retention curves.",
    readTime: "7 min read",
    date: "September 24, 2026",
  },
  {
    slug: "flashcards-vs-notes",
    category: "Learning science",
    title: "Flashcards vs. notes: when each one wins.",
    excerpt:
      "Both have a place. Here's how to pick the right tool for the subject you're studying.",
    readTime: "4 min read",
    date: "September 17, 2026",
  },
  {
    slug: "ai-tutor-honest",
    category: "Product",
    title: "An honest take on AI tutors in 2026.",
    excerpt:
      "Where they help, where they still get in the way, and how we built Aceley's tutor to stay out of the hallucination trap.",
    readTime: "6 min read",
    date: "September 10, 2026",
  },
  {
    slug: "study-streaks-habit",
    category: "Habits",
    title: "Why streaks work (and when to break one on purpose).",
    excerpt:
      "The psychology of streaks, the research on habit formation, and the one time you should let yours reset.",
    readTime: "5 min read",
    date: "September 3, 2026",
  },
  {
    slug: "note-upload-tips",
    category: "Product",
    title: "Getting better flashcards from your messy notes.",
    excerpt:
      "A few small changes to how you upload — photos, PDFs, or plain text — that make a huge difference in output quality.",
    readTime: "4 min read",
    date: "August 27, 2026",
  },
  {
    slug: "focus-mode-launch",
    category: "Product",
    title: "Introducing Focus Mode.",
    excerpt:
      "A distraction-free timer, a quick reset ritual, and a way to count every minute you actually studied.",
    readTime: "3 min read",
    date: "August 20, 2026",
  },
];

export default function ArticlesPage() {
  return (
    <main className="min-h-[100dvh] bg-white text-[#1E1B4B]">
      <div className="relative overflow-hidden px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <nav className="relative z-10 mx-auto flex w-full max-w-[1240px] items-center justify-between gap-4 py-2">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/icons/icon-192.png"
              alt=""
              className="h-[38px] w-[38px] rounded-[10px] object-cover"
            />
            <span className="text-[21px] font-black tracking-[-0.02em]">
              Aceley
            </span>
          </Link>
          <PublicPrimaryCta
            tone="light"
            label="Get started"
            loggedInLabel="Open app"
            size="sm"
            variant="dark"
          />
        </nav>

        <section className="mx-auto mt-10 max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[.18em] text-[#CA8A04]">
            Articles
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.03em] sm:text-5xl">
            Study smarter. One read at a time.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base font-semibold leading-7 text-slate-600">
            Learning science, product updates, and honest advice from the team
            behind Aceley.
          </p>
        </section>

        <section className="mx-auto mt-14 max-w-5xl">
          <Link
            href={`/articles/${featured.slug}`}
            className="group block overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-[#F8FAFC] to-white p-8 shadow-sm transition hover:border-[#FACC15]/60 hover:shadow-lg sm:p-10"
          >
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[.18em] text-[#CA8A04]">
              <span>Featured</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500">{featured.category}</span>
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.02em] sm:text-4xl">
              {featured.title}
            </h2>
            <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-slate-600">
              {featured.excerpt}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-slate-500">
              <span>{featured.date}</span>
              <span className="text-slate-300">·</span>
              <span>{featured.readTime}</span>
              <span className="ml-auto font-black text-[#312E81] transition group-hover:text-[#CA8A04]">
                Read article →
              </span>
            </div>
          </Link>
        </section>

        <section className="mx-auto mt-12 max-w-5xl">
          <div className="grid gap-5 sm:grid-cols-2">
            {articles.map((a) => (
              <Link
                key={a.slug}
                href={`/articles/${a.slug}`}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#FACC15]/60 hover:shadow-lg"
              >
                <span className="text-xs font-black uppercase tracking-[.18em] text-[#CA8A04]">
                  {a.category}
                </span>
                <h3 className="mt-3 text-xl font-black tracking-tight transition group-hover:text-[#312E81]">
                  {a.title}
                </h3>
                <p className="mt-3 flex-1 text-sm font-semibold leading-6 text-slate-600">
                  {a.excerpt}
                </p>
                <div className="mt-5 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>{a.date}</span>
                  <span>{a.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-3xl rounded-2xl border border-slate-200 bg-[#F8FAFC] p-8 text-center">
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
            Ready to put it into practice?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-6 text-slate-600">
            Jump into Aceley and turn your next set of notes into a study deck
            in under a minute.
          </p>
          <div className="mt-6 flex justify-center">
            <PublicPrimaryCta
              tone="light"
              label="Start studying"
              loggedInLabel="Open dashboard"
              size="lg"
              withArrow
            />
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
