"use client";

import Link from "next/link";
import { useCredits } from "@/services/hooks/useCredits";

export function CreditChip() {
  const { data, isLoading } = useCredits();
  const balance = data?.balance ?? 0;
  const isUnlimited = data?.is_unlimited ?? false;

  const label = isUnlimited ? "∞" : isLoading && !data ? "—" : balance.toLocaleString();
  const href = isUnlimited ? "/profile" : "/paywall";

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-xs font-black text-[#CA8A04] shadow-sm transition hover:border-amber-300 hover:bg-amber-100"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
        <path d="M12 2 15 9l7 .8-5.3 4.8L18.2 22 12 18l-6.2 4 1.5-7.4L2 9.8 9 9l3-7Z" />
      </svg>
      {label}
    </Link>
  );
}
