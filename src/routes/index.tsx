import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Star } from "lucide-react";
import { AVATARS } from "@/data/avatars";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aurora AI — Galeria de Avatares de IA" },
      {
        name: "description",
        content:
          "Converse com avatares de IA com personalidade própria. Escolha seu provedor de IA e comece o chat em segundos.",
      },
      { property: "og:title", content: "Aurora AI — Galeria de Avatares de IA" },
      {
        property: "og:description",
        content: "Chat imersivo com avatares de IA, dark mode e provedor configurável.",
      },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 lg:px-8 lg:py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-bold lg:text-4xl">
          Encontre seu <span className="gradient-text">avatar</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Personagens com história, memória de conversa e o cérebro de IA que você escolher.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {AVATARS.map((a) => (
          <Link
            key={a.id}
            to="/avatar/$avatarId"
            params={{ avatarId: a.id }}
            className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card transition-transform hover:-translate-y-1 hover:glow"
          >
            <img
              src={a.image}
              alt={`Avatar ${a.name}`}
              width={768}
              height={1024}
              loading="lazy"
              className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="veil absolute inset-x-0 bottom-0 p-3">
              <div className="flex items-center gap-1 text-xs text-gold">
                <Star className="h-3.5 w-3.5 fill-current" /> {a.rating.toFixed(1)}
                <span className="ml-auto flex items-center gap-1 text-muted-foreground">
                  <MessageCircle className="h-3.5 w-3.5" /> {a.chats}
                </span>
              </div>
              <h2 className="mt-1 truncate text-base font-semibold">{a.name}</h2>
              <p className="truncate text-xs text-muted-foreground">{a.tagline}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {a.tags.slice(0, 2).map((t) => (
                  <Badge key={t} variant="secondary" className="text-[10px]">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
