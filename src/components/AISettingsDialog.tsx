import { useEffect, useState } from "react";
import { Cpu, KeyRound, Link2, Save } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROVIDERS, getProvider } from "@/lib/ai/providers";
import { useAISettings } from "@/lib/ai/useAISettings";
import type { AISettings, ProviderId } from "@/lib/ai/types";

export function AISettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { settings, save } = useAISettings();
  const [draft, setDraft] = useState<AISettings>(settings);

  useEffect(() => {
    if (open) setDraft(settings);
  }, [open, settings]);

  const preset = getProvider(draft.provider);

  const onProviderChange = (value: string) => {
    const next = getProvider(value as ProviderId);
    setDraft((d) => ({
      ...d,
      provider: next.id,
      baseUrl: next.baseUrl || d.baseUrl,
      model: next.models[0] ?? d.model,
    }));
  };

  const submit = () => {
    if (!draft.baseUrl.trim()) return toast.error("Informe a URL de conexão do provedor.");
    if (!draft.model.trim()) return toast.error("Informe o modelo que será usado.");
    if (preset.requiresKey && !draft.apiKey.trim())
      return toast.error(`${preset.label} exige uma chave de API.`);
    save(draft);
    toast.success("Configurações de IA salvas");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto scroll-slim sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" /> Configurações de IA
          </DialogTitle>
          <DialogDescription>
            A interface é independente do provedor. Escolha o cérebro que vai responder pelos
            avatares.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Provedor</Label>
            <Select value={draft.provider} onValueChange={onProviderChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROVIDERS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="baseUrl" className="flex items-center gap-2">
              <Link2 className="h-4 w-4" /> URL de conexão
            </Label>
            <Input
              id="baseUrl"
              value={draft.baseUrl}
              placeholder="https://api.exemplo.com/v1"
              onChange={(e) => setDraft({ ...draft, baseUrl: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey" className="flex items-center gap-2">
              <KeyRound className="h-4 w-4" /> Chave de API{" "}
              {!preset.requiresKey && (
                <span className="text-xs text-muted-foreground">(opcional)</span>
              )}
            </Label>
            <Input
              id="apiKey"
              type="password"
              autoComplete="off"
              value={draft.apiKey}
              placeholder="sk-..."
              onChange={(e) => setDraft({ ...draft, apiKey: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              A chave fica salva apenas neste navegador.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Modelo</Label>
            <Input
              id="model"
              list="model-presets"
              value={draft.model}
              onChange={(e) => setDraft({ ...draft, model: e.target.value })}
            />
            <datalist id="model-presets">
              {preset.models.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
          </div>

          <div className="space-y-2">
            <Label>Criatividade — {draft.temperature.toFixed(1)}</Label>
            <Slider
              value={[draft.temperature]}
              min={0}
              max={2}
              step={0.1}
              onValueChange={([v]) => setDraft({ ...draft, temperature: v ?? 0.8 })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sys">Instrução base</Label>
            <Textarea
              id="sys"
              rows={3}
              value={draft.systemPrompt}
              onChange={(e) => setDraft({ ...draft, systemPrompt: e.target.value })}
            />
          </div>

          <Button className="w-full" onClick={submit}>
            <Save className="h-4 w-4" /> Salvar configurações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
