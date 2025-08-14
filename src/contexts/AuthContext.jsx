import { createContext, useContext, useState, useEffect } from "react";
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

  // Función para limpiar autenticación (no hay token en cliente)
  const clearAuth = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("mock_user_role");
  };

  // Guardar usuario en storage (opcional) y estado
  const saveUserToStorage = (userData) => {
    localStorage.setItem("auth_user", JSON.stringify(userData));
    setUser(userData);
  };

  // Cargar usuario al inicializar preguntando al backend por la cookie
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const userData = await authService.getProfile();
        saveUserToStorage(userData);
      } catch (error) {
        // No autenticado o cookie inválida
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    // Backend setea cookie; luego consultamos el perfil
    await authService.login(credentials);

    // Cargar perfil inmediatamente después del login
    const userData = await authService.getProfile();
    saveUserToStorage(userData);

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

  const updateProfile = async () => {
    const userData = await authService.getProfile();
    saveUserToStorage(userData);
    return userData;
  };

  // Helpers
  const isAuthenticated = () => !!user; // ya no dependemos de token
  const isAdmin = () => user?.rol === "admin";
  const isPreAuthorized = () => user?.rol === "pre-autorizado";
  const hasRole = (role) => user?.rol === role;

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
    updateProfile,
    isAuthenticated,
    isAdmin,
    isPreAuthorized,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
