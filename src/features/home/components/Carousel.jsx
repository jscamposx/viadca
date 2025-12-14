import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowRightLeft } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { getPaquetesPublic } from "../../../api/packagesService";

const FALLBACK_ROUTES = [
  {
    id: "placeholder-1",
    title: "Escápate al Caribe",
    dates: "Próxima salida",
    price: "--",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=900&auto=format&fit=crop",
    alt: "Playa en el Caribe mexicano",
  },
  {
    id: "placeholder-2",
    title: "Europa 2025",
    dates: "Circuitos 2025",
    price: "--",
    image: "https://images.unsplash.com/photo-1505764706515-aa95265c5abc?q=80&w=900&auto=format&fit=crop",
    alt: "Ciudad europea al atardecer",
  },
  {
    id: "placeholder-3",
    title: "City breaks USA",
    dates: "City breaks",
    price: "--",
    image: "https://images.unsplash.com/photo-1485736231960-0c8ad5b04c8e?q=80&w=900&auto=format&fit=crop",
    alt: "Skyline urbano",
  },
];

const normalizePackages = (raw = []) => {
  const pool = Array.isArray(raw) ? raw : [];
  if (!pool.length) return FALLBACK_ROUTES;

  const pickImage = (p) =>
    p?.primera_imagen ||
    p?.imagen_principal ||
    p?.imagenDestacada ||
    p?.portada ||
    p?.cover ||
    (Array.isArray(p?.imagenes) ? p.imagenes[0] : null) ||
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=900&auto=format&fit=crop";

  return pool
    .filter((p) => p?.activo !== false)
    .map((p, idx) => {
      const destino =
        p?.destino ||
        p?.ciudad ||
        p?.pais ||
        p?.lugar ||
        p?.titulo ||
        p?.title ||
        "Destino";
      const origen = p?.origen || p?.ciudadSalida || "Durango";
      const price =
        p?.precioDesde ??
        p?.precio_total ??
        p?.precio ??
        p?.price ??
        null;
      const currency = p?.moneda || p?.currency || "MXN";
      const fechaSalida = p?.fechaSalida || p?.fechaInicio;
      const fechaFin = p?.fechaFin;
      const dates = fechaSalida
        ? fechaFin
          ? `${fechaSalida} - ${fechaFin}`
          : `${fechaSalida}`
        : "Próximas salidas";
      const title = p?.titulo || p?.title || destino || "Paquete";

      return {
        id: p?.id || p?._id || p?.codigoUrl || p?.slug || `pkg-${idx}`,
        title,
        cityFrom: origen,
        cityTo: destino,
        dates,
        price: price ? `${currency} ${price}` : "Cotiza",
        image: pickImage(p),
        alt: `Viaje a ${destino}`,
      };
    })
    .filter(Boolean);
};

const Carousel = () => {
  const containerRef = useRef(null);
  const carouselRef = useRef(null);
  const [routes, setRoutes] = useState(FALLBACK_ROUTES);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await getPaquetesPublic(1, 12);
        const items = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data)
              ? data
              : [];
        if (!active) return;
        const normalized = normalizePackages(items);
        setRoutes(normalized.length ? normalized : FALLBACK_ROUTES);
      } catch (err) {
        console.error("Error cargando paquetes públicos", err);
        if (active) setRoutes(FALLBACK_ROUTES);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useGSAP(() => {
    gsap.from(".route-card", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      clearProps: "all"
    });
  }, { scope: containerRef });

  const scroll = (direction) => {
    if (carouselRef.current) {
      const cardWidth = 320; 
      const gap = 24; 
      const scrollAmount = cardWidth + gap;

      const leftPos = direction === 'left' 
        ? -scrollAmount 
        : scrollAmount;

      carouselRef.current.scrollBy({
        left: leftPos,
        behavior: 'smooth' 
      });
    }
  };

  return (
    <section
      ref={containerRef}
      className="bg-white min-h-screen w-full flex items-center justify-center px-6 md:px-12 py-16 font-sans"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .font-inter { font-family: 'Inter', sans-serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="w-full max-w-375 mx-auto font-inter">
        
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-12 gap-4 sm:gap-0">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tighter uppercase text-center sm:text-left">
            Viajes
          </h1>

          {/* Botones ocultos en móvil (hidden) y visibles en tablet/desktop (sm:flex) */}
          <div className="hidden sm:flex gap-4">
            <button
              onClick={() => scroll('left')}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 hover:border-gray-400 transition-all focus:outline-none active:scale-95 z-10 shadow-sm"
              aria-label="Scroll left"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 hover:border-gray-400 transition-all focus:outline-none active:scale-95 z-10 shadow-sm"
              aria-label="Scroll right"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div
            ref={carouselRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-8 snap-x snap-mandatory px-2 scroll-smooth"
          >
            {routes.map((route, index) => (
              <div
                key={route.id}
                // width: 85vw en móvil (más inmersivo) y 320px fijo en desktop
                className="route-card flex-none w-[85vw] sm:w-[320px] snap-center group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-3xl aspect-3/4 mb-5 shadow-sm hover:shadow-xl transition-shadow duration-300 bg-gray-200">
                  <img
                    src={route.image}
                    alt={route.alt}
                    loading={index < 2 ? "eager" : "lazy"} 
                    decoding="async"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="text-center space-y-2">
                  <div className="text-xl font-bold text-gray-900 tracking-tight">
                    {route.title || route.cityTo || "Paquete"}
                  </div>

                  <p className="text-sm font-medium text-gray-500">
                    {route.dates}
                  </p>

                  <p className="text-base font-bold text-gray-900">
                    <span className="text-gray-400 font-normal text-xs mr-1 uppercase tracking-wide">Desde</span>
                    {route.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Carousel;