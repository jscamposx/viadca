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
import PapeleraPage from "./features/admin/pages/PapeleraPage";
import AdminUsersPage from "./features/admin/pages/AdminUsersPage";
import AdminProfilePage from "./features/admin/pages/AdminProfilePage";
import AdminConfigPage from "./features/admin/pages/AdminConfigPage";

// Importar componentes de autenticación
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import VerifyEmailPage from "./features/auth/pages/VerifyEmailPage";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";
import AuthTestPage from "./features/auth/pages/AuthTestPage";
import PendingApprovalPage from "./features/auth/pages/PendingApprovalPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/paquetes/:url" element={<PaqueteDetalle />} />
        
        {/* Rutas de autenticación */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/verificar-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/restablecer-contraseña" element={<ResetPasswordPage />} />
        <Route path="/restablecer-contrase%c3%b1a" element={<ResetPasswordPage />} />
        <Route path="/auth-test" element={<AuthTestPage />} />
        <Route path="/pending-approval" element={<PendingApprovalPage />} />
        
        {/* Rutas protegidas de administración */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
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
          <Route path="usuarios" element={
            <ProtectedRoute requiredRole="admin">
              <AdminUsersPage />
            </ProtectedRoute>
          } />
          <Route path="papelera" element={<PapeleraPage />} />
          <Route path="perfil" element={<AdminProfilePage />} />
          <Route path="configuracion" element={<AdminConfigPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
