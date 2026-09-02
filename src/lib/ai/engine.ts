import type { AIEngine, AISettings, ChatMessage } from "./types";

export class AIConfigError extends Error {}

/**
 * OpenAI-compatible brain. Works with OpenRouter, OpenAI, Groq, Ollama and any
 * custom endpoint exposing /chat/completions. The UI never talks to a provider
 * directly — it only depends on the AIEngine contract.
 */
export const openAICompatibleEngine: AIEngine = {
  async send(messages, settings, signal) {
    const baseUrl = settings.baseUrl.trim().replace(/\/$/, "");
    if (!baseUrl) {
      throw new AIConfigError(
        "Nenhum endpoint de IA configurado. Abra Configurações de IA para conectar um provedor.",
      );
    }

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (settings.apiKey.trim()) headers["Authorization"] = `Bearer ${settings.apiKey.trim()}`;

    let res: Response;
    try {
      res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers,
        signal: signal ?? null,
        body: JSON.stringify({
          model: settings.model,
          temperature: settings.temperature,
          messages,
        }),
      });
    } catch {
      throw new Error(
        "Não foi possível alcançar o provedor de IA. Verifique a URL de conexão e sua rede.",
      );
    }

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      if (res.status === 401 || res.status === 403)
        throw new AIConfigError("Chave de API inválida ou sem permissão para este modelo.");
      if (res.status === 429)
        throw new Error("Limite de requisições atingido. Aguarde alguns segundos e tente novamente.");
      throw new Error(`Falha do provedor (${res.status}). ${text.slice(0, 180)}`);
    }

    const data = (await res.json().catch(() => null)) as
      | { choices?: { message?: { content?: string } }[] }
      | null;
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error("O provedor respondeu em um formato inesperado.");
    return content;
  },
};

export function toApiMessages(
  systemPrompt: string,
  persona: string,
  history: ChatMessage[],
): Pick<ChatMessage, "role" | "content">[] {
  return [
    { role: "system" as const, content: `${systemPrompt}\n\n${persona}`.trim() },
    ...history
      .filter((m) => !m.error && !m.pending)
      .map((m) => ({ role: m.role, content: m.content })),
  ];
}

export function isConfigured(settings: AISettings) {
  return Boolean(settings.baseUrl.trim() && settings.model.trim());
}
