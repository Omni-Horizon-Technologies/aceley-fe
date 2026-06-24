import type { ReactNode } from "react";
import { BackButton } from "@/app/components/back-button";
import { BrandMark, cn, Icon } from "@/app/components/ui";
import Link from "next/link";

type NavId = "dashboard" | "create" | "profile";

const navItems: Array<{
  id: NavId;
  label: string;
  href: string;
  icon: "dashboard" | "create" | "profile";
}> = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { id: "create", label: "Create", href: "/create", icon: "create" },
  { id: "profile", label: "Profile", href: "/profile", icon: "profile" },
];

export function Sidebar({ active }: { active: NavId }) {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col border-r border-white/10 bg-gradient-to-b from-[#1E1B4B] to-[#312E81] p-5 text-white lg:flex">
      <BrandMark tone="dark" />
      <nav className="mt-10 space-y-2" aria-label="Main navigation">
        {navItems.map((item) => (
          <Link
            aria-current={active === item.id ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition",
              active === item.id
                ? "bg-white text-[#312E81] shadow-sm hover:bg-white"
                : "text-white/72 hover:bg-white/10 hover:text-white",
            )}
            href={item.href}
            key={item.id}
          >
            <Icon name={item.icon} />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto rounded-lg bg-white/10 p-4">
        <p className="text-sm font-bold">Fast study flow</p>
        <p className="mt-2 text-sm leading-6 text-white/70">
          Notes in. Cards out. Studying starts immediately.
        </p>
      </div>
    </aside>
  );
}

export function Navbar({ active }: { active: NavId }) {
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <BackButton className="h-10 w-10" />
            <BrandMark />
          </div>
          <Link
            className="rounded-lg bg-[#FB7185] px-4 py-2 text-sm font-bold text-white shadow-sm"
            href="/study"
          >
            Study
          </Link>
        </div>
      </header>
      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-3 py-2 shadow-[0_-8px_30px_rgba(30,27,75,0.08)] backdrop-blur lg:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
          {navItems.map((item) => (
            <Link
              aria-current={active === item.id ? "page" : undefined}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-xs font-bold transition",
                active === item.id
                  ? "bg-[#312E81] text-white hover:bg-[#312E81]"
                  : "text-slate-500 hover:bg-[#F8FAFC]",
              )}
              href={item.href}
              key={item.id}
            >
              <Icon name={item.icon} className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}

export function AppLayout({
  active,
  children,
}: {
  active: NavId;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E1B4B]">
      <Sidebar active={active} />
      <Navbar active={active} />
      <main className="px-4 py-8 pb-28 sm:px-6 lg:ml-72 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 hidden lg:block">
            <BackButton />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
