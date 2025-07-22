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
      className={`absolute top-1/2 z-20 -translate-y-1/2 group ${isPrev ? "left-6" : "right-6"}`}
    >
      <div className="w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center border border-white/30">
        {isPrev ? (
          <FiChevronLeft className="w-6 h-6 text-white group-hover:text-white" />
        ) : (
          <FiChevronRight className="w-6 h-6 text-white group-hover:text-white" />
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
      <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-white rounded-full"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full"></div>
    </div>

    <div className="text-center z-10">
      <div className="w-20 h-20 bg-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <FiCamera className="w-10 h-10 text-slate-500" />
      </div>
      <h3 className="text-2xl font-bold text-slate-600 mb-2">Sin imágenes</h3>
      <p className="text-slate-500 max-w-xs">
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

  const getImageUrl = (url) => {
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
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slate-600 font-medium">
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
              src={getImageUrl(imagen.url)}
              alt={imagen.nombre || `Imagen ${index + 1} del paquete turístico`}
              onLoad={handleImageLoad}
              onError={() => handleImageError(imagen.id)}
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </Carousel>

      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 z-20">
        <div className="flex items-center space-x-2 text-white text-sm">
          <FiEye className="w-4 h-4" />
          <span>
            {currentSlide + 1} de {validImages.length}
          </span>
        </div>
      </div>

      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center space-x-2 text-white text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Auto</span>
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;
