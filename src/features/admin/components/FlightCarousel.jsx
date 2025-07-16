import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const FlightCarousel = ({ flights = [], onFlightSelect, selectedFlightId }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const [visibleSlide, setVisibleSlide] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  const getImageUrl = (flight) => {
    if (!flight?.imagenes?.length) {
      return `https://source.unsplash.com/random/800x400/?airplane,${flight.id}`;
    }

    const url = flight.imagenes[0].url;
    return url.startsWith("http")
      ? url
      : `${import.meta.env.VITE_API_URL}${url}`;
  };

  const handleSlideChange = (index) => {
    setVisibleSlide(index);
  };

  const scrollToSlide = (index) => {
    if (carouselRef.current) {
      carouselRef.current.moveTo(index);
    }
  };

  if (flights.length === 0) {
    return (
      <div className="text-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-sm">
        <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-lg font-medium text-gray-700">
          No hay vuelos disponibles
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Intenta con otros filtros o fechas
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200 shadow-lg max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
            Selecciona tu vuelo
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Explora nuestras opciones disponibles
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <span className="inline-flex items-center bg-blue-50 text-blue-700 py-1 px-3 rounded-full text-sm font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {flights.length} {flights.length === 1 ? "opción" : "opciones"}
          </span>

          <div className="flex space-x-1">
            <button
              onClick={() => scrollToSlide(visibleSlide - 1)}
              disabled={visibleSlide === 0}
              className={`p-2 rounded-full ${
                visibleSlide === 0
                  ? "text-gray-300"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => scrollToSlide(visibleSlide + 1)}
              disabled={visibleSlide === flights.length - 1}
              className={`p-2 rounded-full ${
                visibleSlide === flights.length - 1
                  ? "text-gray-300"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="relative px-0">
        <Carousel
          ref={carouselRef}
          showThumbs={false}
          showStatus={false}
          showIndicators={false}
          infiniteLoop={false}
          useKeyboardArrows
          centerMode={!isMobile}
          centerSlidePercentage={isMobile ? 100 : 30}
          emulateTouch
          swipeable
          onChange={handleSlideChange}
          ariaLabel="Vuelos disponibles"
          className="modern-carousel"
          renderArrowPrev={() => null}
          renderArrowNext={() => null}
        >
          {flights.map((flight) => {
            const isSelected = flight.id === selectedFlightId;
            const imageUrl = getImageUrl(flight);

            return (
              <div key={flight.id} className="px-1.5 py-2 h-full">
                <div
                  className={`h-full p-4 transition-all duration-300 ease-out ${
                    isSelected
                      ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-500 shadow-lg transform -translate-y-1"
                      : "bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md"
                  } rounded-xl flex flex-col overflow-hidden`}
                  role="button"
                  tabIndex={0}
                  onClick={() => onFlightSelect(flight.id)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && onFlightSelect(flight.id)
                  }
                  aria-label={`Vuelo ${flight.nombre} con ${flight.transporte}`}
                >
                  <div className="relative pb-[56.25%] overflow-hidden rounded-lg mb-4 flex-shrink-0">
                    {!loadedImages[flight.id] && (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
                    )}
                    <img
                      src={imageUrl}
                      alt={`Vuelo ${flight.nombre}`}
                      className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${
                        loadedImages[flight.id] ? "opacity-100" : "opacity-0"
                      }`}
                      loading="lazy"
                      onLoad={() => handleImageLoad(flight.id)}
                    />
                    <div className="absolute top-2 right-2 bg-gray-900 text-white text-xs py-1 px-2 rounded-lg font-medium flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                      {flight.transporte}
                    </div>
                  </div>

                  <div className="px-1 flex-grow flex flex-col">
                    <h4 className="font-bold text-gray-900 text-lg mb-2">
                      {flight.nombre}
                    </h4>

                    {flight.origen && flight.destino && (
                      <div className="flex items-center mb-4">
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-500">
                            SALIDA
                          </p>
                          <p className="font-medium text-gray-800">
                            {flight.origen}
                          </p>
                        </div>
                        <div className="mx-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-500">
                            LLEGADA
                          </p>
                          <p className="font-medium text-gray-800">
                            {flight.destino}
                          </p>
                        </div>
                      </div>
                    )}

                    {flight.duracion && (
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Duración: {flight.duracion}
                      </div>
                    )}

                    <div className="mt-auto">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onFlightSelect(flight.id);
                        }}
                        className={`w-full py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] ${
                          isSelected
                            ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg"
                            : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                        }`}
                        aria-pressed={isSelected}
                      >
                        {isSelected ? (
                          <span className="flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Seleccionado
                          </span>
                        ) : (
                          "Seleccionar vuelo"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Carousel>
      </div>

      <div className="flex justify-center mt-6 space-x-1">
        {flights.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSlide(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              index === visibleSlide ? "bg-blue-600 w-6" : "bg-gray-300"
            }`}
            aria-label={`Ir al vuelo ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

FlightCarousel.propTypes = {
  flights: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      nombre: PropTypes.string.isRequired,
      transporte: PropTypes.string.isRequired,
      origen: PropTypes.string,
      destino: PropTypes.string,
      duracion: PropTypes.string,
      imagenes: PropTypes.arrayOf(
        PropTypes.shape({
          url: PropTypes.string.isRequired,
        })
      ),
    })
  ),
  onFlightSelect: PropTypes.func.isRequired,
  selectedFlightId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default FlightCarousel;