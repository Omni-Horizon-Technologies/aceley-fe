/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Metadata } from "next";
import { LottieMascot } from "@/app/components/lottie-mascot";
import { PublicPrimaryCta } from "@/app/components/public-auth-actions";

export const metadata: Metadata = {
  title: "Aceley | AI study coach for exam season",
  description:
    "Aceley turns your notes, photos, and exam dates into flashcards, quizzes, and personalised study plans — so you walk into every exam ready.",
};

const universities = [
  "Stanford",
  "Oxford",
  "MIT",
  "Yale",
  "Harvard",
  "Cambridge",
  "Berkeley",
  "Princeton",
];

const howItWorksSteps = [
  {
    num: "01",
    title: "Add what you’re studying",
    body: "Enter your subject and exam date, then upload notes or snap a photo — Aceley reads it instantly.",
    accent: "indigo" as const,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 8V5h3" />
        <path d="M16 5h3v3" />
        <path d="M19 16v3h-3" />
        <path d="M8 19H5v-3" />
        <path d="M8 12h8" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Get a personalised plan",
    body: "A sprint of flashcards, quizzes, and focus blocks — auto-built and paced around your deadline.",
    accent: "indigo" as const,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Study, review, repeat",
    body: "Work through your plan and watch Aceley adapt in real time as your readiness score climbs.",
    accent: "yellow" as const,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
        <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
      </svg>
    ),
  },
];

type Testimonial = {
  quote: string;
  name: string;
  subject: string;
  gpa: string;
  photo: string;
  variant: "flat" | "grad";
};

const testimonials: Testimonial[] = [
  {
    quote: "Aceley completely changed how I study. In minutes I get flashcards and summaries from my lecture slides. My grades have never been better!",
    name: "Jamila",
    subject: "Biology · 2nd yr",
    gpa: "4.0 GPA",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    variant: "flat",
  },
  {
    quote: "I love the chat feature. It feels like a conversation with my textbook, and it really helped me understand tricky concepts.",
    name: "Yahia",
    subject: "Computer Science",
    gpa: "4.0 GPA",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    variant: "grad",
  },
  {
    quote: "As someone who struggles with time management, Aceley cuts through the noise. I upload notes and it makes key points and quizzes.",
    name: "Samuel",
    subject: "Economics",
    gpa: "3.9 GPA",
    photo: "https://randomuser.me/api/portraits/men/54.jpg",
    variant: "flat",
  },
  {
    quote: "The 2-minute study plan kept me on track for finals. No more staring at a pile of notes not knowing where to start. Studying is fun now!",
    name: "Maya",
    subject: "Pre-Med",
    gpa: "4.0 GPA",
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
    variant: "grad",
  },
  {
    quote: "Scan-to-solve is magic. I photograph a problem set and get worked solutions I can actually follow, step by step.",
    name: "Priya",
    subject: "Chemistry",
    gpa: "3.8 GPA",
    photo: "https://randomuser.me/api/portraits/women/12.jpg",
    variant: "flat",
  },
  {
    quote: "Turning 60-page readings into crisp summaries and quizzes saved my semester. I retain so much more now.",
    name: "Daniel",
    subject: "Law",
    gpa: "4.0 GPA",
    photo: "https://randomuser.me/api/portraits/men/76.jpg",
    variant: "grad",
  },
  {
    quote: "Focus mode plus the adaptive plan finally got me off my phone. My readiness score climbing is weirdly addictive.",
    name: "Aisha",
    subject: "Psychology",
    gpa: "3.9 GPA",
    photo: "https://randomuser.me/api/portraits/women/33.jpg",
    variant: "flat",
  },
  {
    quote: "It quizzes me on exactly what I keep getting wrong. Feels like a tutor who knows my weak spots.",
    name: "Lucas",
    subject: "Engineering",
    gpa: "4.0 GPA",
    photo: "https://randomuser.me/api/portraits/men/22.jpg",
    variant: "grad",
  },
];

const useCases = [
  {
    num: "01",
    title: "Exam preparation & review",
    body: "Transform lecture slides and notes into flashcards, quizzes, and fill-in-the-blank questions instantly. Active recall techniques help you ace exams with less study time.",
  },
  {
    num: "02",
    title: "Homework help & assignment support",
    body: "Generate summaries and interactive study materials to simplify complex assignments. Clarify difficult subjects and make your study sessions more productive.",
  },
  {
    num: "03",
    title: "Research & study content creation",
    body: "Turn sprawling articles and video lectures into clear, digestible content. Streamline note-taking and enhance comprehension to focus on developing insightful ideas.",
  },
];

const dayTimeline = [
  {
    time: "7:40 AM · Phone",
    title: "Warm up on the bus",
    body: "Flip through today’s flashcards and knock out a 5-minute quiz before class.",
    highlight: false,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3v2" />
        <path d="M5.6 5.6l1.4 1.4" />
        <path d="M3 12h2" />
        <circle cx="12" cy="13" r="5" />
      </svg>
    ),
  },
  {
    time: "1:15 PM · Laptop",
    title: "Deep work, library",
    body: "Turn lecture slides into a study pack and grind a focus session with ambient audio.",
    highlight: false,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 6h16v10H4z" />
        <path d="M8 20h8" />
      </svg>
    ),
  },
  {
    time: "6:30 PM · Tablet",
    title: "Review on the couch",
    body: "Ask the tutor to re-explain what you missed, then re-quiz only the weak spots.",
    highlight: false,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 4h12v16H6z" />
        <path d="M10.5 6.5h3" />
      </svg>
    ),
  },
  {
    time: "11:00 PM · Streak +1",
    title: "End the day ahead",
    body: "Your readiness score ticks up and tomorrow’s plan is already waiting for you.",
    highlight: true,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 21c4 0 7-2.7 7-6.7 0-2.8-1.5-4.9-3.6-6.6.1 1.6-.5 2.7-1.6 3.5.2-3.1-1.4-5.6-4-7.2.1 3.2-1.9 4.6-3.3 6.4A6.2 6.2 0 0 0 5 14.3C5 18.3 8 21 12 21Z" />
      </svg>
    ),
  },
];

const platformChips = [
  "Web, iOS, Android & tablet",
  "Real-time sync across devices",
  "Works offline, syncs later",
];

const comparisonRows = [
  {
    title: "Evidence-based techniques",
    aceley: ["Active recall built in", "Spaced repetition algorithms", "Real-time feedback & insights"],
    old: ["Passive reading & highlighting", "Repetitive review, no feedback", "Inefficient time allocation"],
  },
  {
    title: "Speed & personalization",
    aceley: ["Instant AI study materials", "Personalised to how you learn", "Adapts to your progress"],
    old: ["Hours making materials by hand", "One-size-fits-all approach", "Limited ability to adapt"],
  },
  {
    title: "Cost & convenience",
    aceley: ["One affordable subscription", "All your tools in one app", "24/7 — study anytime"],
    old: ["Tutors at $50–100/hr", "Juggling many subscriptions", "Limited availability"],
  },
];

const faqs = [
  {
    q: "What is Aceley?",
    a: "Aceley is an AI study coach that turns your notes, slides, and photos into flashcards, quizzes, summaries, and a personalised study plan — everything you need to prepare for exams in one app.",
    open: true,
  },
  {
    q: "What is the difference between Free and Pro?",
    a: "Free gives you core tutoring, flashcards, and quizzes with daily limits. Pro unlocks unlimited study packs, scan-to-solve, focus mode, adaptive study plans, and priority AI responses.",
    open: false,
  },
  {
    q: "Can Aceley replace a human tutor?",
    a: "Aceley is available 24/7 and explains concepts in whatever style clicks for you, but it works best alongside your classes and teachers — an always-on study partner, not a replacement for your professor.",
    open: false,
  },
  {
    q: "How does Aceley personalise my learning?",
    a: "It builds around your subject and exam date, tracks which topics you get right and wrong, and adapts your flashcards, quizzes, and focus blocks so you spend time on what actually needs work.",
    open: false,
  },
  {
    q: "Does it support my subject and exam type?",
    a: "Yes — Aceley works across sciences, maths, humanities, business, and more, and can tailor materials for coursework, midterms, finals, and standardised tests.",
    open: false,
  },
];

const productLinks = [
  { label: "AI Tutor", href: "#tools" },
  { label: "Flashcards", href: "#tools" },
  { label: "Quizzes", href: "#tools" },
  { label: "Scan & solve", href: "#tools" },
  { label: "Focus mode", href: "#tools" },
];

const studyLinks = [
  { label: "How it works", href: "#tools" },
  { label: "Class spaces", href: "/spaces" },
  { label: "Study plans", href: "/plan/new" },
  { label: "Test prep", href: "/test-prep" },
  { label: "Pricing", href: "/pricing" },
];

const companyLinks = [
  { label: "About", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Help center", href: "#" },
  { label: "Contact", href: "#" },
];

function StarRow({ count = 5, size = 15, color = "#facc15" }: { count?: number; size?: number; color?: string }) {
  return (
    <div className="flex gap-[3px]" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <path d="m12 2 2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.3 5.8 20.9l1.6-6.8L2.2 8.9l6.9-.6L12 2Z" />
        </svg>
      ))}
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#fbfbfe] text-[#1E1B4B]">
      {/* ===== HERO ===== */}
      <section
        className="relative flex min-h-screen flex-col overflow-hidden rounded-b-[44px] px-5 pb-9 sm:px-8 sm:pb-14 lg:px-14"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 82% 2%, rgba(250,204,21,0.18) 0%, transparent 55%), radial-gradient(ellipse 70% 55% at 12% 100%, rgba(99,88,220,0.16) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 95% 90%, rgba(22,163,74,0.1) 0%, transparent 60%), #fbfbfe",
        }}
      >
        {/* aurora + grid */}
        <div
          aria-hidden="true"
          className="ace-grid pointer-events-none absolute inset-0 z-0 [animation:ace-grid-drift_6s_linear_infinite]"
          style={{
            backgroundImage: "radial-gradient(rgba(30,27,75,0.06) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            WebkitMaskImage:
              "radial-gradient(ellipse 95% 70% at 50% 20%, #000 35%, transparent 72%)",
            maskImage:
              "radial-gradient(ellipse 95% 70% at 50% 20%, #000 35%, transparent 72%)",
          }}
        />
        <div
          aria-hidden="true"
          className="ace-aurora pointer-events-none absolute z-0 rounded-full [animation:ace-aurora-a_16s_ease-in-out_infinite]"
          style={{
            top: "-160px",
            right: "-80px",
            height: "460px",
            width: "460px",
            background: "radial-gradient(circle, rgba(250,204,21,0.38), transparent 62%)",
            filter: "blur(40px)",
          }}
        />
        <div
          aria-hidden="true"
          className="ace-aurora pointer-events-none absolute z-0 rounded-full [animation:ace-aurora-b_20s_ease-in-out_infinite]"
          style={{
            bottom: "-190px",
            left: "-110px",
            height: "440px",
            width: "440px",
            background: "radial-gradient(circle, rgba(99,88,220,0.3), transparent 62%)",
            filter: "blur(48px)",
          }}
        />
        <div
          aria-hidden="true"
          className="ace-aurora pointer-events-none absolute z-0 rounded-full [animation:ace-aurora-c_24s_ease-in-out_infinite]"
          style={{
            top: "30%",
            left: "42%",
            height: "380px",
            width: "380px",
            background: "radial-gradient(circle, rgba(67,56,202,0.18), transparent 64%)",
            filter: "blur(52px)",
          }}
        />
        <div
          aria-hidden="true"
          className="ace-beam pointer-events-none absolute z-0 rounded-full opacity-50 [animation:ace-beam-spin_40s_linear_infinite]"
          style={{
            top: "50%",
            left: "50%",
            height: "1100px",
            width: "1100px",
            margin: "-550px 0 0 -550px",
            filter: "blur(46px)",
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(250,204,21,0.16) 40deg, transparent 90deg, rgba(99,88,220,0.16) 160deg, transparent 210deg, rgba(67,56,202,0.14) 300deg, transparent 340deg)",
            WebkitMaskImage: "radial-gradient(circle, #000 30%, transparent 70%)",
            maskImage: "radial-gradient(circle, #000 30%, transparent 70%)",
          }}
        />

        {/* nav */}
        <nav className="relative z-10 mx-auto flex w-full max-w-[1240px] items-center justify-between gap-4 py-5">
          <Link href="/" className="flex items-center gap-3">
            <img src="/icons/icon-192.png" alt="" className="h-[38px] w-[38px] rounded-[10px] object-cover" />
            <span className="text-[21px] font-black tracking-[-0.02em]">Aceley</span>
          </Link>
          <div className="hidden items-center gap-7 md:flex">
            <a href="#tools" className="text-sm font-bold text-slate-600 transition hover:text-[#CA8A04]">Tools</a>
            <a href="#how" className="text-sm font-bold text-slate-600 transition hover:text-[#CA8A04]">How it works</a>
            <Link href="/pricing" className="text-sm font-bold text-slate-600 transition hover:text-[#CA8A04]">Pricing</Link>
            <PublicPrimaryCta tone="light" label="Get started" loggedInLabel="Open app" size="sm" variant="dark" />
          </div>
          <div className="md:hidden">
            <PublicPrimaryCta tone="light" label="Get started" loggedInLabel="Open app" size="sm" variant="dark" />
          </div>
        </nav>

        {/* hero body */}
        <div className="relative z-10 mx-auto grid w-full max-w-[1240px] flex-1 items-center gap-8 py-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:py-12">
          <div className="flex max-w-[620px] flex-col items-start [animation:ace-rise_0.6s_ease-out_both]">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[12.5px] font-black tracking-[0.02em] text-[#1E1B4B] shadow-sm">
              <span className="h-[7px] w-[7px] rounded-full bg-[#FACC15]" />
              Your AI study coach
            </span>
            <h1 className="mt-5 text-[46px] font-black leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-[82px]">
              Stop cramming.
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(105deg,#4338ca,#312e81 40%,#ca8a04)" }}
              >
                Start acing.
              </span>
            </h1>
            <p className="mt-6 max-w-[500px] text-base font-semibold leading-[1.6] text-slate-600 sm:text-lg lg:text-[19px]">
              Aceley turns your notes, photos, and exam dates into flashcards, quizzes, and personalised study plans — so you walk into every exam ready.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <PublicPrimaryCta tone="light" label="Start free" size="lg" withArrow variant="shine" />
              <a
                href="#how"
                className="group inline-flex items-center gap-3 py-3 text-[15px] font-black text-[#1E1B4B] transition hover:text-[#CA8A04]"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white shadow-[0_6px_18px_rgba(15,13,41,0.12)]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#1e1b4b" aria-hidden="true">
                    <path d="M8 5v14l11-7-11-7Z" />
                  </svg>
                </span>
                <span className="flex flex-col leading-tight">
                  See how it works
                  <span className="text-xs font-bold text-slate-400">Watch 60-sec demo</span>
                </span>
              </a>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <div className="flex">
                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="" className="h-10 w-10 rounded-full border-2 border-[#fbfbfe] object-cover" />
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="" className="-ml-3 h-10 w-10 rounded-full border-2 border-[#fbfbfe] object-cover" />
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="" className="-ml-3 h-10 w-10 rounded-full border-2 border-[#fbfbfe] object-cover" />
                <span className="-ml-3 grid h-10 w-10 place-items-center rounded-full border-2 border-[#fbfbfe] bg-[#1E1B4B] text-[11px] font-black text-white">
                  50k+
                </span>
              </div>
              <div>
                <StarRow />
                <p className="mt-1 text-[13px] font-bold text-slate-500">Loved by 50,000+ students</p>
              </div>
            </div>
            <p className="mt-4 text-[13.5px] font-semibold text-slate-400">
              Free to start. No credit card required.
            </p>
          </div>

          {/* product mock */}
          <div className="relative ml-auto w-full max-w-[460px] [animation:ace-rise_0.7s_ease-out_0.1s_both]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-[2%] z-0 rounded-[32px]"
              style={{
                background: "radial-gradient(circle at 50% 40%, rgba(250,204,21,0.4), transparent 68%)",
                filter: "blur(34px)",
              }}
            />
            <div
              aria-hidden="true"
              className="absolute top-[26px] right-3 bottom-[6px] left-3 z-[1] rounded-3xl border border-slate-200 bg-white shadow-[0_20px_40px_rgba(15,13,41,0.1)]"
              style={{ transform: "rotate(-4deg)" }}
            />

            <div className="relative z-[2] rounded-[22px] bg-white p-4 shadow-[0_30px_60px_rgba(15,13,41,0.4)]">
              <div className="pointer-events-none absolute -top-20 right-2 z-[3] h-28 w-28 sm:-top-24 sm:right-3 sm:h-32 sm:w-32">
                <LottieMascot name="mascot_Hi" className="h-full w-full" sizeLabel="Aceley waving mascot" />
              </div>
              <div className="flex items-center justify-between px-1.5 pt-1 pb-3">
                <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#CA8A04]">Today&rsquo;s Focus</span>
                <span className="rounded-lg bg-[#FEFCE8] px-2.5 py-1 text-xs font-black text-[#CA8A04]">Day 4 / 14</span>
              </div>
              <div className="rounded-[14px] p-[18px] text-white" style={{ background: "linear-gradient(135deg,#312e81,#1e1b4b)" }}>
                <p className="text-xs font-black text-white/65">Card 1 of 24 · Biology</p>
                <p className="mt-3.5 text-[22px] font-black leading-[1.15]">What is photosynthesis?</p>
                <div className="mt-[18px] grid grid-cols-3 gap-2">
                  <span className="rounded-lg bg-white/12 py-2 text-center text-xs font-black">Hard</span>
                  <span className="rounded-lg bg-white/12 py-2 text-center text-xs font-black">Good</span>
                  <span className="rounded-lg bg-[#FACC15] py-2 text-center text-xs font-black text-[#1E1B4B]">Easy</span>
                </div>
              </div>
              <div className="flex items-center justify-between px-1.5 pt-3.5 pb-1">
                <span className="text-[13px] font-bold text-[#64748B]">Cell Biology</span>
                <span className="text-[13px] font-black text-[#1E1B4B]">72%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-lg bg-[#E2E8F0]">
                <div className="h-full w-[72%] rounded-lg bg-[#312E81]" />
              </div>
            </div>

            {/* floating stats */}
            <div className="absolute -bottom-6 -left-6 z-[3] hidden items-center gap-2.5 rounded-[14px] bg-white px-4 py-3 shadow-[0_16px_34px_rgba(15,13,41,0.22)] [animation:ace-float_4s_ease-in-out_infinite] sm:flex">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#FACC15]/18 text-[#CA8A04]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 21c4 0 7-2.7 7-6.7 0-2.8-1.5-4.9-3.6-6.6.1 1.6-.5 2.7-1.6 3.5.2-3.1-1.4-5.6-4-7.2.1 3.2-1.9 4.6-3.3 6.4A6.2 6.2 0 0 0 5 14.3C5 18.3 8 21 12 21Z" />
                </svg>
              </span>
              <span>
                <span className="block text-lg font-black text-[#1E1B4B]">12-day</span>
                <span className="block text-[11px] font-bold text-[#94A3B8]">study streak</span>
              </span>
            </div>
            <div className="absolute top-10 right-[-30px] z-[3] hidden items-center gap-2.5 rounded-[14px] bg-white px-4 py-2.5 shadow-[0_16px_34px_rgba(15,13,41,0.22)] [animation:ace-float_4.6s_ease-in-out_0.5s_infinite] sm:flex">
              <span className="grid h-[34px] w-[34px] place-items-center rounded-lg bg-[#312E81]/10 text-[#312E81]">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <span className="text-[13px] font-black text-[#1E1B4B]">Exam ready</span>
            </div>
          </div>
        </div>

        {/* trust strip */}
        <div className="relative z-10 mx-auto mt-8 flex w-full max-w-[1240px] flex-wrap items-center justify-center gap-3 sm:mt-14">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-[13px] font-black text-slate-700 shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#312e81" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m3 9 9-5 9 5-9 5-9-5Z" />
              <path d="M7 12v4c2.5 2 7.5 2 10 0v-4" />
            </svg>
            Built for university students
          </span>
          <span className="inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-[13px] font-black text-slate-700 shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#312e81" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
            </svg>
            AI-powered in seconds
          </span>
          <span className="inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-[13px] font-black text-slate-700 shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#312e81" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 3v4" />
              <path d="M17 3v4" />
              <path d="M4 8h16" />
              <path d="M5 5h14v16H5V5Z" />
            </svg>
            Study plans in under 2 minutes
          </span>
        </div>
      </section>

      {/* ===== UNIVERSITY MARQUEE ===== */}
      <section className="mx-auto max-w-[1200px] px-5 pt-12 pb-6 text-center sm:px-8 sm:pt-16 lg:px-14 lg:pt-20">
        <p className="mx-auto max-w-[620px] text-lg font-black tracking-[-0.01em] text-slate-600 sm:text-xl lg:text-[22px]">
          Students at <span className="text-[#1E1B4B]">leading universities</span> trust our powerful AI study tool
        </p>
        <div
          className="relative mt-8 overflow-hidden"
          style={{
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
            maskImage:
              "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
          }}
        >
          <div className="ace-marquee flex w-max items-center gap-14 sm:gap-20">
            {universities.map((name) => (
              <span key={`u1-${name}`} className="ace-uni">{name}</span>
            ))}
            {universities.map((name) => (
              <span key={`u2-${name}`} className="ace-uni" aria-hidden="true">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="tools" className="mx-auto max-w-[1200px] px-5 pt-14 pb-10 sm:px-8 sm:pt-20 lg:px-14 lg:pt-26 lg:pb-12">
        <div className="max-w-[660px]">
          <p className="text-[13px] font-black uppercase tracking-[0.18em] text-[#CA8A04]">How it works</p>
          <h2 className="mt-3 text-3xl font-black leading-[1.05] tracking-[-0.02em] sm:text-4xl lg:text-[46px]">
            From notes to top marks, in three steps.
          </h2>
          <p className="mt-4 text-base font-semibold leading-[1.6] text-slate-600">
            No setup, no juggling apps. Add what you&rsquo;re studying and Aceley builds the whole plan around you.
          </p>
        </div>

        <div className="relative mt-12 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-7">
          <div
            aria-hidden="true"
            className="absolute top-[38px] right-[12%] left-[12%] z-0 hidden h-0.5 md:block"
            style={{
              background:
                "repeating-linear-gradient(90deg,#cbd5e1 0 8px,transparent 8px 16px)",
            }}
          />
          {howItWorksSteps.map((step) => {
            const isYellow = step.accent === "yellow";
            return (
              <div
                key={step.num}
                className={
                  isYellow
                    ? "relative z-[1] rounded-3xl border border-[#FACC15]/50 p-7 shadow-[0_10px_30px_rgba(250,204,21,0.2)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(250,204,21,0.3)]"
                    : "relative z-[1] rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_10px_30px_rgba(15,13,41,0.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,13,41,0.12)]"
                }
                style={
                  isYellow
                    ? { background: "linear-gradient(150deg,#facc15,#f5c518)" }
                    : undefined
                }
              >
                <div className="flex items-center justify-between">
                  <span
                    className="grid h-14 w-14 place-items-center rounded-2xl text-[#FACC15]"
                    style={
                      isYellow
                        ? { background: "#1E1B4B" }
                        : { background: "linear-gradient(150deg,#312e81,#1e1b4b)" }
                    }
                  >
                    {step.icon}
                  </span>
                  <span
                    className="text-[52px] font-black leading-none tracking-[-0.04em]"
                    style={{ color: isYellow ? "rgba(30,27,75,0.14)" : "#EEF1F6" }}
                  >
                    {step.num}
                  </span>
                </div>
                <h3
                  className={`mt-5 text-xl font-black tracking-[-0.01em] ${isYellow ? "text-[#1E1B4B]" : ""}`}
                >
                  {step.title}
                </h3>
                <p
                  className={`mt-2.5 text-[14.5px] font-semibold leading-[1.6] ${isYellow ? "text-[#713F12]" : "text-slate-600"}`}
                >
                  {step.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== DARK FULL-WIDTH SECTION ===== */}
      <section className="relative overflow-hidden bg-[#0f0c26] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            WebkitMaskImage: "radial-gradient(ellipse 90% 60% at 50% 0%, #000, transparent 75%)",
            maskImage: "radial-gradient(ellipse 90% 60% at 50% 0%, #000, transparent 75%)",
          }}
        />
        <div className="relative mx-auto max-w-[1320px] px-5 py-14 sm:px-8 sm:py-20 lg:px-14 lg:py-24">
          {/* Trusted by 50k+ */}
          <div className="text-center">
            <h2 className="text-3xl font-black tracking-[-0.02em] sm:text-4xl lg:text-[44px]">
              Trusted by 50,000+ students
            </h2>
          </div>

          {/* testimonials marquee */}
          <div
            className="relative mt-12 overflow-hidden"
            style={{
              WebkitMaskImage: "linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent)",
              maskImage: "linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent)",
            }}
          >
            <div className="ace-testi-track">
              {[...testimonials, ...testimonials].map((t, i) => (
                <div
                  key={`${t.name}-${i}`}
                  className="ace-testi-card flex flex-col rounded-[20px] border border-white/8 p-6"
                  style={{
                    background:
                      t.variant === "grad"
                        ? "linear-gradient(160deg,#211b4d,#171334)"
                        : "#171334",
                  }}
                >
                  <StarRow />
                  <p className="mt-4 flex-1 text-[14.5px] font-semibold italic leading-[1.6] text-white/82">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={t.photo} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                      <span className="text-sm font-black text-white">
                        {t.name}
                        <span className="block text-[11.5px] font-bold text-white/50">{t.subject}</span>
                      </span>
                    </div>
                    <span className="text-sm font-black text-[#FACC15]">{t.gpa}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What you can do with Aceley */}
          <div className="mt-24 text-center sm:mt-28 lg:mt-32">
            <h2 className="text-3xl font-black tracking-[-0.02em] sm:text-4xl lg:text-[46px]">
              What you can do with Aceley
            </h2>
            <p className="mx-auto mt-4 max-w-[620px] text-base font-semibold leading-[1.6] text-white/66">
              From exam prep to homework help — everything you need to learn faster and smarter.
            </p>
          </div>
          <div className="mt-14 flex flex-col">
            {useCases.map((uc, index) => (
              <div
                key={uc.num}
                className={`grid grid-cols-[80px_1fr] gap-6 py-9 sm:grid-cols-[120px_1fr] sm:gap-12 ${
                  index === 0 ? "border-t border-white/8" : "border-t border-white/8"
                } ${index === useCases.length - 1 ? "border-b border-white/8" : ""}`}
              >
                <span className="text-4xl font-black leading-none tracking-[-0.04em] text-[#FACC15] sm:text-5xl lg:text-[64px]">
                  {uc.num}
                </span>
                <div>
                  <h3 className="text-xl font-black tracking-[-0.01em] sm:text-2xl lg:text-[26px]">{uc.title}</h3>
                  <p className="mt-3 max-w-[780px] text-[15.5px] font-semibold leading-[1.65] text-white/66">
                    {uc.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <PublicPrimaryCta tone="dark" label="Try Aceley for free" loggedInLabel="Open app" size="lg" withArrow variant="shine" />
          </div>

          {/* A day in your study life */}
          <div className="mt-24 text-center sm:mt-28 lg:mt-32">
            <p className="text-[13px] font-black uppercase tracking-[0.18em] text-[#FACC15]">One streak, all day</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.02em] sm:text-4xl lg:text-[46px]">
              A day in your study life
            </h2>
            <p className="mx-auto mt-4 max-w-[580px] text-base font-semibold leading-[1.6] text-white/66">
              Aceley picks up wherever you left off — phone on the bus, laptop in the library, tablet on the couch. Your progress follows you.
            </p>
          </div>
          <div className="relative mt-14">
            <div
              aria-hidden="true"
              className="absolute top-[34px] right-[8%] left-[8%] z-0 hidden h-0.5 md:block"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(250,204,21,0.5) 12%, rgba(250,204,21,0.5) 88%, transparent)",
              }}
            />
            <div className="relative z-[1] grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
              {dayTimeline.map((s) => (
                <div key={s.title} className="flex flex-col items-center text-center">
                  <span
                    className="grid h-[68px] w-[68px] place-items-center rounded-full"
                    style={
                      s.highlight
                        ? {
                            background: "linear-gradient(150deg,#facc15,#f5c518)",
                            color: "#1E1B4B",
                            boxShadow: "0 0 0 6px #0f0c26, 0 0 30px rgba(250,204,21,0.4)",
                          }
                        : {
                            background: "#171334",
                            border: "1px solid rgba(250,204,21,0.4)",
                            color: "#FACC15",
                            boxShadow: "0 0 0 6px #0f0c26",
                          }
                    }
                  >
                    {s.icon}
                  </span>
                  <p className={`mt-4 text-xs font-black uppercase tracking-[0.1em] ${s.highlight ? "text-[#FACC15]" : "text-white/45"}`}>
                    {s.time}
                  </p>
                  <h3 className="mt-2 text-lg font-black">{s.title}</h3>
                  <p className="mt-2 text-[13.5px] font-semibold leading-[1.55] text-white/62">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-11 flex flex-wrap items-center justify-center gap-3">
            {platformChips.map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-[13px] font-black text-white/82"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {chip}
              </span>
            ))}
          </div>

          {/* Comparison table */}
          <div className="mt-24 text-center sm:mt-28 lg:mt-32">
            <h2 className="text-[26px] font-black tracking-[-0.02em] sm:text-3xl lg:text-[42px]">
              Why Aceley beats old-school studying
            </h2>
            <p className="mx-auto mt-4 max-w-[640px] text-base font-semibold leading-[1.6] text-white/66">
              AI-powered studying is designed to save you time, boost retention, and make learning more effective.
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-[960px]">
            {/* Header */}
            <div className="mb-1 hidden grid-cols-[1.1fr_1fr_1fr] md:grid">
              <div />
              <div className="pb-4 text-center">
                <span className="text-lg font-black text-[#FACC15]">Aceley</span>
              </div>
              <div className="pb-4 pl-6 text-center">
                <span className="text-base font-black text-white/50">Traditional methods</span>
              </div>
            </div>

            {comparisonRows.map((row, rowIndex) => {
              const isFirst = rowIndex === 0;
              const isLast = rowIndex === comparisonRows.length - 1;
              return (
                <div key={row.title} className="grid grid-cols-1 items-stretch md:grid-cols-[1.1fr_1fr_1fr]">
                  <div className="flex items-center py-5 pr-6 md:py-6">
                    <h4 className="text-[17px] font-black leading-tight text-white">{row.title}</h4>
                  </div>
                  <div
                    className="flex flex-col gap-3.5 border-y-0 border-[#FACC15]/35 p-5 md:border-x md:p-6"
                    style={{
                      background: "rgba(250,204,21,0.06)",
                      borderTop: isFirst ? "1px solid rgba(250,204,21,0.35)" : "none",
                      borderBottom: isLast ? "1px solid rgba(250,204,21,0.35)" : "none",
                      borderRadius: isFirst
                        ? "18px 18px 0 0"
                        : isLast
                          ? "0 0 18px 18px"
                          : "0",
                    }}
                  >
                    {row.aceley.map((item) => (
                      <div key={item} className="flex items-start gap-2.5">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-shrink-0">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                        <span className="text-sm font-semibold leading-[1.4] text-white/90">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3.5 py-5 pl-0 md:py-6 md:pl-6">
                    {row.old.map((item) => (
                      <div key={item} className="flex items-start gap-2.5">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-shrink-0">
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                        <span className="text-sm font-semibold leading-[1.4] text-white/42">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* FAQ */}
          <div className="mt-24 text-center sm:mt-28 lg:mt-32">
            <h2 className="text-3xl font-black tracking-[-0.02em] sm:text-4xl lg:text-[44px]">
              Frequently asked questions
            </h2>
          </div>
          <div className="mx-auto mt-11 max-w-[860px] border-b border-white/8">
            {faqs.map((faq) => (
              <details key={faq.q} open={faq.open} className="group border-t border-white/8 px-1 py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-base font-black text-white sm:text-lg lg:text-[19px]">
                  {faq.q}
                  <span className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full border border-white/8 text-xl font-normal text-[#FACC15] transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mb-5 max-w-[760px] px-1 text-[14.5px] font-semibold leading-[1.65] text-white/66">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section id="pricing" className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8 sm:py-20 lg:px-14 lg:py-26">
        <div
          className="relative overflow-hidden rounded-[28px] p-10 text-center text-white sm:p-14 lg:p-18"
          style={{
            background:
              "radial-gradient(ellipse 70% 90% at 85% 20%, #4338ca 0%, transparent 60%), #1e1b4b",
          }}
        >
          <div className="mx-auto mb-2 h-24 w-24">
            <LottieMascot name="mascot_celebrate" className="h-full w-full" sizeLabel="Aceley celebrating mascot" />
          </div>
          <h2 className="text-3xl font-black leading-[1.05] tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            Your next exam doesn&rsquo;t
            <br />
            have to be stressful.
          </h2>
          <p className="mx-auto mt-4 max-w-[480px] text-base font-semibold leading-[1.6] text-white/74">
            Join students who study smarter with Aceley. Start free — no credit card needed.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <PublicPrimaryCta tone="dark" label="Start free" size="lg" />
            <Link
              href="/pricing"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/18 bg-white/8 px-7 py-3.5 text-[15px] font-black text-white transition hover:bg-white/16"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer
        className="mt-6 rounded-t-[40px] px-6 pt-12 pb-7 text-white sm:px-10 sm:pt-16 lg:px-14 lg:pt-18"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 12% 0%, #312e81 0%, transparent 55%), #1e1b4b",
        }}
      >
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-14">
          <div className="max-w-[320px]">
            <div className="flex items-center gap-3">
              <img src="/icons/icon-192.png" alt="" className="h-[38px] w-[38px] rounded-[10px] object-cover" />
              <span className="text-[21px] font-black tracking-[-0.02em]">Aceley</span>
            </div>
            <p className="mt-5 text-[14.5px] font-semibold leading-[1.6] text-white/66">
              The AI study coach that turns notes, photos, and deadlines into a plan to ace every exam.
            </p>
            <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-[#FACC15]">Study tips, weekly</p>
            <form className="mt-3 flex gap-2" action="#" method="post">
              <input
                type="email"
                placeholder="you@school.edu"
                aria-label="Email address"
                className="min-h-11 flex-1 rounded-xl border border-white/18 bg-white/8 px-3.5 text-[13.5px] font-semibold text-white placeholder-white/40 outline-none focus:border-[#FACC15]"
              />
              <button
                type="submit"
                className="min-h-11 flex-shrink-0 rounded-xl bg-[#FACC15] px-5 text-[13.5px] font-black text-[#1E1B4B] transition hover:bg-white"
              >
                Join
              </button>
            </form>
          </div>

          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/40">Product</p>
            <ul className="mt-4 flex flex-col gap-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm font-bold text-white/72 transition hover:text-[#FACC15]">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/40">Study</p>
            <ul className="mt-4 flex flex-col gap-3">
              {studyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm font-bold text-white/72 transition hover:text-[#FACC15]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/40">Company</p>
            <ul className="mt-4 flex flex-col gap-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm font-bold text-white/72 transition hover:text-[#FACC15]">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-[1200px] flex-wrap items-center justify-between gap-4 border-t border-white/12 pt-6 sm:mt-13">
          <p className="text-[12.5px] font-semibold text-white/50">© 2026 Aceley. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <Link href="/paywall" className="text-[12.5px] font-bold text-white/60 transition hover:text-[#FACC15]">Privacy</Link>
            <Link href="/paywall" className="text-[12.5px] font-bold text-white/60 transition hover:text-[#FACC15]">Terms</Link>
            <Link href="/paywall" className="text-[12.5px] font-bold text-white/60 transition hover:text-[#FACC15]">Restore purchase</Link>
          </div>
          <div className="flex gap-2.5">
            <a href="#" aria-label="Instagram" className="grid h-[38px] w-[38px] place-items-center rounded-xl bg-white/8 text-white transition hover:bg-[#FACC15] hover:text-[#1E1B4B]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="4" y="4" width="16" height="16" rx="5" />
                <circle cx="12" cy="12" r="3.5" />
                <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="#" aria-label="TikTok" className="grid h-[38px] w-[38px] place-items-center rounded-xl bg-white/8 text-white transition hover:bg-[#FACC15] hover:text-[#1E1B4B]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 18V6l10-2v12" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="16" cy="16" r="3" />
              </svg>
            </a>
            <a href="#" aria-label="YouTube" className="grid h-[38px] w-[38px] place-items-center rounded-xl bg-white/8 text-white transition hover:bg-[#FACC15] hover:text-[#1E1B4B]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="6" width="18" height="12" rx="4" />
                <path d="M10 9.5v5l4.5-2.5-4.5-2.5Z" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
