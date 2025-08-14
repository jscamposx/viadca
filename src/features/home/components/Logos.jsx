import React from "react";

const Logos = ({ logos }) => {
  const containerRef = React.useRef(null);
  const trackRef = React.useRef(null);
  const firstSeqRef = React.useRef(null);
  const offsetRef = React.useRef(0);
  const lastTimeRef = React.useRef(0);
  const rafIdRef = React.useRef(null);
  const [seqWidth, setSeqWidth] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  // Normalizamos la lista base (mantiene props como h, width, height)
  const base = React.useMemo(() => logos || [], [logos]);
  // Creamos varias secuencias para cubrir el viewport con holgura
  const sequences = React.useMemo(() => [base, base, base], [base]);

  // Observa el ancho de la primera secuencia (cambia cuando cargan imágenes o al redimensionar)
  React.useEffect(() => {
    const el = firstSeqRef.current;
    if (!el) return;

    const measure = () => setSeqWidth(el.scrollWidth || el.offsetWidth || 0);
    measure();

    let ro;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(measure);
      ro.observe(el);
    } else {
      window.addEventListener("resize", measure);
    }

    const t = setTimeout(measure, 300); // por si imágenes terminan de cargar

    return () => {
      clearTimeout(t);
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", measure);
    };
  }, [base]);

  // Animación con rAF: desplazamiento continuo sin saltos usando módulo
  React.useEffect(() => {
    const prefersReduced =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return; // respeta preferencias del usuario

    const speed = 60; // px/segundo (ajusta al gusto)

    const tick = (now) => {
      if (!trackRef.current || !seqWidth) {
        lastTimeRef.current = now;
        rafIdRef.current = requestAnimationFrame(tick);
        return;
      }

      if (!lastTimeRef.current) lastTimeRef.current = now;
      const dt = (now - lastTimeRef.current) / 1000; // segundos
      lastTimeRef.current = now;

      if (!paused) {
        offsetRef.current -= speed * dt;
        // Normaliza el offset a [0, seqWidth) y aplica el negativo para mover a la izquierda
        const visual = ((offsetRef.current % seqWidth) + seqWidth) % seqWidth;
        const x = -visual;
        // Suaviza subpíxeles para evitar jitter
        const snapped = Math.round(x * (window.devicePixelRatio || 1)) / (window.devicePixelRatio || 1);
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
      aria-labelledby="logos-heading"
      className="py-16 px-4 sm:px-6 lg:px-8 relative scroll-mt-32"
      role="region"
    >
      <div className="max-w-7xl mx-auto">
        <h2
          id="logos-heading"
          className="text-center text-xl sm:text-2xl font-semibold text-slate-800 mb-6"
        >
          Socios y marcas colaboradoras
        </h2>
        <div
          className="relative overflow-hidden"
          aria-live="polite"
          ref={containerRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="pointer-events-none absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-white to-transparent z-10"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-white to-transparent z-10"
            aria-hidden="true"
          />

          <div
            ref={trackRef}
            className="flex w-max items-center opacity-90 hover:opacity-100 transition-opacity py-4 will-change-transform select-none"
            style={{ transform: "translate3d(0,0,0)" }}
          >
            {sequences.map((seq, sIdx) => (
              <ul
                key={`seq-${sIdx}`}
                ref={sIdx === 0 ? firstSeqRef : undefined}
                className="flex w-max shrink-0 items-center gap-24"
                role="list"
              >
                {seq.map((logo, idx) => (
                  <li key={`logo-${sIdx}-${idx}`} className="shrink-0">
                    <div
                      className={`flex items-center justify-center ${logo.boxed ? "bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border border-slate-100" : ""}`}
                      role="img"
                      aria-label={logo.alt}
                    >
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        width={logo.width || undefined}
                        height={logo.height || undefined}
                        className={`${logo.h || "h-16"} w-auto grayscale hover:grayscale-0 transition-all duration-500 ease-linear drop-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600`}
                        decoding="async"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Logos;
