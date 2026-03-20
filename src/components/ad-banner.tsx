import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function AdBanner() {
  const publisherId = import.meta.env.VITE_ADSENSE_PUBLISHER_ID as string | undefined;
  const slotId = import.meta.env.VITE_ADSENSE_SLOT_ID as string | undefined;

  useEffect(() => {
    if (!publisherId || !slotId) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense initialization failed — ignore silently
    }
  }, [publisherId, slotId]);

  if (!publisherId || !slotId) return null;

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={publisherId}
      data-ad-slot={slotId}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
