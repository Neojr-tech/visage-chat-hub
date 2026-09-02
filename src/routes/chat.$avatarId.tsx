import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  Mic,
  Plus,
  SendHorizonal,
  Settings2,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";
import { getAvatar } from "@/data/avatars";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AISettingsDialog } from "@/components/AISettingsDialog";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useAISettings } from "@/lib/ai/useAISettings";
import { AIConfigError, isConfigured, openAICompatibleEngine, toApiMessages } from "@/lib/ai/engine";
import type { ChatMessage } from "@/lib/ai/types";
import { loadThread, saveThread } from "@/lib/chat-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat/$avatarId")({
  loader: ({ params }) => {
    const avatar = getAvatar(params.avatarId);
    if (!avatar) throw notFound();
    return { avatar };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return {
        meta: [{ title: "Conversa indisponível — Aurora AI" }, { name: "robots", content: "noindex" }],
      };
    const title = `Conversa com ${loaderData.avatar.name} | Aurora AI`;
    return {
      meta: [
        { title },
        { name: "description", content: `Chat imersivo com ${loaderData.avatar.name}.` },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.avatar.tagline },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  component: () => (
    <ErrorBoundary label="chat">
      <ChatScreen />
    </ErrorBoundary>
  ),
});

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

function ChatScreen() {
  const { avatar } = Route.useLoaderData();
  const { settings } = useAISettings();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [plusOpen, setPlusOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = loadThread(avatar.id);
    setMessages(
      stored.length
        ? stored
        : [{ id: uid(), role: "assistant", content: avatar.greeting, createdAt: Date.now() }],
    );
  }, [avatar.id, avatar.greeting]);

  useEffect(() => {
    if (messages.length) saveThread(avatar.id, messages);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, avatar.id]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: ChatMessage = { id: uid(), role: "user", content: text, createdAt: Date.now() };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");

    if (!isConfigured(settings)) {
      setMessages((m) => [
        ...m,
        {
          id: uid(),
          role: "assistant",
          content:
            "Nenhum provedor de IA está conectado. Abra as Configurações de IA para escolher o modelo e inserir sua chave.",
          createdAt: Date.now(),
          error: true,
        },
      ]);
      return;
    }

    setSending(true);
    const pendingId = uid();
    setMessages((m) => [
      ...m,
      { id: pendingId, role: "assistant", content: "", createdAt: Date.now(), pending: true },
    ]);

    try {
      const reply = await openAICompatibleEngine.send(
        toApiMessages(settings.systemPrompt, avatar.persona, history),
        settings,
      );
      setMessages((m) =>
        m.map((msg) =>
          msg.id === pendingId ? { ...msg, content: reply, pending: false } : msg,
        ),
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Falha desconhecida ao falar com a IA.";
      if (err instanceof AIConfigError) toast.error(message);
      setMessages((m) =>
        m.map((msg) =>
          msg.id === pendingId ? { ...msg, content: message, pending: false, error: true } : msg,
        ),
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden">
      <img
        src={avatar.image}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full scale-110 object-cover object-top blur-[2px]"
      />
      <div className="veil absolute inset-0" />

      {/* Header */}
      <header className="relative z-10 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 pt-4">
        <Button variant="ghost" size="icon" asChild aria-label="Voltar">
          <Link to="/avatar/$avatarId" params={{ avatarId: avatar.id }}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold">{avatar.name}</h1>
          <p className="truncate text-xs text-muted-foreground">
            {isConfigured(settings) ? `online · ${settings.model}` : "sem provedor conectado"}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Configurações de IA"
          onClick={() => setSettingsOpen(true)}
        >
          <Settings2 className="h-5 w-5" />
        </Button>
      </header>

      {/* Messages */}
      <div className="scroll-slim relative z-10 flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          {messages.map((m) => (
            <Bubble key={m.id} message={m} />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Composer */}
      <div className="relative z-10 px-3 pb-3">
        <div className="glass-panel mx-auto flex max-w-2xl items-end gap-2 rounded-3xl p-2">
          <Popover open={plusOpen} onOpenChange={setPlusOpen}>
            <PopoverTrigger asChild>
              <Button variant="secondary" size="icon" className="shrink-0 rounded-full" aria-label="Mais opções">
                <Plus className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="top" align="start" className="w-56 rounded-2xl p-1.5">
              <button
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm hover:bg-accent/15"
                onClick={() => {
                  setPlusOpen(false);
                  setMediaOpen(true);
                }}
              >
                <Sparkles className="h-4 w-4 text-primary" /> Pedir Mídia
              </button>
              <button
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm hover:bg-accent/15"
                onClick={() => {
                  setPlusOpen(false);
                  toast("🎙️ Gravação de áudio disponível no plano Premium.");
                }}
              >
                <Mic className="h-4 w-4 text-accent" /> Áudio
              </button>
            </PopoverContent>
          </Popover>

          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            rows={1}
            placeholder={`Escreva para ${avatar.name}...`}
            className="max-h-32 min-h-11 resize-none border-0 bg-transparent focus-visible:ring-0"
          />

          <Button
            size="icon"
            className="shrink-0 rounded-full"
            disabled={sending || !input.trim()}
            onClick={() => void send()}
            aria-label="Enviar mensagem"
          >
            <SendHorizonal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <AlertDialog open={mediaOpen} onOpenChange={setMediaOpen}>
        <AlertDialogContent className="glass-panel">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Pedir mídia exclusiva
            </AlertDialogTitle>
            <AlertDialogDescription>
              {avatar.name} vai gerar uma mídia exclusiva para esta conversa. O envio consome 1
              crédito e pode levar alguns segundos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setInput("Me manda uma foto exclusiva sua agora 📸");
                toast.success("Pedido preparado — é só enviar!");
              }}
            >
              Confirmar pedido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AISettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}

function Bubble({ message }: { message: ChatMessage }) {
  const mine = message.role === "user";
  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-3xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[70%]",
          mine
            ? "rounded-br-lg bg-[image:var(--gradient-primary)] text-primary-foreground"
            : "glass-panel rounded-bl-lg text-foreground",
          message.error && "border-destructive/50 bg-destructive/15 text-destructive-foreground",
        )}
      >
        {message.pending ? (
          <span className="flex gap-1 py-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-2 w-2 animate-bounce rounded-full bg-foreground/60"
                style={{ animationDelay: `${i * 120}ms` }}
              />
            ))}
          </span>
        ) : (
          <span className="whitespace-pre-wrap break-words">
            {message.error && <TriangleAlert className="mr-1 inline h-4 w-4 align-[-3px]" />}
            {message.content}
          </span>
        )}
      </div>
    </div>
  );
}
