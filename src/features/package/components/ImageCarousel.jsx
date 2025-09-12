import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FiChevronLeft, FiChevronRight, FiCamera, FiEye } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const CustomArrow = ({ direction, onClick, isVisible }) => {
  const isPrev = direction === "prev";

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute top-1/2 z-20 -translate-y-1/2 group ${
        isPrev ? "left-2 sm:left-4 lg:left-6" : "right-2 sm:right-4 lg:right-6"
      }`}
      aria-label={isPrev ? "Imagen anterior" : "Imagen siguiente"}
    >
      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center border border-white/30">
        {isPrev ? (
          <FiChevronLeft
            className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white group-hover:text-white"
            aria-hidden="true"
          />
        ) : (
          <FiChevronRight
            className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white group-hover:text-white"
            aria-hidden="true"
          />
        )}
      </div>
    </button>
  );
};

const ImageOverlay = () => {
  return null;
};

const CustomIndicator = ({ isSelected, index, onClick }) => (
  <button
    onClick={onClick}
    className={`mx-1 transition-all duration-300 rounded-full border-2 ${
      isSelected
        ? "w-8 h-3 bg-white border-white"
        : "w-3 h-3 bg-white/50 border-white/50 hover:bg-white/70"
    }`}
    aria-label={`Ir a imagen ${index + 1}`}
  />
);

const EmptyState = ({
  title = "Sin imágenes",
  description = "Las imágenes de este destino se cargarán próximamente",
}) => (
  <div className="w-full h-full bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center relative overflow-hidden">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-4 sm:top-10 left-4 sm:left-10 w-16 h-16 sm:w-32 sm:h-32 bg-white rounded-full"></div>
      <div className="absolute bottom-4 sm:bottom-10 right-4 sm:right-10 w-12 h-12 sm:w-24 sm:h-24 bg-white rounded-full"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-40 sm:h-40 bg-white rounded-full"></div>
    </div>

    <div className="text-center z-10 px-4">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
        <FiCamera className="w-8 h-8 sm:w-10 sm:h-10 text-slate-500" />
      </div>
      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-600 mb-2">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-slate-500 max-w-xs mx-auto">
        {description}
      </p>
    </div>
  </div>
);

const ImageCarousel = ({
  imagenes,
  emptyStateTitle,
  emptyStateDescription,
  enableSnap = false,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [invalidImages, setInvalidImages] = useState(new Set());

  const handleImageError = (imageId) => {
    setInvalidImages((prev) => new Set([...prev, imageId]));
  };

  const getOptimizedImageUrl = (imagen) => {
    if (!imagen) return "";

    if (imagen.contenido && imagen.contenido.startsWith("data:")) {
      return imagen.contenido;
    }

    if (
      imagen.url &&
      (imagen.url.startsWith("http") || imagen.url.startsWith("data:"))
    ) {
      return imagen.url;
    }

    if (
      imagen.contenido &&
      (imagen.contenido.startsWith("http") || imagen.contenido.includes("://"))
    ) {
      return imagen.contenido;
    }

    if (
      imagen.contenido &&
      !imagen.contenido.startsWith("http") &&
      !imagen.contenido.includes("://")
    ) {
      return `data:image/jpeg;base64,${imagen.contenido}`;
    }

    if (imagen.ruta) {
      return `${API_URL}${imagen.ruta}`;
    }

    if (imagen.nombre) {
      const fileName = imagen.nombre.startsWith("/")
        ? imagen.nombre
        : `/${imagen.nombre}`;
      return `${API_URL}/uploads/images${fileName}`;
    }

    if (imagen.url) {
      return `${API_URL}${imagen.url}`;
    }

    return "";
  };

  const validImages = Array.isArray(imagenes)
    ? imagenes.filter((imagen) => {
        if (!imagen) return false;

        const imageId =
          imagen.id || imagen.nombre || imagen.url || imagen.contenido;
        if (invalidImages.has(imageId)) return false;

        const hasValidUrl =
          imagen.url || imagen.ruta || imagen.nombre || imagen.contenido;
        return hasValidUrl;
      })
    : [];

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  if (!validImages || validImages.length === 0) {
    return (
      <EmptyState title={emptyStateTitle} description={emptyStateDescription} />
    );
  }

  const snapWrapper = enableSnap
    ? "sm:overflow-hidden overflow-x-auto snap-x snap-mandatory"
    : "";
  const snapSlide = enableSnap ? "sm:snap-none snap-center" : "";

  return (
    <div className={`w-full h-full relative group ${snapWrapper}`}>
      {isLoading && (
        <div className="absolute inset-0 z-30 bg-slate-200 flex items-center justify-center">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 px-4">
            <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 sm:border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slate-600 font-medium text-sm sm:text-base text-center">
              Cargando imágenes...
            </span>
          </div>
        </div>
      )}

      <Carousel
        showArrows={true}
        showThumbs={false}
        showStatus={false}
        showIndicators={false}
        infiniteLoop={true}
        useKeyboardArrows={true}
        autoPlay={true}
        interval={8000}
        transitionTime={600}
        swipeable={true}
        emulateTouch={true}
        selectedItem={currentSlide}
        onChange={(index) => setCurrentSlide(index)}
        renderArrowPrev={(onClickHandler, hasPrev) => (
          <CustomArrow
            direction="prev"
            onClick={onClickHandler}
            isVisible={hasPrev && validImages.length > 1}
          />
        )}
        renderArrowNext={(onClickHandler, hasNext) => (
          <CustomArrow
            direction="next"
            onClick={onClickHandler}
            isVisible={hasNext && validImages.length > 1}
          />
        )}
        className={`h-full [&_.carousel]:h-full [&_.carousel_.slider-wrapper]:h-full [&_.carousel_.slider]:h-full [&_.carousel_.slide]:h-full [&_.carousel-slider]:overflow-visible ${enableSnap ? "[&_.carousel_.slide]:snap-center" : ""}`}
      >
        {validImages.map((imagen, index) => {
          const imageUrl = getOptimizedImageUrl(imagen);
          const imageId =
            imagen.id || imagen.nombre || imagen.contenido || index;

          return (
            <div key={imageId} className={`w-full h-full relative ${snapSlide}`}>
              <img
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                src={imageUrl}
                alt={
                  imagen.alt ||
                  imagen.nombre ||
                  `Imagen ${index + 1} del paquete turístico`
                }
                onLoad={handleImageLoad}
                onError={() => handleImageError(imageId)}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "low"}
                decoding={index === 0 ? "sync" : "async"}
              />
            </div>
          );
        })}
      </Carousel>

      {/* Hint táctil en mobile */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 sm:hidden z-20">
        <div className="flex items-center gap-2 bg-black/40 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
          <span className="inline-block w-6 h-6 rounded-full bg-white/20 relative">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full animate-pulse" />
          </span>
          Desliza
        </div>
      </div>

      {/* Hint de interacción en desktop */}
      <div className="pointer-events-none absolute bottom-4 right-4 hidden sm:block z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2 bg-black/40 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
          <span className="hidden md:inline">Arrastra o usa</span>
          <span className="inline-flex items-center gap-1">
            ← →
          </span>
        </div>
      </div>

      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-black/50 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1 z-20">
        <div className="flex items-center space-x-1 sm:space-x-2 text-white text-xs sm:text-sm">
          <FiEye className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>
            {currentSlide + 1} de {validImages.length}
          </span>
        </div>
      </div>

      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/50 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center space-x-1 sm:space-x-2 text-white text-xs sm:text-sm">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Auto</span>
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;
