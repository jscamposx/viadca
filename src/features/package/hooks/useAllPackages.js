import { useFetch } from "../../../hooks/useFetch";
import api from "../../../api";

export const useAllPackages = () => {
  // Asegúrate de que useFetch devuelva 'setData' para poder modificar el estado
  const { data: paquetes, setData: setPaquetes, loading, error } = useFetch(api.packages.getPaquetes);

  return { paquetes, setPaquetes, loading, error };
};