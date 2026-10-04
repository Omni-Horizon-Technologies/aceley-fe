"use client";

import { useRef, useState } from "react";
import { Icon, PrimaryButton, SecondaryButton, cn } from "@/app/components/ui";
import { uploadPlanSourceFile } from "@/services/modules/study-plans";
import type { PlanSource, PlanSourceType } from "@/services/dtos/study-plans";

type Variant = {
  type: PlanSourceType;
  label: string;
  description: string;
  icon: Parameters<typeof Icon>[0]["name"];
};

const VARIANTS: Variant[] = [
  { type: "text", label: "Paste text", description: "Paste notes or an outline.", icon: "notes" },
  { type: "file", label: "PDF file", description: "Upload a PDF from your device.", icon: "file" },
  { type: "youtu", label: "YouTube", description: "Drop a YouTube URL.", icon: "play" },
  { type: "url", label: "Web URL", description: "A link to an article or page.", icon: "upload" },
  { type: "image", label: "Image", description: "Upload a photo of your notes.", icon: "image" },
  { type: "scan", label: "Scan a page", description: "Take a photo with your camera.", icon: "scan" },
];

type Mode = "pick" | "text" | "url" | "youtu";

export function SourcePickerSheet({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (source: PlanSource) => void;
}) {
  const [mode, setMode] = useState<Mode>("pick");
  const [value, setValue] = useState("");
  const [uploading, setUploading] = useState<null | PlanSourceType>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const scanRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  function reset() {
    setMode("pick");
    setValue("");
    setError("");
    setUploading(null);
  }

  function close() {
    reset();
    onClose();
  }

  function pick(type: PlanSourceType) {
    setError("");
    if (type === "text") {
      setMode("text");
      return;
    }
    if (type === "url") {
      setMode("url");
      return;
    }
    if (type === "youtu") {
      setMode("youtu");
      return;
    }
    if (type === "file") {
      fileRef.current?.click();
      return;
    }
    if (type === "image") {
      imageRef.current?.click();
      return;
    }
    if (type === "scan") {
      scanRef.current?.click();
      return;
    }
  }

  async function handleFile(type: PlanSourceType, file: File | undefined) {
    if (!file) return;
    setError("");
    setUploading(type);
    try {
      const id = await uploadPlanSourceFile(file);
      onPick({ type, ref: id, label: file.name });
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Try again.");
    } finally {
      setUploading(null);
    }
  }

  function submitText() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onPick({ type: "text", ref: trimmed, label: "Pasted notes" });
    close();
  }

  function submitUrl(type: "url" | "youtu") {
    const trimmed = value.trim();
    if (!trimmed) return;
    onPick({ type, ref: trimmed, label: trimmed });
    close();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 px-3 pb-3 sm:items-center sm:p-6"
      onClick={close}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-[#CA8A04]">
              Build your plan
            </p>
            <h2 className="mt-1 text-xl font-black text-[#1E1B4B]">
              {mode === "pick"
                ? "Where should we start?"
                : mode === "text"
                  ? "Paste your notes"
                  : mode === "url"
                    ? "Paste a URL"
                    : "YouTube URL"}
            </h2>
          </div>
          <button
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500 transition hover:bg-slate-200"
            onClick={close}
            type="button"
          >
            <Icon name="x" className="h-4 w-4" />
          </button>
        </div>

        {mode === "pick" && (
          <>
            <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {VARIANTS.map((v) => {
                const busy = uploading === v.type;
                return (
                  <li key={v.type}>
                    <button
                      className={cn(
                        "flex w-full items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-[#312E81]/40 hover:bg-slate-50",
                        busy && "opacity-60",
                      )}
                      disabled={busy}
                      onClick={() => pick(v.type)}
                      type="button"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#312E81]/10 text-[#312E81]">
                        <Icon name={v.icon} className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-black text-[#1E1B4B]">
                          {v.label}
                        </span>
                        <span className="mt-0.5 block text-xs font-semibold text-slate-500">
                          {busy ? "Uploading…" : v.description}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {error && (
              <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
                {error}
              </p>
            )}
            <input
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                void handleFile("file", e.target.files?.[0]);
                e.target.value = "";
              }}
              ref={fileRef}
              type="file"
            />
            <input
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                void handleFile("image", e.target.files?.[0]);
                e.target.value = "";
              }}
              ref={imageRef}
              type="file"
            />
            <input
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                void handleFile("scan", e.target.files?.[0]);
                e.target.value = "";
              }}
              ref={scanRef}
              type="file"
            />
          </>
        )}

        {mode === "text" && (
          <>
            <textarea
              autoFocus
              className="mt-5 min-h-40 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold outline-none focus:border-[#312E81]"
              onChange={(e) => setValue(e.target.value)}
              placeholder="Paste or type your notes…"
              value={value}
            />
            <div className="mt-4 flex gap-3">
              <SecondaryButton className="flex-1" onClick={() => setMode("pick")}>
                Back
              </SecondaryButton>
              <PrimaryButton
                className="flex-1"
                disabled={!value.trim()}
                onClick={submitText}
              >
                Use this
              </PrimaryButton>
            </div>
          </>
        )}

        {(mode === "url" || mode === "youtu") && (
          <>
            <input
              autoFocus
              className="mt-5 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold outline-none focus:border-[#312E81]"
              onChange={(e) => setValue(e.target.value)}
              placeholder={mode === "youtu" ? "https://youtube.com/…" : "https://…"}
              type="url"
              value={value}
            />
            <div className="mt-4 flex gap-3">
              <SecondaryButton className="flex-1" onClick={() => setMode("pick")}>
                Back
              </SecondaryButton>
              <PrimaryButton
                className="flex-1"
                disabled={!value.trim()}
                onClick={() => submitUrl(mode)}
              >
                Use this
              </PrimaryButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
