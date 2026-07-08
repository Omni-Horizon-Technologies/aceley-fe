"use client";

import { type ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BackButton } from "@/app/components/back-button";
import { HydrationGate } from "@/app/components/hydration-gate";
import { BrandMark, cn, Icon } from "@/app/components/ui";

/* ------------------------------------------------------------------ */
/*  Nav IDs                                                            */
/* ------------------------------------------------------------------ */

type NavId =
  | "home"
  | "dashboard"
  | "coach"
  | "plans"
  | "spaces"
  | "progress"
  | "focus"
  | "create"
  | "ask"
  | "quiz"
  | "flashcards"
  | "tutor"
  | "explain"
  | "scan"
  | "study-pack"
  | "test-prep"
  | "profile"
  | "pricing"
  | "study"
  | "paywall"
  | "decks";

/* ------------------------------------------------------------------ */
/*  Sidebar nav structure                                              */
/* ------------------------------------------------------------------ */

type NavItem = {
  id: NavId;
  label: string;
  href: string;
  icon: Parameters<typeof Icon>[0]["name"];
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: "Main",
    items: [
      { id: "home", label: "Home", href: "/home", icon: "home" },
      { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: "dashboard" },
      { id: "coach", label: "Coach", href: "/coach", icon: "brain" },
      { id: "plans", label: "Plans", href: "/plans", icon: "calendar" },
      { id: "spaces", label: "Spaces", href: "/spaces", icon: "spaces" },
      { id: "progress", label: "Progress", href: "/progress", icon: "progress" },
      { id: "focus", label: "Focus", href: "/focus", icon: "target" },
    ],
  },
  {
    label: "Study Tools",
    items: [
      { id: "create", label: "Create", href: "/create", icon: "create" },
      { id: "ask", label: "Ask", href: "/ask", icon: "chat" },
      { id: "quiz", label: "Quiz", href: "/quiz", icon: "bolt" },
      { id: "flashcards", label: "Flashcards", href: "/flashcards", icon: "book" },
      { id: "tutor", label: "Tutor", href: "/tutor", icon: "pencil" },
      { id: "explain", label: "Explain", href: "/explain", icon: "search" },
      { id: "scan", label: "Scan", href: "/scan", icon: "scan" },
      { id: "study-pack", label: "Study Pack", href: "/study-pack", icon: "bookmark" },
      { id: "test-prep", label: "Test Prep", href: "/test-prep", icon: "medal" },
    ],
  },
  {
    label: "Account",
    items: [
      { id: "profile", label: "Profile", href: "/profile", icon: "profile" },
      { id: "pricing", label: "Pricing", href: "/pricing", icon: "spark" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Mobile bottom tabs                                                 */
/* ------------------------------------------------------------------ */

const mobileNavItems: NavItem[] = [
  { id: "home", label: "Home", href: "/home", icon: "home" },
  { id: "coach", label: "Coach", href: "/coach", icon: "brain" },
  { id: "create", label: "Create", href: "/create", icon: "create" },
  { id: "progress", label: "Progress", href: "/progress", icon: "progress" },
  { id: "profile", label: "Profile", href: "/profile", icon: "profile" },
];

/* ------------------------------------------------------------------ */
/*  Path → NavId mapping                                               */
/* ------------------------------------------------------------------ */

const allNavItems = navGroups.flatMap((g) => g.items);

function detectNavId(pathname: string): NavId {
  // exact match first
  const exact = allNavItems.find((item) => item.href === pathname);
  if (exact) return exact.id;

  // sub-route matching
  if (pathname.startsWith("/plan/") || pathname.startsWith("/plans/")) return "plans";
  if (pathname.startsWith("/ask/")) return "ask";
  if (pathname.startsWith("/quiz/")) return "quiz";
  if (pathname.startsWith("/flashcards/")) return "flashcards";
  if (pathname.startsWith("/tutor/")) return "tutor";
  if (pathname.startsWith("/explain/")) return "explain";
  if (pathname.startsWith("/scan/")) return "scan";
  if (pathname.startsWith("/study-pack/")) return "study-pack";
  if (pathname.startsWith("/test-prep/")) return "test-prep";
  if (pathname.startsWith("/focus/")) return "focus";
  if (pathname.startsWith("/decks/")) return "decks";
  if (pathname.startsWith("/study")) return "study";
  if (pathname.startsWith("/paywall")) return "paywall";

  return "home";
}

/* ------------------------------------------------------------------ */
/*  Sidebar                                                            */
/* ------------------------------------------------------------------ */

const studyToolIds = new Set(navGroups.find((g) => g.label === "Study Tools")?.items.map((i) => i.id) ?? []);

function Sidebar({ active }: { active: NavId }) {
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col overflow-y-auto border-r border-white/10 bg-gradient-to-b from-[#1E1B4B] to-[#312E81] p-5 text-white lg:flex">
      <BrandMark tone="dark" />
      <nav className="mt-8 flex-1 space-y-6" aria-label="Main navigation">
        {navGroups.map((group) => {
          const isStudyTools = group.label === "Study Tools";
          const isOpen = isStudyTools ? toolsOpen : true;

          return (
            <div key={group.label}>
              {isStudyTools ? (
                <button
                  type="button"
                  onClick={() => setToolsOpen((o) => !o)}
                  className="mb-2 flex w-full items-center justify-between px-4 text-[10px] font-black uppercase tracking-[0.18em] text-white/40 transition hover:text-white/60"
                >
                  {group.label}
                  <Icon
                    name="chevronRight"
                    className={cn("h-3 w-3 transition-transform", isOpen && "rotate-90")}
                  />
                </button>
              ) : (
                <p className="mb-2 px-4 text-[10px] font-black uppercase tracking-[0.18em] text-white/40">
                  {group.label}
                </p>
              )}
              {isOpen && (
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <Link
                      aria-current={active === item.id ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold transition",
                        active === item.id
                          ? "bg-white text-[#312E81] shadow-sm hover:bg-white"
                          : "text-white/72 hover:bg-white/10 hover:text-white",
                      )}
                      href={item.href}
                      key={item.id}
                    >
                      <Icon name={item.icon} className="h-4 w-4" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="mt-6 rounded-lg bg-white/10 p-4">
        <p className="text-sm font-bold">Fast study flow</p>
        <p className="mt-2 text-sm leading-6 text-white/70">
          Notes in. Cards out. Studying starts immediately.
        </p>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile header + bottom bar                                         */
/* ------------------------------------------------------------------ */

function MobileNav({ active }: { active: NavId }) {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/92 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <BackButton className="h-10 w-10" fallbackHref="/home" />
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
      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-3 py-2 shadow-[0_-8px_30px_rgba(30,27,75,0.08)] backdrop-blur lg:hidden"
      >
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1 sm:gap-2">
          {mobileNavItems.map((item) => {
            const isActive = active === item.id;
            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-xs font-bold transition",
                  isActive
                    ? "bg-[#FACC15] text-[#1E1B4B] hover:bg-[#FACC15]"
                    : "text-slate-500 hover:bg-[#FEFCE8] hover:text-[#1E1B4B]",
                )}
                href={item.href}
                key={item.id}
              >
                <Icon name={item.icon} className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  AppLayout                                                          */
/* ------------------------------------------------------------------ */

export type { NavId };

export function AppLayout({
  active: activeOverride,
  children,
}: {
  active?: NavId;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const active = activeOverride ?? detectNavId(pathname);

  return (
    <HydrationGate>
      <div className="min-h-screen bg-[#F8FAFC] text-[#1E1B4B]">
        <Sidebar active={active} />
        <MobileNav active={active} />
        <main className="px-4 py-6 pb-28 sm:px-6 lg:ml-72 lg:px-8 lg:py-10">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 hidden lg:block">
              <BackButton />
            </div>
            {children}
          </div>
        </main>
      </div>
    </HydrationGate>
  );
}
