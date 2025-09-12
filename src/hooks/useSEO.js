import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Hook para gestionar etiquetas SEO dinámicas (title, meta, JSON-LD, canonical).
 * Uso:
 * useSEO({
 *   title: 'Paquete X | Viadca',
 *   description: 'Descripción...',
 *   keywords: ['viajes', 'paquete X'],
 *   canonical: `https://www.viadca.app${location.pathname}`,
 *   og: { type: 'article', image: 'https://...' },
 *   twitter: { card: 'summary_large_image' },
 *   jsonLd: [{ ...schemaOrgObject }]
 * })
 */
export function useSEO(config = {}) {
  const location = useLocation();

  useEffect(() => {
    if (typeof document === "undefined") return;

    const {
      title,
      siteName = "Viadca Viajes",
      description,
      keywords,
      canonical,
      robots = "index,follow",
      og = {},
      twitter = {},
      jsonLd = [],
      noindex = false,
    } = config;

    const fullTitle = title ? `${title}` : siteName;
    if (fullTitle) document.title = fullTitle;

    const ensureMeta = (attrName, attrValue, content) => {
      if (!content) return null;
      let selector = `meta[${attrName}='${attrValue}']`;
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
      return el;
    };

    // Description
    ensureMeta("name", "description", description);
    // Keywords (no crítico pero puede ayudar en buscadores secundarios)
    if (keywords) {
      ensureMeta(
        "name",
        "keywords",
        Array.isArray(keywords) ? keywords.join(", ") : keywords,
      );
    }
    // Robots
    ensureMeta("name", "robots", noindex ? "noindex,nofollow" : robots);

    // Canonical
    if (canonical) {
      let link = document.head.querySelector("link[rel='canonical']");
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
    }

    // Open Graph
    const ogDefaults = {
      title: fullTitle,
      description,
      url: canonical || `https://www.viadca.app${location.pathname}`,
      site_name: siteName,
      type: "website",
    };
    Object.entries({ ...ogDefaults, ...og }).forEach(([k, v]) => {
      if (!v) return;
      ensureMeta("property", `og:${k}`, v);
    });

    // Twitter
    const twitterDefaults = {
      card: "summary_large_image",
      title: fullTitle,
      description,
    };
    Object.entries({ ...twitterDefaults, ...twitter }).forEach(([k, v]) => {
      if (!v) return;
      ensureMeta("name", `twitter:${k}`, v);
    });

    // JSON-LD (eliminar previos creados por este hook)
    const previous = document.head.querySelectorAll(
      "script[data-dynamic-jsonld]",
    );
    previous.forEach((p) => p.remove());
    const list = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
    list.filter(Boolean).forEach((obj) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.dynamicJsonld = "true";
      script.textContent = JSON.stringify(obj);
      document.head.appendChild(script);
    });

    // Limpieza opcional cuando cambie ruta: se mantiene porque siguientes ejecuciones los sobreescriben
    return () => {};
  }, [location.pathname, JSON.stringify(config)]);
}
