import { useState, useEffect, useRef } from "react";
import { FiCheckCircle, FiXCircle, FiInfo, FiX } from "react-icons/fi";

const Notification = ({
  message,
  type = "info",
  onDismiss,
  duration = 5000,
}) => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const progressInterval = useRef(null);
  const animationRef = useRef(null);
  const notificationRef = useRef(null);

  // Iconos más grandes con contorno circular
  const notificationIcons = {
    success: (
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
        <FiCheckCircle className="w-6 h-6 text-green-600" />
      </div>
    ),
    error: (
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
        <FiXCircle className="w-6 h-6 text-red-600" />
      </div>
    ),
    info: (
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
        <FiInfo className="w-6 h-6 text-blue-600" />
      </div>
    ),
  };

  // Colores para cada tipo de notificación
  const notificationColors = {
    success: {
      bg: "bg-gradient-to-r from-green-50 to-green-100",
      border: "border-l-4 border-green-500",
      text: "text-green-800",
    },
    error: {
      bg: "bg-gradient-to-r from-red-50 to-red-100",
      border: "border-l-4 border-red-500",
      text: "text-red-800",
    },
    info: {
      bg: "bg-gradient-to-r from-blue-50 to-blue-100",
      border: "border-l-4 border-blue-500",
      text: "text-blue-800",
    },
  };

  useEffect(() => {
    // Animación de entrada
    setVisible(true);

    // Barra de progreso
    const startTime = Date.now();
    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      setProgress((remaining / duration) * 100);
    }, 50);

    // Temporizador para desvanecer
    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval.current);
    };
  }, [duration]);

  const handleDismiss = () => {
    // Cancelar animación si ya está en progreso
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Animación de salida
    setVisible(false);
    setTimeout(onDismiss, 300);
  };

  return (
    <div
      ref={notificationRef}
      className={`fixed z-[1000] transition-all duration-300 ease-out
        ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }
        /* Posicionamiento responsive */
        bottom-4 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg
        md:bottom-6 md:left-auto md:right-6 md:transform-none md:w-auto
      `}
    >
      <div
        className={`${notificationColors[type].bg} ${notificationColors[type].border} rounded-xl shadow-xl overflow-hidden min-w-[300px]`}
      >
        {/* Barra de progreso */}
        <div className="h-1.5 w-full bg-gray-200">
          <div
            className={`h-full ${
              type === "success"
                ? "bg-green-500"
                : type === "error"
                  ? "bg-red-500"
                  : "bg-blue-500"
            }`}
            style={{ width: `${progress}%`, transition: "width 50ms linear" }}
          ></div>
        </div>

        <div className="p-4 flex items-start">
          <div className="mr-3 flex-shrink-0">{notificationIcons[type]}</div>
          <div className="flex-1 min-w-0">
            <p
              className={`font-semibold ${notificationColors[type].text} text-base`}
            >
              {type === "success"
                ? "Éxito"
                : type === "error"
                  ? "Error"
                  : "Información"}
            </p>
            <p className={`mt-1 text-base ${notificationColors[type].text}`}>
              {message}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="ml-2 flex-shrink-0 p-1.5 rounded-full hover:bg-gray-200 transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
