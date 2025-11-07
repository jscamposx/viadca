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
      className="relative h-[55svh] sm:h-[70svh] lg:h-[80svh] min-h-[420px] sm:min-h-[560px] lg:min-h-[680px] w-full flex items-center justify-center overflow-hidden"
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

      {/* Overlay simple y limpio - Sin degradados complejos */}
      <div
        className="absolute inset-0 bg-black/40"
        aria-hidden="true"
      />

      {/* Contenido */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 text-center text-white">
        <div
          className={`transition-all duration-1000 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {/* Título principal */}
          <h1 className="font-volkhov text-[2.25rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold sm:leading-tight mb-5 sm:mb-6 lg:mb-8">
            <span className="block text-white drop-shadow-2xl mb-2 sm:mb-3">
              Descubre tu próximo
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 drop-shadow-2xl">
              destino soñado
            </span>
          </h1>

          {/* Descripción */}
          <p className="text-sm sm:text-base lg:text-xl max-w-lg sm:max-w-xl lg:max-w-3xl mx-auto text-white/95 leading-relaxed font-light">
            Encuentra experiencias únicas, filtra por tus intereses y diseña el viaje perfecto.
          </p>
        </div>
      </div>

      {/* Mensaje de error del video */}
      {videoError && (
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20">
          <span className="px-3 sm:px-4 py-2 rounded-lg bg-red-600/90 backdrop-blur-sm text-white text-xs sm:text-sm font-medium shadow-lg">
            Video no disponible
          </span>
        </div>
      )}
    </section>
  );
};

export default DestinationsHero;
