import { useFetch } from "../../../hooks/useFetch";
import api from "../../../api";

export const usePackage = (identifier, isId = false) => {
  const fetchFunction = isId ? api.packages.getPaqueteById : api.packages.getPaqueteByUrl;
  
  const {
    data: paquete,
    loading,
    error,
  } = useFetch(fetchFunction, [identifier]);

  return { paquete, loading, error };
};
