import { useState, useEffect } from "react";
import api from "../../../api";

export const useAllPackages = () => {
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPaquetes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.packages.getAllPaquetes();
      
      if (response.data) {
        // Nueva estructura de respuesta con paginación
        if (response.data.data) {
          setPaquetes(response.data.data || []);
        } else if (Array.isArray(response.data)) {
          // Fallback para respuesta directa como array
          setPaquetes(response.data);
        } else {
          setPaquetes([]);
        }
      } else {
        setPaquetes([]);
      }
    } catch (err) {
      console.error("Error fetching all paquetes:", err);
      setError(err.message || "Error al obtener los paquetes");
      setPaquetes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaquetes();
  }, []);

  return { paquetes, setPaquetes, loading, error };
};
