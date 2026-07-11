"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon, PrimaryButton } from "@/app/components/ui";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

type Status = "verifying" | "error";

function VerifyingCard() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-lg shadow-[#1E1B4B]/8">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#312E81]/10 text-[#312E81]">
        <Icon name="lock" />
      </span>
      <h1 className="mt-4 text-2xl font-black tracking-tight text-[#1E1B4B]">
        Signing you in...
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Verifying your magic link. This only takes a moment.
      </p>
    </div>
  );
}

function VerifyLinkClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("verifying");
  const [errorMessage, setErrorMessage] = useState("");
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    if (!token) {
      router.replace("/sign-in?error=missing_token");
      return;
    }

    (async () => {
      try {
        const verifyRes = await fetch(`${API_URL}/api/v1/auth/email/verify-link`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        if (!verifyRes.ok) {
          throw new Error(`verify_failed_${verifyRes.status}`);
        }
        const data = (await verifyRes.json()) as {
          access_token?: string;
          refresh_token?: string;
        };
        if (!data.access_token || !data.refresh_token) {
          throw new Error("verify_missing_tokens");
        }

        const sessionRes = await fetch("/api/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
          }),
        });
        if (!sessionRes.ok) {
          throw new Error("session_failed");
        }

        router.replace("/dashboard");
      } catch {
        setStatus("error");
        setErrorMessage("Your sign-in link is invalid or has expired.");
      }
    })();
  }, [router, token]);

  if (status === "verifying") {
    return <VerifyingCard />;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-lg shadow-[#1E1B4B]/8">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#FACC15]/20 text-[#CA8A04]">
        <Icon name="warning" />
      </span>
      <h1 className="mt-4 text-2xl font-black tracking-tight text-[#1E1B4B]">
        Link couldn&apos;t be verified
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">{errorMessage}</p>
      <PrimaryButton className="mt-6 w-full" href="/sign-in">
        Request a new link
      </PrimaryButton>
    </div>
  );
}

export default function VerifyLinkPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-10">
      <div className="w-full max-w-sm text-center">
        <Suspense fallback={<VerifyingCard />}>
          <VerifyLinkClient />
        </Suspense>
      </div>
    </main>
  );
}
