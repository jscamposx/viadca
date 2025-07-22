import { Outlet } from "react-router-dom";
import AdminNav from "../components/AdminNav";
import { useState, useEffect } from "react";

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
  );
};

export default AdminLayout;
