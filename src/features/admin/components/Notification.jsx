import { useState, useEffect, useRef } from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiInfo,
  FiX,
  FiAlertTriangle,
  FiAlertCircle,
  FiClock,
  FiZap,
} from "react-icons/fi";

const Notification = ({
  message,
  type = "info",
  title,
  onDismiss,
  duration = 5000,
  persistent = false,
  action,
  index = 0,
}) => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const progressInterval = useRef(null);
  const animationRef = useRef(null);
  const notificationRef = useRef(null);

  const notificationIcons = {
    success: (
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 ring-2 ring-green-200">
        <FiCheckCircle className="w-5 h-5 text-green-600" />
      </div>
    ),
    error: (
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 ring-2 ring-red-200">
        <FiXCircle className="w-5 h-5 text-red-600" />
      </div>
    ),
    warning: (
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 ring-2 ring-yellow-200">
        <FiAlertTriangle className="w-5 h-5 text-yellow-600" />
      </div>
    ),
    info: (
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 ring-2 ring-blue-200">
        <FiInfo className="w-5 h-5 text-blue-600" />
      </div>
    ),
    loading: (
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 ring-2 ring-purple-200">
        <FiClock className="w-5 h-5 text-purple-600 animate-spin" />
      </div>
    ),
    urgent: (
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 ring-2 ring-orange-200 animate-pulse">
        <FiZap className="w-5 h-5 text-orange-600" />
      </div>
    ),
  };

  const notificationColors = {
    success: {
      bg: "bg-gradient-to-r from-green-50 via-green-25 to-emerald-50",
      border: "border-l-4 border-green-500",
      text: "text-green-800",
      shadow: "shadow-green-100/50",
    },
    error: {
      bg: "bg-gradient-to-r from-red-50 via-red-25 to-rose-50",
      border: "border-l-4 border-red-500",
      text: "text-red-800",
      shadow: "shadow-red-100/50",
    },
    warning: {
      bg: "bg-gradient-to-r from-yellow-50 via-yellow-25 to-amber-50",
      border: "border-l-4 border-yellow-500",
      text: "text-yellow-800",
      shadow: "shadow-yellow-100/50",
    },
    info: {
      bg: "bg-gradient-to-r from-blue-50 via-blue-25 to-sky-50",
      border: "border-l-4 border-blue-500",
      text: "text-blue-800",
      shadow: "shadow-blue-100/50",
    },
    loading: {
      bg: "bg-gradient-to-r from-purple-50 via-purple-25 to-violet-50",
      border: "border-l-4 border-purple-500",
      text: "text-purple-800",
      shadow: "shadow-purple-100/50",
    },
    urgent: {
      bg: "bg-gradient-to-r from-orange-50 via-orange-25 to-red-50",
      border: "border-l-4 border-orange-500",
      text: "text-orange-800",
      shadow: "shadow-orange-100/50",
    },
  };

  const typeLabels = {
    success: "Éxito",
    error: "Error",
    warning: "Advertencia",
    info: "Información",
    loading: "Cargando",
    urgent: "Urgente",
  };

  useEffect(() => {
    setVisible(true);

    if (persistent) return;

    const startTime = Date.now();
    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      setProgress((remaining / duration) * 100);
    }, 50);

    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval.current);
    };
  }, [duration, persistent]);

  const handleDismiss = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    setVisible(false);
    setTimeout(onDismiss, 300);
  };

  return (
    <div
      ref={notificationRef}
      className={`fixed z-[1000] transition-all duration-500 ease-out
        ${
          visible
            ? "opacity-100 translate-x-0 scale-100"
            : "opacity-0 translate-x-full scale-95 pointer-events-none"
        }
        right-2 sm:right-6 left-2 sm:left-auto w-auto sm:w-full sm:max-w-sm`}
      style={{
        bottom: `${24 + index * 110}px`,
        transform: visible ? "translateX(0)" : "translateX(100%)",
      }}
    >
      <div
        className={`${notificationColors[type].bg} ${notificationColors[type].border} ${notificationColors[type].shadow}
          rounded-xl shadow-2xl backdrop-blur-sm border border-white/20 overflow-hidden
          transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}
      >
        {!persistent && (
          <div className="h-1 w-full bg-white/30">
            <div
              className={`h-full transition-all duration-75 linear ${
                type === "success"
                  ? "bg-green-500"
                  : type === "error"
                    ? "bg-red-500"
                    : type === "warning"
                      ? "bg-yellow-500"
                      : type === "loading"
                        ? "bg-purple-500"
                        : type === "urgent"
                          ? "bg-orange-500"
                          : "bg-blue-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {notificationIcons[type]}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4
                  className={`font-semibold text-sm ${notificationColors[type].text}`}
                >
                  {title || typeLabels[type]}
                </h4>

                <button
                  onClick={handleDismiss}
                  className={`ml-1 sm:ml-2 p-1 rounded-full transition-all duration-200 
                    hover:bg-white/30 active:scale-95 ${notificationColors[type].text}`}
                  aria-label="Cerrar notificación"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              <p
                className={`mt-1 text-sm leading-relaxed ${notificationColors[type].text} opacity-90`}
              >
                {message}
              </p>

              {action && (
                <div className="mt-3">
                  <button
                    onClick={action.onClick}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200
                      hover:scale-105 active:scale-95 bg-white/20 backdrop-blur-sm
                      ${notificationColors[type].text} hover:bg-white/30`}
                  >
                    {action.label}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {persistent && (
          <div className="absolute top-2 right-2">
            <div
              className={`w-2 h-2 rounded-full ${
                type === "success"
                  ? "bg-green-400"
                  : type === "error"
                    ? "bg-red-400"
                    : type === "warning"
                      ? "bg-yellow-400"
                      : type === "loading"
                        ? "bg-purple-400 animate-pulse"
                        : type === "urgent"
                          ? "bg-orange-400 animate-ping"
                          : "bg-blue-400"
              }`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
