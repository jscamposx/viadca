import { useState, useEffect, useCallback } from "react";
import apiClient from "../../../api/axiosConfig";

export const usePapelera = () => {
  const [loading, setLoading] = useState(false); // Cambiado a false para evitar loading infinito
  const [error, setError] = useState(null);
  const [paquetesEliminados, setPaquetesEliminados] = useState([]);
  const [mayoristasEliminados, setMayoristasEliminados] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Función para cargar datos eliminados
  const loadDeletedData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar paquetes eliminados
      const paquetesResponse = await apiClient.get("/admin/paquetes/deleted/list");
      setPaquetesEliminados(paquetesResponse.data || []);
      
      // Cargar mayoristas eliminados
      const mayoristasResponse = await apiClient.get("/admin/mayoristas/deleted/list");
      setMayoristasEliminados(mayoristasResponse.data || []);
      
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error al cargar datos eliminados:", err);
      setError("Error al cargar los elementos eliminados");
      // Establecer valores por defecto en caso de error
      setPaquetesEliminados([]);
      setMayoristasEliminados([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar datos al inicializar
  useEffect(() => {
    loadDeletedData();
  }, [loadDeletedData]);

  // Función para restaurar un elemento
  const restoreItem = useCallback(async (itemId, itemType) => {
    try {
      const endpoint = itemType === "paquete" 
        ? `/admin/paquetes/${itemId}/restore`
        : `/admin/mayoristas/${itemId}/restore`;
      
      await apiClient.patch(endpoint);
      
      // Actualizar el estado local
      if (itemType === "paquete") {
        setPaquetesEliminados(prev => prev.filter(p => p.id !== itemId));
      } else {
        setMayoristasEliminados(prev => prev.filter(m => m.id !== itemId));
      }
      
      setLastUpdated(new Date());
      return true;
    } catch (err) {
      console.error("Error al restaurar elemento:", err);
      return false;
    }
  }, []);

  // Función para eliminar definitivamente un elemento
  const hardDeleteItem = useCallback(async (itemId, itemType) => {
    try {
      const endpoint = itemType === "paquete" 
        ? `/admin/paquetes/${itemId}/hard`
        : `/admin/mayoristas/${itemId}/hard`;
      
      await apiClient.delete(endpoint);
      
      // Actualizar el estado local
      if (itemType === "paquete") {
        setPaquetesEliminados(prev => prev.filter(p => p.id !== itemId));
      } else {
        setMayoristasEliminados(prev => prev.filter(m => m.id !== itemId));
      }
      
      setLastUpdated(new Date());
      return true;
    } catch (err) {
      console.error("Error al eliminar definitivamente:", err);
      return false;
    }
  }, []);

  // Función para vaciar toda la papelera
  const emptyTrash = useCallback(async () => {
    try {
      // Obtener todos los elementos actuales
      const allPaquetes = [...paquetesEliminados];
      const allMayoristas = [...mayoristasEliminados];
      
      // Crear promesas para eliminar todos los elementos
      const deletePromises = [
        ...allPaquetes.map(p => apiClient.delete(`/admin/paquetes/${p.id}/hard`)),
        ...allMayoristas.map(m => apiClient.delete(`/admin/mayoristas/${m.id}/hard`))
      ];
      
      // Ejecutar todas las eliminaciones en paralelo
      await Promise.all(deletePromises);
      
      setPaquetesEliminados([]);
      setMayoristasEliminados([]);
      setLastUpdated(new Date());
      return true;
    } catch (err) {
      console.error("Error al vaciar papelera:", err);
      return false;
    }
  }, [paquetesEliminados, mayoristasEliminados]);

  // Calcular estadísticas
  const stats = {
    totalPaquetes: paquetesEliminados?.length || 0,
    totalMayoristas: mayoristasEliminados?.length || 0,
    total: (paquetesEliminados?.length || 0) + (mayoristasEliminados?.length || 0),
    isEmpty: (paquetesEliminados?.length || 0) === 0 && (mayoristasEliminados?.length || 0) === 0,
  };

  // Obtener todos los elementos combinados
  const getAllItems = useCallback(() => {
    const paquetes = paquetesEliminados.map(p => ({
      ...p,
      type: "paquete",
      name: p.titulo,
      eliminadoEn: p.eliminadoEn || p.eliminado_en,
    }));
    
    const mayoristas = mayoristasEliminados.map(m => ({
      ...m,
      type: "mayorista", 
      name: m.nombre,
      eliminadoEn: m.eliminadoEn || m.eliminado_en,
    }));
    
    return [...paquetes, ...mayoristas];
  }, [paquetesEliminados, mayoristasEliminados]);

  return {
    loading,
    error,
    paquetesEliminados,
    mayoristasEliminados,
    stats,
    lastUpdated,
    loadDeletedData,
    restoreItem,
    hardDeleteItem,
    emptyTrash,
    getAllItems,
  };
};

export default usePapelera;
