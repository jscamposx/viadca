import { useState, useEffect } from "react";
import api from "../../../api";

export const usePaginatedPackages = (initialPage = 1, initialLimit = 10) => {
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const fetchPaquetes = async (currentPage = page, currentLimit = limit) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.packages.getPaquetes(currentPage, currentLimit);
      
      if (response.data) {
        // Nueva estructura de respuesta con paginación
        if (response.data.data && response.data.pagination) {
          setPaquetes(response.data.data || []);
          setTotalPages(response.data.pagination.totalPages || 0);
          setTotalItems(response.data.pagination.totalItems || 0);
        } else if (response.data.data) {
          // Fallback para respuesta con data pero sin pagination
          setPaquetes(response.data.data || []);
        } else if (Array.isArray(response.data)) {
          // Fallback para respuesta directa como array
          setPaquetes(response.data);
        } else {
          setPaquetes([]);
        }
      } else {
        setPaquetes([]);
      }
    } catch (err) {
      console.error("Error fetching paquetes:", err);
      setError(err.message || "Error al obtener los paquetes");
      setPaquetes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaquetes();
  }, [page, limit]);

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const setItemsPerPage = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

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
    refetch: fetchPaquetes
  };
};
