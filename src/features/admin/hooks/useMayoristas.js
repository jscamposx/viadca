import { useState, useEffect, useCallback } from "react";
import api from "../../../api";

// Caché y promesa en vuelo a nivel de módulo para deduplicar peticiones
let mayoristasCache = null; // Array | null
let mayoristasInFlight = null; // Promise | null

export const useMayoristas = () => {
  const [mayoristas, setMayoristas] = useState(Array.isArray(mayoristasCache) ? mayoristasCache : []);
  const [loading, setLoading] = useState(!Array.isArray(mayoristasCache));
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(!!Array.isArray(mayoristasCache) && mayoristasCache.length >= 0);

  const fetchMayoristas = useCallback(
    async (force = false) => {
      try {
        setError(null);

        // Usar caché si existe y no es forzado
        if (Array.isArray(mayoristasCache) && !force) {
          setMayoristas(mayoristasCache);
          setIsInitialized(true);
          setLoading(false);
          return mayoristasCache;
        }

        // Si hay una promesa en vuelo y no es forzado, esperar a que termine
        if (mayoristasInFlight && !force) {
          setLoading(true);
          const data = await mayoristasInFlight;
          setMayoristas(data);
          setIsInitialized(true);
          setLoading(false);
          return data;
        }

        // Lanzar una nueva petición (y deduplicar concurrentes)
        setLoading(true);
        if (import.meta.env.DEV) {
          console.log("🔄 Cargando mayoristas desde API...");
        }
        mayoristasInFlight = api.mayoristas
          .getMayoristas()
          .then((response) => (Array.isArray(response.data) ? response.data : []))
          .then((data) => {
            mayoristasCache = data;
            return data;
          })
          .finally(() => {
            mayoristasInFlight = null;
          });

        const data = await mayoristasInFlight;
        if (import.meta.env.DEV) {
          console.log("✅ Mayoristas cargados:", { count: data?.length || 0 });
        }
        setMayoristas(data);
        setIsInitialized(true);
        return data;
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error("❌ Error al cargar mayoristas:", err);
        }
        setError("Error al cargar los mayoristas");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const createMayorista = useCallback(async (mayoristaData) => {
    try {
      if (import.meta.env.DEV) {
        console.log("🚀 Creando mayorista...", {
          data: mayoristaData,
          apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
          environment: import.meta.env.MODE,
        });
      }

      const response = await api.mayoristas.createMayorista(mayoristaData);

      if (import.meta.env.DEV) {
        console.log("✅ Mayorista creado exitosamente:", response.data);
      }

      setMayoristas((prev) => [response.data, ...prev]);
      // Actualizar caché global
      mayoristasCache = Array.isArray(mayoristasCache)
        ? [response.data, ...mayoristasCache]
        : [response.data];
      return response.data;
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("❌ Error detallado al crear mayorista:", {
          error: err,
          message: err.message,
          response: err.response,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          headers: err.response?.headers,
        });
      }
      throw err;
    }
  }, []);

  const updateMayorista = useCallback(async (id, mayoristaData) => {
    try {
      const response = await api.mayoristas.updateMayorista(id, mayoristaData);
      setMayoristas((prev) =>
        prev.map((mayorista) => (mayorista.id === id ? response.data : mayorista)),
      );
      // Actualizar caché global
      if (Array.isArray(mayoristasCache)) {
        mayoristasCache = mayoristasCache.map((m) => (m.id === id ? response.data : m));
      }
      return response.data;
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("Error al actualizar mayorista:", err);
      }
      throw err;
    }
  }, []);

  const deleteMayorista = useCallback(async (id) => {
    try {
      await api.mayoristas.deleteMayorista(id);
      setMayoristas((prev) => prev.filter((mayorista) => mayorista.id !== id));
      // Actualizar caché global
      if (Array.isArray(mayoristasCache)) {
        mayoristasCache = mayoristasCache.filter((m) => m.id !== id);
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("Error al eliminar mayorista:", err);
      }
      throw err;
    }
  }, []);

  const getMayoristaById = useCallback(async (id) => {
    try {
      // Si está en caché devolver inmediato; si no, pedir a la API
      if (Array.isArray(mayoristasCache)) {
        const cached = mayoristasCache.find((m) => m.id === id);
        if (cached) return cached;
      }
      const response = await api.mayoristas.getMayoristaById(id);
      return response.data;
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("Error al obtener mayorista:", err);
      }
      throw err;
    }
  }, []);

  useEffect(() => {
    // En montaje, intentar cargar usando deduplicación
    fetchMayoristas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    mayoristas,
    setMayoristas,
    loading,
    error,
    createMayorista,
    updateMayorista,
    deleteMayorista,
    getMayoristaById,
    refetch: fetchMayoristas,
    isInitialized,
  };
};
