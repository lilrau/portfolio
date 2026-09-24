import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * A browser-only value, false/fallback during SSR and hydration, the real value
 * right after — without a setState-in-effect round trip.
 */
export function useClientValue<T>(read: () => T, serverValue: T): T {
  return useSyncExternalStore(noopSubscribe, read, () => serverValue);
}

export const useIsClient = () => useClientValue(() => true, false);
