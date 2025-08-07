import { useState, useEffect, useCallback } from "react";
import api from "../../../api";

export const useMayoristas = () => {
  const [mayoristas, setMayoristas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchMayoristas = useCallback(async (force = false) => {
    // Evitar múltiples peticiones si ya se inicializó y no es forzado
    if (isInitialized && !force) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      if (import.meta.env.DEV) {
        console.log("🔄 Cargando mayoristas desde API...");
      }
      const response = await api.mayoristas.getMayoristas();
      if (import.meta.env.DEV) {
        console.log("✅ Mayoristas cargados:", {
          count: response.data?.length || 0,
        });
      }
      // Asegurar que siempre sea un array
      setMayoristas(Array.isArray(response.data) ? response.data : []);
      setIsInitialized(true);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("❌ Error al cargar mayoristas:", err);
      }
      setError("Error al cargar los mayoristas");
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  const createMayorista = useCallback(async (mayoristaData) => {
    try {
      if (import.meta.env.DEV) {
        console.log("🚀 Creando mayorista...", {
          data: mayoristaData,
          apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
          environment: import.meta.env.MODE
        });
      }
      
      const response = await api.mayoristas.createMayorista(mayoristaData);
      
      if (import.meta.env.DEV) {
        console.log("✅ Mayorista creado exitosamente:", response.data);
      }
      
      setMayoristas((prev) => [response.data, ...prev]);
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
          headers: err.response?.headers
        });
      }
      throw err;
    }
  }, []);

  const updateMayorista = useCallback(async (id, mayoristaData) => {
    try {
      const response = await api.mayoristas.updateMayorista(id, mayoristaData);
      setMayoristas((prev) =>
        prev.map((mayorista) =>
          mayorista.id === id ? response.data : mayorista,
        ),
      );
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
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("Error al eliminar mayorista:", err);
      }
      throw err;
    }
  }, []);

  const getMayoristaById = useCallback(async (id) => {
    try {
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
    fetchMayoristas();
  }, [fetchMayoristas]);

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
  };
};
