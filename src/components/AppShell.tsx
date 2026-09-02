import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Crown,
  Drama,
  LayoutGrid,
  Menu,
  MessagesSquare,
  Settings2,
  Sparkles,
  UserRound,
  WandSparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AISettingsDialog } from "@/components/AISettingsDialog";
import { useAISettings } from "@/lib/ai/useAISettings";
import { isConfigured } from "@/lib/ai/engine";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Galeria", icon: LayoutGrid },
  { to: "/conversas", label: "Minhas Conversas", icon: MessagesSquare },
  { to: "/criar", label: "Criar Avatar", icon: WandSparkles },
  { to: "/perfil", label: "Meu Perfil", icon: UserRound },
  { to: "/persona", label: "Persona", icon: Drama },
  { to: "/upgrades", label: "Upgrades", icon: Crown },
] as const;

const TABS = [NAV[0], NAV[1], NAV[2], NAV[3]] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-foreground"
        >
          <Icon className="h-[18px] w-[18px] shrink-0 transition-colors group-data-[status=active]:text-primary" />
          <span className="truncate">{label}</span>
        </Link>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground">
        <Sparkles className="h-4 w-4" />
      </div>
      <span className="truncate font-display text-lg font-bold">Aurora AI</span>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [drawer, setDrawer] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { settings } = useAISettings();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const immersive = pathname.startsWith("/chat/");
  const connected = isConfigured(settings) && (settings.apiKey.trim() !== "" || settings.provider === "ollama" || settings.provider === "custom");

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar — desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar p-4 lg:flex">
        <Brand />
        <div className="mt-6 flex-1">
          <NavList />
        </div>
        <SettingsCard connected={connected} onOpen={() => setSettingsOpen(true)} />
      </aside>

      {/* Topbar — mobile */}
      <header
        className={cn(
          "sticky top-0 z-30 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border/60 px-4 py-3 lg:hidden",
          immersive ? "border-transparent bg-transparent absolute inset-x-0" : "glass-panel",
        )}
      >
        <Sheet open={drawer} onOpenChange={setDrawer}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Abrir menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-sidebar p-4">
            <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
            <Brand />
            <div className="mt-6">
              <NavList onNavigate={() => setDrawer(false)} />
            </div>
            <div className="mt-6">
              <SettingsCard
                connected={connected}
                onOpen={() => {
                  setDrawer(false);
                  setSettingsOpen(true);
                }}
              />
            </div>
          </SheetContent>
        </Sheet>
        <div className="min-w-0">{!immersive && <Brand />}</div>
        <Button variant="ghost" size="icon" aria-label="Configurações de IA" onClick={() => setSettingsOpen(true)}>
          <Settings2 className="h-5 w-5" />
        </Button>
      </header>

      <main className={cn("lg:pl-64", immersive ? "" : "pb-20 lg:pb-0")}>{children}</main>

      {/* Tabs — mobile */}
      {!immersive && (
        <nav className="glass-panel fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-glass-border px-2 py-2 lg:hidden">
          {TABS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-medium text-muted-foreground data-[status=active]:text-primary"
            >
              <Icon className="h-5 w-5" />
              <span className="truncate">{label.split(" ").pop()}</span>
            </Link>
          ))}
        </nav>
      )}

      <AISettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}

function SettingsCard({ connected, onOpen }: { connected: boolean; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="glass-panel w-full rounded-2xl p-3 text-left transition-colors hover:border-primary/40"
    >
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Settings2 className="h-4 w-4 text-primary" /> Configurações de IA
      </div>
      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
        <span
          className={cn(
            "h-2 w-2 rounded-full",
            connected ? "bg-accent" : "bg-destructive",
          )}
        />
        {connected ? "Cérebro conectado" : "Nenhum provedor conectado"}
      </div>
    </button>
  );
}
