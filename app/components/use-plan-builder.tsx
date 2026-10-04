"use client";

import { useCallback, useState } from "react";
import { SourcePickerSheet } from "@/app/components/source-picker-sheet";
import { PlanBuilderSheet } from "@/app/components/plan-builder-sheet";
import type { PlanSource } from "@/services/dtos/study-plans";

/**
 * Drives the two-sheet "build a plan" flow:
 * 1. SourcePickerSheet gathers a source.
 * 2. PlanBuilderSheet collects hours + confidence and submits.
 *
 * Returns `{ open, element }`. Mount `element` once in the component tree and
 * call `open()` from wherever ("Build your first plan" CTA, nav button, etc.).
 */
export function usePlanBuilder() {
  const [stage, setStage] = useState<"idle" | "pick" | "configure">("idle");
  const [source, setSource] = useState<PlanSource | null>(null);

  const open = useCallback(() => {
    setSource(null);
    setStage("pick");
  }, []);

  const close = useCallback(() => {
    setStage("idle");
    setSource(null);
  }, []);

  const element = (
    <>
      <SourcePickerSheet
        onClose={close}
        onPick={(s) => {
          setSource(s);
          setStage("configure");
        }}
        open={stage === "pick"}
      />
      <PlanBuilderSheet
        onClose={close}
        open={stage === "configure"}
        source={source}
      />
    </>
  );

  return { open, close, element };
}
