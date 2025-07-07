import { useFetch } from "./useFetch";
import api from "../api";

export const usePackage = (url) => {
  const {
    data: paquete,
    loading,
    error,
  } = useFetch(api.packages.getPaqueteByUrl, [url]);

  return { paquete, loading, error };
};
