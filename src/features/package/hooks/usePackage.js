import { useFetch } from "../../../hooks/useFetch";
import api from "../../../api";

export const usePackage = (identifier, isId = false) => {
  const fetchFunction = isId
    ? api.packages.getPaqueteById
    : api.packages.getPaqueteByUrl;

  const {
    data: paquete,
    loading,
    error,
  } = useFetch(fetchFunction, [identifier]);

  // Detectar acceso denegado (403)
  // error puede ser un objeto Error con response, o un string
  const accessDenied = 
    error?.response?.status === 403 || 
    error?.status === 403 ||
    (typeof error === 'object' && error?.message?.includes('403'));

  return { paquete, loading, error, accessDenied };
};
