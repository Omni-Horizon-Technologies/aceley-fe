import type { ApiEnvelopeError } from "./types";

// Same-origin proxy: browser hits /api/admin-proxy/* which next.config.ts
// rewrites server-side to the real backend. Avoids CORS entirely.
export const API_BASE = "/api/admin-proxy";

export const UNAUTHORIZED_EVENT = "admin:unauthorized";

const TOKEN_KEY = "admin.token";
const ADMIN_KEY = "admin.me";
const EXPIRY_KEY = "admin.expires_at";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getStoredAdmin() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(ADMIN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { id: string; email: string; username: string };
  } catch {
    return null;
  }
}

export function getExpiresAt(): number | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(EXPIRY_KEY);
  return raw ? Number(raw) : null;
}

export function saveSession(token: string, expiresInSec: number, admin: { id: string; email: string; username: string }) {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
  window.localStorage.setItem(EXPIRY_KEY, String(Date.now() + expiresInSec * 1000));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(ADMIN_KEY);
  window.localStorage.removeItem(EXPIRY_KEY);
}

export class ApiError extends Error {
  code: string;
  status: number;
  details: Record<string, unknown>;

  constructor(status: number, envelope: ApiEnvelopeError) {
    super(envelope.message || "Request failed");
    this.name = "ApiError";
    this.status = status;
    this.code = envelope.code || "error";
    this.details = envelope.details || {};
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean;
  query?: Record<string, string | number | undefined | null>;
};

export async function apiRequest<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, auth = true, query } = opts;

  // API_BASE is relative ("/api/admin-proxy") so we can't use new URL() directly.
  // Build the query string manually to keep the request same-origin.
  const search = new URLSearchParams();
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null || v === "") continue;
      search.set(k, String(v));
    }
  }
  const qs = search.toString();
  const target = `${API_BASE}${path}${qs ? `?${qs}` : ""}`;

  const requestHeaders: Record<string, string> = {
    Accept: "application/json",
    // Bypass the ngrok free-tier browser-warning interstitial (harmless in prod).
    "ngrok-skip-browser-warning": "true",
    ...headers,
  };
  if (body !== undefined && !(body instanceof FormData)) {
    requestHeaders["Content-Type"] = "application/json";
  }
  if (auth) {
    const token = getToken();
    if (token) requestHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(target, {
    method,
    headers: requestHeaders,
    body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
    credentials: "omit",
  });

  if (res.status === 204) return undefined as T;

  let payload: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { message: text, code: "invalid_response", details: {} };
    }
  }

  if (!res.ok) {
    const envelope =
      payload && typeof payload === "object"
        ? (payload as ApiEnvelopeError)
        : { message: res.statusText, code: "error", details: {} };
    const err = new ApiError(res.status, envelope);
    if (res.status === 401 || res.status === 403) {
      clearSession();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT, { detail: err }));
      }
    }
    throw err;
  }

  return payload as T;
}
