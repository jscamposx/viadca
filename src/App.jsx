import "./App.css";
import { Routes, Route } from "react-router-dom";
import PaqueteDetalle from "./features/package/pages/PackageViewPage";
import AdminDashboard from "./features/admin/pages/AdminDashboardPage";
import AdminPaquetes from "./features/admin/pages/AdminPackagesPage";
import Home from "./features/home/pages/HomePage";
import NuevoPaquete from "./features/admin/pages/NewPackagePage";
import AdminLayout from "./features/admin/pages/AdminLayout";
import AdminFlightsPage from "./features/admin/pages/AdminFlightsPage";
import NewFlightPage from "./features/admin/pages/NewFlightPage";
import AdminHotelsPage from "./features/admin/pages/AdminHotelsPage";
import NewHotelPage from "./features/admin/pages/NewHotelPage";
import AdminTrashPage from "./features/admin/pages/AdminTrashPage";

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
        <Route path="vuelos" element={<AdminFlightsPage />} />
        <Route path="vuelos/nuevo" element={<NewFlightPage />} />
        <Route path="vuelos/editar/:id" element={<NewFlightPage />} />
        <Route path="hoteles" element={<AdminHotelsPage />} />
        <Route path="hoteles/nuevo" element={<NewHotelPage />} />
        <Route path="hoteles/editar/:id" element={<NewHotelPage />} />
        <Route path="papelera" element={<AdminTrashPage />} />
      </Route>
    </Routes>
  );
}

export default App;
