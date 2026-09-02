import { createFileRoute, Link } from "@tanstack/react-router";
import { MessagesSquare, Trash2 } from "lucide-react";
import { AVATARS, getAvatar } from "@/data/avatars";
import { Button } from "@/components/ui/button";
import { clearThread, useThreads } from "@/lib/chat-store";

const IDS = AVATARS.map((a) => a.id);

export const Route = createFileRoute("/conversas")({
  head: () => ({
    meta: [
      { title: "Minhas Conversas | Aurora AI" },
      { name: "description", content: "Retome suas conversas com os avatares de IA." },
      { property: "og:title", content: "Minhas Conversas | Aurora AI" },
      { property: "og:description", content: "Retome suas conversas com os avatares de IA." },
    ],
  }),
  component: Conversas,
});

function Conversas() {
  const { threads, refresh } = useThreads(IDS);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 lg:px-8 lg:py-10">
      <h1 className="text-2xl font-bold lg:text-3xl">Minhas Conversas</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Histórico salvo neste dispositivo, pronto para continuar.
      </p>

      {threads.length === 0 ? (
        <div className="glass-panel mt-6 rounded-3xl p-8 text-center">
          <MessagesSquare className="mx-auto h-8 w-8 text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">
            Você ainda não iniciou nenhuma conversa.
          </p>
          <Button className="mt-4" asChild>
            <Link to="/">Ver galeria</Link>
          </Button>
        </div>
      ) : (
        <ul className="mt-6 space-y-2">
          {threads.map((t) => {
            const avatar = getAvatar(t.avatarId);
            if (!avatar) return null;
            return (
              <li
                key={t.avatarId}
                className="glass-panel grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl p-3"
              >
                <Link to="/chat/$avatarId" params={{ avatarId: avatar.id }} className="shrink-0">
                  <img
                    src={avatar.image}
                    alt={avatar.name}
                    width={768}
                    height={1024}
                    loading="lazy"
                    className="h-12 w-12 rounded-full object-cover object-top"
                  />
                </Link>
                <Link to="/chat/$avatarId" params={{ avatarId: avatar.id }} className="min-w-0">
                  <div className="truncate font-medium">{avatar.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{t.last}</div>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Apagar conversa com ${avatar.name}`}
                  onClick={() => {
                    clearThread(avatar.id);
                    refresh();
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
