import { useState, useEffect, useCallback } from "react";
import apiClient from "../../../api/axiosConfig";

export const usePapelera = () => {
  const [loading, setLoading] = useState(false); // Cambiado a false para evitar loading infinito
  const [error, setError] = useState(null);
  const [paquetesEliminados, setPaquetesEliminados] = useState([]);
  const [mayoristasEliminados, setMayoristasEliminados] = useState([]);
  const [usuariosEliminados, setUsuariosEliminados] = useState([]);
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
      
      // Cargar usuarios eliminados
      const usuariosResponse = await apiClient.get("/admin/usuarios/deleted/list");
      setUsuariosEliminados(usuariosResponse.data || []);
      
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error al cargar datos eliminados:", err);
      setError("Error al cargar los elementos eliminados");
      // Establecer valores por defecto en caso de error
      setPaquetesEliminados([]);
      setMayoristasEliminados([]);
      setUsuariosEliminados([]);
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
        : itemType === "mayorista"
        ? `/admin/mayoristas/${itemId}/restore`
        : `/admin/usuarios/${itemId}/restore`;
      
      await apiClient.patch(endpoint);
      
      // Actualizar el estado local
      if (itemType === "paquete") {
        setPaquetesEliminados(prev => prev.filter(p => p.id !== itemId));
      } else if (itemType === "mayorista") {
        setMayoristasEliminados(prev => prev.filter(m => m.id !== itemId));
      } else if (itemType === "usuario") {
        setUsuariosEliminados(prev => prev.filter(u => u.id !== itemId));
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
      // Endpoints según backend actual:
      // - Paquetes: DELETE /admin/paquetes/:id/hard
      // - Mayoristas: DELETE /admin/mayoristas/:id/hard
      // - Usuarios:  POST   /admin/usuarios/:id/hard-delete
      if (itemType === "usuario") {
        await apiClient.post(`/admin/usuarios/${itemId}/hard-delete`);
      } else if (itemType === "paquete") {
        await apiClient.delete(`/admin/paquetes/${itemId}/hard`);
      } else if (itemType === "mayorista") {
        await apiClient.delete(`/admin/mayoristas/${itemId}/hard`);
      } else {
        throw new Error(`Tipo de elemento desconocido: ${itemType}`);
      }
      
      // Actualizar el estado local
      if (itemType === "paquete") {
        setPaquetesEliminados(prev => prev.filter(p => p.id !== itemId));
      } else if (itemType === "mayorista") {
        setMayoristasEliminados(prev => prev.filter(m => m.id !== itemId));
      } else if (itemType === "usuario") {
        setUsuariosEliminados(prev => prev.filter(u => u.id !== itemId));
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
      // Endpoint de limpieza masiva del backend:
      // POST /admin/cleanup/hard-delete
      await apiClient.post('/admin/cleanup/hard-delete');
      
      // Limpiar estado local tras éxito
      setPaquetesEliminados([]);
      setMayoristasEliminados([]);
      setUsuariosEliminados([]);
      setLastUpdated(new Date());
      return true;
    } catch (err) {
      console.error("Error al vaciar papelera:", err);
      return false;
    }
  }, []);

  // Calcular estadísticas
  const stats = {
    totalPaquetes: paquetesEliminados?.length || 0,
    totalMayoristas: mayoristasEliminados?.length || 0,
    totalUsuarios: usuariosEliminados?.length || 0,
    total: (paquetesEliminados?.length || 0) + (mayoristasEliminados?.length || 0) + (usuariosEliminados?.length || 0),
    isEmpty: (paquetesEliminados?.length || 0) === 0 && (mayoristasEliminados?.length || 0) === 0 && (usuariosEliminados?.length || 0) === 0,
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
    
    const usuarios = usuariosEliminados.map(u => ({
      ...u,
      type: "usuario",
      name: u.usuario,
      eliminadoEn: u.eliminadoEn || u.eliminado_en,
    }));
    
    return [...paquetes, ...mayoristas, ...usuarios];
  }, [paquetesEliminados, mayoristasEliminados, usuariosEliminados]);

  return {
    loading,
    error,
    paquetesEliminados,
    mayoristasEliminados,
    usuariosEliminados,
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
