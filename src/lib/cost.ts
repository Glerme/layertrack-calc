export function calcFilamentCost({
  gramsUsed,
  pricePerKg,
}: {
  gramsUsed: number;
  pricePerKg: number;
}): number {
  return gramsUsed * (pricePerKg / 1000);
}

export function calcEnergyCost({
  printHours,
  printerWattage,
  energyCostPerKwh,
}: {
  printHours: number;
  printerWattage: number;
  energyCostPerKwh: number;
}): number {
  return printHours * (printerWattage / 1000) * energyCostPerKwh;
}

export function calcSuppliesCost(
  items: { unitCost: number; quantityUsed: number }[]
): number {
  return items.reduce((sum, item) => sum + item.unitCost * item.quantityUsed, 0);
}

export function calcTotalCost({
  filamentCost,
  energyCost,
  suppliesCost,
}: {
  filamentCost: number;
  energyCost: number;
  suppliesCost: number;
}): number {
  return filamentCost + energyCost + suppliesCost;
}

export function calcSuggestedPrice({
  totalCost,
  markupPercent,
}: {
  totalCost: number;
  markupPercent: number;
}): number {
  return totalCost * (1 + markupPercent / 100);
}

export function calcMargin({
  salePrice,
  totalCost,
}: {
  salePrice: number | null;
  totalCost: number;
}): number | null {
  if (salePrice === null) return null;
  return salePrice - totalCost;
}
