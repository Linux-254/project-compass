import { useEffect } from "react";
import { metaForPath } from "@/config/seo";
import type { PageMeta } from "@/config/seo";

export type { PageMeta };

const SITE_NAME = "ReForge";
export const DEFAULT_DESCRIPTION =
  "ReForge is a gentle whole-life recovery companion. Rebuild, renew, and become stronger through intentional progress across 21 life dimensions.";

function upsertMeta(attr: "name" | "property", key: string, value: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function applyMeta(meta: PageMeta) {
  if (typeof document === "undefined") return;
  const title = meta.title ? `${meta.title} — ${SITE_NAME}` : SITE_NAME;
  const description = meta.description || DEFAULT_DESCRIPTION;

  document.title = title;

  upsertMeta("name", "description", description);
  upsertMeta("name", "twitter:title", meta.title || SITE_NAME);
  upsertMeta("name", "twitter:description", description);
  upsertMeta("property", "og:title", meta.title || SITE_NAME);
  upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:site_name", SITE_NAME);

  let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
  if (meta.noIndex) {
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", "noindex, nofollow");
  } else if (robots) {
    robots.remove();
  }
}

/** Applies the metadata configured for a route path (used by RouterMeta). */
export function applySeoMeta(path: string) {
  const meta = metaForPath(path);
  if (meta) applyMeta(meta);
}

/**
 * Sets the document title and canonical meta for the current page.
 * Call once per routed page with a stable `PageMeta`.
 */
export function usePageMeta(meta: PageMeta) {
  useEffect(() => {
    applyMeta(meta);
  }, [meta.title, meta.description, meta.noIndex]);
}
