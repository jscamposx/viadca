import { useState, useEffect, useCallback, useRef } from "react";
import apiClient from "../../../api/axiosConfig";

// Caché y promesas en vuelo por tipo a nivel de módulo
const trashCache = {
  paquetes: null,
  mayoristas: null,
  usuarios: null,
};
const trashInFlight = {
  paquetes: null,
  mayoristas: null,
  usuarios: null,
};

export const usePapelera = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paquetesEliminados, setPaquetesEliminados] = useState(
    Array.isArray(trashCache.paquetes) ? trashCache.paquetes : [],
  );
  const [mayoristasEliminados, setMayoristasEliminados] = useState(
    Array.isArray(trashCache.mayoristas) ? trashCache.mayoristas : [],
  );
  const [usuariosEliminados, setUsuariosEliminados] = useState(
    Array.isArray(trashCache.usuarios) ? trashCache.usuarios : [],
  );
  const [lastUpdated, setLastUpdated] = useState(null);
  const mountedRef = useRef(false);

  const fetchType = useCallback(async (type, force = false) => {
    try {
      // Cache hit
      if (Array.isArray(trashCache[type]) && !force) {
        return trashCache[type];
      }
      // In-flight existing
      if (trashInFlight[type] && !force) {
        return await trashInFlight[type];
      }
      // Build endpoint
      const endpoint =
        type === "paquetes"
          ? "/admin/paquetes/deleted/list"
          : type === "mayoristas"
            ? "/admin/mayoristas/deleted/list"
            : "/admin/usuarios/deleted/list";

      trashInFlight[type] = apiClient
        .get(endpoint)
        .then((res) => (Array.isArray(res.data) ? res.data : []))
        .then((data) => {
          trashCache[type] = data;
          return data;
        })
        .finally(() => {
          trashInFlight[type] = null;
        });

      return await trashInFlight[type];
    } catch (e) {
      throw e;
    }
  }, []);

  // Función para cargar datos eliminados (las 3 colecciones)
  const loadDeletedData = useCallback(
    async (force = false) => {
      try {
        setLoading(true);
        setError(null);

        const [p, m, u] = await Promise.all([
          fetchType("paquetes", force),
          fetchType("mayoristas", force),
          fetchType("usuarios", force),
        ]);

        setPaquetesEliminados(p);
        setMayoristasEliminados(m);
        setUsuariosEliminados(u);
        setLastUpdated(new Date());
      } catch (err) {
        console.error("Error al cargar datos eliminados:", err);
        setError("Error al cargar los elementos eliminados");
        setPaquetesEliminados([]);
        setMayoristasEliminados([]);
        setUsuariosEliminados([]);
      } finally {
        setLoading(false);
      }
    },
    [fetchType],
  );

  // Cargar datos al inicializar una sola vez (evitar doble efecto por StrictMode)
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    loadDeletedData(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Función para restaurar un elemento
  const restoreItem = useCallback(async (itemId, itemType) => {
    try {
      const endpoint =
        itemType === "paquete"
          ? `/admin/paquetes/${itemId}/restore`
          : itemType === "mayorista"
            ? `/admin/mayoristas/${itemId}/restore`
            : `/admin/usuarios/${itemId}/restore`;

      await apiClient.patch(endpoint);

      if (itemType === "paquete") {
        setPaquetesEliminados((prev) => prev.filter((p) => p.id !== itemId));
        if (Array.isArray(trashCache.paquetes)) {
          trashCache.paquetes = trashCache.paquetes.filter((p) => p.id !== itemId);
        }
      } else if (itemType === "mayorista") {
        setMayoristasEliminados((prev) => prev.filter((m) => m.id !== itemId));
        if (Array.isArray(trashCache.mayoristas)) {
          trashCache.mayoristas = trashCache.mayoristas.filter((m) => m.id !== itemId);
        }
      } else if (itemType === "usuario") {
        setUsuariosEliminados((prev) => prev.filter((u) => u.id !== itemId));
        if (Array.isArray(trashCache.usuarios)) {
          trashCache.usuarios = trashCache.usuarios.filter((u) => u.id !== itemId);
        }
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
      if (itemType === "usuario") {
        await apiClient.post(`/admin/usuarios/${itemId}/hard-delete`);
      } else if (itemType === "paquete") {
        await apiClient.delete(`/admin/paquetes/${itemId}/hard`);
      } else if (itemType === "mayorista") {
        await apiClient.delete(`/admin/mayoristas/${itemId}/hard`);
      } else {
        throw new Error(`Tipo de elemento desconocido: ${itemType}`);
      }

      if (itemType === "paquete") {
        setPaquetesEliminados((prev) => prev.filter((p) => p.id !== itemId));
        if (Array.isArray(trashCache.paquetes)) {
          trashCache.paquetes = trashCache.paquetes.filter((p) => p.id !== itemId);
        }
      } else if (itemType === "mayorista") {
        setMayoristasEliminados((prev) => prev.filter((m) => m.id !== itemId));
        if (Array.isArray(trashCache.mayoristas)) {
          trashCache.mayoristas = trashCache.mayoristas.filter((m) => m.id !== itemId);
        }
      } else if (itemType === "usuario") {
        setUsuariosEliminados((prev) => prev.filter((u) => u.id !== itemId));
        if (Array.isArray(trashCache.usuarios)) {
          trashCache.usuarios = trashCache.usuarios.filter((u) => u.id !== itemId);
        }
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
      await apiClient.post("/admin/cleanup/hard-delete");
      setPaquetesEliminados([]);
      setMayoristasEliminados([]);
      setUsuariosEliminados([]);
      trashCache.paquetes = [];
      trashCache.mayoristas = [];
      trashCache.usuarios = [];
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
    total:
      (paquetesEliminados?.length || 0) +
      (mayoristasEliminados?.length || 0) +
      (usuariosEliminados?.length || 0),
    isEmpty:
      (paquetesEliminados?.length || 0) === 0 &&
      (mayoristasEliminados?.length || 0) === 0 &&
      (usuariosEliminados?.length || 0) === 0,
  };

  // Obtener todos los elementos combinados
  const getAllItems = useCallback(() => {
    const paquetes = paquetesEliminados.map((p) => ({
      ...p,
      type: "paquete",
      name: p.titulo,
      eliminadoEn: p.eliminadoEn || p.eliminado_en,
    }));

    const mayoristas = mayoristasEliminados.map((m) => ({
      ...m,
      type: "mayorista",
      name: m.nombre,
      eliminadoEn: m.eliminadoEn || m.eliminado_en,
    }));

    const usuarios = usuariosEliminados.map((u) => ({
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
