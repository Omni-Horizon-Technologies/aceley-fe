"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiFetch, exchangeGoogleToken } from "@/lib/api";

const AUTH_STORAGE_KEY = "aceley:v1:auth";

type AuthUser = { sub: string; email: string; name: string; picture: string };

type BackendProfile = {
  id: string;
  email: string;
  display_name: string;
  role: string;
  grade: string | null;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  profile: BackendProfile | null;
};

type AuthContextValue = AuthState & {
  hydrated: boolean;
  isAuthenticated: boolean;
  isPremium: boolean;
  loginWithAccessToken: (accessToken: string) => Promise<boolean>;
  createBackendProfile: (data: { display_name: string; role: string; grade?: string }) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  logout: () => void;
};

const defaultAuth: AuthState = { token: null, user: null, profile: null };

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(defaultAuth);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AuthState;
        if (parsed.token) {
          setState(parsed);
        }
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (state.token) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [hydrated, state]);

  const fetchBackendProfile = useCallback(async (): Promise<BackendProfile | null> => {
    try {
      const res = await apiFetch("/identity/profile");
      if (res.ok) return await res.json();
    } catch {
      // ignore
    }
    return null;
  }, []);

  const loginWithAccessToken = useCallback(
    async (googleAccessToken: string): Promise<boolean> => {
      try {
        // Exchange Google token for a long-lived backend JWT
        const { token, user } = await exchangeGoogleToken(googleAccessToken);

        const authState: AuthState = {
          token,
          user,
          profile: null,
        };

        // Write to localStorage immediately so apiFetch can read it
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
        setState(authState);

        // Fetch backend profile if it exists
        const profile = await fetchBackendProfile();
        if (profile) {
          const withProfile = { ...authState, profile };
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(withProfile));
          setState(withProfile);
        }

        return true;
      } catch {
        return false;
      }
    },
    [fetchBackendProfile],
  );

  const createBackendProfile = useCallback(
    async (data: { display_name: string; role: string; grade?: string }): Promise<boolean> => {
      try {
        const res = await apiFetch("/identity/onboarding", {
          method: "POST",
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const profile: BackendProfile = await res.json();
          setState((prev) => {
            const next = { ...prev, profile };
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
            return next;
          });
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [],
  );

  const refreshProfile = useCallback(async () => {
    const profile = await fetchBackendProfile();
    if (profile) {
      setState((prev) => {
        const next = { ...prev, profile };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    }
  }, [fetchBackendProfile]);

  const logout = useCallback(() => {
    setState(defaultAuth);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      hydrated,
      isAuthenticated: !!state.token,
      isPremium: state.profile?.is_premium ?? false,
      loginWithAccessToken,
      createBackendProfile,
      refreshProfile,
      logout,
    }),
    [state, hydrated, loginWithAccessToken, createBackendProfile, refreshProfile, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
