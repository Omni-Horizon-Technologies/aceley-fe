"use client";

import Lottie from "lottie-react";
import { useEffect, useState, useSyncExternalStore } from "react";

type AnimationData = Record<string, unknown>;
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

export function LottieMascot({ className = "" }: { className?: string }) {
  const [animationData, setAnimationData] = useState<AnimationData | null>(null);
  const reduceMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );

  useEffect(() => {
    let active = true;

    fetch("/animation/mascot_Hi.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load Aceley mascot animation.");
        }

        return response.json() as Promise<AnimationData>;
      })
      .then((data) => {
        if (active) {
          setAnimationData(data);
        }
      })
      .catch(() => {
        if (active) {
          setAnimationData(null);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className={className} aria-label="Aceley study mascot" role="img">
      {animationData ? (
        <Lottie
          animationData={animationData}
          autoplay={!reduceMotion}
          loop={!reduceMotion}
        />
      ) : (
        <div className="grid aspect-square place-items-center rounded-lg bg-white/10 text-4xl font-black text-[#FACC15]">
          A
        </div>
      )}
    </div>
  );
}
