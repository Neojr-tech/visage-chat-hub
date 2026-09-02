import { createFileRoute } from "@tanstack/react-router";
import { Crown, MessagesSquare, Sparkles, UserRound } from "lucide-react";
import { AVATARS } from "@/data/avatars";
import { useThreads } from "@/lib/chat-store";

const IDS = AVATARS.map((a) => a.id);

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Meu Perfil | Aurora AI" },
      { name: "description", content: "Sua conta, créditos e atividade no Aurora AI." },
      { property: "og:title", content: "Meu Perfil | Aurora AI" },
      { property: "og:description", content: "Sua conta, créditos e atividade no Aurora AI." },
    ],
  }),
  component: Perfil,
});

function Perfil() {
  const { threads } = useThreads(IDS);
  const total = threads.reduce((acc, t) => acc + t.count, 0);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 lg:px-8 lg:py-10">
      <div className="glass-panel grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 rounded-3xl p-5">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground">
          <UserRound className="h-7 w-7" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold">Visitante</h1>
          <p className="truncate text-sm text-muted-foreground">Plano gratuito · 20 créditos</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <Stat icon={<MessagesSquare className="h-4 w-4" />} value={String(threads.length)} label="Conversas" />
        <Stat icon={<Sparkles className="h-4 w-4" />} value={String(total)} label="Mensagens" />
        <Stat icon={<Crown className="h-4 w-4" />} value="Free" label="Plano" />
      </div>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="glass-panel rounded-2xl p-4 text-center">
      <div className="flex justify-center text-primary">{icon}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
