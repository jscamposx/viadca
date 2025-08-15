import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PaqueteDetalle from "./features/package/pages/PackageViewPage";
import AdminDashboard from "./features/admin/pages/AdminDashboardPage";
import AdminPaquetes from "./features/admin/pages/AdminPackagesPage";
import Home from "./features/home/pages/HomePage";
import NuevoPaquete from "./features/admin/pages/NewPackagePage";
import AdminLayout from "./features/admin/pages/AdminLayout";
import AdminMayoristasPage from "./features/admin/pages/AdminMayoristasPage";
import NewMayoristaPage from "./features/admin/pages/NewMayoristaPage";
import PapeleraPage from "./features/admin/pages/PapeleraPage";
import AdminUsersPage from "./features/admin/pages/AdminUsersPage";
import AdminProfilePage from "./features/admin/pages/AdminProfilePage";
import AdminConfigPage from "./features/admin/pages/AdminConfigPage";

import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import VerifyEmailPage from "./features/auth/pages/VerifyEmailPage";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";
import PendingApprovalPage from "./features/auth/pages/PendingApprovalPage";
import ProtectedUserProfilePage from "./features/profile/pages/UserProfilePage";

import PrivacyPage from "./features/legal/pages/PrivacyPage";
import TermsPage from "./features/legal/pages/TermsPage";
import CookiesPage from "./features/legal/pages/CookiesPage";
import ScrollToTop from "./components/ui/ScrollToTop";

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      {/* Asegura que cada navegación coloque el scroll arriba */}
      <ScrollToTop />
      <Routes location={location} key={location.pathname}>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/paquetes/:url" element={<PaqueteDetalle />} />
        {/* Páginas legales */}
        <Route path="/privacidad" element={<PrivacyPage />} />
        <Route path="/terminos" element={<TermsPage />} />
        <Route path="/cookies" element={<CookiesPage />} />

        {/* Rutas de autenticación (ES) */}
        <Route path="/iniciar-sesion" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/verificar-correo" element={<VerifyEmailPage />} />
        <Route path="/recuperar-contraseña" element={<ForgotPasswordPage />} />
        <Route path="/restablecer-contraseña" element={<ResetPasswordPage />} />
        <Route path="/aprobacion-pendiente" element={<PendingApprovalPage />} />
        <Route path="/perfil" element={<ProtectedUserProfilePage />} />

        {/* Rutas protegidas de administración */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="paquetes" element={<AdminPaquetes />} />
          <Route path="paquetes/nuevo" element={<NuevoPaquete />} />
          <Route path="paquetes/editar/:id" element={<NuevoPaquete />} />
          <Route path="mayoristas" element={<AdminMayoristasPage />} />
          <Route path="mayoristas/nuevo" element={<NewMayoristaPage />} />
          <Route path="mayoristas/editar/:id" element={<NewMayoristaPage />} />
          <Route path="usuarios" element={<AdminUsersPage />} />
          <Route path="papelera" element={<PapeleraPage />} />
          <Route path="perfil" element={<AdminProfilePage />} />
          <Route path="configuracion" element={<AdminConfigPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
