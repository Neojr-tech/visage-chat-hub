import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  label?: string;
}
interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error) {
    console.error("[ErrorBoundary]", this.props.label ?? "", error);
  }

  override render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center p-6">
          <div className="glass-panel max-w-sm rounded-3xl p-6 text-center">
            <AlertTriangle className="mx-auto h-8 w-8 text-destructive" />
            <h2 className="mt-3 text-lg font-semibold">Algo quebrou por aqui</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {this.state.error.message || "Erro inesperado nesta seção."}
            </p>
            <Button className="mt-4" onClick={() => this.setState({ error: null })}>
              Tentar novamente
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
