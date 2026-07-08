"use client";

import Link from "next/link";
import { AuthForm } from "@/app/components/auth-form";
import { Icon, PrimaryButton, SecondaryButton, cn } from "@/app/components/ui";
import { useAppState } from "@/lib/state";
import { useAuth } from "@/lib/auth";

const signupHref = "/onboarding/profile-ready";
const loginHref = "/auth";
const appHref = "/home";

type Tone = "dark" | "light";
type Variant = "header" | "hero" | "stack";

function placeholderClass(variant: Variant) {
  if (variant === "hero") {
    return "h-12 w-full max-w-lg";
  }

  if (variant === "stack") {
    return "h-24 w-full";
  }

  return "h-10 w-36 shrink-0";
}

function primaryClass(tone: Tone, variant: Variant) {
  const size =
    variant === "hero"
      ? "min-h-12 flex-1 px-5 py-3"
      : variant === "stack"
        ? "min-h-11 w-full px-5 py-3"
        : "min-h-10 px-4 py-2";

  return cn(
    "inline-flex items-center justify-center gap-2 rounded-lg bg-[#FACC15] text-sm font-black text-[#1E1B4B] shadow-sm transition",
    size,
    tone === "dark" ? "hover:bg-white hover:text-[#312E81]" : "hover:bg-[#312E81] hover:text-white",
  );
}

function secondaryClass(tone: Tone, variant: Variant) {
  const size =
    variant === "hero"
      ? "min-h-12 flex-1 px-5 py-3"
      : variant === "stack"
        ? "min-h-11 w-full px-5 py-3"
        : "min-h-10 px-3 py-2";

  return cn(
    "inline-flex items-center justify-center rounded-lg text-sm font-black transition",
    size,
    tone === "dark"
      ? "text-white/80 hover:bg-white/10 hover:text-[#FACC15]"
      : "text-slate-600 hover:bg-slate-100 hover:text-[#312E81]",
    variant !== "header" &&
      tone === "dark" &&
      "border border-white/18 bg-white/10 !text-white hover:border-[#FACC15] hover:!text-[#FACC15]",
    variant !== "header" &&
      tone === "light" &&
      "border border-slate-200 bg-white text-[#1E1B4B] shadow-sm hover:border-[#FACC15]/60 hover:text-[#CA8A04]",
  );
}

export function PublicAuthActions({
  tone = "light",
  variant = "header",
  className,
}: {
  tone?: Tone;
  variant?: Variant;
  className?: string;
}) {
  const { hydrated, onboarded } = useAppState();
  const { isAuthenticated } = useAuth();
  const isLoggedIn = onboarded && isAuthenticated;
  const wrapperClass =
    variant === "header"
      ? "flex shrink-0 items-center gap-2 sm:gap-3"
      : variant === "hero"
        ? "flex w-full max-w-lg flex-col gap-3 sm:flex-row"
        : "flex w-full flex-col gap-3 sm:flex-row lg:flex-col";

  if (!hydrated) {
    return <div aria-hidden="true" className={cn(placeholderClass(variant), className)} />;
  }

  if (isLoggedIn) {
    return (
      <div className={cn(wrapperClass, className)}>
        <Link
          className={cn(primaryClass(tone, variant), variant === "hero" && "w-full max-w-xs flex-none")}
          href={appHref}
        >
          Open app
        </Link>
      </div>
    );
  }

  return (
    <div className={cn(wrapperClass, className)}>
      <Link className={secondaryClass(tone, variant)} href={loginHref}>
        Log in
      </Link>
      <Link className={primaryClass(tone, variant)} href={signupHref}>
        {variant === "header" ? "Sign up" : "Sign up free"}
      </Link>
    </div>
  );
}

export function PublicAuthFooterLinks({
  linkClassName,
}: {
  linkClassName: string;
}) {
  const { hydrated, onboarded } = useAppState();
  const { isAuthenticated } = useAuth();

  if (!hydrated) {
    return (
      <li aria-hidden="true">
        <span className="block h-4 w-20 rounded-lg bg-slate-100" />
      </li>
    );
  }

  if (onboarded && isAuthenticated) {
    return (
      <li>
        <Link className={linkClassName} href={appHref}>
          Open app
        </Link>
      </li>
    );
  }

  return (
    <>
      <li>
        <Link className={linkClassName} href={loginHref}>
          Log in
        </Link>
      </li>
      <li>
        <Link className={linkClassName} href={signupHref}>
          Sign up
        </Link>
      </li>
    </>
  );
}

export function PricingPlanCta({
  href,
  cta,
  highlighted,
}: {
  href: string;
  cta: string;
  highlighted?: boolean;
}) {
  const { hydrated, onboarded } = useAppState();
  const { isAuthenticated } = useAuth();
  const isLoggedIn = onboarded && isAuthenticated;
  const isSignup = href === signupHref;
  if (isSignup && !hydrated) {
    return <div aria-hidden="true" className="h-11 w-full rounded-lg bg-slate-100" />;
  }

  const resolvedHref = hydrated && isLoggedIn && isSignup ? appHref : href;
  const resolvedCta = hydrated && isLoggedIn && isSignup ? "Open app" : cta;

  if (highlighted) {
    return (
      <PrimaryButton
        href={resolvedHref}
        className="w-full bg-[#FACC15] !text-[#1E1B4B] hover:bg-white hover:!text-[#312E81]"
      >
        {resolvedCta}
      </PrimaryButton>
    );
  }

  return (
    <SecondaryButton href={resolvedHref} className="w-full">
      {resolvedCta}
    </SecondaryButton>
  );
}

export function AuthPageEntry() {
  const { hydrated, onboarded } = useAppState();
  const { isAuthenticated } = useAuth();

  if (!hydrated) {
    return <div className="h-[28rem] rounded-lg border border-slate-200 bg-white shadow-lg shadow-[#1E1B4B]/8" />;
  }

  if (onboarded && isAuthenticated) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-lg shadow-[#1E1B4B]/8">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-[#312E81]/10 text-[#312E81]">
          <Icon name="check" />
        </span>
        <h2 className="mt-5 text-3xl font-black tracking-tight text-[#1E1B4B]">You are signed in</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Continue to your Aceley workspace to pick up your study plan.
        </p>
        <PrimaryButton href={appHref} className="mt-6 w-full">
          Open app
        </PrimaryButton>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-black tracking-tight text-[#1E1B4B]">Log in to Aceley</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Sign in to save decks, track progress, and keep studying across devices.
        </p>
      </div>
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
        <span className="rounded-lg bg-white px-4 py-3 text-center text-sm font-black text-[#1E1B4B] shadow-sm">
          Log in
        </span>
        <Link
          className="rounded-lg px-4 py-3 text-center text-sm font-black text-slate-500 transition hover:bg-white hover:text-[#312E81]"
          href={signupHref}
        >
          Sign up
        </Link>
      </div>
      <AuthForm />
      <p className="mt-4 text-center text-sm font-semibold text-slate-600">
        New to Aceley?{" "}
        <Link className="font-black text-[#312E81] transition hover:text-[#CA8A04]" href={signupHref}>
          Create an account
        </Link>
      </p>
    </>
  );
}
