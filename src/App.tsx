import { CalculatorForm } from "@/components/calculator-form";
import { AdBanner } from "@/components/ad-banner";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-lg px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-indigo-600">LayerCalc</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Calcule o custo da sua impressão 3D em segundos
          </p>
        </header>

        <main>
          <CalculatorForm />
        </main>

        <div className="mt-8">
          <AdBanner />
        </div>

        <footer className="mt-8 text-center text-xs text-muted-foreground">
          Feito com{" "}
          <a
            href="https://github.com/gvloon/layertrack"
            className="underline hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            LayerTrack
          </a>
        </footer>
      </div>
    </div>
  );
}
