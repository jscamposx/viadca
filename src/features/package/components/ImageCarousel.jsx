import { useState, useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiMaximize2, 
  FiDownload, 
  FiHeart,
  FiShare2,
  FiCamera,
  FiEye
} from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL;

// Componente de flechas personalizadas más modernas
const CustomArrow = ({ direction, onClick, isVisible }) => {
  const isPrev = direction === 'prev';
  
  if (!isVisible) return null;
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute top-1/2 z-20 -translate-y-1/2 group ${isPrev ? 'left-6' : 'right-6'}`}
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

// Componente de overlay con información
const ImageOverlay = ({ imagen, currentIndex, totalImages, onAction }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <div className={`absolute inset-0 z-10 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Gradiente superior */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/40 to-transparent" />
      
      {/* Gradiente inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
      
      {/* Información superior */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
        <div className="flex items-center space-x-2">
          <div className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/30">
            <span className="text-white text-sm font-medium">
              {currentIndex + 1} / {totalImages}
            </span>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/30">
            <FiCamera className="w-4 h-4 text-white inline mr-1.5" />
            <span className="text-white text-sm font-medium">Galería</span>
          </div>
        </div>
        
        {/* Acciones */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onAction('favorite')}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 transition-all duration-300 hover:scale-110"
          >
            <FiHeart className="w-5 h-5 text-white" />
          </button>
          <button 
            onClick={() => onAction('share')}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 transition-all duration-300 hover:scale-110"
          >
            <FiShare2 className="w-5 h-5 text-white" />
          </button>
          <button 
            onClick={() => onAction('fullscreen')}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 transition-all duration-300 hover:scale-110"
          >
            <FiMaximize2 className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
      
      {/* Información inferior */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30">
          <h3 className="text-white font-semibold text-lg mb-1">
            {imagen?.nombre || `Imagen ${currentIndex + 1}`}
          </h3>
          <p className="text-white/80 text-sm">
            {imagen?.descripcion || "Una vista espectacular de tu próximo destino"}
          </p>
        </div>
      </div>
    </div>
  );
};

// Componente de indicadores personalizados
const CustomIndicator = ({ isSelected, index, onClick }) => (
  <button
    onClick={onClick}
    className={`mx-1 transition-all duration-300 rounded-full border-2 ${
      isSelected 
        ? 'w-8 h-3 bg-white border-white' 
        : 'w-3 h-3 bg-white/50 border-white/50 hover:bg-white/70'
    }`}
    aria-label={`Ir a imagen ${index + 1}`}
  />
);

// Componente de estado vacío mejorado
const EmptyState = () => (
  <div className="w-full h-full bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center relative overflow-hidden">
    {/* Patrón de fondo */}
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

// Componente principal mejorado
const ImageCarousel = ({ imagenes }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState(new Set());

  // Manejo de errores de imagen
  const handleImageError = (imageId) => {
    setImageErrors(prev => new Set(prev).add(imageId));
  };

  // Manejo de carga de imagen
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Manejo de acciones
  const handleAction = (action) => {
    switch (action) {
      case 'favorite':
        console.log('Agregar a favoritos');
        break;
      case 'share':
        console.log('Compartir imagen');
        break;
      case 'fullscreen':
        console.log('Ver en pantalla completa');
        break;
      default:
        break;
    }
  };

  // Función para obtener URL de imagen
  const getImageUrl = (url) => {
    if (url?.startsWith("http") || url?.startsWith("data:")) {
      return url;
    }
    return `${API_URL}${url}`;
  };

  // Filtrar imágenes válidas
  const validImages = imagenes?.filter(img => img && !imageErrors.has(img.id)) || [];

  if (!validImages || validImages.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="w-full h-full relative group">
      {/* Indicador de carga */}
      {isLoading && (
        <div className="absolute inset-0 z-30 bg-slate-200 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slate-600 font-medium">Cargando imágenes...</span>
          </div>
        </div>
      )}

      <Carousel
        showArrows={true}
        showThumbs={false}
        showStatus={false}
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
        renderIndicator={(onClickHandler, isSelected, index) => (
          <CustomIndicator 
            isSelected={isSelected}
            index={index}
            onClick={onClickHandler}
          />
        )}
        className="h-full"
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
            
            {/* Overlay con información */}
            <ImageOverlay
              imagen={imagen}
              currentIndex={index}
              totalImages={validImages.length}
              onAction={handleAction}
            />
          </div>
        ))}
      </Carousel>

      {/* Contador de imágenes flotante */}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 z-20">
        <div className="flex items-center space-x-2 text-white text-sm">
          <FiEye className="w-4 h-4" />
          <span>{currentSlide + 1} de {validImages.length}</span>
        </div>
      </div>

      {/* Indicador de autoplay */}
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