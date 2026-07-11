"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { AUTH_STORAGE_KEY } from "@/services/apiClient";
import type {
  AuthTokens,
  AuthUser,
  Profile,
  SignInResponse,
} from "@/services/dtos/auth";
import {
  logout as logoutApi,
  refreshAccessToken,
} from "@/services/modules/auth";

// Timer + in-flight refresh live at module scope so they survive re-renders
// and never end up serialized into the persisted store.
let refreshTimer: ReturnType<typeof setTimeout> | null = null;
let refreshInFlight: Promise<AuthTokens | null> | null = null;

function clearRefreshTimer() {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
}

interface AuthActions {
  applySignIn: (response: SignInResponse) => void;
  updateProfile: (profile: Profile) => void;
  refreshTokens: () => Promise<AuthTokens | null>;
  signOut: (options?: { allDevices?: boolean }) => Promise<void>;
  setHasHydrated: (value: boolean) => void;
}

interface AuthState {
  tokens: AuthTokens | null;
  user: AuthUser | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
}

type AuthStore = AuthState & AuthActions;

const emptyState: AuthState = {
  tokens: null,
  user: null,
  profile: null,
  isAuthenticated: false,
  hasHydrated: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => {
      const scheduleRefresh = (tokens: AuthTokens) => {
        clearRefreshTimer();
        const leadSeconds = 60;
        const delayMs = Math.max((tokens.expires_in - leadSeconds) * 1000, 5000);
        refreshTimer = setTimeout(() => {
          void get().refreshTokens();
        }, delayMs);
      };

      return {
        ...emptyState,

        applySignIn: (response) => {
          const tokens: AuthTokens = {
            access_token: response.access_token,
            refresh_token: response.refresh_token,
            token_type: response.token_type,
            expires_in: response.expires_in,
          };
          set({
            tokens,
            user: response.user,
            profile: response.profile,
            isAuthenticated: true,
          });
          scheduleRefresh(tokens);
        },

        updateProfile: (profile) => {
          set({ profile });
        },

        refreshTokens: async () => {
          if (refreshInFlight) return refreshInFlight;
          const currentRefresh = get().tokens?.refresh_token ?? null;
          if (!currentRefresh) return null;

          const pending = (async () => {
            try {
              const fresh = await refreshAccessToken(currentRefresh);
              set({ tokens: fresh });
              scheduleRefresh(fresh);
              return fresh;
            } catch {
              clearRefreshTimer();
              set({ ...emptyState, hasHydrated: true });
              return null;
            } finally {
              refreshInFlight = null;
            }
          })();

          refreshInFlight = pending;
          return pending;
        },

        signOut: async (options = {}) => {
          clearRefreshTimer();
          const refreshToken = get().tokens?.refresh_token ?? null;
          if (refreshToken) {
            try {
              await logoutApi(refreshToken, { allDevices: options.allDevices });
            } catch {
              // logout is idempotent client-side
            }
          }
          set({ ...emptyState, hasHydrated: true });
        },

        setHasHydrated: (value) => set({ hasHydrated: value }),
      };
    },
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tokens: state.tokens,
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        // Schedule a refresh right after hydration if we already have tokens.
        if (state?.tokens?.refresh_token) {
          const leadSeconds = 60;
          const delayMs = Math.max(
            (state.tokens.expires_in - leadSeconds) * 1000,
            5000,
          );
          clearRefreshTimer();
          refreshTimer = setTimeout(() => {
            void useAuthStore.getState().refreshTokens();
          }, delayMs);
        }
      },
    },
  ),
);
