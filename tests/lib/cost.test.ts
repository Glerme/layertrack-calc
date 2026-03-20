import { describe, it, expect } from "vitest";
import {
  calcFilamentCost,
  calcEnergyCost,
  calcTotalCost,
  calcSuggestedPrice,
} from "@/lib/cost";

describe("calcFilamentCost", () => {
  it("calculates filament cost from grams and price/kg", () => {
    expect(calcFilamentCost({ gramsUsed: 100, pricePerKg: 100 })).toBe(10);
  });
  it("returns 0 for 0 grams", () => {
    expect(calcFilamentCost({ gramsUsed: 0, pricePerKg: 100 })).toBe(0);
  });
});

describe("calcEnergyCost", () => {
  it("calculates energy cost", () => {
    // 2h × 0.25kW × R$0.75 = R$0.375
    expect(
      calcEnergyCost({ printHours: 2, printerWattage: 250, energyCostPerKwh: 0.75 })
    ).toBeCloseTo(0.375);
  });
});

describe("calcTotalCost", () => {
  it("sums all cost components", () => {
    expect(
      calcTotalCost({ filamentCost: 10, energyCost: 0.375, suppliesCost: 0 })
    ).toBeCloseTo(10.375);
  });
});

describe("calcSuggestedPrice", () => {
  it("applies markup percent as raw integer (30 = 30%)", () => {
    expect(calcSuggestedPrice({ totalCost: 10, markupPercent: 30 })).toBeCloseTo(13);
  });
  it("returns total cost unchanged at 0% markup", () => {
    expect(calcSuggestedPrice({ totalCost: 10, markupPercent: 0 })).toBe(10);
  });
});
