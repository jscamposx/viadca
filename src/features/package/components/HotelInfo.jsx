import ImageCarousel from "./ImageCarousel";
import { FiStar } from "react-icons/fi";

const Star = ({ filled }) => (
  <FiStar
    className={`w-5 h-5 ${filled ? "text-yellow-400 fill-current" : "text-gray-300"}`}
  />
);

const StarRatingDisplay = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <Star key={index} filled={index < rating} />
      ))}
    </div>
  );
};

const HotelInfo = ({ hotel }) => {
  if (!hotel) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{hotel.nombre}</h3>
        <div className="flex items-center my-2">
          <StarRatingDisplay rating={hotel.estrellas} />
          <span className="text-sm text-gray-600 ml-2">
            {hotel.estrellas} estrellas
          </span>
        </div>
        {hotel.total_calificaciones !== null && (
          <p className="text-sm text-gray-500">
            {hotel.total_calificaciones} calificaciones
          </p>
        )}
      </div>
      <div className="mt-4 rounded-lg overflow-hidden shadow-inner flex-grow min-h-48">
        <ImageCarousel
          imagenes={hotel.imagenes || []}
          emptyStateTitle="Sin fotos del hotel"
          emptyStateDescription="Las imágenes del hotel no están disponibles"
        />
      </div>
    </div>
  );
};

export default HotelInfo;
