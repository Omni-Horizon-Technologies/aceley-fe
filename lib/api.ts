const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/v1`
).replace(/\/$/, "");

const AUTH_STORAGE_KEY = "aceley:v1:auth";
const MODERN_AUTH_STORAGE_KEY = "aceley:auth:v1";

function readAccessToken(): string | null {
  try {
    // AuthForm persists the Zustand store as { state: { tokens: ... } }.
    const modernRaw = localStorage.getItem(MODERN_AUTH_STORAGE_KEY);
    if (modernRaw) {
      const modern = JSON.parse(modernRaw) as {
        state?: { tokens?: { access_token?: string } };
      };
      const token = modern.state?.tokens?.access_token;
      if (token) return token;
    }

    // Keep compatibility with the original auth provider format.
    const legacyRaw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (legacyRaw) {
      return (JSON.parse(legacyRaw) as { token?: string }).token ?? null;
    }
  } catch {
    // Ignore malformed or unavailable browser storage.
  }
  return null;
}

/**
 * Wrapper around fetch that adds the Bearer token from localStorage.
 * Automatically clears auth state on 401 responses.
 */
export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = readAccessToken();

  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  // If backend returns 401, clear stored auth and redirect to login
  if (res.status === 401) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(MODERN_AUTH_STORAGE_KEY);
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/sign-in")) {
      window.location.href = "/sign-in";
    }
  }

  return res;
}

/**
 * Exchange a Google access token for a backend JWT.
 * This is called once during login — the returned token is long-lived.
 */
export async function exchangeGoogleToken(
  googleAccessToken: string,
): Promise<{ token: string; user: { sub: string; email: string; name: string; picture: string } }> {
  const res = await fetch(`${API_BASE}/identity/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ google_access_token: googleAccessToken }),
  });
  if (!res.ok) throw new Error("Failed to exchange Google token");
  return res.json();
}
