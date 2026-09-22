"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { useEffect } from "react";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-xl font-black transition disabled:cursor-not-allowed disabled:opacity-50";
const btnVariants: Record<Variant, string> = {
  primary: "bg-[#312E81] text-white hover:bg-[#1E1B4B]",
  secondary: "bg-white text-[#312E81] border border-slate-200 hover:border-[#818CF8]",
  ghost: "bg-transparent text-[#312E81] hover:bg-slate-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
};
const btnSizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  loading,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; loading?: boolean }) {
  return (
    <button
      {...rest}
      disabled={rest.disabled || loading}
      className={cn(btnBase, btnVariants[variant], btnSizes[size], className)}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}

export function LinkButton({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
}: {
  variant?: Variant;
  size?: Size;
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={cn(btnBase, btnVariants[variant], btnSizes[size], className)}>
      {children}
    </Link>
  );
}

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...rest}
      className={cn(
        "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-[#0F1626] placeholder:text-slate-400 focus:border-[#312E81] focus:outline-none focus:ring-2 focus:ring-[#818CF8]/30 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    />
  );
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...rest}
      className={cn(
        "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-[#0F1626] placeholder:text-slate-400 focus:border-[#312E81] focus:outline-none focus:ring-2 focus:ring-[#818CF8]/30 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    />
  );
}

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select
      {...rest}
      className={cn(
        "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-[#0F1626] focus:border-[#312E81] focus:outline-none focus:ring-2 focus:ring-[#818CF8]/30",
        className,
      )}
    >
      {children}
    </select>
  );
}

export function Label({ children, htmlFor, hint }: { children: ReactNode; htmlFor?: string; hint?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-black uppercase tracking-[.14em] text-slate-500">
      {children}
      {hint ? <span className="ml-2 text-[10px] font-semibold normal-case tracking-normal text-slate-400">{hint}</span> : null}
    </label>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-slate-200 bg-white p-6 shadow-sm", className)}>{children}</div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "primary" | "accent" | "success";
}) {
  const toneCls =
    tone === "primary"
      ? "bg-[#312E81] text-white"
      : tone === "accent"
        ? "bg-[#FACC15] text-[#1E1B4B]"
        : tone === "success"
          ? "bg-[#10B981] text-white"
          : "bg-white text-[#1E1B4B] border border-slate-200";
  return (
    <div className={cn("rounded-2xl p-6 shadow-sm", toneCls)}>
      <p
        className={cn(
          "text-xs font-black uppercase tracking-[.16em]",
          tone === "default" ? "text-slate-500" : "opacity-80",
        )}
      >
        {label}
      </p>
      <p className="mt-2 text-3xl font-black tracking-tight">{value}</p>
      {hint ? (
        <p className={cn("mt-1 text-xs font-semibold", tone === "default" ? "text-slate-500" : "opacity-80")}>{hint}</p>
      ) : null}
    </div>
  );
}

export function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-xs font-black transition",
        active
          ? "border-[#312E81] bg-[#312E81] text-white"
          : "border-slate-200 bg-white text-slate-600 hover:border-[#818CF8]",
      )}
    >
      {children}
    </button>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-4 w-4 animate-spin", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <circle cx="12" cy="12" r="10" strokeWidth={3} className="opacity-25" />
      <path d="M22 12a10 10 0 0 0-10-10" strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
}

export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <h3 className="text-lg font-black text-[#1E1B4B]">{title}</h3>
      {hint ? <p className="mt-2 text-sm font-semibold text-slate-500">{hint}</p> : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function ErrorBanner({ title, message, onRetry }: { title?: string; message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
      <p className="font-black">{title ?? "Something went wrong"}</p>
      <p className="mt-1 font-semibold">{message}</p>
      {onRetry ? (
        <button className="mt-3 rounded-full bg-red-600 px-3 py-1.5 text-xs font-black text-white" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  );
}

export function Sheet({
  open,
  onClose,
  title,
  description,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-slate-200 bg-white shadow-2xl">
        <header className="sticky top-0 flex items-start justify-between gap-3 border-b border-slate-100 bg-white p-6">
          <div>
            <h2 className="text-lg font-black text-[#1E1B4B]">{title}</h2>
            {description ? <p className="mt-1 text-sm font-semibold text-slate-500">{description}</p> : null}
          </div>
          <button
            aria-label="Close panel"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </header>
        <div className="flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  destructive,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  destructive?: boolean;
  loading?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-lg font-black text-[#1E1B4B]">{title}</h2>
        <p className="mt-2 text-sm font-semibold text-slate-500">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={destructive ? "danger" : "primary"} onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
