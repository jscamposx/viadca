import { useFetch } from "./useFetch";
import api from "../api";

export const useAllPackages = () => {
  const { data: paquetes, loading, error } = useFetch(api.packages.getPaquetes);

  return { paquetes, loading, error };
};
