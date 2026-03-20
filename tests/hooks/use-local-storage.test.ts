import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "@/hooks/use-local-storage";

beforeEach(() => {
  localStorage.clear();
});

describe("useLocalStorage", () => {
  it("returns defaultValue when key is not set", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", 42));
    expect(result.current[0]).toBe(42);
  });

  it("reads existing value from localStorage on init", () => {
    localStorage.setItem("test-key", JSON.stringify(99));
    const { result } = renderHook(() => useLocalStorage("test-key", 42));
    expect(result.current[0]).toBe(99);
  });

  it("writes value to localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", 0));
    act(() => result.current[1](123));
    expect(JSON.parse(localStorage.getItem("test-key")!)).toBe(123);
    expect(result.current[0]).toBe(123);
  });

  it("falls back to defaultValue when localStorage.getItem throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementationOnce(() => {
      throw new Error("storage error");
    });
    const { result } = renderHook(() => useLocalStorage("test-key", "fallback"));
    expect(result.current[0]).toBe("fallback");
  });

  it("does not throw when localStorage.setItem throws", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementationOnce(() => {
      throw new Error("quota exceeded");
    });
    const { result } = renderHook(() => useLocalStorage("test-key", 0));
    expect(() => act(() => result.current[1](1))).not.toThrow();
  });
});
