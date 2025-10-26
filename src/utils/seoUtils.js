
import { sanitizeMoneda, formatPrecio } from "./priceUtils";

const SITE_ORIGIN = "https://www.viadca.app";
const API_BASE = (import.meta?.env?.VITE_API_BASE_URL || SITE_ORIGIN).replace(
  /\/$/,
  "",
);
const FALLBACK_OG_IMAGE = `${SITE_ORIGIN}/seo%20image.png`;
const FALLBACK_HERO_IMAGE = `${SITE_ORIGIN}/HomePage/Hero-Image.avif`;


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
    // Título del paquete
    paquete.titulo,
    
    // Keywords generales de viaje
    "viajes",
    "viaje a medida",
    "tour organizado",
    "vacaciones",
    "turismo",

    // KEYWORDS LOCALES - SEO LOCAL ULTRA OPTIMIZADO
    "agencia de viajes en Durango",
    "agencia de viajes Durango",
    "viajes Durango",
    "Viadca Durango",
    "agencia viajes Durango Dgo",
    "tours desde Durango",
    "viajes vacacionales Durango",
    "viajes económicos Durango",
    "mejores agencias de viajes Durango",
    "agencia de viajes en Durango centro",
    "paquetes turísticos Durango",
    "viajes baratos Durango",
    "tours organizados Durango",
    "agencia viajes confiable Durango",
    
    // Long-tail transaccionales (alta intención de compra)
    "cotizar viaje Durango",
    "reservar viaje Durango",
    "comprar paquete viaje Durango",
    "precio viajes Durango",

    // Duración
    `${paquete.duracion_dias} días`,
    `viaje ${paquete.duracion_dias} días`,
    `tour ${paquete.duracion_dias} días`,

    // Destinos con combinaciones locales
    ...(paquete.destinos?.map((d) => {
      const ciudad = d.ciudad || d.destino;
      return [
        ciudad,
        `viaje a ${ciudad}`,
        `viaje a ${ciudad} desde Durango`,
        `tour ${ciudad} desde Durango`
      ];
    }).flat().filter(Boolean) || []),
    ...(paquete.destinos?.map((d) => d.estado).filter(Boolean) || []),
    ...(paquete.destinos?.map((d) => d.pais).filter(Boolean) || []),

    // Hotel con especificaciones
    ...(paquete.hotel
      ? [
          `hotel ${paquete.hotel.estrellas} estrellas`,
          `alojamiento ${paquete.hotel.estrellas}★`,
          `hotel ${paquete.hotel.estrellas}★ todo incluido`,
          paquete.hotel.nombre,
        ].filter(Boolean)
      : []),

    // Mayoristas
    ...(paquete.mayoristas?.map((m) => m.nombre || m.clave).filter(Boolean) ||
      []),

    // Precio con variaciones
    ...(paquete.precio_total
      ? [
          `desde ${formatPrecio(paquete.precio_total, sanitizeMoneda(paquete.moneda))}`,
          `viaje ${sanitizeMoneda(paquete.moneda)}`,
          `oferta ${sanitizeMoneda(paquete.moneda)}`,
          `promoción viaje ${sanitizeMoneda(paquete.moneda)}`,
        ]
      : []),

    ...(paquete.incluye ? extractActivityKeywords(paquete.incluye) : []),
    ...(paquete.descripcion
      ? extractActivityKeywords(paquete.descripcion)
      : []),
  ];

  // Retornar keywords únicas, filtradas y optimizadas (máximo 30 para mejor relevancia)
  return [...new Set(keywords)]
    .filter(Boolean)
    .filter((k) => k.length > 2 && k.length < 80) // Evitar keywords demasiado largas
    .slice(0, 30);
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
  if (!paquete) return "🌎 Agencia de Viajes en Durango | Tours Nacionales e Internacionales ✈️ Viadca";

  const destinos =
    paquete.destinos
      ?.map((d) => d.ciudad || d.destino)
      .filter(Boolean)
      .slice(0, 2) || [];
  const destinoStr = destinos.length ? ` a ${destinos.join(" y ")}` : "";

  const precioStr = paquete.precio_total
    ? ` desde $${Math.floor(paquete.precio_total).toLocaleString('es-MX')}`
    : "";

  // Título con nombre del paquete + destinos + días + ubicación
  const title = `${paquete.titulo}${destinoStr} · ${paquete.duracion_dias} días | Viadca Durango`;

  // Si es muy largo, versión corta
  return title.length > 60
    ? `${paquete.titulo} ${paquete.duracion_dias}d | Viadca Durango`
    : title;
};


export const generateSEODescription = (paquete) => {
  if (!paquete)
    return "✅ Agencia de viajes #1 en Durango, Dgo. Tours nacionales e internacionales 🌴 Paquetes todo incluido 💰 Mejores precios 📞 Cotización gratis. ¡Reserva tu aventura!";

  if (paquete.descripcion && paquete.descripcion.length <= 155) {
    return `✨ ${paquete.descripcion}`;
  }

  const destinos =
    paquete.destinos
      ?.map((d) => d.ciudad || d.destino)
      .filter(Boolean)
      .slice(0, 3) || [];
  const destinoStr = destinos.length ? `${destinos.join(", ")}` : "";

  const incluye = paquete.incluye
    ? `. Incluye: ${paquete.incluye.substring(0, 50)}...`
    : "";
  const hotel = paquete.hotel ? ` Hotel ${paquete.hotel.estrellas}★` : "";
  const precio = paquete.precio_total ? ` desde $${Math.floor(paquete.precio_total).toLocaleString('es-MX')}` : "";

  // Descripción optimizada con emojis y call-to-action
  const baseDesc = `✈️ ${destinoStr} · ${paquete.duracion_dias} días${hotel}${precio}${incluye} 📞 Cotiza gratis | Viadca Durango`;

  return baseDesc.length > 158 ? baseDesc.substring(0, 155) + "..." : baseDesc;
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

    // Organización principal con LocalBusiness para SEO local
    {
      "@context": "https://schema.org",
      "@type": ["TravelAgency", "LocalBusiness", "Organization"],
      name: "Viadca - Agencia de Viajes en Durango",
      alternateName: "Viadca Viajes Durango",
      url: "https://www.viadca.app",
      logo: "https://www.viadca.app/seo%20image.png",
      image: "https://www.viadca.app/seo%20image.png",
      description: "Agencia de viajes en Durango especializada en tours, viajes vacacionales nacionales e internacionales con más de 10 años de experiencia",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Durango",
        addressRegion: "Durango",
        postalCode: "34000",
        addressCountry: "MX"
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "24.0277",
        longitude: "-104.6532"
      },
      areaServed: [
        {
          "@type": "City",
          name: "Durango"
        },
        {
          "@type": "State",
          name: "Durango"
        },
        {
          "@type": "Country",
          name: "México"
        }
      ],
      priceRange: "$$",
      telephone: "+52-618-XXX-XXXX",
      openingHours: "Mo-Fr 09:00-19:00, Sa 10:00-14:00",
      sameAs: [
        "https://www.facebook.com/viadcaviajes",
        "https://www.instagram.com/viadca.viajes",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Viajes y Tours",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Viajes nacionales desde Durango"
            }
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Viajes internacionales desde Durango"
            }
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Tours organizados"
            }
          }
        ]
      }
    },

    // WebSite (para búsquedas de sitio)
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Viadca - Agencia de Viajes Durango",
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
          name: "Viajes",
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
      category: "Viajes y Tours",
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

  const alt = paquete.titulo || "Viaje organizado - Viadca Viajes";
  const updated = new Date().toISOString();

  return {
    type: "product",
    title: `${paquete.titulo}${destinoStr} - ${paquete.duracion_dias} días`,
    description: `Descubre ${paquete.titulo} con Viadca Viajes${precioStr}. ¡Reserva tu viaje ahora!`,
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
  const alt = paquete.titulo || "Viaje organizado - Viadca Viajes";

  return {
    card: "summary_large_image",
    title: `${paquete.titulo}${destinoStr}`,
    description: `${paquete.duracion_dias} días de aventura${precioStr}. ¡Reserva tu viaje con Viadca!`,
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
    title: "Agencia de Viajes en Durango - Tours y Viajes | Viadca",
    description:
      "Agencia de viajes en Durango con los mejores tours nacionales e internacionales. Viajes todo incluido, cruceros, circuitos y más. ¡Cotiza sin compromiso!",
    image: FALLBACK_OG_IMAGE,
    "image:alt": "Viadca - Agencia de viajes en Durango, Durango",
    "image:width": "1200",
    "image:height": "630",
    url: "https://www.viadca.app",
    site_name: "Viadca Durango",
    locale: "es_MX",
  };
};

/**
 * Genera Twitter Card para la homepage
 */
export const generateHomepageTwitter = () => {
  return {
    card: "summary_large_image",
    title: "Agencia de Viajes en Durango | Viadca",
    description:
      "Los mejores tours y viajes vacacionales desde Durango. Viajes nacionales e internacionales con atención personalizada. ¡Reserva ahora!",
    image: FALLBACK_OG_IMAGE,
    site: "@viadcaviajes",
    creator: "@viadcaviajes",
    "image:alt": "Viadca - Agencia de viajes en Durango, Dgo",
  };
};

/**
 * Genera JSON-LD estructurado para la homepage
 */
export const generateHomepageJsonLd = () => {
  return [
    // LocalBusiness + TravelAgency optimizado para SEO local
    {
      "@context": "https://schema.org",
      "@type": ["TravelAgency", "LocalBusiness"],
      name: "Viadca - Agencia de Viajes en Durango",
      alternateName: ["Viadca", "Viadca Viajes Durango", "Agencia Viadca"],
      url: "https://www.viadca.app",
      logo: "https://www.viadca.app/seo%20image.png",
      image: [
        FALLBACK_OG_IMAGE,
        "https://www.viadca.app/HomePage/Hero-Image.avif"
      ],
      description:
        "Agencia de viajes en Durango con más de 10 años de experiencia. Tours nacionales e internacionales, viajes todo incluido, cruceros, circuitos y viajes a medida.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Centro",
        addressLocality: "Durango",
        addressRegion: "Durango",
        postalCode: "34000",
        addressCountry: "MX"
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "24.0277",
        longitude: "-104.6532"
      },
      telephone: "+52-618-XXX-XXXX",
      priceRange: "$$",
      openingHours: "Mo-Fr 09:00-19:00, Sa 10:00-14:00",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: "+52-618-XXX-XXXX",
        availableLanguage: ["Spanish"],
        areaServed: "MX"
      },
      sameAs: [
        "https://www.facebook.com/viadcaviajes",
        "https://www.instagram.com/viadca.viajes",
      ],
      areaServed: [
        {
          "@type": "City",
          name: "Durango",
          "@id": "https://www.wikidata.org/wiki/Q46422"
        },
        {
          "@type": "State",
          name: "Durango"
        },
        {
          "@type": "Country",
          name: "México"
        }
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Catálogo de Viajes",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "TouristTrip",
              name: "Viajes nacionales desde Durango",
              description: "Tours y viajes a destinos nacionales de México"
            }
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "TouristTrip",
              name: "Viajes internacionales desde Durango",
              description: "Viajes a Europa, Asia, América y más"
            }
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Cruceros",
              description: "Cruceros por el Caribe, Mediterráneo y más"
            }
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Tours organizados",
              description: "Circuitos guiados nacionales e internacionales"
            }
          }
        ]
      },
      serviceType: [
        "Viajes organizados",
        "Tours personalizados",
        "Viajes a medida",
        "Viajes vacacionales",
        "Cruceros",
        "Circuitos turísticos"
      ],
      knowsAbout: [
        "Viajes a Europa",
        "Tours por México",
        "Viajes a playa",
        "Circuitos culturales",
        "Viajes todo incluido"
      ]
    },
    // WebSite para búsquedas
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Viadca Viajes",
      url: "https://www.viadca.app",
      description:
        "Portal de viajes con tours y viajes organizados exclusivos desde Durango, México.",
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
