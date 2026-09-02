export const AUTH_STORAGE_KEY = "aceley:auth:v1";

type Primitive = string | number | boolean | null | undefined;

export type Query = Record<string, Primitive | Primitive[]>;

export interface ApiClientOptions {
  baseUrl: string;
  getToken?: () => string | null | undefined;
  onUnauthorized?: () => void;
  defaultHeaders?: Record<string, string>;
}

export interface RequestOptions extends Omit<RequestInit, "body" | "method" | "headers"> {
  query?: Query;
  body?: unknown;
  headers?: Record<string, string>;
  skipAuth?: boolean;
  parseAs?: "json" | "text" | "blob" | "none";
}

export class ApiError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly data: unknown;

  constructor(status: number, statusText: string, data: unknown, message?: string) {
    super(message ?? `API request failed: ${status} ${statusText}`);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

function serializeQuery(query: Query | undefined): string {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      for (const v of value) {
        if (v === undefined || v === null) continue;
        params.append(key, String(v));
      }
    } else {
      params.append(key, String(value));
    }
  }
  const search = params.toString();
  return search ? `?${search}` : "";
}

export class ApiClient {
  private readonly baseUrl: string;
  private readonly getToken?: () => string | null | undefined;
  private readonly onUnauthorized?: () => void;
  private readonly defaultHeaders: Record<string, string>;

  constructor(options: ApiClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.getToken = options.getToken;
    this.onUnauthorized = options.onUnauthorized;
    this.defaultHeaders = options.defaultHeaders ?? {};
  }

  private buildUrl(path: string, query?: Query): string {
    const suffix = path.startsWith("/") ? path : `/${path}`;
    return `${this.baseUrl}${suffix}${serializeQuery(query)}`;
  }

  private buildHeaders(options: RequestOptions, hasJsonBody: boolean): Headers {
    const headers = new Headers({ ...this.defaultHeaders, ...(options.headers ?? {}) });

    if (hasJsonBody && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    if (!headers.has("Accept")) {
      headers.set("Accept", "application/json");
    }

    // Skip ngrok's browser-warning interstitial when the API is served through
    // an ngrok tunnel in dev. Ignored by non-ngrok origins.
    headers.set("ngrok-skip-browser-warning", "true");

    if (!options.skipAuth && this.getToken) {
      const token = this.getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    return headers;
  }

  private async request<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
    const {
      query,
      body,
      skipAuth,
      parseAs = "json",
      headers: _customHeaders,
      ...rest
    } = options;
    void _customHeaders;

    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    const hasJsonBody = body !== undefined && body !== null && !isFormData;

    const headers = this.buildHeaders(options, hasJsonBody);

    const init: RequestInit = {
      ...rest,
      method,
      headers,
    };

    if (body !== undefined && body !== null) {
      init.body = isFormData ? (body as FormData) : JSON.stringify(body);
    }

    const res = await fetch(this.buildUrl(path, query), init);

    if (res.status === 401 && !skipAuth) {
      this.onUnauthorized?.();
    }

    if (!res.ok) {
      let errorBody: unknown = null;
      try {
        const contentType = res.headers.get("content-type") ?? "";
        errorBody = contentType.includes("application/json") ? await res.json() : await res.text();
      } catch {
        // ignore body parse errors on failed responses
      }
      throw new ApiError(res.status, res.statusText, errorBody);
    }

    if (parseAs === "none" || res.status === 204) {
      return undefined as T;
    }

    if (parseAs === "text") {
      return (await res.text()) as unknown as T;
    }

    if (parseAs === "blob") {
      return (await res.blob()) as unknown as T;
    }

    return (await res.json()) as T;
  }

  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("GET", path, options);
  }

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>("POST", path, { ...options, body });
  }

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>("PUT", path, { ...options, body });
  }

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>("PATCH", path, { ...options, body });
  }

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("DELETE", path, options);
  }
}

function readTokenFromStorage(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    // Zustand's `persist` middleware wraps state as { state: {...}, version }.
    // Support both the wrapped and the flat shape so we're resilient to
    // storage-format changes.
    const parsed = JSON.parse(raw) as {
      state?: { tokens?: { access_token?: string } };
      tokens?: { access_token?: string };
    };
    return (
      parsed.state?.tokens?.access_token ??
      parsed.tokens?.access_token ??
      null
    );
  } catch {
    return null;
  }
}

function handleUnauthorized(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  if (!window.location.pathname.startsWith("/auth") && !window.location.pathname.startsWith("/sign-in")) {
    window.location.href = "/auth";
  }
}

export const apiClient = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  getToken: readTokenFromStorage,
  onUnauthorized: handleUnauthorized,
});
