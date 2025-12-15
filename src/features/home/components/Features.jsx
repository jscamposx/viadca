import React, { useRef, useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const FEATURES_DATA = [
  {
    id: "tailor",
    title: "Viajes a tu medida",
    description:
      "Diseñamos tu viaje con vuelos, hotel y traslados ajustados a fechas, presupuesto y preferencias.",
    image: "/HomePage/feat-medida.avif",
    alt: "Planeación de viaje con mapas y maletas",
    modalDetails: [
      {
        headline: "Itinerarios personalizados",
        text: "Escogemos horarios y conexiones cómodas con proveedores confiables.",
      },
      {
        headline: "Flexibilidad",
        text: "Opciones con cambios permitidos y políticas claras antes de pagar.",
      },
      {
        headline: "Ajustes y upgrades",
        text: "Revisamos opciones de categoría de hotel, traslados privados y asistencia en aeropuerto para mejorar tu experiencia.",
      },
    ],
  },
  {
    id: "docs",
    title: "Asesoría y documentación",
    description:
      "Te indicamos qué visas, seguros y requisitos sanitarios necesitas antes de viajar.",
    image: "/HomePage/feat-documentacion.avif",
    alt: "Documentación de viaje y pasaportes",
    modalDetails: [
      {
        headline: "Revisión de requisitos",
        text: "Validamos pasaporte, visas y vacunas según tu destino.",
      },
      {
        headline: "Seguros de viaje",
        text: "Coberturas médicas, equipaje y cancelación recomendadas para tu ruta.",
      },
      {
        headline: "Checklists y recordatorios",
        text: "Enviamos recordatorios de check-in, visados electrónicos y tiempos de llegada al aeropuerto.",
      },
    ],
  },
  {
    id: "care",
    title: "Soporte dedicado 24/7",
    description:
      "Acompañamiento de nuestro equipo antes, durante y después del viaje para ajustes, reprogramaciones o emergencias.",
    image: "/HomePage/feat-asesoria.avif",
    alt: "Asesoría de viaje personalizada",
    modalDetails: [
      {
        headline: "Gestión de cambios",
        text: "Te ayudamos con vuelos, hoteles y traslados cuando surgen imprevistos.",
      },
      {
        headline: "Comunicación clara",
        text: "Canales directos por WhatsApp y teléfono con tiempos de respuesta rápidos.",
      },
      {
        headline: "Seguimiento en destino",
        text: "Confirmamos servicios clave (traslados, tours) y damos soporte en español durante el viaje.",
      },
    ],
  },
  {
    id: "perks",
    title: "Beneficios y pagos flexibles",
    description:
      "Accede a promos, pagos en meses con costo financiero y tarifas negociadas para maximizar tu presupuesto.",
    image: "/HomePage/feat-pagos.avif",
    alt: "Pagos y beneficios para viajes",
    modalDetails: [
      {
        headline: "Financiamiento",
        text: "Pagos en meses con costo financiero y anticipos para asegurar tu lugar.",
      },
      {
        headline: "Tarifas negociadas",
        text: "Mejores condiciones con hoteles, tours y cruceros aliados.",
      },
      {
        headline: "Extras y amenidades",
        text: "Buscamos upgrades, desayunos incluidos o late check-out según disponibilidad del proveedor.",
      },
    ],
  },
];

const FeatureModal = ({ feature, onClose }) => {
  const containerRef = useRef(null);
  const backdropRef = useRef(null);
  const modalRef = useRef(null);
  const isClosing = useRef(false);

  useGSAP(
    () => {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
      gsap.fromTo(
        modalRef.current,
        { y: "100%" },
        { y: "0%", duration: 0.5, ease: "power3.out" }
      );
    },
    { scope: containerRef }
  );

  const handleClose = () => {
    if (isClosing.current) return;
    isClosing.current = true;
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(modalRef.current, { y: "100%", duration: 0.4, ease: "power3.in" });
    tl.to(backdropRef.current, { opacity: 0, duration: 0.4 }, "<");
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!feature) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-100 flex items-end md:items-center justify-center"
    >
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] cursor-pointer"
      ></div>
      <div
        ref={modalRef}
        className="relative bg-white w-full h-full md:w-[96%] md:max-w-375 md:h-[92vh] md:rounded-xl shadow-2xl flex flex-col overflow-hidden will-change-transform"
      >
        <div className="flex justify-between items-start pt-10 px-8 md:pt-14 md:px-16 pb-8 bg-white shrink-0">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight max-w-4xl">
            {feature.title}
          </h2>
          <button
            onClick={handleClose}
            className="p-3 hover:bg-gray-100 rounded-full transition-colors -mr-2 -mt-2"
          >
            <X className="w-8 h-8 text-gray-900" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-8 md:px-16 pb-16 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-12 mt-8">
            {feature.modalDetails &&
              feature.modalDetails.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-4 pt-8 border-t border-gray-300"
                >
                  <h4 className="text-lg font-bold text-gray-900 leading-snug">
                    {item.headline}
                  </h4>
                  <p className="text-[17px] text-gray-600 leading-relaxed font-light">
                    {item.text}
                  </p>
                </div>
              ))}
          </div>
          <div className="h-20"></div>
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  const containerRef = useRef(null);
  const [selectedFeature, setSelectedFeature] = useState(null);

  useGSAP(
    () => {
      const rows = gsap.utils.toArray(".feature-card");
      rows.forEach((row) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: row,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  return (
    <>
      <section
        ref={containerRef}
        className="bg-white w-full px-6 md:px-12 py-24"
      >
        <div className="max-w-375 mx-auto">
          <div className="mb-16">
            <h2 className="mx-automax-w-375 text-center text-4xl md:text-[64px] leading-[1.05] tracking-[-0.02em]  text-gray-900">
              Viaja con respaldo total en cada etapa
            </h2>
          </div>

          <div className="mt-16 border-t border-gray-200"></div>

          <div className="flex flex-col">
            {FEATURES_DATA.map((feature, index) => (
              <div key={feature.id || index} className="feature-card group">
                <div
                  className={`grid grid-cols-1 md:grid-cols-12 items-start gap-y-8 md:gap-x-20 py-14 ${
                    index !== 0 ? "border-t border-gray-200" : ""
                  }`}
                >
                  <div className="col-span-1 md:col-span-5 w-full">
                    <div
                      className="overflow-hidden rounded-2xl cursor-pointer bg-gray-50 aspect-video w-full max-w-130"
                      onClick={() => setSelectedFeature(feature)}
                    >
                      <img
                        src={feature.image}
                        alt={feature.alt}
                        className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-7 flex flex-col justify-start">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-0 leading-tight">
                      {feature.title}
                    </h3>

                    <p className="mt-4 max-w-130 text-base text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>

                    <div className="mt-6">
                      <button
                        onClick={() => setSelectedFeature(feature)}
                        className="inline-flex items-center text-base font-bold text-black hover:text-black hover:underline decoration-2 underline-offset-4 transition-all"
                      >
                        Más información{" "}
                        <Plus className="w-4 h-4 ml-1 stroke-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedFeature && (
        <FeatureModal
          feature={selectedFeature}
          onClose={() => setSelectedFeature(null)}
        />
      )}
    </>
  );
};

export default Features;