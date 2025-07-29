import "./App.css";
import { Routes, Route } from "react-router-dom";
import PaqueteDetalle from "./features/package/pages/PackageViewPage";
import AdminDashboard from "./features/admin/pages/AdminDashboardPage";
import AdminPaquetes from "./features/admin/pages/AdminPackagesPage";
import Home from "./features/home/pages/HomePage";
import NuevoPaquete from "./features/admin/pages/NewPackagePage";
import AdminLayout from "./features/admin/pages/AdminLayout";
import AdminMayoristasPage from "./features/admin/pages/AdminMayoristasPage";
import NewMayoristaPage from "./features/admin/pages/NewMayoristaPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/paquetes/:url" element={<PaqueteDetalle />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="paquetes" element={<AdminPaquetes />} />
        <Route path="paquetes/nuevo" element={<NuevoPaquete />} />
        <Route path="paquetes/editar/:id" element={<NuevoPaquete />} />
        <Route path="mayoristas" element={<AdminMayoristasPage />} />
        <Route path="mayoristas/nuevo" element={<NewMayoristaPage />} />
        <Route path="mayoristas/editar/:id" element={<NewMayoristaPage />} />
      </Route>
    </Routes>
  );
}

export default App;
