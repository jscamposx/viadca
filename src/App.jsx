import "./App.css";
import { Routes, Route } from "react-router-dom";
import PaqueteDetalle from "./features/package/pages/PackageViewPage";
import AdminDashboard from "./features/admin/pages/AdminDashboardPage";
import AdminPaquetes from "./features/admin/pages/AdminPackagesPage";
import Home from "./features/home/pages/HomePage";
import NuevoPaquete from "./features/admin/pages/NewPackagePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/paquetes/:url" element={<PaqueteDetalle />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/paquetes" element={<AdminPaquetes />} />
      <Route path="/admin/paquetes/nuevo" element={<NuevoPaquete />} />
      <Route path="/admin/paquetes/editar/:url" element={<NuevoPaquete />} />
    </Routes>
  );
}

export default App;