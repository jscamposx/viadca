import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useRef, useState } from "react";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading, isAuthenticated, updateProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Verificación perezosa: si no hay usuario pero podría haber cookie válida, probar una vez
  const triedOnceRef = useRef(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (isAuthenticated()) return;
    if (triedOnceRef.current) return;
    triedOnceRef.current = true;

    let mounted = true;
    (async () => {
      try {
        setChecking(true);
        await updateProfile();
      } catch (_) {
        // Ignorar errores (401 esperado si no hay sesión)
      } finally {
        if (mounted) setChecking(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [loading, updateProfile, isAuthenticated]);

  if (loading || checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            Verificando acceso...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    // Redirigir al login guardando la ubicación actual
    return <Navigate to="/iniciar-sesion" state={{ from: location }} replace />;
  }

  // Verificar si el usuario está pre-autorizado - redirigir a página de espera
  if (
    user?.rol === "pre-autorizado" &&
    location.pathname !== "/aprobacion-pendiente"
  ) {
    return <Navigate to="/aprobacion-pendiente" replace />;
  }

  // Verificar rol si es requerido
  if (requiredRole && user?.rol !== requiredRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Acceso Denegado
          </h1>
          <p className="text-gray-600 mb-6">
            No tienes permisos para acceder a esta página.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Volver a Homepage
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
