import { useState, useCallback } from 'react';

/**
 * Hook para gestionar filtros dinámicos
 * Compatible con el sistema de filtros dinámicos del backend
 * 
 * @example
 * const { filters, setFilter, removeFilter, clearFilters, hasActiveFilters } = useDynamicFilters();
 * 
 * // Agregar filtro
 * setFilter('activo', true);
 * setFilter('mayorista', 'Viajes');
 * setFilter('moneda', 'USD');
 * 
 * // Remover filtro
 * removeFilter('activo');
 * 
 * // Limpiar todos
 * clearFilters();
 */
export const useDynamicFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);

  /**
   * Establece un filtro
   * Si el valor es undefined, null o '', remueve el filtro
   */
  const setFilter = useCallback((key, value) => {
    setFilters(prev => {
      // Si el valor es vacío, remover el filtro
      if (value === undefined || value === null || value === '') {
        const newFilters = { ...prev };
        delete newFilters[key];
        return newFilters;
      }
      
      // Agregar/actualizar filtro
      return { ...prev, [key]: value };
    });
  }, []);

  /**
   * Remueve un filtro específico
   */
  const removeFilter = useCallback((key) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  /**
   * Limpia todos los filtros
   */
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  /**
   * Establece múltiples filtros a la vez
   */
  const setMultipleFilters = useCallback((newFilters) => {
    setFilters(prev => {
      const merged = { ...prev };
      
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          delete merged[key];
        } else {
          merged[key] = value;
        }
      });
      
      return merged;
    });
  }, []);

  /**
   * Indica si hay filtros activos
   */
  const hasActiveFilters = Object.keys(filters).length > 0;

  /**
   * Cuenta de filtros activos
   */
  const activeFiltersCount = Object.keys(filters).length;

  /**
   * Construye params para axios/fetch
   * Limpia valores vacíos
   */
  const buildParams = useCallback((additionalParams = {}) => {
    const params = { ...additionalParams };
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params[key] = value;
      }
    });

    return params;
  }, [filters]);

  return {
    filters,
    setFilter,
    removeFilter,
    clearFilters,
    setMultipleFilters,
    hasActiveFilters,
    activeFiltersCount,
    buildParams,
  };
};

/**
 * Función helper para construir params de filtros dinámicos
 * Útil cuando no necesitas el hook completo
 */
export const buildDynamicFilters = (filtros) => {
  const params = {};
  
  Object.entries(filtros).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    
    // Para strings, limpiar espacios
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed) params[key] = trimmed;
    } else {
      params[key] = value;
    }
  });

  // Si hay filtros activos, desactivar paginación
  if (Object.keys(params).length > 0) {
    params.noPagination = true;
  }

  return params;
};
