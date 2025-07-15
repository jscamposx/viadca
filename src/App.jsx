import "./App.css";
import { Routes, Route } from "react-router-dom";
import PaqueteDetalle from "./features/package/pages/PackageViewPage";
import AdminDashboard from "./features/admin/pages/AdminDashboardPage";
import AdminPaquetes from "./features/admin/pages/AdminPackagesPage";
import Home from "./features/home/pages/HomePage";
import NuevoPaquete from "./features/admin/pages/NewPackagePage";
import AdminLayout from "./features/admin/pages/AdminLayout"; // 1. Importa el layout
import AdminFlightsPage from "./features/admin/pages/AdminFlightsPage"; // <-- Añade esta línea
import NewFlightPage from "./features/admin/pages/NewFlightPage"; // <-- Añade esta línea

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/paquetes/:url" element={<PaqueteDetalle />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="paquetes" element={<AdminPaquetes />} />
        <Route path="paquetes/nuevo" element={<NuevoPaquete />} />
        <Route path="paquetes/editar/:url" element={<NuevoPaquete />} />
        
        {/* --- NUEVAS RUTAS PARA VUELOS --- */}
        <Route path="vuelos" element={<AdminFlightsPage />} />
        <Route path="vuelos/nuevo" element={<NewFlightPage />} />
        <Route path="vuelos/editar/:id" element={<NewFlightPage />} />
      </Route>
    </Routes>
  );
}

export default App;