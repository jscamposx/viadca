import { useFetch } from "../../../hooks/useFetch";
import api from "../../../api";

export const useAllPackages = () => {
  const { data: paquetes, loading, error } = useFetch(api.packages.getPaquetes);

  return { paquetes, loading, error };
};
