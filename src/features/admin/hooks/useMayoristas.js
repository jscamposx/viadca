// src/features/admin/hooks/useMayoristas.js

import { useState, useEffect, useCallback } from "react";
import api from "../../../api";

export const useMayoristas = () => {
  const [mayoristas, setMayoristas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMayoristas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.mayoristas.getMayoristas();
      setMayoristas(response.data);
    } catch (err) {
      console.error("Error al cargar mayoristas:", err);
      setError("Error al cargar los mayoristas");
    } finally {
      setLoading(false);
    }
  }, []);

  const createMayorista = useCallback(async (mayoristaData) => {
    try {
      const response = await api.mayoristas.createMayorista(mayoristaData);
      setMayoristas((prev) => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      console.error("Error al crear mayorista:", err);
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
      console.error("Error al actualizar mayorista:", err);
      throw err;
    }
  }, []);

  const deleteMayorista = useCallback(async (id) => {
    try {
      await api.mayoristas.deleteMayorista(id);
      setMayoristas((prev) => prev.filter((mayorista) => mayorista.id !== id));
    } catch (err) {
      console.error("Error al eliminar mayorista:", err);
      throw err;
    }
  }, []);

  const getMayoristaById = useCallback(async (id) => {
    try {
      const response = await api.mayoristas.getMayoristaById(id);
      return response.data;
    } catch (err) {
      console.error("Error al obtener mayorista:", err);
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
