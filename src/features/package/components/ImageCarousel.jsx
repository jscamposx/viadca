import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const API_URL = import.meta.env.VITE_API_URL;

// Componente reutilizable para las flechas de navegación
const CustomArrow = ({ direction, onClick }) => {
  const isPrev = direction === 'prev';
  const icon = isPrev ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute top-1/2 z-10 -translate-y-1/2 p-3 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${isPrev ? 'left-4' : 'right-4'}`}
    >
      {icon}
    </button>
  );
};


const ImageCarousel = ({ imagenes }) => {
  if (!imagenes || imagenes.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-3 text-lg font-medium text-gray-500">No hay imágenes disponibles</p>
        </div>
      </div>
    );
  }

  const getImageUrl = (url) => {
    if (url.startsWith("http") || url.startsWith("data:")) {
      return url;
    }
    return `${API_URL}${url}`;
  };

  return (
    <div className="w-full h-full"> {/* El contenedor debe ocupar el 100% del padre */}
      <Carousel
        showArrows={true}
        showThumbs={false}
        showStatus={false}
        infiniteLoop={true}
        useKeyboardArrows={true}
        autoPlay={true}
        interval={6000}
        transitionTime={800}
        swipeable={true}
        emulateTouch={true}
        renderArrowPrev={(onClickHandler, hasPrev) => hasPrev && <CustomArrow direction="prev" onClick={onClickHandler} />}
        renderArrowNext={(onClickHandler, hasNext) => hasNext && <CustomArrow direction="next" onClick={onClickHandler} />}
        renderIndicator={(onClickHandler, isSelected, index) => (
          <li
            className={`inline-block mx-1.5 w-3 h-3 bg-white rounded-full cursor-pointer transition-all duration-300 ${isSelected ? 'opacity-100 scale-125' : 'opacity-50'}`}
            onClick={onClickHandler}
            onKeyDown={onClickHandler}
            value={index}
            key={index}
            role="button"
            tabIndex={0}
          />
        )}
      >
        {imagenes.map((imagen) => (
          // Este div ahora solo se encarga del contenido, no del tamaño
          <div key={imagen.id} className="w-full h-full">
            <img
              className="w-full h-full object-cover" // object-cover es clave para que la imagen llene el espacio sin deformarse
              src={getImageUrl(imagen.url)}
              alt={imagen.nombre || "Imagen del paquete turístico"}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ImageCarousel;