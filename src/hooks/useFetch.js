import { useState, useEffect, useRef } from "react";

// Caché de promesas en vuelo por (apiFunc, paramsKey)
const INFLIGHT = new WeakMap(); // apiFunc => Map(paramsKey => Promise)

export function useFetch(apiFunc, params = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const paramsKey = JSON.stringify(params);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const shouldSkipFetch = params.some((p) => p === null || p === undefined);

    if (shouldSkipFetch) {
      setLoading(false);
      return;
    }

    let innerMap = INFLIGHT.get(apiFunc);
    if (!innerMap) {
      innerMap = new Map();
      INFLIGHT.set(apiFunc, innerMap);
    }

    const doRequest = async () => {
      setLoading(true);
      setError(null);

      // Reutilizar promesa en vuelo si existe
      let promise = innerMap.get(paramsKey);
      if (!promise) {
        promise = (async () => {
          const response = await apiFunc(...params);
          return response;
        })()
          .catch((err) => {
            // Propagar error tal cual
            throw err;
          })
          .finally(() => {
            // Limpiar entrada cuando termina (éxito/error)
            innerMap.delete(paramsKey);
          });
        innerMap.set(paramsKey, promise);
      }

      try {
        const response = await promise;
        if (mountedRef.current) {
          // Compatibilidad: si apiFunc ya devuelve .data, usa eso; si no, intenta response.data
          const payload = response?.data !== undefined ? response.data : response;
          setData(payload);
        }
      } catch (err) {
        if (mountedRef.current) {
          const msg = err?.message || err?.response?.data?.message || "Ocurrió un error al obtener los datos.";
          setError(msg);
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    doRequest();
  }, [apiFunc, paramsKey]);

  return { data, setData, loading, error };
}
