import { describe, it, expect } from "vitest";
import { parseTimeInput } from "@/lib/time";

describe("parseTimeInput", () => {
  it("parses '1h 30m' to 1.5", () => expect(parseTimeInput("1h 30m")).toBe(1.5));
  it("parses '1h30m' to 1.5", () => expect(parseTimeInput("1h30m")).toBe(1.5));
  it("parses '90min' to 1.5", () => expect(parseTimeInput("90min")).toBe(1.5));
  it("parses '90m' to 1.5", () => expect(parseTimeInput("90m")).toBe(1.5));
  it("parses '1.5h' to 1.5", () => expect(parseTimeInput("1.5h")).toBe(1.5));
  it("parses '2h' to 2", () => expect(parseTimeInput("2h")).toBe(2));
  it("parses '0h 30m' to 0.5", () => expect(parseTimeInput("0h 30m")).toBe(0.5));

  it("returns null for empty string", () => expect(parseTimeInput("")).toBeNull());
  it("returns null for 'abc'", () => expect(parseTimeInput("abc")).toBeNull());
  it("returns null for bare '1.5' (no suffix)", () => expect(parseTimeInput("1.5")).toBeNull());
  it("returns null for bare '90' (no suffix)", () => expect(parseTimeInput("90")).toBeNull());
  it("returns null for '0m'", () => expect(parseTimeInput("0m")).toBeNull());
  it("returns null for '0h 0m'", () => expect(parseTimeInput("0h 0m")).toBeNull());
  it("returns null for '-1h'", () => expect(parseTimeInput("-1h")).toBeNull());
  it("returns null for whitespace only", () => expect(parseTimeInput("   ")).toBeNull());
});
