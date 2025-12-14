import React, { useRef } from "react";
import { Star, Quote } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const REVIEWS = [
  {
    id: "r1",
    name: "Lucía Martínez",
    role: "Fundadora, Panadería Brisa",
    quote:
      "Migramos a Square en un fin de semana y el lunes ya cobrábamos con inventario sincronizado. El equipo duerme mejor.",
    score: 5,
  },
  {
    id: "r2",
    name: "Diego Ríos",
    role: "COO, Casa Nuba Retail",
    quote:
      "Los reportes en tiempo real cambiaron cómo planificamos compras y promociones. Todo está en un solo panel.",
    score: 5,
  },
  {
    id: "r3",
    name: "Andrea Gómez",
    role: "Directora, Studio 9 Belleza",
    quote:
      "La agenda con recordatorios automáticos redujo los no-show casi a cero. Además el staff no necesitó capacitación.",
    score: 4.9,
  },
  {
    id: "r4",
    name: "Rafael Torres",
    role: "Consultor independiente",
    quote:
      "Facturo y cobro contratos recurrentes sin fricción. Me avisa al instante cuando un pago entra y puedo transferirlo al banco.",
    score: 5,
  },
  {
    id: "r5",
    name: "Mariana Silva",
    role: "Dueña, Florería Lluvia",
    quote:
      "El POS móvil y los pagos sin conexión me salvan en ferias. Los clientes pagan como quieran y yo cierro ventas sin estrés.",
    score: 4.8,
  },
  {
    id: "r6",
    name: "Carlos Paredes",
    role: "Director, Gym Kinesis",
    quote:
      "Automatizamos membresías y cobros recurrentes. La retención subió y el equipo ya no persigue pagos manuales.",
    score: 5,
  },
];

const Reviews = () => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        gsap.from(".review-card", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 78%",
          },
        });
      }, containerRef);

      return () => ctx.revert();
    },
    { scope: containerRef }
  );

  const renderStars = (score) => {
    const rounded = Math.round(score);

    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={`star-${i}`}
        className={`w-4 h-4 ${i < rounded ? "fill-black text-black" : "text-gray-300"}`}
        aria-hidden="true"
      />
    ));
  };

  const initials = (name = "") => {
    const parts = name.trim().split(" ");
    const first = parts[0]?.[0] || "";
    const second = parts[1]?.[0] || "";
    return `${first}${second}`.toUpperCase();
  };

  const scroll = (direction) => {
    const node = trackRef.current;
    if (!node) return;
    const cardWidth = 360;
    const gap = 24;
    const amount = direction === "left" ? -(cardWidth + gap) : cardWidth + gap;
    node.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section
      ref={containerRef}
      className="bg-white w-full px-6 md:px-12 py-24"
      aria-labelledby="reviews-heading"
    >
      <style>{`
        .review-track::-webkit-scrollbar { display: none; }
        .review-track { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
      <div className="max-w-375 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-black">
              Reviews
            </p>
            <h2
              id="reviews-heading"
              className="text-4xl md:text-[56px] leading-[1.05] tracking-tight font-serif font-medium text-gray-900"
            >
              La gente que usa Square lo recomienda.
            </h2>
            <p className="text-base md:text-lg text-gray-800 leading-relaxed max-w-xl">
              Testimonios reales de negocios que venden, agendan y cobran todos los
              días con Square. Sin guiones, sin retoques.
            </p>
          </div>
        </div>

        <div className="lg:col-span-8 relative">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <p className="text-sm text-gray-800">Historias recientes</p>
            <div className="hidden md:flex gap-3">
              <button
                type="button"
                onClick={() => scroll("left")}
                className="w-10 h-10 rounded-full border border-black bg-white text-black hover:bg-black hover:text-white hover:shadow-sm transition"
                aria-label="Ver anteriores"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                className="w-10 h-10 rounded-full border border-black bg-white text-black hover:bg-black hover:text-white hover:shadow-sm transition"
                aria-label="Ver siguientes"
              >
                →
              </button>
            </div>
          </div>

          <div
            ref={trackRef}
            className="review-track flex gap-6 lg:gap-8 overflow-x-auto pb-4 md:pb-6 snap-x snap-mandatory scroll-smooth"
          >
            {REVIEWS.map((review) => (
              <article
                key={review.id}
                className="review-card flex-none w-[88vw] sm:w-90 lg:w-105 snap-start relative rounded-3xl border border-black/10 bg-white shadow-[0_25px_80px_-40px_rgba(0,0,0,0.2)] p-7 md:p-8 flex flex-col gap-6"
              >
                <Quote
                  className="w-6 h-6 fill-black text-black absolute top-6 right-6"
                  aria-hidden="true"
                />

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-black/5 text-black flex items-center justify-center text-sm font-semibold">
                    {initials(review.name)}
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-gray-900 leading-tight">
                      {review.name}
                    </p>
                    <p className="text-sm text-gray-800 leading-snug mt-0.5">
                      {review.role}
                    </p>
                  </div>
                </div>

                <p className="text-[17px] text-gray-900 leading-relaxed flex-1">
                  {review.quote}
                </p>

                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <div
                    className="flex items-center gap-1"
                    aria-label={`Calificación ${review.score} de 5`}
                  >
                    {renderStars(review.score)}
                  </div>
                  <span className="ml-1 text-gray-900">{review.score}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;