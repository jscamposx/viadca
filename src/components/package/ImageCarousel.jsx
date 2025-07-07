import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const API_URL = import.meta.env.VITE_API_URL;

const ImageCarousel = ({ imagenes }) => {
  if (!imagenes || imagenes.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-300 flex items-center justify-center">
        <p className="text-gray-500">Imagen no disponible</p>
      </div>
    );
  }

  return (
    <Carousel
      showArrows={true}
      showThumbs={false}
      infiniteLoop={true}
      useKeyboardArrows={true}
      autoPlay={true}
      interval={5000}
    >
      {imagenes.map((imagen) => (
        <div key={imagen.id}>
          <img
            className="w-full h-96 object-cover"
            src={`${API_URL}${imagen.url}`}
            alt={imagen.nombre}
          />
        </div>
      ))}
    </Carousel>
  );
};

export default ImageCarousel;
