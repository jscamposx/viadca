import React, { useRef, useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const FEATURES_DATA = [
  {
    id: "payment",
    title: "Acepta cualquier tipo de pago",
    description:
      "Recibe pagos en persona, en línea o por teléfono, y luego accede a tu dinero al instante. Simplifica el proceso de pago con funciones que te ayudan a agilizar el servicio.",
    image:
      "https://images.ctfassets.net/2d5q1td6cyxq/ah0miZPiEPGcHXq7ee7zO/5842168cbe1a1abadf82a90489ee5a90/PD07327-USES-features-payment.png?fm=webp&q=85&fit=fill&w=958",
    alt: "Terminal de pago Square",
    modalDetails: [
      {
        headline: "Tipos de pago",
        text: "Acepta las principales tarjetas de crédito, pagos sin contacto, etc.",
      },
      {
        headline: "Transferencias rápidas",
        text: "Transfiere fondos a una cuenta bancaria externa gratis.",
      },
    ],
  },
  {
    id: "sell",
    title: "Vende de todo",
    description:
      "En un mismo surtido de artículos, puedes agregar varios artículos del menú, productos, servicios o paquetes personalizados. Cobra las ventas rápidamente con un mosaico de artículos personalizado.",
    image:
      "https://images.ctfassets.net/2d5q1td6cyxq/6VhwqJWH1JEITY3Cf6VJnq/42cdf18518dc4f7d9012fefd7b756c5d/PD07327-USES-features-sell.png?fm=webp&q=85&fit=fill&w=958",
    alt: "Interfaz de venta",
    modalDetails: [
      {
        headline: "Catálogo flexible",
        text: "Crea variantes de artículos y modificadores complejos.",
      },
      {
        headline: "Gestión de inventario",
        text: "Recibe alertas de stock bajo en tiempo real.",
      },
    ],
  },
  {
    id: "organized",
    title: "Trabaja de manera rápida y organizada",
    description:
      "Un PDV intuitivo que no requiere capacitación compleja. Mantén a tu equipo sincronizado y las operaciones fluyendo sin interrupciones.",
    image:
      "https://images.ctfassets.net/2d5q1td6cyxq/1Upj6heZj0hvn7JmoZJnvi/1ac80e575f88e4eae3f22220e53c50fa/PD07327-features-organized.png?fm=webp&q=85&fit=fill&w=958",
    alt: "Organización",
    modalDetails: [
      {
        headline: "Permisos de equipo",
        text: "Controla el acceso con códigos personalizados.",
      },
      {
        headline: "Perfiles de clientes",
        text: "Guarda historiales de compra automáticamente.",
      },
    ],
  },
  {
    id: "grow",
    title: "Aprende y crece con cada venta",
    description:
      "Datos y estadísticas en tiempo real sobre tu negocio para tomar decisiones informadas y mejorar tu rentabilidad día a día.",
    image:
      "https://images.ctfassets.net/2d5q1td6cyxq/19oGKq54H07C4WTWLRZWNG/0a5f35e20487a9d85762781c0633cb2d/PD07327-USES-features-grow.png?fm=webp&q=85&fit=fill&w=958",
    alt: "Crecimiento",
    modalDetails: [
      {
        headline: "Reportes de ventas",
        text: "Visualiza ventas brutas y netas en tiempo real.",
      },
      {
        headline: "Integraciones",
        text: "Conecta con QuickBooks, Xero y más.",
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
              Vende sin problemas en una o cien sucursales
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