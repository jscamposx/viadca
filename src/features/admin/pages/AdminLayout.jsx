import { Outlet } from "react-router-dom";
import AdminNav from "../components/AdminNav";


const AdminLayout = () => {
  return (

      <div className="bg-gray-100 min-h-screen">
        <AdminNav />
        <main className="pl-24 pr-4 py-8 sm:pl-28 sm:pr-8">
          <Outlet />
        </main>
      </div>

  );
};

export default AdminLayout;