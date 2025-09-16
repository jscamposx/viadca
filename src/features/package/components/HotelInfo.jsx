import ImageCarousel from "./ImageCarousel";
import { useState } from "react";
import LightboxModal from "../../../components/ui/LightboxModal";
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

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

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
      {/* Ajuste: se quita el redondeado superior para que no parezca una card independiente */}
      <div className="mt-2 sm:mt-3 rounded-b-xl overflow-hidden shadow-md flex-grow min-h-[16rem] sm:min-h-[18rem] md:min-h-[22rem]">
        <ImageCarousel
          imagenes={hotel.imagenes || []}
          emptyStateTitle="Sin fotos del hotel"
          emptyStateDescription="Las imágenes del hotel no están disponibles"
          enableSnap={true}
          onRequestFullscreen={() => setOpen(true)}
          onSlideChange={(i) => setIndex(i)}
        />
      </div>

      <LightboxModal
        images={(hotel.imagenes || []).map((img) =>
          img?.contenido?.startsWith("data:")
            ? img.contenido
            : img?.url?.startsWith("http") || img?.url?.startsWith("data:")
              ? img.url
              : img?.contenido?.startsWith("http") ||
                  img?.contenido?.includes("://")
                ? img.contenido
                : img?.contenido &&
                    !img?.contenido?.includes("://") &&
                    !img?.contenido?.startsWith("http")
                  ? `data:image/jpeg;base64,${img.contenido}`
                  : img?.ruta
                    ? `${import.meta.env.VITE_API_BASE_URL}${img.ruta}`
                    : img?.nombre
                      ? `${import.meta.env.VITE_API_BASE_URL}/uploads/images/${img.nombre.startsWith("/") ? img.nombre.slice(1) : img.nombre}`
                      : img?.url
                        ? `${import.meta.env.VITE_API_BASE_URL}${img.url}`
                        : "",
        )}
        startIndex={index}
        isOpen={open}
        onClose={() => setOpen(false)}
        onIndexChange={setIndex}
      />
    </div>
  );
};

export default HotelInfo;
