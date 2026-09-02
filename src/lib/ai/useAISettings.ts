import { useCallback, useEffect, useSyncExternalStore } from "react";
import { DEFAULT_SETTINGS } from "./providers";
import type { AISettings } from "./types";

const KEY = "aichat.ai-settings.v1";

let current: AISettings = DEFAULT_SETTINGS;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) current = { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<AISettings>) };
  } catch {
    current = DEFAULT_SETTINGS;
  }
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useAISettings() {
  const settings = useSyncExternalStore(
    subscribe,
    () => current,
    () => DEFAULT_SETTINGS,
  );

  useEffect(() => {
    hydrate();
  }, []);

  const save = useCallback((next: AISettings) => {
    current = next;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage indisponível — mantém em memória */
    }
    emit();
  }, []);

  return { settings, save };
}
