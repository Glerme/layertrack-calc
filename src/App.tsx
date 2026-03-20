import { CalculatorForm } from "@/components/calculator-form";
import { AdBanner } from "@/components/ad-banner";

export default function App() {
  return (
    <div className="min-h-screen bg-[#fffbed] bg-[radial-gradient(#d1d5db_2px,transparent_2px)] [background-size:24px_24px] text-black font-sans font-medium selection:bg-[#ff90e8]">
      <div className="mx-auto max-w-lg px-4 py-8 pb-32">
        <header className="mb-8 text-center">
          <h1 className="flex items-center justify-center gap-3 text-5xl font-black uppercase tracking-tighter text-black drop-shadow-[4px_4px_0_rgba(0,0,0,1)] bg-[#ffc900] inline-flex px-6 py-3 border-4 border-black -rotate-2 mb-4">
            <img src="/logo.svg" alt="Logo" className="w-10 h-10" />
            LayerCalc
          </h1>
          <p className="mt-2 text-black font-bold uppercase tracking-wide text-sm bg-white border-2 border-black inline-block px-3 py-1 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
            Calcule o custo da sua impressão 3D
          </p>
        </header>

        <main>
          <CalculatorForm />
        </main>

        <div className="mt-8">
          <AdBanner />
        </div>

        <footer className="mt-8 text-center text-xs font-bold text-black uppercase">
          Feito com{" "}
          <a
            href="https://github.com/Glerme/layertrack"
            className="underline hover:bg-[#ff90e8] transition-colors border-b-2 border-black"
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
