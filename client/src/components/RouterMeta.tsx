import { useEffect } from "react";
import { useLocation } from "wouter";
import { applySeoMeta } from "@/lib/seo";

/**
 * Watches the current route and applies per-page SEO metadata (title,
 * description, robots) so every page has a distinct, meaningful head.
 */
export function RouterMeta() {
  const [location] = useLocation();

  useEffect(() => {
    applySeoMeta(location);
  }, [location]);

  return null;
}
