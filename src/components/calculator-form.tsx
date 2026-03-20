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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { calculatorSchema, type CalculatorFormValues } from "@/schemas/calculator.schema";
import { parseTimeInput } from "@/lib/time";
import {
  calcFilamentCost,
  calcEnergyCost,
  calcTotalCost,
  calcSuggestedPrice,
} from "@/lib/cost";

const fmt = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function CalculatorForm() {
  const [storedPricePerKg, setStoredPricePerKg] = useLocalStorage<number>("lc_price_per_kg", 100);
  const [storedMarkup, setStoredMarkup] = useLocalStorage<number>("lc_markup_percent", 30);
  const [storedWattage, setStoredWattage] = useLocalStorage<number>("lc_printer_wattage", 250);
  const [storedEnergy, setStoredEnergy] = useLocalStorage<number>("lc_energy_cost_per_kwh", 0.75);

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

  useEffect(() => { setStoredPricePerKg(watchedPricePerKg); }, [watchedPricePerKg]);
  useEffect(() => { setStoredMarkup(watchedMarkup); }, [watchedMarkup]);
  useEffect(() => { setStoredWattage(watchedWattage); }, [watchedWattage]);
  useEffect(() => { setStoredEnergy(watchedEnergy); }, [watchedEnergy]);

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
  const totalCost = calcTotalCost({ filamentCost, energyCost, suppliesCost: 0 });
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
                  <Input placeholder="ex: 1h30m, 90min, 2h" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
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
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resultado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Filamento</span>
            <span>{fmt.format(filamentCost)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Energia</span>
            <span>{fmt.format(energyCost)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Custo total</span>
            <span>{fmt.format(totalCost)}</span>
          </div>
          <div className="flex justify-between font-semibold text-base">
            <span>Preço sugerido</span>
            <span className="text-indigo-600">{fmt.format(suggestedPrice)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
