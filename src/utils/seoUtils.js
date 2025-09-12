/**
 * Utilidades para SEO y optimización de motores de búsqueda
 */

import { sanitizeMoneda, formatPrecio } from "./priceUtils";

/**
 * Genera keywords optimizadas para un paquete
 */
export const generatePackageKeywords = (paquete) => {
  if (!paquete) return [];

  const keywords = [
    // Términos principales
    paquete.titulo,
    "paquete de viaje",
    "tour organizado",
    "viajes",
    "vacaciones",
    "turismo",

    // Ubicación
    "agencia viajes Durango",
    "Viadca viajes",
    "tours desde Durango",

    // Duración
    `${paquete.duracion_dias} días`,
    `tour ${paquete.duracion_dias} días`,

    // Destinos
    ...(paquete.destinos?.map((d) => d.ciudad || d.destino).filter(Boolean) ||
      []),
    ...(paquete.destinos?.map((d) => d.estado).filter(Boolean) || []),
    ...(paquete.destinos?.map((d) => d.pais).filter(Boolean) || []),

    // Hotel
    ...(paquete.hotel
      ? [
          `hotel ${paquete.hotel.estrellas} estrellas`,
          `alojamiento ${paquete.hotel.estrellas}★`,
          paquete.hotel.nombre,
        ].filter(Boolean)
      : []),

    // Mayoristas/Operadores
    ...(paquete.mayoristas?.map((m) => m.nombre || m.clave).filter(Boolean) ||
      []),

    // Precio
    ...(paquete.precio_total
      ? [
          `desde ${formatPrecio(paquete.precio_total, sanitizeMoneda(paquete.moneda))}`,
          `paquete ${sanitizeMoneda(paquete.moneda)}`,
        ]
      : []),

    // Tipos de actividades (extraer de descripción/incluye)
    ...(paquete.incluye ? extractActivityKeywords(paquete.incluye) : []),
    ...(paquete.descripcion
      ? extractActivityKeywords(paquete.descripcion)
      : []),
  ];

  // Filtrar duplicados y vacíos, limitar a 15-20 keywords más relevantes
  return [...new Set(keywords)]
    .filter(Boolean)
    .filter((k) => k.length > 2)
    .slice(0, 20);
};

/**
 * Extrae keywords de actividades de un texto
 */
const extractActivityKeywords = (text) => {
  if (!text || typeof text !== "string") return [];

  const activityTerms = [
    "excursión",
    "excursiones",
    "tour",
    "tours",
    "visita",
    "visitas",
    "playa",
    "playas",
    "montaña",
    "montañas",
    "ciudad",
    "ciudades",
    "museo",
    "museos",
    "parque",
    "parques",
    "aventura",
    "aventuras",
    "cultura",
    "cultural",
    "gastronómico",
    "gastronomía",
    "naturaleza",
    "natural",
    "histórico",
    "historia",
    "arqueológico",
    "arqueología",
    "colonial",
    "spa",
    "relax",
    "wellness",
    "descanso",
    "buceo",
    "snorkel",
    "pesca",
    "senderismo",
    "trekking",
    "cenotes",
    "cascadas",
    "volcanes",
    "ruinas",
  ];

  const lowerText = text.toLowerCase();
  return activityTerms.filter((term) => lowerText.includes(term));
};

/**
 * Genera título SEO optimizado para un paquete
 */
export const generateSEOTitle = (paquete) => {
  if (!paquete) return "Paquete de Viaje | Viadca Viajes";

  const destinos =
    paquete.destinos
      ?.map((d) => d.ciudad || d.destino)
      .filter(Boolean)
      .slice(0, 2) || [];
  const destinoStr = destinos.length ? ` a ${destinos.join(", ")}` : "";

  const precioStr = paquete.precio_total
    ? ` desde ${formatPrecio(paquete.precio_total, sanitizeMoneda(paquete.moneda))} ${sanitizeMoneda(paquete.moneda)}`
    : "";

  const title = `${paquete.titulo} · ${paquete.duracion_dias} días${precioStr} | Viadca Viajes`;

  // Limitar a ~60-65 caracteres para Google sin perder contexto de marca
  return title.length > 65
    ? `${paquete.titulo} · ${paquete.duracion_dias} días | Viadca Viajes`
    : title;
};

/**
 * Genera descripción SEO optimizada para un paquete
 */
export const generateSEODescription = (paquete) => {
  if (!paquete)
    return "Descubre increíbles paquetes de viaje con Viadca Viajes, tu agencia de confianza desde Durango.";

  if (paquete.descripcion && paquete.descripcion.length <= 155) {
    return paquete.descripcion;
  }

  const destinos =
    paquete.destinos
      ?.map((d) => d.ciudad || d.destino)
      .filter(Boolean)
      .slice(0, 2) || [];
  const destinoStr = destinos.length ? ` a ${destinos.join(", ")}` : "";

  const incluye = paquete.incluye
    ? `. Incluye: ${paquete.incluye.substring(0, 80)}...`
    : "";
  const hotel = paquete.hotel ? `. Hotel ${paquete.hotel.estrellas}★` : "";

  const baseDesc = `Vive ${paquete.titulo} con ${paquete.duracion_dias} días de aventura${destinoStr}${hotel}${incluye} Reserva con Viadca Viajes.`;

  // Limitar a 155 caracteres para Google
  return baseDesc.length > 155 ? baseDesc.substring(0, 152) + "..." : baseDesc;
};

/**
 * Genera datos estructurados JSON-LD para un paquete
 */
export const generatePackageJsonLd = (paquete, url) => {
  if (!paquete) return [];

  const moneda = sanitizeMoneda(paquete.moneda);
  const destinos =
    paquete.destinos?.map((d) => d.ciudad || d.destino).filter(Boolean) || [];

  return [
    // Organization (para reforzar entidad)
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Viadca Viajes",
      url: "https://www.viadca.app",
      logo: "https://www.viadca.app/viadcalogo.avif",
      sameAs: [
        "https://www.facebook.com/viadcaviajes",
        "https://www.instagram.com/viadca.viajes",
      ],
    },

    // WebSite (para búsquedas de sitio)
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Viadca Viajes",
      url: "https://www.viadca.app",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://www.viadca.app/buscar?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    // Breadcrumb
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: "https://www.viadca.app/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Paquetes",
          item: "https://www.viadca.app/paquetes",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: paquete.titulo,
          item: `https://www.viadca.app/paquetes/${url}`,
        },
      ],
    },

    // Product Schema
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: paquete.titulo,
      description: generateSEODescription(paquete),
  image: (paquete.imagenes || []).map((i) => i.url).filter(Boolean).slice(0, 6),
      sku: paquete.codigo || url,
      brand: { "@type": "Brand", name: "Viadca Viajes" },
      category: "Travel Package",
      aggregateRating: paquete.rating
        ? {
            "@type": "AggregateRating",
            ratingValue: paquete.rating,
            ratingCount: paquete.reviewCount || 1,
          }
        : undefined,
      offers: {
        "@type": "Offer",
        priceCurrency: moneda || "MXN",
        price: parseFloat(paquete.precio_total) || 0,
        url: `https://www.viadca.app/paquetes/${url}`,
        availability: paquete.activo
          ? "https://schema.org/InStock"
          : "https://schema.org/Discontinued",
        seller: {
          "@type": "Organization",
          name: "Viadca Viajes",
          url: "https://www.viadca.app",
        },
        priceValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
          .toISOString()
          .split("T")[0],
      },
      additionalProperty: [
        ...(paquete.hotel
          ? [
              {
                "@type": "PropertyValue",
                name: "Hotel Rating",
                value: `${paquete.hotel.estrellas} stars`,
              },
            ]
          : []),
        {
          "@type": "PropertyValue",
          name: "Duration",
          value: `${paquete.duracion_dias} days`,
        },
      ].filter(Boolean),
    },

    // TourPackage Schema
    {
      "@context": "https://schema.org",
      "@type": "TourPackage",
      name: paquete.titulo,
      description: generateSEODescription(paquete),
      provider: {
        "@type": "TravelAgency",
        name: "Viadca Viajes",
        url: "https://www.viadca.app",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Durango",
          addressRegion: "Durango",
          addressCountry: "México",
        },
        telephone: "+52-618-XXX-XXXX",
      },
      duration: `P${paquete.duracion_dias}D`,
      offers: paquete.precio_total
        ? {
            "@type": "Offer",
            price: parseFloat(paquete.precio_total),
            priceCurrency: moneda || "MXN",
          }
        : undefined,
      touristType: destinos.join(", "),
      itinerary: paquete.destinos
        ?.map((dest) => ({
          "@type": "TouristDestination",
          name: dest.ciudad || dest.destino,
          addressRegion: dest.estado,
          addressCountry: dest.pais || "México",
        }))
        .filter(Boolean),
    },
  ].filter(Boolean);
};

/**
 * Genera Open Graph optimizado para un paquete
 */
export const generatePackageOG = (paquete, url) => {
  if (!paquete) return {};

  const destinos =
    paquete.destinos
      ?.map((d) => d.ciudad || d.destino)
      .filter(Boolean)
      .slice(0, 2) || [];
  const destinoStr = destinos.length ? ` a ${destinos.join(", ")}` : "";
  const precioStr = paquete.precio_total
    ? ` desde ${formatPrecio(paquete.precio_total, sanitizeMoneda(paquete.moneda))} ${sanitizeMoneda(paquete.moneda)}`
    : "";

  return {
    type: "product",
    title: `${paquete.titulo}${destinoStr} - ${paquete.duracion_dias} días`,
    description: `Descubre ${paquete.titulo} con Viadca Viajes${precioStr}. ¡Reserva ahora!`,
    image:
      paquete.imagenes?.[0]?.url || "https://www.viadca.app/viadca-preview.jpg",
    product: {
      price_amount: paquete.precio_total,
      price_currency: sanitizeMoneda(paquete.moneda) || "MXN",
    },
  };
};

/**
 * Genera configuración Twitter Card para un paquete
 */
export const generatePackageTwitter = (paquete) => {
  if (!paquete) return {};

  const destinos =
    paquete.destinos
      ?.map((d) => d.ciudad || d.destino)
      .filter(Boolean)
      .slice(0, 2) || [];
  const destinoStr = destinos.length ? ` a ${destinos.join(", ")}` : "";
  const precioStr = paquete.precio_total
    ? ` desde ${formatPrecio(paquete.precio_total, sanitizeMoneda(paquete.moneda))} ${sanitizeMoneda(paquete.moneda)}`
    : "";

  return {
    card: "summary_large_image",
    title: `${paquete.titulo}${destinoStr}`,
    description: `${paquete.duracion_dias} días de aventura${precioStr}. ¡Reserva con Viadca Viajes!`,
    image:
      paquete.imagenes?.[0]?.url || "https://www.viadca.app/viadca-preview.jpg",
  };
};

/**
 * Genera OG extra para metas más ricas (múltiples imágenes, producto)
 */
export const generateOGExtras = (paquete, url) => {
  if (!paquete) return [];
  const images = (paquete.imagenes || [])
    .map((i) => i.url)
    .filter(Boolean)
    .slice(0, 5);

  const moneda = sanitizeMoneda(paquete.moneda) || "MXN";
  const extras = [];

  images.forEach((img) => {
    extras.push({ property: "og:image", content: img });
  });

  // Metas específicas de producto
  if (paquete.precio_total) {
    extras.push({ property: "product:price:amount", content: String(paquete.precio_total) });
    extras.push({ property: "product:price:currency", content: moneda });
    extras.push({ property: "product:availability", content: paquete.activo ? "in stock" : "discontinued" });
  }

  if (url) {
    extras.push({ property: "og:url", content: `https://www.viadca.app/paquetes/${url}` });
  }

  return extras;
};
