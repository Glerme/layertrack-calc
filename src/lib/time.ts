/**
 * Parses a flexible time string into decimal hours.
 * Accepted formats: "1h 30m", "1h30m", "90min", "90m", "1.5h", "2h"
 * Bare numbers (e.g. "90", "1.5") are NOT accepted — ambiguous hours vs. minutes.
 * Returns null for invalid or non-positive input.
 */
export function parseTimeInput(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // "1h 30m" or "1h30m" (hours + minutes)
  const hmMatch = trimmed.match(/^(\d+(?:\.\d+)?)h\s*(\d+(?:\.\d+)?)m(?:in)?$/i);
  if (hmMatch) {
    const result = parseFloat(hmMatch[1]) + parseFloat(hmMatch[2]) / 60;
    return result > 0 ? result : null;
  }

  // "90min" or "90m" (minutes only)
  const minMatch = trimmed.match(/^(\d+(?:\.\d+)?)m(?:in)?$/i);
  if (minMatch) {
    const result = parseFloat(minMatch[1]) / 60;
    return result > 0 ? result : null;
  }

  // "1.5h" or "2h" (hours only, must have suffix)
  const hMatch = trimmed.match(/^(\d+(?:\.\d+)?)h$/i);
  if (hMatch) {
    const result = parseFloat(hMatch[1]);
    return result > 0 ? result : null;
  }

  return null;
}
