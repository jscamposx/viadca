import { useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { FiChevronLeft, FiChevronRight, FiCamera, FiEye } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL;

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
    >
      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center border border-white/30">
        {isPrev ? (
          <FiChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white group-hover:text-white" />
        ) : (
          <FiChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white group-hover:text-white" />
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

const EmptyState = () => (
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
      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-600 mb-2">Sin imágenes</h3>
      <p className="text-sm sm:text-base text-slate-500 max-w-xs mx-auto">
        Las imágenes de este destino se cargarán próximamente
      </p>
    </div>
  </div>
);

const ImageCarousel = ({ imagenes }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState(new Set());

  const handleImageError = (imageId) => {
    setImageErrors((prev) => new Set(prev).add(imageId));
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const getImageUrl = (imagen) => {
    // Usar 'contenido' si existe, sino 'url' para compatibilidad
    const url = imagen.contenido || imagen.url;
    if (url?.startsWith("http") || url?.startsWith("data:")) {
      return url;
    }
    return `${API_URL}${url}`;
  };

  const validImages =
    imagenes?.filter((img) => img && !imageErrors.has(img.id)) || [];

  if (!validImages || validImages.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="w-full h-full relative group">
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
        className="h-full [&_.carousel]:h-full [&_.carousel_.slider-wrapper]:h-full [&_.carousel_.slider]:h-full [&_.carousel_.slide]:h-full [&_.carousel-slider]:overflow-visible"
      >
        {validImages.map((imagen, index) => (
          <div key={imagen.id || index} className="w-full h-full relative">
            <img
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              src={getImageUrl(imagen)}
              alt={imagen.nombre || `Imagen ${index + 1} del paquete turístico`}
              onLoad={handleImageLoad}
              onError={() => handleImageError(imagen.id)}
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </Carousel>

      {/* Contador de imágenes */}
      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-black/50 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1 z-20">
        <div className="flex items-center space-x-1 sm:space-x-2 text-white text-xs sm:text-sm">
          <FiEye className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>
            {currentSlide + 1} de {validImages.length}
          </span>
        </div>
      </div>

      {/* Indicador de autoplay */}
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
