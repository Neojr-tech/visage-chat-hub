import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { WandSparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/criar")({
  head: () => ({
    meta: [
      { title: "Criar Avatar | Aurora AI" },
      { name: "description", content: "Crie um avatar de IA com nome, tags e personalidade própria." },
      { property: "og:title", content: "Criar Avatar | Aurora AI" },
      { property: "og:description", content: "Monte a personalidade do seu avatar de IA." },
    ],
  }),
  component: Criar,
});

function Criar() {
  const [name, setName] = useState("");
  const [tags, setTags] = useState("");
  const [story, setStory] = useState("");

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 lg:px-8 lg:py-10">
      <h1 className="text-2xl font-bold lg:text-3xl">Criar Avatar</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Defina identidade e personalidade — o cérebro de IA é escolhido nas configurações.
      </p>

      <form
        className="glass-panel mt-6 space-y-4 rounded-3xl p-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) {
            toast.error("Dê um nome ao avatar.");
            return;
          }
          toast.success(`${name} foi criado como rascunho.`);
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="nome">Nome</Label>
          <Input id="nome" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Nova Kim" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Sci-fi, Mentor, Romance"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hist">História &amp; Personalidade</Label>
          <Textarea
            id="hist"
            rows={6}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Quem é, de onde veio, como fala..."
          />
        </div>
        <Button type="submit" className="w-full">
          <WandSparkles className="h-4 w-4" /> Criar avatar
        </Button>
      </form>
    </div>
  );
}
