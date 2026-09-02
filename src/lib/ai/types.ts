export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  pending?: boolean;
  error?: boolean;
}

export type ProviderId = "openrouter" | "openai" | "groq" | "ollama" | "custom";

export interface ProviderPreset {
  id: ProviderId;
  label: string;
  baseUrl: string;
  requiresKey: boolean;
  models: string[];
  docs?: string;
}

export interface AISettings {
  provider: ProviderId;
  baseUrl: string;
  apiKey: string;
  model: string;
  temperature: number;
  systemPrompt: string;
}

/** Contract that every AI brain implementation must satisfy. */
export interface AIEngine {
  send(
    messages: Pick<ChatMessage, "role" | "content">[],
    settings: AISettings,
    signal?: AbortSignal,
  ): Promise<string>;
}
