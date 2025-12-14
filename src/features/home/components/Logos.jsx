import React from "react";

import { AnimatedSection, useSectionReveal } from "../../../hooks/scrollAnimations";

const defaultLogos = [
  { src: "/HomePage/logo1.avif", alt: "Partner 1", h: "h-24", width: 240, height: 96 },
  { src: "/HomePage/logo2.avif", alt: "Partner 2", h: "h-24", width: 240, height: 96 },
  { src: "/HomePage/logo3.avif", alt: "Partner 3", h: "h-24", width: 240, height: 96 },
  { src: "/HomePage/logo7.avif", alt: "Partner 4", h: "h-14", width: 240, height: 96 },
  { src: "/HomePage/logo6.avif", alt: "Partner 5", h: "h-12", width: 240, height: 96 },
  { src: "/HomePage/logo8.avif", alt: "Partner 6", h: "h-24", width: 240, height: 96 },
  { src: "/HomePage/logo9.avif", alt: "Partner 7", h: "h-24", width: 240, height: 96 },
  { src: "/HomePage/logo10.avif", alt: "Partner 8", h: "h-24", width: 240, height: 96 },
];

const Logos = ({ logos: logosProp }) => {
  const containerRef = React.useRef(null);
  const trackRef = React.useRef(null);
  const firstSeqRef = React.useRef(null);
  const offsetRef = React.useRef(0);
  const lastTimeRef = React.useRef(0);
  const rafIdRef = React.useRef(null);
  const [seqWidth, setSeqWidth] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  // Hook para revelar la sección
  const [sectionRef, sectionVisible] = useSectionReveal({ threshold: 0.1 });

  // Normalizamos la lista base
  const base = React.useMemo(
    () => (logosProp && logosProp.length ? logosProp : defaultLogos),
    [logosProp],
  );
  // Creamos secuencias para cubrir el viewport
  const sequences = React.useMemo(() => [base, base, base, base], [base]); // Aumenté a 4 para seguridad en monitores ultrawide

  // Observa el ancho de la primera secuencia
  React.useEffect(() => {
    const el = firstSeqRef.current;
    if (!el) return;

    // Medir incluye el padding derecho que añadiremos a los LI, asegurando un loop perfecto
    const measure = () => setSeqWidth(el.scrollWidth || el.offsetWidth || 0);
    measure();

    let ro;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(measure);
      ro.observe(el);
    } else {
      window.addEventListener("resize", measure);
    }

    // Un pequeño delay para asegurar que fuentes/estilos cargaron
    const t = setTimeout(measure, 300);

    return () => {
      clearTimeout(t);
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", measure);
    };
  }, [base]);

  // Animación
  React.useEffect(() => {
    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const speed = 60; // px/segundo

    const tick = (now) => {
      if (!trackRef.current || !seqWidth) {
        lastTimeRef.current = now;
        rafIdRef.current = requestAnimationFrame(tick);
        return;
      }

      if (!lastTimeRef.current) lastTimeRef.current = now;
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      if (!paused) {
        offsetRef.current -= speed * dt;
        // La lógica modular aquí funciona perfecto si todos los items tienen el mismo espacio (padding)
        const visual = ((offsetRef.current % seqWidth) + seqWidth) % seqWidth;
        const x = -visual;

        // Redondeo para evitar jitter visual en monitores de alta frecuencia
        const snapped =
          Math.round(x * (window.devicePixelRatio || 1)) /
          (window.devicePixelRatio || 1);

        trackRef.current.style.transform = `translate3d(${snapped}px, 0, 0)`;
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
      lastTimeRef.current = 0;
    };
  }, [seqWidth, paused]);

  return (
    <section
      id="socios"
      ref={sectionRef}
      aria-labelledby="logos-heading"
      className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative scroll-mt-32 bg-gradient-to-b from-gray-50 to-white overflow-hidden" // overflow-hidden importante en la sección o contenedor
      role="region"
    >
      <div className="max-w-375  mx-auto">
       

        {/* Contenedor principal del carrusel */}
        <AnimatedSection
          animation="scaleInPremium"
          delay={200}
          forceVisible={sectionVisible}
          className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50 border border-slate-100/50"
          aria-live="polite"
          ref={containerRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          tabIndex={0}
        >
          {/* Sombras de desvanecimiento laterales */}
          <div
            className="pointer-events-none absolute left-0 top-0 h-full w-16 sm:w-24 lg:w-32 bg-gradient-to-r from-white to-transparent z-10"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute right-0 top-0 h-full w-16 sm:w-24 lg:w-32 bg-gradient-to-l from-white to-transparent z-10"
            aria-hidden="true"
          />

          {/* TRACK: Flex continuo */}
          <div
            ref={trackRef}
            className="flex w-max items-center opacity-90 hover:opacity-100 transition-opacity py-6 px-2 sm:px-4 will-change-transform select-none"
            style={{ transform: "translate3d(0,0,0)" }}
          >
            {sequences.map((seq, sIdx) => (
              <ul
                key={`seq-${sIdx}`}
                ref={sIdx === 0 ? firstSeqRef : undefined}
                // CAMBIO 1: Eliminamos 'gap-...' aquí. El flex mantiene los items juntos, el espacio lo dará el LI.
                className="flex w-max shrink-0 items-center"
                role="list"
              >
                {seq.map((logo, idx) => (
                  <li
                    key={`logo-${sIdx}-${idx}`}
                    // CAMBIO 2: Añadimos padding-right (pr) aquí. 
                    // Esto asegura que el espacio es parte del ancho del elemento.
                    // Al terminar la lista 1, el último elemento tiene padding, separándolo del primero de la lista 2.
                    className="shrink-0 pr-16 sm:pr-20 lg:pr-24"
                  >
                    <div
                      className={`${"flex items-center justify-center"} ${logo.boxed
                        ? "bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border border-slate-100"
                        : ""
                        }`}
                      role="img"
                      aria-label={logo.alt}
                    >
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        width={logo.width || undefined}
                        height={logo.height || undefined}
                        className={`${logo.h || "h-16"
                          } w-auto grayscale hover:grayscale-0 transition-all duration-500 ease-linear drop-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600`}
                        decoding="async"
                        loading="lazy"
                        draggable="false" // Buena práctica en carruseles para evitar arrastrar la imagen fantasma
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Logos;