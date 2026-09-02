import { useCallback, useEffect, useState } from "react";
import type { ChatMessage } from "@/lib/ai/types";

const key = (avatarId: string) => `aichat.thread.${avatarId}`;

export interface ThreadSummary {
  avatarId: string;
  last: string;
  updatedAt: number;
  count: number;
}

export function loadThread(avatarId: string): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key(avatarId));
    return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
  } catch {
    return [];
  }
}

export function saveThread(avatarId: string, messages: ChatMessage[]) {
  try {
    window.localStorage.setItem(key(avatarId), JSON.stringify(messages.slice(-100)));
  } catch {
    /* ignora limite de storage */
  }
}

export function clearThread(avatarId: string) {
  try {
    window.localStorage.removeItem(key(avatarId));
  } catch {
    /* noop */
  }
}

export function useThreads(avatarIds: string[]) {
  const [threads, setThreads] = useState<ThreadSummary[]>([]);

  const refresh = useCallback(() => {
    const list = avatarIds
      .map((id) => {
        const msgs = loadThread(id);
        const last = msgs[msgs.length - 1];
        if (!last) return null;
        return {
          avatarId: id,
          last: last.content,
          updatedAt: last.createdAt,
          count: msgs.length,
        } satisfies ThreadSummary;
      })
      .filter((t): t is ThreadSummary => t !== null)
      .sort((a, b) => b.updatedAt - a.updatedAt);
    setThreads(list);
  }, [avatarIds]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { threads, refresh };
}
