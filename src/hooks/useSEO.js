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
      googlebot,
      og = {},
      ogExtra = [],
      twitter = {},
      twitterExtra = [],
      jsonLd = [],
      noindex = false,
      themeColor,
      author = "Viadca Viajes",
      publisher = "Viadca Viajes",
      locale = "es_MX",
      addHreflangEsMx = true,
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
    if (googlebot) ensureMeta("name", "googlebot", googlebot);

    // Autor y publisher
    ensureMeta("name", "author", author);
    ensureMeta("name", "publisher", publisher);

    // Theme color (PWA/SEO indirecto)
    if (themeColor) ensureMeta("name", "theme-color", themeColor);

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

    // Hreflang básico (es-MX)
    if (canonical && addHreflangEsMx) {
      let alt = document.head.querySelector(
        "link[rel='alternate'][hreflang='es-MX']",
      );
      if (!alt) {
        alt = document.createElement("link");
        alt.setAttribute("rel", "alternate");
        alt.setAttribute("hreflang", "es-MX");
        document.head.appendChild(alt);
      }
      alt.setAttribute("href", canonical);
    }

    // Open Graph
    const ogDefaults = {
      title: fullTitle,
      description,
      url: canonical || `https://www.viadca.app${location.pathname}`,
      site_name: siteName,
      type: "website",
      locale,
    };
    Object.entries({ ...ogDefaults, ...og }).forEach(([k, v]) => {
      if (!v) return;
      ensureMeta("property", `og:${k}`, v);
    });

    // Open Graph extra (propiedades completas como product:price:amount)
    if (Array.isArray(ogExtra)) {
      ogExtra
        .filter((m) => m && m.property && m.content)
        .forEach(({ property, content }) => {
          ensureMeta("property", property, content);
        });
    }

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

    if (Array.isArray(twitterExtra)) {
      twitterExtra
        .filter((m) => m && m.name && m.content)
        .forEach(({ name, content }) => {
          ensureMeta("name", name, content);
        });
    }

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
