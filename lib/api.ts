const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:8000/api/v1";

const AUTH_STORAGE_KEY = "aceley:v1:auth";

/**
 * Wrapper around fetch that adds the Bearer token from localStorage.
 * Automatically clears auth state on 401 responses.
 */
export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  let token: string | null = null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      token = (JSON.parse(raw) as { token?: string }).token ?? null;
    }
  } catch {
    // ignore
  }

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
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth")) {
      window.location.href = "/auth/login";
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
