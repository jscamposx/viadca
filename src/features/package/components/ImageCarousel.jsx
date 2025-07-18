import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import "./ImageCarousel.css"; // Crearemos este archivo para estilos personalizados

const API_URL = import.meta.env.VITE_API_URL;

const ImageCarousel = ({ imagenes }) => {
  if (!imagenes || imagenes.length === 0) {
    return (
      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
        <p className="text-gray-500">Imagen no disponible</p>
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
    <div className="relative w-full h-full">
      <Carousel
        showArrows={true}
        showThumbs={false}
        showStatus={false}
        infiniteLoop={true}
        useKeyboardArrows={true}
        autoPlay={true}
        interval={5000}
        transitionTime={800}
        emulateTouch={true}
        swipeable={true}
        className="main-carousel"
      >
        {imagenes.map((imagen) => (
          <div key={imagen.id} className="h-full">
            <img
              className="w-full h-full object-cover"
              src={getImageUrl(imagen.url)}
              alt={imagen.nombre || "Imagen del paquete"}
            />
          </div>
        ))}
      </Carousel>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
    </div>
  );
};

export default ImageCarousel;