import { createFileRoute } from "@tanstack/react-router";
import { Check, Crown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PLANS = [
  { name: "Free", price: "R$ 0", perks: ["20 créditos/mês", "3 avatares", "Histórico local"] },
  {
    name: "Premium",
    price: "R$ 29",
    perks: ["Créditos ilimitados", "Mídia exclusiva", "Áudio nas conversas", "Modelos avançados"],
    highlight: true,
  },
  { name: "Studio", price: "R$ 79", perks: ["Tudo do Premium", "Avatares privados", "Suporte prioritário"] },
];

export const Route = createFileRoute("/upgrades")({
  head: () => ({
    meta: [
      { title: "Upgrades | Aurora AI" },
      { name: "description", content: "Planos com créditos ilimitados, mídia exclusiva e áudio." },
      { property: "og:title", content: "Upgrades | Aurora AI" },
      { property: "og:description", content: "Planos com créditos ilimitados e mídia exclusiva." },
    ],
  }),
  component: Upgrades,
});

function Upgrades() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 lg:px-8 lg:py-10">
      <h1 className="text-2xl font-bold lg:text-3xl">Upgrades</h1>
      <p className="mt-1 text-sm text-muted-foreground">Mais créditos, mais liberdade criativa.</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={cn(
              "glass-panel rounded-3xl p-5",
              p.highlight && "border-primary/50 glow",
            )}
          >
            <div className="flex items-center gap-2">
              {p.highlight && <Crown className="h-4 w-4 text-gold" />}
              <h2 className="text-lg font-semibold">{p.name}</h2>
            </div>
            <div className="mt-2 text-3xl font-bold gradient-text">{p.price}</div>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {p.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {perk}
                </li>
              ))}
            </ul>
            <Button
              className="mt-5 w-full"
              variant={p.highlight ? "default" : "secondary"}
              onClick={() => toast(`Checkout do plano ${p.name} em breve.`)}
            >
              Escolher {p.name}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
