import { createFileRoute } from "@tanstack/react-router";
import { Drama } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAISettings } from "@/lib/ai/useAISettings";
import { useState } from "react";

export const Route = createFileRoute("/persona")({
  head: () => ({
    meta: [
      { title: "Persona | Aurora AI" },
      { name: "description", content: "Defina como os avatares devem enxergar e tratar você." },
      { property: "og:title", content: "Persona | Aurora AI" },
      { property: "og:description", content: "Defina como os avatares devem tratar você." },
    ],
  }),
  component: Persona,
});

function Persona() {
  const { settings, save } = useAISettings();
  const [nome, setNome] = useState("");
  const [sobre, setSobre] = useState("");

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 lg:px-8 lg:py-10">
      <h1 className="text-2xl font-bold lg:text-3xl">Persona</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Estas informações entram na instrução base enviada ao provedor de IA.
      </p>

      <form
        className="glass-panel mt-6 space-y-4 rounded-3xl p-5"
        onSubmit={(e) => {
          e.preventDefault();
          const extra = `O usuário se chama ${nome || "Visitante"}. ${sobre}`.trim();
          save({ ...settings, systemPrompt: `${settings.systemPrompt}\n\n${extra}` });
          toast.success("Persona aplicada às conversas.");
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="pnome">Como quer ser chamado</Label>
          <Input id="pnome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Alex" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="psobre">Sobre você</Label>
          <Textarea
            id="psobre"
            rows={5}
            value={sobre}
            onChange={(e) => setSobre(e.target.value)}
            placeholder="Gosto de conversas diretas, trabalho com design, moro em Salvador..."
          />
        </div>
        <Button type="submit" className="w-full">
          <Drama className="h-4 w-4" /> Salvar persona
        </Button>
      </form>
    </div>
  );
}
