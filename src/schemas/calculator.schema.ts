import { z } from "zod";
import { parseTimeInput } from "@/lib/time";

export const calculatorSchema = z.object({
  print_time_input: z
    .string()
    .refine((val) => parseTimeInput(val) !== null, {
      message: "Use formato: 1h30m, 90min, 1.5h",
    }),
  price_per_kg: z.number({ invalid_type_error: "Obrigatório" }).positive("Deve ser positivo"),
  filament_grams_used: z.number({ invalid_type_error: "Obrigatório" }).positive("Deve ser positivo"),
  markup_percent: z
    .number({ invalid_type_error: "Obrigatório" })
    .min(0, "Mínimo 0")
    .max(1000, "Máximo 1000"),
  printer_wattage: z.number({ invalid_type_error: "Obrigatório" }).positive("Deve ser positivo"),
  energy_cost_per_kwh: z.number({ invalid_type_error: "Obrigatório" }).positive("Deve ser positivo"),
});

export type CalculatorFormValues = z.infer<typeof calculatorSchema>;
