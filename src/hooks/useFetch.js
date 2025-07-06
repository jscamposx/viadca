import { useState, useEffect, useCallback } from "react";

export function useFetch(apiFunc, params = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFunc(...params);
      setData(response.data);
    } catch (err) {
      setError(err.message || "Ocurrió un error al obtener los datos.");
    } finally {
      setLoading(false);
    }
  }, [apiFunc, ...params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error };
}
