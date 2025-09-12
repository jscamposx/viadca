import { useState, useEffect, useCallback, useRef } from "react";
import api from "../../../api";

// Caché y promesa en curso a nivel de módulo por combinación page|limit|search
const mayoristasCache = new Map(); // key -> { list, totalPages, totalItems }
const mayoristasInFlight = new Map(); // key -> Promise<{ list, totalPages, totalItems }>

// Normalizador de respuestas para mayoristas (array o { data, pagination })
const normalizeMayoristas = (response) => {
  const result = { list: [], totalPages: 0, totalItems: 0 };
  if (!response) return result;
  const resp = response.data ?? response; // axios => { data: ... }

  // Caso objeto con data y opcional pagination
  if (resp && Array.isArray(resp.data)) {
    result.list = resp.data;
    if (resp.pagination) {
      result.totalPages = Number(resp.pagination.totalPages) || 0;
      result.totalItems = Number(resp.pagination.totalItems) || 0;
    }
    // Fallback: si sólo llega totalItems
    if (!result.totalPages && result.totalItems) {
      // El cálculo real depende del limit vigente; se hará en el hook
    }
    return result;
  }

  // Caso array directo
  if (Array.isArray(resp)) {
    result.list = resp;
    return result;
  }

  // Caso { mayoristas: [...] }
  if (resp && Array.isArray(resp.mayoristas)) {
    result.list = resp.mayoristas;
    return result;
  }

  return result;
};

export const useMayoristas = () => {
  const [mayoristas, setMayoristas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Paginación
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6); // por defecto 6 por página
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Clave actual para prevenir condiciones de carrera
  const getKey = (p = page, l = limit, s = search) => `${p}|${l}|${s || ""}`;
  const keyRef = useRef(getKey(1, 6, ""));

  const fetchMayoristas = useCallback(
    async (force = false, p = page, l = limit, s = search) => {
      const reqKey = getKey(p, l, s);
      keyRef.current = reqKey;
      try {
        setError(null);

        // Usar caché por clave si existe y no es forzado
        if (mayoristasCache.has(reqKey) && !force) {
          const cached = mayoristasCache.get(reqKey);
          setMayoristas(cached.list || []);
          setTotalPages(cached.totalPages || 0);
          setTotalItems(cached.totalItems || 0);
          setLoading(false);
          setIsInitialized(true);
          return cached;
        }

        // Esperar promesa en vuelo para la misma clave si existe y no es forzado
        if (mayoristasInFlight.has(reqKey) && !force) {
          setLoading(true);
          const result = await mayoristasInFlight.get(reqKey);
          if (keyRef.current === reqKey) {
            setMayoristas(result.list || []);
            const tp =
              result.totalPages ||
              (result.totalItems ? Math.ceil(result.totalItems / (l || 1)) : 0);
            setTotalPages(tp);
            setTotalItems(result.totalItems || 0);
            setLoading(false);
            setIsInitialized(true);
          }
          return result;
        }

        // Lanzar nueva petición y registrar promesa por clave
        setLoading(true);
        if (import.meta.env.DEV) {
          console.log("🔄 Cargando mayoristas desde API...", {
            page: p,
            limit: l,
            search: s,
          });
        }

        const promise = api.mayoristas
          .getMayoristas(p, l, s)
          .then((response) => normalizeMayoristas(response))
          .then((normalized) => {
            const { list, totalPages: tpRaw, totalItems: ti } = normalized;
            const tp = tpRaw || (ti ? Math.ceil(ti / (l || 1)) : 0);
            const value = { list, totalPages: tp, totalItems: ti || 0 };
            mayoristasCache.set(reqKey, value);
            return value;
          })
          .finally(() => {
            mayoristasInFlight.delete(reqKey);
          });

        mayoristasInFlight.set(reqKey, promise);

        const result = await promise;
        if (keyRef.current === reqKey) {
          setMayoristas(result.list || []);
          setTotalPages(result.totalPages || 0);
          setTotalItems(result.totalItems || 0);
          setIsInitialized(true);
        }
        return result;
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error("❌ Error al cargar mayoristas:", err);
        }
        setError("Error al cargar los mayoristas");
        setMayoristas([]);
        throw err;
      } finally {
        if (keyRef.current === reqKey) {
          setLoading(false);
        }
      }
    },
    [page, limit, search],
  );

  useEffect(() => {
    // En montaje y cuando cambie page/limit/search, cargar mayoristas
    fetchMayoristas(false, page, limit, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search]);

  const createMayorista = useCallback(async (mayoristaData) => {
    try {
      if (import.meta.env.DEV) {
        console.log("🚀 Creando mayorista...", {
          data: mayoristaData,
          apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
          environment: import.meta.env.MODE,
        });
      }

      const result = await api.mayoristas.createMayorista(mayoristaData);

      if (import.meta.env.DEV) {
        console.log("✅ Mayorista creado exitosamente:", result.data);
      }

      setMayoristas((prev) => [result.data, ...prev]);
      // Invalidar toda la caché paginada para forzar refetch consistente
      mayoristasCache.clear();
      // Aumentar totalItems si lo estábamos mostrando
      setTotalItems((ti) => (ti ? ti + 1 : ti));
      return result.data;
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
      const result = await api.mayoristas.updateMayorista(id, mayoristaData);

      setMayoristas((prev) =>
        prev.map((mayorista) =>
          mayorista.id === id ? result.data : mayorista,
        ),
      );
      // Invalidar caché para evitar inconsistencias entre páginas
      mayoristasCache.clear();
      return result.data;
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
      // Invalidar caché para evitar inconsistencias
      mayoristasCache.clear();
      // Reducir totalItems si corresponde
      setTotalItems((ti) => (ti ? Math.max(0, ti - 1) : ti));
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("Error al eliminar mayorista:", err);
      }
      throw err;
    }
  }, []);

  const getMayoristaById = useCallback(
    async (id) => {
      try {
        // Buscar primero en estado actual
        const local = (Array.isArray(mayoristas) ? mayoristas : []).find(
          (m) => m.id === id,
        );
        if (local) return local;

        // Buscar en la caché paginada
        for (const [, value] of mayoristasCache.entries()) {
          const found = (value.list || []).find((m) => m.id === id);
          if (found) return found;
        }

        // Si no está, pedir a la API
        const response = await api.mayoristas.getMayoristaById(id);
        return response.data;
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error("Error al obtener mayorista:", err);
        }
        throw err;
      }
    },
    [mayoristas],
  );

  // Controles de paginación expuestos
  const goToPage = (newPage) => {
    if (newPage >= 1 && (totalPages === 0 || newPage <= totalPages)) {
      setPage(newPage);
    }
  };
  const nextPage = () => {
    if (totalPages === 0 || page < totalPages) setPage((p) => p + 1);
  };
  const prevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };
  const setItemsPerPage = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const setSearchQuery = useCallback((value) => {
    setSearch(value || "");
    setPage(1);
  }, []);

  const refetch = (force = false) =>
    fetchMayoristas(force, page, limit, search);

  return {
    mayoristas,
    /* setMayoristas, */ loading,
    error,
    deleteMayorista,
    refetch,
    // Controles de paginación del hook
    page,
    limit,
    totalPages,
    totalItems,
    goToPage,
    setItemsPerPage,
    // búsqueda backend
    search,
    setSearch: setSearchQuery,
    createMayorista,
    updateMayorista,
    getMayoristaById,
  };
};
