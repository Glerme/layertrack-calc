import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  calculatorSchema,
  type CalculatorFormValues,
} from "@/schemas/calculator.schema";
import { parseTimeInput } from "@/lib/time";
import {
  calcFilamentCost,
  calcEnergyCost,
  calcTotalCost,
  calcSuggestedPrice,
} from "@/lib/cost";

const fmt = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function CalculatorForm() {
  const [storedPricePerKg, setStoredPricePerKg] = useLocalStorage<number>(
    "lc_price_per_kg",
    100,
  );
  const [storedMarkup, setStoredMarkup] = useLocalStorage<number>(
    "lc_markup_percent",
    30,
  );
  const [storedWattage, setStoredWattage] = useLocalStorage<number>(
    "lc_printer_wattage",
    250,
  );
  const [storedEnergy, setStoredEnergy] = useLocalStorage<number>(
    "lc_energy_cost_per_kwh",
    0.75,
  );

  const form = useForm<CalculatorFormValues>({
    resolver: zodResolver(calculatorSchema),
    mode: "onChange",
    defaultValues: {
      print_time_input: "",
      price_per_kg: storedPricePerKg,
      filament_grams_used: 0,
      markup_percent: storedMarkup,
      printer_wattage: storedWattage,
      energy_cost_per_kwh: storedEnergy,
    },
  });

  // Sync persisted fields to localStorage
  // watch() is used for side-effect sync; useWatch (below) is used for the live preview
  const watchedPricePerKg = form.watch("price_per_kg");
  const watchedMarkup = form.watch("markup_percent");
  const watchedWattage = form.watch("printer_wattage");
  const watchedEnergy = form.watch("energy_cost_per_kwh");

  useEffect(() => {
    setStoredPricePerKg(watchedPricePerKg);
  }, [watchedPricePerKg]);
  useEffect(() => {
    setStoredMarkup(watchedMarkup);
  }, [watchedMarkup]);
  useEffect(() => {
    setStoredWattage(watchedWattage);
  }, [watchedWattage]);
  useEffect(() => {
    setStoredEnergy(watchedEnergy);
  }, [watchedEnergy]);

  // Live preview — useWatch subscribes to all fields reactively
  const values = useWatch({ control: form.control });

  const printHours = parseTimeInput(values.print_time_input ?? "") ?? 0;
  const filamentCost = calcFilamentCost({
    gramsUsed: values.filament_grams_used ?? 0,
    pricePerKg: values.price_per_kg ?? 0,
  });
  const energyCost = calcEnergyCost({
    printHours,
    printerWattage: values.printer_wattage ?? 0,
    energyCostPerKwh: values.energy_cost_per_kwh ?? 0,
  });
  const totalCost = calcTotalCost({
    filamentCost,
    energyCost,
    suppliesCost: 0,
  });
  const suggestedPrice = calcSuggestedPrice({
    totalCost,
    markupPercent: values.markup_percent ?? 0,
  });

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="print_time_input"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tempo de impressão</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ex: 1h30m, 90min, 2h"
                    inputMode="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="filament_grams_used"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filamento (g)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step={0.1}
                      inputMode="decimal"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price_per_kg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço/kg (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      inputMode="decimal"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="printer_wattage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Potência (W)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step={1}
                      inputMode="decimal"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="energy_cost_per_kwh"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Energia (R$/kWh)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      inputMode="decimal"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="markup_percent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Markup (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={1000}
                    step={1}
                    inputMode="decimal"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div className="sticky bottom-4 z-10 border-4 border-black bg-[#ff90e8] p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)] sm:static">
        <div className="mb-4 border-b-4 border-black pb-2">
          <h2 className="text-xl font-black uppercase tracking-tight text-black">
            Resultado Final
          </h2>
        </div>
        <div className="space-y-4 text-sm font-bold text-black">
          <div className="flex justify-between items-center text-base">
            <span className="uppercase">Filamento</span>
            <span className="text-lg">{fmt.format(filamentCost)}</span>
          </div>
          <div className="flex justify-between items-center text-base">
            <span className="uppercase">Energia</span>
            <span className="text-lg">{fmt.format(energyCost)}</span>
          </div>
          <div className="h-1 w-full bg-black"></div>
          <div className="flex justify-between items-center text-lg">
            <span className="uppercase">Custo total</span>
            <span>{fmt.format(totalCost)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-4 border-black bg-[#ffc900] p-4 text-xl">
            <span className="font-black uppercase text-black">
              Preço sugerido
            </span>
            <span className="font-black text-black">
              {fmt.format(suggestedPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
