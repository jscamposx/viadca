import "./App.css";
import { Routes, Route } from "react-router-dom";
import PaqueteDetalle from "./pages/PackageView";
import AdminDashboard from "./pages/admin/Dashboard/Home";
import AdminPaquetes from "./pages/admin/Dashboard/Paquetes";
import Home from "./pages/Home";
import NuevoPaquete from "./pages/admin/Dashboard/NuevoPaquete";



function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/paquetes/:url" element={<PaqueteDetalle />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/paquetes" element={<AdminPaquetes />} />
      <Route path="/admin/paquetes/nuevo" element={<NuevoPaquete />} />;
    </Routes>
  );
}

export default App;
