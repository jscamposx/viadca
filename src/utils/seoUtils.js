
import { sanitizeMoneda, formatPrecio } from "./priceUtils";

const SITE_ORIGIN = "https://www.viadca.app";
const API_BASE = (import.meta?.env?.VITE_API_BASE_URL || SITE_ORIGIN).replace(
  /\/$/,
  "",
);
const FALLBACK_OG_IMAGE = `${SITE_ORIGIN}/HomePage/Hero-Image.avif`;


const resolveImageUrlForSEO = (img) => {
  if (!img) {
    return FALLBACK_OG_IMAGE;
  }

  if (img.cloudinary_url) {
    if (/^https?:\/\//i.test(img.cloudinary_url)) {
      return img.cloudinary_url;
    }
  }

 
  if (img.url) {
    if (/^https?:\/\//i.test(img.url)) {
      return img.url;
    }

    if (img.url.startsWith("data:")) {
      return FALLBACK_OG_IMAGE;
    }

    return `${API_BASE}${img.url.startsWith("/") ? "" : "/"}${img.url}`;
  }

  if (img.contenido) {
    if (/^https?:\/\//i.test(img.contenido)) {
      return img.contenido;
    }


    if (img.contenido.startsWith("data:") || img.contenido.length > 500) {
      return FALLBACK_OG_IMAGE;
    }

    return `${API_BASE}${img.contenido.startsWith("/") ? "" : "/"}${img.contenido}`;
  }

  if (img.ruta) {
    return `${API_BASE}${img.ruta.startsWith("/") ? "" : "/"}${img.ruta}`;
  }

  if (img.nombre) {
    const nm = img.nombre.startsWith("/") ? img.nombre.slice(1) : img.nombre;
    return `${API_BASE}/uploads/images/${nm}`;
  }


  return FALLBACK_OG_IMAGE;
};


export const generatePackageKeywords = (paquete) => {
  if (!paquete) return [];

  const keywords = [

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


    ...(paquete.mayoristas?.map((m) => m.nombre || m.clave).filter(Boolean) ||
      []),

    ...(paquete.precio_total
      ? [
          `desde ${formatPrecio(paquete.precio_total, sanitizeMoneda(paquete.moneda))}`,
          `paquete ${sanitizeMoneda(paquete.moneda)}`,
        ]
      : []),

    ...(paquete.incluye ? extractActivityKeywords(paquete.incluye) : []),
    ...(paquete.descripcion
      ? extractActivityKeywords(paquete.descripcion)
      : []),
  ];


  return [...new Set(keywords)]
    .filter(Boolean)
    .filter((k) => k.length > 2)
    .slice(0, 20);
};


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

  return title.length > 65
    ? `${paquete.titulo} · ${paquete.duracion_dias} días | Viadca Viajes`
    : title;
};


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

  return baseDesc.length > 155 ? baseDesc.substring(0, 152) + "..." : baseDesc;
};


export const generatePackageJsonLd = (paquete, url) => {
  if (!paquete) return [];

  const moneda = sanitizeMoneda(paquete.moneda);
  const destinos =
    paquete.destinos?.map((d) => d.ciudad || d.destino).filter(Boolean) || [];

  const resolvedImages = (paquete.imagenes || [])
    .map((i) => resolveImageUrlForSEO(i))
    .filter(Boolean)
    .slice(0, 6);

  return [

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
      image: resolvedImages.length ? resolvedImages : [FALLBACK_OG_IMAGE],
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

  // Intentar resolver múltiples imágenes como fallback
  let firstImage = FALLBACK_OG_IMAGE;
  if (paquete.imagenes && paquete.imagenes.length > 0) {
    for (const img of paquete.imagenes.slice(0, 3)) {
      // Probar hasta 3 imágenes
      const resolved = resolveImageUrlForSEO(img);
      if (resolved && resolved !== FALLBACK_OG_IMAGE) {
        firstImage = resolved;
        break;
      }
    }
  }

  const alt = paquete.titulo || "Paquete de viaje - Viadca Viajes";
  const updated = new Date().toISOString();

  return {
    type: "product",
    title: `${paquete.titulo}${destinoStr} - ${paquete.duracion_dias} días`,
    description: `Descubre ${paquete.titulo} con Viadca Viajes${precioStr}. ¡Reserva ahora!`,
    image: firstImage,
    "image:alt": alt,
    "image:width": "1200",
    "image:height": "630",
    updated_time: updated,
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

  const firstImage =
    resolveImageUrlForSEO(paquete.imagenes?.[0]) || FALLBACK_OG_IMAGE;
  const alt = paquete.titulo || "Paquete de viaje - Viadca Viajes";

  return {
    card: "summary_large_image",
    title: `${paquete.titulo}${destinoStr}`,
    description: `${paquete.duracion_dias} días de aventura${precioStr}. ¡Reserva con Viadca Viajes!`,
    image: firstImage,
    site: "@viadcaviajes",
    creator: "@viadcaviajes",
    "image:alt": alt,
  };
};

/**
 * Genera OG extra para metas más ricas (múltiples imágenes, producto)
 */
export const generateOGExtras = (paquete, url) => {
  if (!paquete) return [];
  const images = (paquete.imagenes || [])
    .map((i) => resolveImageUrlForSEO(i))
    .filter(Boolean)
    .slice(0, 5);

  const moneda = sanitizeMoneda(paquete.moneda) || "MXN";
  const extras = [];

  // Imágenes adicionales para OG (múltiples og:image)
  if (images.length > 1) {
    images.slice(1).forEach((img) => {
      extras.push({ property: "og:image", content: img });
    });
  }

  // Metas de producto (Open Graph Product)
  if (paquete.precio_total) {
    extras.push({
      property: "product:price:amount",
      content: `${paquete.precio_total}`,
    });
    extras.push({
      property: "product:price:currency",
      content: sanitizeMoneda(paquete.moneda) || "MXN",
    });
  }
  if (typeof paquete.activo !== "undefined") {
    const avail = paquete.activo ? "in stock" : "out of stock";
    extras.push({ property: "product:availability", content: avail });
  }

  images.forEach((img) => {
    extras.push({ property: "og:image", content: img });
  });

  // Metas específicas de producto
  if (paquete.precio_total) {
    extras.push({
      property: "product:price:amount",
      content: String(paquete.precio_total),
    });
    extras.push({ property: "product:price:currency", content: moneda });
    extras.push({
      property: "product:availability",
      content: paquete.activo ? "in stock" : "discontinued",
    });
  }

  if (url) {
    extras.push({
      property: "og:url",
      content: `https://www.viadca.app/paquetes/${url}`,
    });
  }

  return extras;
};

/**
 * Genera Open Graph optimizado para la homepage
 */
export const generateHomepageOG = () => {
  return {
    type: "website",
    title: "Viadca Viajes - Tu próxima aventura comienza aquí",
    description:
      "En Viadca, convertimos sus sueños de viajar en realidad. Con atención personalizada y paquetes exclusivos, te llevamos a los destinos más fascinantes.",
    image: FALLBACK_OG_IMAGE,
    "image:alt": "Viadca Viajes - Agencia de viajes en Durango",
    "image:width": "1200",
    "image:height": "630",
    url: "https://www.viadca.app",
    site_name: "Viadca Viajes",
    locale: "es_MX",
  };
};

/**
 * Genera Twitter Card para la homepage
 */
export const generateHomepageTwitter = () => {
  return {
    card: "summary_large_image",
    title: "Viadca Viajes - Tu próxima aventura comienza aquí",
    description:
      "En Viadca, convertimos sus sueños de viajar en realidad. Con atención personalizada y paquetes exclusivos, te llevamos a los destinos más fascinantes.",
    image: FALLBACK_OG_IMAGE,
    site: "@viadcaviajes",
    creator: "@viadcaviajes",
    "image:alt": "Viadca Viajes - Agencia de viajes en Durango",
  };
};

/**
 * Genera JSON-LD estructurado para la homepage
 */
export const generateHomepageJsonLd = () => {
  return [
    // Organización principal
    {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      name: "Viadca Viajes",
      alternateName: "Viadca",
      url: "https://www.viadca.app",
      logo: "https://www.viadca.app/viadcalogo.avif",
      image: FALLBACK_OG_IMAGE,
      description:
        "Agencia de viajes especializada en paquetes turísticos personalizados desde Durango, México.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Durango",
        addressRegion: "Durango",
        addressCountry: "México",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: "Spanish",
      },
      sameAs: [
        "https://www.facebook.com/viadcaviajes",
        "https://www.instagram.com/viadca.viajes",
      ],
      areaServed: {
        "@type": "Country",
        name: "México",
      },
      serviceType: [
        "Paquetes turísticos",
        "Viajes organizados",
        "Tours personalizados",
      ],
    },
    // WebSite para búsquedas
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Viadca Viajes",
      url: "https://www.viadca.app",
      description:
        "Portal de viajes con paquetes turísticos exclusivos desde Durango, México.",
      publisher: {
        "@type": "TravelAgency",
        name: "Viadca Viajes",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://www.viadca.app/paquetes?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ];
};
