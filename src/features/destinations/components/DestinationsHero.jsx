import React, { useRef, useState, useEffect } from "react";

const fallbackImg = "/images/destinations-hero-fallback.jpg";

const DestinationsHero = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [mounted, setMounted] = useState(false);

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (isPlaying) {
      vid.pause();
      setIsPlaying(false);
    } else {
      vid
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const onCanPlay = () => setCanPlay(true);
    vid.addEventListener("canplay", onCanPlay);
    return () => vid.removeEventListener("canplay", onCanPlay);
  }, []);

  return (
    <section
      className="relative h-[60vh] sm:h-[68vh] min-h-[420px] sm:min-h-[520px] w-full flex items-center justify-center overflow-hidden rounded-b-2xl sm:rounded-b-[3rem]"
      aria-label="Hero destinos"
    >
      {/* Video / Imagen */}
      {!videoError && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${canPlay ? "opacity-100" : "opacity-0"}`}
          src="/videos/destinations-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          poster={fallbackImg}
          onError={() => setVideoError(true)}
          aria-label="Video de destinos destacados"
        />
      )}
      {videoError && (
        <img
          src={fallbackImg}
          alt="Destinos destacados"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
      )}

      {/* Multi overlay dinámico */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/30 to-slate-900/80"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 mix-blend-overlay bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.35),transparent_60%),radial-gradient(circle_at_70%_60%,rgba(99,102,241,0.35),transparent_55%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_40%,rgba(255,255,255,0)_65%,rgba(255,255,255,0.07)_100%)]"
        aria-hidden="true"
      />

      {/* Partículas simples (accesibles, decorativas) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {[...Array(18)].map((_, i) => (
          <span
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/70 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.35}s`,
              opacity: 0.4,
            }}
          />
        ))}
      </div>

      {/* Glow corners */}
      <div
        className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/30 blur-3xl rounded-full"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/30 blur-3xl rounded-full"
        aria-hidden="true"
      />

      {/* Contenido */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center text-white">
        <div
          className={`transition-all duration-700 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <p className="uppercase tracking-[0.35em] text-xs sm:text-sm font-semibold text-blue-200/90 mb-5 drop-shadow">
            Explora
          </p>
          <h1 className="font-volkhov text-4xl sm:text-5xl lg:text-[3.6rem] font-bold leading-tight mb-6 drop-shadow-xl">
            <span className="block">Todos los destinos</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">
              y paquetes exclusivos
            </span>
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto text-slate-100/85 leading-relaxed">
            Inspírate, filtra por intereses y encuentra experiencias diseñadas
            para ti. Comienza a planear tu próxima aventura ahora.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#top-search"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur border border-white/30 text-sm font-medium text-white transition shadow-lg shadow-black/10"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.2-5.2M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
              <span>Buscar paquetes</span>
            </a>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition"
            >
              Volver al inicio
            </a>
          </div>
        </div>
      </div>

      {/* Botones control video */}
      <div className="absolute top-5 right-5 z-20 flex gap-2">
        <button
          onClick={togglePlay}
          className="px-3.5 py-2 rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur border border-white/30 text-white text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          aria-pressed={!isPlaying}
        >
          {isPlaying ? "Pausar" : "Reproducir"}
        </button>
        {videoError && (
          <span className="px-3.5 py-2 rounded-lg bg-red-600/80 text-white text-xs font-medium">
            Video no disponible
          </span>
        )}
      </div>

      {/* Indicador scroll */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-white/70 text-xs tracking-wide">
        <span className="mb-2">Desplázate</span>
        <span className="relative w-5 h-9 rounded-full border border-white/30 flex items-start justify-center p-1 overflow-hidden">
          <span className="w-1 h-1 rounded-full bg-white/80 animate-[scrollDot_1.6s_ease-in-out_infinite]" />
        </span>
      </div>

      <style>{`@keyframes scrollDot{0%{transform:translateY(0);opacity:0}20%{opacity:1}80%{transform:translateY(16px);opacity:0.8}100%{transform:translateY(20px);opacity:0}}`}</style>
    </section>
  );
};

export default DestinationsHero;
