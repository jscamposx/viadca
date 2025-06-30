import './App.css';
import { Routes, Route } from 'react-router-dom';
import PaqueteDetalle from './pages/[url]';
import AdminDashboard from './pages/admin/Dashboard/Home';
import AdminPaquetes from './pages/admin/Dashboard/Paquetes';
import Home from './pages/Home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/paquetes/:url" element={<PaqueteDetalle />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/paquetes" element={<AdminPaquetes />} />
    </Routes>
  );
}

export default App;