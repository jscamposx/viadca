import { useState, useEffect, useRef, useCallback } from "react";
import api from "../../../api";

// Caché e in-flight por combinación page|limit a nivel de módulo
const paquetesCache = new Map(); // key -> { data, totalPages, totalItems }
const paquetesInFlight = new Map(); // key -> Promise<{ data, totalPages, totalItems }>

export const usePaginatedPackages = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const keyRef = useRef(`${initialPage}|${initialLimit}`);
  const getKey = (p = page, l = limit) => `${p}|${l}`;

  // Inicializar desde caché si existe
  const cached = paquetesCache.get(keyRef.current);
  const [paquetes, setPaquetes] = useState(cached?.data || []);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(cached?.totalPages || 0);
  const [totalItems, setTotalItems] = useState(cached?.totalItems || 0);

  const normalizeResponse = (response) => {
    let data = [];
    let totalPages = 0;
    let totalItems = 0;

    if (response?.data) {
      if (response.data.data && response.data.pagination) {
        data = response.data.data || [];
        totalPages = response.data.pagination.totalPages || 0;
        totalItems = response.data.pagination.totalItems || 0;
      } else if (response.data.data) {
        data = response.data.data || [];
      } else if (Array.isArray(response.data)) {
        data = response.data;
      }
    }

    return { data, totalPages, totalItems };
  };

  const fetchPaquetes = useCallback(
    async (currentPage = page, currentLimit = limit, force = false) => {
      const reqKey = getKey(currentPage, currentLimit);
      keyRef.current = reqKey;

      try {
        setError(null);

        // Usar caché si existe y no es forzado
        if (paquetesCache.has(reqKey) && !force) {
          const cachedVal = paquetesCache.get(reqKey);
          setPaquetes(cachedVal.data);
          setTotalPages(cachedVal.totalPages || 0);
          setTotalItems(cachedVal.totalItems || 0);
          setLoading(false);
          return cachedVal;
        }

        // Si existe una promesa en vuelo para esta clave y no es forzado, esperarla
        if (paquetesInFlight.has(reqKey) && !force) {
          setLoading(true);
          const result = await paquetesInFlight.get(reqKey);
          // Solo actualizar estado si seguimos en la misma clave
          if (keyRef.current === reqKey) {
            setPaquetes(result.data);
            setTotalPages(result.totalPages || 0);
            setTotalItems(result.totalItems || 0);
            setLoading(false);
          }
          return result;
        }

        // Lanzar nueva petición y deduplicar concurrentes
        setLoading(true);
        const promise = api.packages
          .getPaquetes(currentPage, currentLimit)
          .then(normalizeResponse)
          .then((result) => {
            paquetesCache.set(reqKey, result);
            return result;
          })
          .finally(() => {
            paquetesInFlight.delete(reqKey);
          });

        paquetesInFlight.set(reqKey, promise);

        const result = await promise;
        if (keyRef.current === reqKey) {
          setPaquetes(result.data);
          setTotalPages(result.totalPages || 0);
          setTotalItems(result.totalItems || 0);
        }
        return result;
      } catch (err) {
        console.error("Error fetching paquetes:", err);
        setError(err.message || "Error al obtener los paquetes");
        setPaquetes([]);
        throw err;
      } finally {
        if (keyRef.current === getKey(currentPage, currentLimit)) {
          setLoading(false);
        }
      }
    },
    [page, limit],
  );

  useEffect(() => {
    fetchPaquetes(page, limit);
  }, [page, limit, fetchPaquetes]);

  const goToPage = (newPage) => {
    if (newPage >= 1 && (totalPages === 0 || newPage <= totalPages)) {
      setPage(newPage);
    }
  };

  const nextPage = () => {
    if (totalPages === 0 || page < totalPages) {
      setPage((p) => p + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage((p) => p - 1);
    }
  };

  const setItemsPerPage = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  const refetch = (force = false) => fetchPaquetes(page, limit, force);

  return {
    paquetes,
    setPaquetes,
    loading,
    error,
    page,
    limit,
    totalPages,
    totalItems,
    goToPage,
    nextPage,
    prevPage,
    setItemsPerPage,
    refetch,
  };
};
