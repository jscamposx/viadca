import { createContext, useContext, useState, useEffect, useRef } from "react";
import authService from "../api/authService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Cargar usuario desde storage sólo si existe (compat)
    const savedUser = localStorage.getItem("auth_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  // Guardas para evitar dobles efectos en StrictMode y deduplicar llamadas
  const didInitRef = useRef(false);
  const inFlightProfileRef = useRef(null);

  // Función para limpiar autenticación (no hay token en cliente)
  const clearAuth = () => {
    setUser(null);
    setIsProfileLoaded(true);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("mock_user_role");
  };

  // Guardar usuario en storage (opcional) y estado
  const saveUserToStorage = (userData) => {
    localStorage.setItem("auth_user", JSON.stringify(userData));
    setUser(userData);
    setIsProfileLoaded(true);
  };

  // Dedupe: obtener perfil reutilizando una promesa en vuelo
  const fetchProfileOnce = async () => {
    if (inFlightProfileRef.current) return inFlightProfileRef.current;
    inFlightProfileRef.current = authService
      .getProfile()
      .then((userData) => {
        saveUserToStorage(userData);
        return userData;
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        inFlightProfileRef.current = null;
      });
    return inFlightProfileRef.current;
  };

  // Cargar usuario al inicializar sólo si existe en storage
  // Evita golpear /usuarios/profile con 401 cuando no hay sesión
  useEffect(() => {
    if (didInitRef.current) return; // StrictMode guard
    didInitRef.current = true;

    const initializeAuth = async () => {
      const hasStoredUser = Boolean(localStorage.getItem("auth_user"));
      if (!hasStoredUser) {
        // Usuario anónimo: no llamar al backend
        setLoading(false);
        setIsProfileLoaded(true);
        return;
      }

      try {
        await fetchProfileOnce();
      } catch (error) {
        // No autenticado o cookie inválida -> limpiar
        clearAuth();
      } finally {
        setLoading(false);
        setIsProfileLoaded(true);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    // Backend setea cookie; luego consultamos el perfil deduplicado
    await authService.login(credentials);
    const userData = await fetchProfileOnce();
    return { usuario: userData };
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    return response;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      clearAuth();
    }
  };

  const verifyEmail = async (token) => authService.verifyEmail(token);
  const forgotPassword = async (email) => authService.forgotPassword(email);
  const resetPassword = async (token, newPassword) =>
    authService.resetPassword(token, newPassword);

  // updateProfile para refrescar desde backend (deduped)
  const updateProfile = async () => {
    const userData = await fetchProfileOnce();
    return userData;
  };

  // Variante segura: si no hay sesión conocida, no intentes ir a backend
  const safeUpdateProfile = async () => {
    if (!localStorage.getItem("auth_user")) return null;
    try {
      return await fetchProfileOnce();
    } catch (_) {
      return null;
    }
  };

  // Helpers
  const isAuthenticated = () => !!user; // ya no dependemos de token
  const isAdmin = () => user?.rol === "admin";
  const isPreAuthorized = () => user?.rol === "pre-autorizado";
  const hasRole = (role) => user?.rol === role;

  const value = {
    user,
    loading,
    isProfileLoaded,
    login,
    register,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
    updateProfile,
    safeUpdateProfile,
    isAuthenticated,
    isAdmin,
    isPreAuthorized,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
