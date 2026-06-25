"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useSyncExternalStore } from "react";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const motionQuery = window.matchMedia(reducedMotionQuery);
  motionQuery.addEventListener("change", onStoreChange);

  return () => {
    motionQuery.removeEventListener("change", onStoreChange);
  };
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia(reducedMotionQuery).matches;
}

export function LottieMascot({
  className = "",
  name = "mascot_Hi",
  sizeLabel = "Aceley study mascot",
}: {
  className?: string;
  name?: "mascot_Hi" | "mascot_celebrate" | "mascot_winner" | "mascot_lost";
  sizeLabel?: string;
}) {
  const reduceMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );

  return (
    <div className={className} aria-label={sizeLabel} role="img">
      <DotLottieReact
        autoplay={!reduceMotion}
        className="h-full w-full"
        loop={!reduceMotion}
        src={`/animations/${name}.json`}
      />
    </div>
  );
}
