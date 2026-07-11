import { useAuthStore } from "@/services/context/auth";

/**
 * Full auth snapshot + actions. Re-renders on any auth field change.
 * For granular subscriptions, use `useAuthStore(selector)` directly.
 */
export function useAuth() {
  return useAuthStore((state) => state);
}
