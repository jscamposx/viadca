import { useState, useEffect, useRef } from "react";
import api from "../../../api";

// Cache y control de petición en vuelo a nivel de módulo
let __allPackagesCache = null; // array o null
let __allPackagesFetchedAt = 0; // timestamp
let __inFlightPromise = null;
const TTL_MS = 60 * 1000; // 1 minuto, ajustar según necesidad

export const useAllPackages = () => {
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mountedRef = useRef(true);

  const fetchPaquetes = async (force = false) => {
    // Usar cache si existe y no está expirada y no force
    const now = Date.now();
    if (!force && __allPackagesCache && now - __allPackagesFetchedAt < TTL_MS) {
      setPaquetes(__allPackagesCache);
      setLoading(false);
      return __allPackagesCache;
    }
    setLoading(true);
    setError(null);
    try {
      if (!__inFlightPromise) {
        __inFlightPromise = api.packages.getAllPaquetes()
          .then(response => {
            let data = [];
            if (response?.data) {
              if (response.data.data) data = response.data.data || [];
              else if (Array.isArray(response.data)) data = response.data;
            }
            __allPackagesCache = data;
            __allPackagesFetchedAt = Date.now();
            return data;
          })
          .finally(() => {
            __inFlightPromise = null;
          });
      }
      const data = await __inFlightPromise;
      if (mountedRef.current) setPaquetes(data);
      return data;
    } catch (err) {
      console.error("Error fetching all paquetes:", err);
      if (mountedRef.current) {
        setError(err.message || "Error al obtener los paquetes");
        setPaquetes([]);
      }
      return [];
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaquetes();
    return () => { mountedRef.current = false; };
  }, []);

  return { paquetes, setPaquetes, loading, error, refetchAllPaquetes: fetchPaquetes };
};
