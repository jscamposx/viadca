import { useState, useEffect } from "react";

export function useFetch(apiFunc, params = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    const shouldSkipFetch = params.some((p) => p === null || p === undefined);

    if (shouldSkipFetch) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiFunc(...params);
        if (isMounted) {
          setData(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Ocurrió un error al obtener los datos.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [apiFunc, paramsKey]);

  return { data, setData, loading, error };
}
