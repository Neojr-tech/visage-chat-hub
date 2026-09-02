import type { AISettings, ProviderId, ProviderPreset } from "./types";

export const PROVIDERS: ProviderPreset[] = [
  {
    id: "openrouter",
    label: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    requiresKey: true,
    models: [
      "openai/gpt-4o-mini",
      "anthropic/claude-3.5-sonnet",
      "meta-llama/llama-3.1-70b-instruct",
      "google/gemini-flash-1.5",
    ],
  },
  {
    id: "openai",
    label: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    requiresKey: true,
    models: ["gpt-4o-mini", "gpt-4o", "gpt-4.1-mini"],
  },
  {
    id: "groq",
    label: "Groq",
    baseUrl: "https://api.groq.com/openai/v1",
    requiresKey: true,
    models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"],
  },
  {
    id: "ollama",
    label: "Ollama (local)",
    baseUrl: "http://localhost:11434/v1",
    requiresKey: false,
    models: ["llama3.2", "qwen2.5", "mistral"],
  },
  {
    id: "custom",
    label: "Endpoint customizado",
    baseUrl: "",
    requiresKey: false,
    models: [],
  },
];

export function getProvider(id: ProviderId): ProviderPreset {
  return PROVIDERS.find((p) => p.id === id) ?? PROVIDERS[0]!;
}

export const DEFAULT_SETTINGS: AISettings = {
  provider: "openrouter",
  baseUrl: PROVIDERS[0]!.baseUrl,
  apiKey: "",
  model: PROVIDERS[0]!.models[0]!,
  temperature: 0.8,
  systemPrompt:
    "Você é um avatar de IA carismático. Responda sempre em português do Brasil, de forma breve, calorosa e com personalidade.",
};
