import axios from "axios";
import { getAccessToken } from "./tokenManager";

// Resolver unificado de baseURL (IMPORTANTE: usar SIEMPRE variables de entorno primero)
const getBaseURL = () => {
  const primary = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
  const legacy = import.meta.env.VITE_BACKEND_URL; // por si existía antes

  if (import.meta.env.DEV) {
    console.log("🔧 Variables de entorno API detectadas:", {
      VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
      VITE_API_URL: import.meta.env.VITE_API_URL,
      VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
      MODE: import.meta.env.MODE,
    });
  }

  // 1. Variables explícitas
  if (primary) return sanitizeBase(primary);
  if (legacy) return sanitizeBase(legacy);

  // 2. Fallback local dev
  if (import.meta.env.DEV) return "http://localhost:3000";

  // 3. Nuevo dominio oficial
  return "https://api.viadca.app"; // fallback producción
};

const sanitizeBase = (url) => url?.replace(/\/$/, "");

const baseURL = getBaseURL();

if (import.meta.env.DEV) console.log("🌐 URL base de API configurada:", baseURL);

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 segundos de timeout
  // Enviar y recibir cookies (credenciales) con CORS
  withCredentials: true,
});

// Interceptor para logs de request (solo en desarrollo) y para adjuntar Authorization si hay token en memoria
apiClient.interceptors.request.use(
  (config) => {
    // Adjuntar Bearer token si está disponible (fallback Safari/iOS cuando cookies no se envían)
    try {
      const token = getAccessToken?.();
      if (token && !config.headers?.Authorization) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (_) {
      // noop
    }

    if (import.meta.env.DEV) {
      // Enmascarar datos sensibles en logs
      const sanitizedHeaders = { ...(config.headers || {}) };
      if (sanitizedHeaders.Authorization) {
        sanitizedHeaders.Authorization = "Bearer ***";
      }

      console.log("🔄 API Request:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`,
        data: config.data,
        headers: sanitizedHeaders,
        withCredentials: config.withCredentials,
      });
    }
    return config;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error("❌ Request Error:", error);
    }
    return Promise.reject(error);
  },
);

// Interceptor para logs de response (solo en desarrollo)
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      // Evitar loguear tokens
      let dataLog = response.data;
      try {
        if (
          dataLog &&
          typeof dataLog === "object" &&
          Object.prototype.hasOwnProperty.call(dataLog, "access_token")
        ) {
          dataLog = { ...dataLog, access_token: "***" };
        }
      } catch (_) {
        // noop
      }

      console.log("✅ API Response:", {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        data: dataLog,
      });
    }
    return response;
  },
  (error) => {
    if (import.meta.env.DEV) {
      // No mostrar errores 401 como críticos, son esperados cuando no hay autenticación
      const isAuthError = error.response?.status === 401;
      const logLevel = isAuthError ? "log" : "error";
      const emoji = isAuthError ? "🔒" : "❌";

      const sanitizedHeaders = { ...(error.config?.headers || {}) };
      if (sanitizedHeaders.Authorization) {
        sanitizedHeaders.Authorization = "Bearer ***";
      }

      console[logLevel](
        `${emoji} API Response ${isAuthError ? "(Auth required)" : "Error"}:`,
        {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          data: error.response?.data,
          headers: sanitizedHeaders,
        },
      );
    }
    return Promise.reject(error);
  },
);

export default apiClient;
