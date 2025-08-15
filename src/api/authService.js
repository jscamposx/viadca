import api from "./axiosConfig";
import { setAccessToken, clearAccessToken } from "./tokenManager";

const authService = {
  // Endpoints públicos
  register: async (userData) => {
    const response = await api.post("/usuarios/register", userData);
    return response.data;
  },

  login: async (credentials) => {
    // El backend setea cookie HttpOnly y además devuelve access_token como fallback
    const response = await api.post("/usuarios/login", credentials);
    // Guardar token en memoria si llega (para Safari / ITP)
    if (response?.data?.access_token) {
      setAccessToken(response.data.access_token);
    }
    return response.data;
  },

  logout: async () => {
    try {
      // Limpia la cookie HttpOnly en el backend
      const response = await api.post("/usuarios/logout");
      return response.data;
    } finally {
      // Siempre limpiar token en memoria
      clearAccessToken();
    }
  },

  verifyEmail: async (token) => {
    const response = await api.post("/usuarios/verify-email", { token });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post("/usuarios/forgot-password", {
      correo: email,
    });
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await api.post("/usuarios/reset-password", {
      token,
      nuevaContrasena: newPassword,
    });
    return response.data;
  },

  // Endpoints autenticados (definitivo: /usuarios/profile)
  getProfile: async () => {
    const res = await api.get("/usuarios/profile");
    return res.data;
  },

  updateProfile: async (userData) => {
    const res = await api.patch("/usuarios/profile", userData);
    return res.data;
  },

  // Endpoints de administración
  getAllUsers: async (params = {}) => {
    const response = await api.get("/admin/usuarios", { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/admin/usuarios/${id}`);
    return response.data;
  },

  getDeletedUsers: async () => {
    const response = await api.get("/admin/usuarios/deleted/list");
    return response.data;
  },

  getUserStats: async () => {
    const response = await api.get("/admin/usuarios/stats/overview");
    return response.data;
  },

  updateUserRole: async (id, role) => {
    const response = await api.patch(`/admin/usuarios/${id}/role`, {
      rol: role,
    });
    return response.data;
  },

  softDeleteUser: async (id) => {
    const response = await api.patch(`/admin/usuarios/${id}/soft-delete`);
    return response.data;
  },

  restoreUser: async (id) => {
    const response = await api.patch(`/admin/usuarios/${id}/restore`);
    return response.data;
  },

  hardDeleteUser: async (id) => {
    const response = await api.post(`/admin/usuarios/${id}/hard-delete`);
    return response.data;
  },
};

export default authService;
