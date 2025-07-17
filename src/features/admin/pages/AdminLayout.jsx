import { Outlet, useLocation } from "react-router-dom";
import AdminNav from "../components/AdminNav";
import { useState, useEffect } from "react";

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

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

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
    }
  }, [location.pathname, isMobile]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <AdminNav isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      <main
        className={`transition-all duration-300 ease-in-out ${
          isMobile ? "pt-16" : isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <div className=" ">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
