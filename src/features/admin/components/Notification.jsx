import { useState, useEffect } from "react";
import { FiCheckCircle, FiXCircle, FiInfo, FiX } from "react-icons/fi";

const notificationIcons = {
  success: <FiCheckCircle className="w-6 h-6 text-green-500" />,
  error: <FiXCircle className="w-6 h-6 text-red-500" />,
  info: <FiInfo className="w-6 h-6 text-blue-500" />,
};

const Notification = ({ message, type = "info", onDismiss }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      handleDismiss();
    }, 5000); // La notificación se oculta después de 5 segundos

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 300); // Espera a que la animación de salida termine
  };

  return (
    <div
      className={`fixed bottom-5 right-5 flex items-center p-4 rounded-lg shadow-2xl text-white transition-all duration-300 transform ${
        visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      } ${
        type === "success"
          ? "bg-green-600"
          : type === "error"
          ? "bg-red-600"
          : "bg-blue-600"
      }`}
    >
      <div className="mr-3">{notificationIcons[type]}</div>
      <div className="flex-grow font-medium">{message}</div>
      <button onClick={handleDismiss} className="ml-4 p-1 rounded-full hover:bg-white/20">
        <FiX className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Notification;