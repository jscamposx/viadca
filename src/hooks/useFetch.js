import { useState, useEffect, useRef } from "react";

const INFLIGHT = new WeakMap();

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

      let promise = innerMap.get(paramsKey);
      if (!promise) {
        promise = (async () => {
          const response = await apiFunc(...params);
          return response;
        })()
          .catch((err) => {
            throw err;
          })
          .finally(() => {
            innerMap.delete(paramsKey);
          });
        innerMap.set(paramsKey, promise);
      }

      try {
        const response = await promise;
        if (mountedRef.current) {
          const payload =
            response?.data !== undefined ? response.data : response;
          setData(payload);
        }
      } catch (err) {
        if (mountedRef.current) {
          const msg =
            err?.message ||
            err?.response?.data?.message ||
            "Ocurrió un error al obtener los datos.";
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
