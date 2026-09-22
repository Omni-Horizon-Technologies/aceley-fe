"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { UNAUTHORIZED_EVENT, clearSession, getExpiresAt, getStoredAdmin, getToken } from "@/app/admin/lib/api";
import { useMe } from "@/app/admin/lib/hooks";
import { Spinner } from "@/app/admin/components/ui";
import { useToaster } from "@/app/admin/components/toaster";

type NavItem = { href: string; label: string; icon: ReactNode };

const NAV: NavItem[] = [
  { href: "/", label: "Overview", icon: <IconGrid /> },
  { href: "/users", label: "Users", icon: <IconUsers /> },
  { href: "/app-versions", label: "App versions", icon: <IconPhone /> },
  { href: "/push", label: "Push", icon: <IconBell /> },
  { href: "/push/history", label: "Push history", icon: <IconClock /> },
  { href: "/system", label: "System", icon: <IconSettings /> },
];

function normalize(path: string) {
  if (path.startsWith("/admin")) {
    const rest = path.slice("/admin".length);
    return rest === "" ? "/" : rest;
  }
  return path;
}

const subscribeAuth = (cb: () => void) => {
  window.addEventListener("storage", cb);
  window.addEventListener(UNAUTHORIZED_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(UNAUTHORIZED_EVENT, cb);
  };
};

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const current = normalize(pathname || "/");
  const toaster = useToaster();

  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const hasToken = useSyncExternalStore(subscribeAuth, () => getToken() !== null, () => false);
  const admin = mounted ? getStoredAdmin() : null;

  useEffect(() => {
    if (!mounted) return;
    if (!hasToken) router.replace("/login");
  }, [mounted, hasToken, router]);

  useEffect(() => {
    const onUnauth = () => {
      clearSession();
      toaster.error("Session ended", "Please sign in again.");
      router.replace("/login");
    };
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauth);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauth);
  }, [router, toaster]);

  const me = useMe(mounted && hasToken);

  if (!mounted) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-slate-50">
        <Spinner className="h-6 w-6 text-[#312E81]" />
      </div>
    );
  }

  if (!hasToken) return null;

  return (
    <div className="flex min-h-[100dvh] bg-slate-50">
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-slate-100 px-6">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#312E81] text-sm font-black text-white">A</span>
          <div>
            <p className="text-sm font-black leading-tight text-[#1E1B4B]">Aceley</p>
            <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#CA8A04]">Admin</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((item) => {
            const active = current === item.href || (item.href !== "/" && current.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-black transition " +
                  (active ? "bg-[#312E81] text-white" : "text-slate-600 hover:bg-slate-100")
                }
              >
                <span className="grid h-5 w-5 place-items-center">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <SessionExpiry />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-6 backdrop-blur">
          <GlobalUserSearch />
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-slate-500">Signed in as</p>
              <p className="text-sm font-black text-[#1E1B4B]">{me.data?.email || admin?.email || "admin"}</p>
            </div>
            <button
              onClick={() => {
                clearSession();
                router.replace("/login");
              }}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-black text-[#312E81] hover:border-[#818CF8]"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}

function GlobalUserSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");

  return (
    <form
      className="flex w-full max-w-md items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        if (!q) return;
        router.push(`/users?search=${encodeURIComponent(q)}`);
      }}
    >
      <div className="relative flex-1">
        <IconSearchAbs />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search users by email or nickname…"
          className="w-full rounded-full border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm font-semibold text-[#0F1626] placeholder:text-slate-400 focus:border-[#312E81] focus:outline-none focus:ring-2 focus:ring-[#818CF8]/30"
        />
      </div>
    </form>
  );
}

function SessionExpiry() {
  const [msLeft, setMsLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const exp = getExpiresAt();
      setMsLeft(exp ? exp - Date.now() : null);
    };
    tick();
    const iv = setInterval(tick, 30_000);
    return () => clearInterval(iv);
  }, []);

  if (msLeft === null || msLeft <= 0) return null;
  const minutes = Math.floor(msLeft / 60_000);
  if (minutes > 30) return null;

  return (
    <div className="border-t border-slate-100 p-4 text-xs font-black text-amber-700">
      <p className="text-[10px] uppercase tracking-[.18em] text-amber-600">Session</p>
      <p className="mt-1">Expires in {minutes}m — re-login soon.</p>
    </div>
  );
}

function IconGrid() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15 20a4.5 4.5 0 0 1 6.5-4" />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
      <rect x="6" y="2" width="12" height="20" rx="3" />
      <path d="M11 18h2" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
      <path d="M6 15V10a6 6 0 1 1 12 0v5l1.5 3H4.5L6 15Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
function IconSettings() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1A2 2 0 1 1 7 4.6l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  );
}
function IconSearchAbs() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    </span>
  );
}
