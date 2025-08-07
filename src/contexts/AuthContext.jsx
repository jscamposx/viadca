import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../api/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('auth_token'));

  // Configurar token en api si existe
  useEffect(() => {
    if (token) {
      // Agregar token a las headers por defecto
      import('../api/axiosConfig').then(({ default: api }) => {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      });
    }
  }, [token]);

  // Función para limpiar autenticación
  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('mock_user_role'); // Limpiar rol simulado
    // Limpiar header de autorización
    import('../api/axiosConfig').then(({ default: api }) => {
      delete api.defaults.headers.common['Authorization'];
    });
  };

  // Cargar usuario al inicializar
  useEffect(() => {
    const initializeAuth = async () => {
      // Solo intentar cargar perfil si hay token y no hay usuario ya cargado
      if (token && !user) {
        try {
          // En desarrollo, permitir tokens simulados
          if (import.meta.env.DEV && token === 'mock_jwt_token_for_development') {
            const mockRole = localStorage.getItem('mock_user_role') || 'admin';
            const mockUsers = {
              admin: {
                id: 1,
                usuario: 'admin_test',
                correo: 'admin@test.com',
                rol: 'admin',
                verificado: true
              },
              'pre-autorizado': {
                id: 2,
                usuario: 'pending_user',
                correo: 'pending@test.com',
                rol: 'pre-autorizado',
                verificado: true
              },
              usuario: {
                id: 3,
                usuario: 'regular_user',
                correo: 'user@test.com',
                rol: 'usuario',
                verificado: true
              }
            };
            setUser(mockUsers[mockRole] || mockUsers.admin);
          } else {
            const userData = await authService.getProfile();
            setUser(userData);
          }
        } catch (error) {
          // Token inválido o expirado, limpiar silenciosamente
          console.log('Token inválido o expirado, limpiando autenticación');
          clearAuth();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]); // Remover 'user' de las dependencias

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      
      // Extraer access_token y usuario según la estructura del backend
      const { access_token: newToken, usuario } = response;
      
      if (!newToken) {
        throw new Error('Token no encontrado en la respuesta del servidor');
      }
      
      if (!usuario) {
        throw new Error('Datos de usuario no encontrados en la respuesta del servidor');
      }
      
      // Configurar token en api ANTES de guardarlo en el estado
      const { default: api } = await import('../api/axiosConfig');
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      // Guardar token en localStorage
      localStorage.setItem('auth_token', newToken);
      
      // Establecer token y usuario en el estado
      setToken(newToken);
      setUser(usuario);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    clearAuth();
  };

  const verifyEmail = async (token) => {
    try {
      const response = await authService.verifyEmail(token);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await authService.forgotPassword(email);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const response = await authService.resetPassword(token, newPassword);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async () => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  // Helpers
  const isAuthenticated = () => !!user && !!token;
  const isAdmin = () => user?.rol === 'admin';
  const isPreAuthorized = () => user?.rol === 'pre-autorizado';
  const hasRole = (role) => user?.rol === role;

  const value = {
    user,
    token,
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
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
