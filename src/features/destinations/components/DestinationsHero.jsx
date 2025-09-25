import React, { useRef, useState, useEffect } from "react";

const fallbackImg = "/images/destinations-hero-fallback.jpg";

const DestinationsHero = () => {
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [mounted, setMounted] = useState(false);

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
      className="relative h-[60svh] sm:h-[68svh] min-h-[380px] sm:min-h-[520px] w-full flex items-center justify-center overflow-hidden rounded-b-2xl sm:rounded-b-[3rem]"
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

      {/* Multi overlay dinámico mejorado */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/40 to-slate-900/85"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 mix-blend-soft-light bg-[radial-gradient(circle_at_25%_35%,rgba(59,130,246,0.4),transparent_65%),radial-gradient(circle_at_75%_65%,rgba(168,85,247,0.35),transparent_60%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_35%,rgba(255,255,255,0)_70%,rgba(255,255,255,0.06)_100%)]"
        aria-hidden="true"
      />

      {/* Partículas flotantes mejoradas */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-300/60 to-purple-300/60 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              opacity: 0.3 + Math.random() * 0.4,
            }}
          />
        ))}
      </div>

      {/* Glow corners mejorados */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/25 blur-[100px] rounded-full animate-pulse"
        style={{ animationDuration: '4s' }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500/25 blur-[100px] rounded-full animate-pulse"
        style={{ animationDuration: '6s', animationDelay: '2s' }}
        aria-hidden="true"
      />

      {/* Contenido */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center text-white">
        <div
          className={`transition-all duration-1000 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p className="uppercase tracking-[0.4em] text-xs sm:text-sm font-bold text-blue-200/95 mb-6 drop-shadow-lg animate-pulse" style={{ animationDuration: '3s' }}>
            Explora el mundo
          </p>
          <h1 className="font-volkhov text-4xl sm:text-5xl lg:text-[4rem] xl:text-[4.5rem] font-bold leading-[0.95] mb-8 drop-shadow-2xl">
            <span className="block mb-2 bg-gradient-to-r from-white via-blue-50 to-white bg-clip-text text-transparent">
              Todos los destinos
            </span>
            <span className="block bg-gradient-to-r from-blue-300 via-cyan-200 to-purple-300 bg-clip-text text-transparent animate-pulse" style={{ animationDuration: '4s' }}>
              y paquetes exclusivos
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto text-slate-100/90 leading-relaxed font-light">
            Inspírate con destinos únicos, filtra por tus intereses y encuentra experiencias 
            diseñadas especialmente para ti. Tu próxima aventura comienza aquí.
          </p>
        </div>
      </div>

      {/* Mensaje de error del video (sin controles) */}
      {videoError && (
        <div className="absolute top-5 right-5 z-20">
          <span className="px-3.5 py-2 rounded-lg bg-red-600/80 text-white text-xs font-medium">
            Video no disponible
          </span>
        </div>
      )}

      {/* Indicador de scroll removido por solicitud */}
    </section>
  );
};

export default DestinationsHero;
