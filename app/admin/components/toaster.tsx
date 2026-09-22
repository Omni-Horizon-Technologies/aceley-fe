"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type ToastKind = "success" | "error" | "info";
type Toast = { id: string; kind: ToastKind; title: string; body?: string };

type ToasterCtx = {
  push: (toast: Omit<Toast, "id">) => void;
  success: (title: string, body?: string) => void;
  error: (title: string, body?: string) => void;
  info: (title: string, body?: string) => void;
};

const Ctx = createContext<ToasterCtx | null>(null);

export function ToasterProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((toast: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  }, []);

  const value = useMemo<ToasterCtx>(
    () => ({
      push,
      success: (title, body) => push({ kind: "success", title, body }),
      error: (title, body) => push({ kind: "error", title, body }),
      info: (title, body) => push({ kind: "info", title, body }),
    }),
    [push],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[80] flex w-96 flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={
              "pointer-events-auto rounded-2xl border p-4 shadow-lg " +
              (t.kind === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : t.kind === "error"
                  ? "border-red-200 bg-red-50 text-red-800"
                  : "border-slate-200 bg-white text-[#1E1B4B]")
            }
          >
            <p className="text-sm font-black">{t.title}</p>
            {t.body ? <p className="mt-1 text-xs font-semibold opacity-80">{t.body}</p> : null}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToaster() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToaster must be used inside ToasterProvider");
  return ctx;
}
