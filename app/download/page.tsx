/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/app/components/site-footer";
import { PublicPrimaryCta } from "@/app/components/public-auth-actions";
import { Icon } from "@/app/components/ui";

export const metadata: Metadata = {
  title: "Download Aceley | Study on any device",
  description:
    "Download Aceley for iOS and Android, or launch the web app to start studying in seconds.",
};

const platforms = [
  {
    name: "iOS",
    sub: "iPhone & iPad",
    icon: "apple" as const,
    cta: "Download on the App Store",
    href: "#",
    note: "Requires iOS 16 or later.",
  },
  {
    name: "Android",
    sub: "Phone & Tablet",
    icon: "play" as const,
    cta: "Get it on Google Play",
    href: "#",
    note: "Requires Android 10 or later.",
  },
  {
    name: "Web",
    sub: "Any modern browser",
    icon: "study" as const,
    cta: "Launch web app",
    href: "/dashboard",
    note: "No install needed — Chrome, Safari, Firefox, Edge.",
  },
];

const perks = [
  {
    icon: "bolt" as const,
    title: "Sync across devices",
    body: "Start on your phone, finish on your laptop. Your decks, streaks, and progress follow you everywhere.",
  },
  {
    icon: "flame" as const,
    title: "Offline study",
    body: "Download decks for the subway, the plane, or that corner of the library with no signal.",
  },
  {
    icon: "spark" as const,
    title: "Smart notifications",
    body: "Gentle reminders when it's the best time to review — never spammy, always helpful.",
  },
];

export default function DownloadPage() {
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
            Download
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.03em] sm:text-5xl">
            Aceley, on every device you study with.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base font-semibold leading-7 text-slate-600">
            Pick your platform below. Progress syncs instantly across iOS,
            Android, and the web.
          </p>
        </section>

        <section className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {platforms.map((p) => (
            <div
              key={p.name}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#FACC15]/60 hover:shadow-lg"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#312E81]/10 text-[#312E81]">
                <Icon name={p.icon} className="h-6 w-6" />
              </span>
              <h2 className="mt-5 text-xl font-black tracking-tight">
                {p.name}
              </h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {p.sub}
              </p>
              <a
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-[#1E1B4B] px-4 py-3 text-sm font-black text-white transition hover:bg-[#312E81]"
                href={p.href}
              >
                {p.cta}
              </a>
              <p className="mt-3 text-xs font-semibold text-slate-500">
                {p.note}
              </p>
            </div>
          ))}
        </section>

        <section className="mx-auto mt-20 max-w-5xl">
          <h2 className="text-center text-3xl font-black tracking-[-0.02em] sm:text-4xl">
            Built for how students actually study.
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {perks.map((perk) => (
              <div
                key={perk.title}
                className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6"
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#FACC15]/20 text-[#CA8A04]">
                  <Icon name={perk.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-black tracking-tight">
                  {perk.title}
                </h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                  {perk.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-3xl rounded-2xl border border-slate-200 bg-[#F8FAFC] p-8 text-center">
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
            Not ready to install? Try the web app.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-6 text-slate-600">
            Everything Aceley offers, right in your browser. No download, no
            sign-in friction.
          </p>
          <div className="mt-6 flex justify-center">
            <PublicPrimaryCta
              tone="light"
              label="Try it on the web"
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
