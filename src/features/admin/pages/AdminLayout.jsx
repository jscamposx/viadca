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

  const addNotification = useCallback((message, type = "info") => {
    const id = new Date().getTime();
    setNotifications((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}

      <div className="fixed bottom-0 right-0 p-4 space-y-3 z-[100]">
        {notifications.map((notif) => (
          <Notification
            key={notif.id}
            message={notif.message}
            type={notif.type}
            onDismiss={() => removeNotification(notif.id)}
          />
        ))}
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

  const [isSidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 768;
    }
    return true;
  });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
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
