import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { Ban, Check, Heart, MessageCircle, MessagesSquare, Star } from "lucide-react";
import { toast } from "sonner";
import { AVATARS, getAvatar } from "@/data/avatars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/avatar/$avatarId")({
  loader: ({ params }) => {
    const avatar = getAvatar(params.avatarId);
    if (!avatar) throw notFound();
    return { avatar };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return {
        meta: [{ title: "Avatar indisponível — Aurora AI" }, { name: "robots", content: "noindex" }],
      };
    const { avatar } = loaderData;
    const title = `${avatar.name} — Perfil do avatar | Aurora AI`;
    return {
      meta: [
        { title },
        { name: "description", content: avatar.tagline },
        { property: "og:title", content: title },
        { property: "og:description", content: avatar.tagline },
      ],
    };
  },
  component: AvatarProfile,
});

function AvatarProfile() {
  const { avatar } = Route.useLoaderData();
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 lg:px-8 lg:py-10">
      <div className="glass-panel overflow-hidden rounded-3xl lg:grid lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <div className="relative">
          <img
            src={avatar.image}
            alt={`Retrato de ${avatar.name}`}
            width={768}
            height={1024}
            className="h-64 w-full object-cover object-top lg:h-full"
          />
          <div className="veil absolute inset-x-0 bottom-0 h-24 lg:hidden" />
        </div>

        <div className="p-5 lg:p-7">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold lg:text-3xl">{avatar.name}</h1>
              <p className="truncate text-sm text-muted-foreground">{avatar.tagline}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm text-gold">
              <Star className="h-4 w-4 fill-current" /> {avatar.rating.toFixed(1)}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {avatar.tags.map((t) => (
              <Badge key={t} variant="secondary">
                {t}
              </Badge>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <Metric icon={<MessageCircle className="h-4 w-4" />} value={avatar.chats} label="Chats" />
            <Metric icon={<Heart className="h-4 w-4" />} value={avatar.likes} label="Curtidas" />
            <Metric icon={<Star className="h-4 w-4" />} value={avatar.creator} label="Criador" />
          </div>

          <section className="mt-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              História &amp; Personalidade
            </h2>
            <div className="scroll-slim mt-2 max-h-56 overflow-y-auto rounded-2xl border border-glass-border bg-surface/60 p-4 text-sm leading-relaxed text-foreground/90">
              {avatar.story.split("\n\n").map((p, i) => (
                <p key={i} className={i ? "mt-3" : ""}>
                  {p}
                </p>
              ))}
            </div>
          </section>

          <footer className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Button
              className="flex-1"
              onClick={() => navigate({ to: "/chat/$avatarId", params: { avatarId: avatar.id } })}
            >
              <MessagesSquare className="h-4 w-4" /> Iniciar Conversa
            </Button>
            <Button variant="secondary" className="flex-1" asChild>
              <Link to="/">
                <Check className="h-4 w-4" /> OK
              </Link>
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => toast.success(`${avatar.name} foi bloqueado(a).`)}
            >
              <Ban className="h-4 w-4" /> Bloquear
            </Button>
          </footer>
        </div>
      </div>

      <h2 className="mt-8 mb-3 text-lg font-semibold">Avatares parecidos</h2>
      <div className="grid grid-cols-3 gap-3 lg:grid-cols-4">
        {AVATARS.filter((a) => a.id !== avatar.id).map((a) => (
          <Link
            key={a.id}
            to="/avatar/$avatarId"
            params={{ avatarId: a.id }}
            className="overflow-hidden rounded-2xl border border-border/60"
          >
            <img
              src={a.image}
              alt={a.name}
              width={768}
              height={1024}
              loading="lazy"
              className="aspect-square w-full object-cover"
            />
            <div className="truncate p-2 text-xs">{a.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Metric({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-glass-border bg-surface/60 p-2.5">
      <div className="flex items-center justify-center gap-1 text-primary">{icon}</div>
      <div className="mt-1 truncate text-sm font-semibold">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}
