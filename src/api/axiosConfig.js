import axios from "axios";

// Obtener la URL base con fallback
const getBaseURL = () => {
  const envURL = import.meta.env.VITE_API_BASE_URL;
  console.log("🔧 Variables de entorno:", {
    VITE_API_BASE_URL: envURL,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD
  });
  
  // Fallback basado en el entorno
  if (envURL) {
    return envURL;
  }
  
  // Fallbacks por entorno
  if (import.meta.env.DEV) {
    return "http://localhost:3000";
  } else {
    return "https://viadca-back.onrender.com";
  }
};

const baseURL = getBaseURL();
console.log("🌐 URL base de API configurada:", baseURL);

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 segundos de timeout
});

// Interceptor para logs de request
apiClient.interceptors.request.use(
  (config) => {
    console.log("🔄 API Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Interceptor para logs de response
apiClient.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error("❌ API Response Error:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      headers: error.response?.headers
    });
    return Promise.reject(error);
  }
);

export default apiClient;
