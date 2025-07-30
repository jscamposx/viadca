import { Outlet, useOutletContext } from "react-router-dom";
import AdminNav from "../components/AdminNav";
import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import Notification from "../components/Notification";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = "info", options = {}) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      message,
      type,
      title: options.title,
      persistent: options.persistent || false,
      duration: options.duration || (type === "error" ? 7000 : type === "success" ? 4000 : 5000),
      action: options.action,
    };
    
    setNotifications((prev) => {
      // Limitar a máximo 5 notificaciones
      const updated = [...prev, newNotification];
      return updated.slice(-5);
    });
    
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const updateNotification = useCallback((id, updates) => {
    setNotifications((prev) => 
      prev.map((n) => n.id === id ? { ...n, ...updates } : n)
    );
  }, []);

  return (
    <NotificationContext.Provider value={{ 
      addNotification, 
      removeNotification, 
      clearAll,
      updateNotification,
      notifications 
    }}>
      {children}

      {/* Container de notificaciones mejorado */}
      <div className="fixed top-0 right-0 w-full max-w-sm p-4 pointer-events-none z-[1000]">
        <div className="space-y-2">
          {notifications.map((notif, index) => (
            <div key={notif.id} className="pointer-events-auto">
              <Notification
                message={notif.message}
                type={notif.type}
                title={notif.title}
                persistent={notif.persistent}
                duration={notif.duration}
                action={notif.action}
                index={index}
                onDismiss={() => removeNotification(notif.id)}
              />
            </div>
          ))}
        </div>
        
        {/* Botón para limpiar todas las notificaciones */}
        {notifications.length > 1 && (
          <div className="mt-4 flex justify-end pointer-events-auto">
            <button
              onClick={clearAll}
              className="text-xs px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg
                         transition-all duration-200 shadow-lg hover:scale-105 active:scale-95"
            >
              Limpiar todas ({notifications.length})
            </button>
          </div>
        )}
      </div>
    </NotificationContext.Provider>
  );
};

const AdminLayout = () => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <NotificationProvider>
      <div className="bg-gray-100 min-h-screen">
        <AdminNav isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
        <main
          className={`transition-[margin-left] duration-300 ease-in-out ${
            isMobile ? "pt-16" : isSidebarOpen ? "ml-64" : "ml-20"
          }`}
        >
          <div className="p-4 sm:p-6 md:p-8 bg-white">
            <Outlet />
          </div>
        </main>
      </div>
    </NotificationProvider>
  );
};

export default AdminLayout;
