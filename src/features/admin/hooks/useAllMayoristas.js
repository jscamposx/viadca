import { useState, useEffect } from "react";
import api from "../../../api";

// Hook para cargar TODOS los mayoristas sin paginación (para filtros rápidos)
export const useAllMayoristas = () => {
  const [mayoristas, setMayoristas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllMayoristas = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('📥 Cargando TODOS los mayoristas para filtros...');
        
        const response = await api.mayoristas.getAllMayoristas();
        
        // Normalizar respuesta
        let data = [];
        if (response?.data?.data && Array.isArray(response.data.data)) {
          data = response.data.data;
        } else if (Array.isArray(response?.data)) {
          data = response.data;
        }
        
        console.log('✅ Mayoristas cargados para filtros:', data.length);
        setMayoristas(data);
      } catch (err) {
        console.error('❌ Error al cargar mayoristas para filtros:', err);
        setError(err.message || 'Error al cargar mayoristas');
        setMayoristas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllMayoristas();
  }, []); // Solo cargar una vez al montar

  return { mayoristas, loading, error };
};
