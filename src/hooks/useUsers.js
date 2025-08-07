import { useState, useEffect } from 'react';
import authService from '../api/authService';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Obtener todos los usuarios
  const fetchUsers = async (params = {}, force = false) => {
    // Evitar múltiples peticiones si ya se inicializó y no es forzado
    if (isInitialized && !force && Object.keys(params).length === 0) {
      return users;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await authService.getAllUsers(params);
      setUsers(data);
      if (Object.keys(params).length === 0) {
        setIsInitialized(true);
      }
      return data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      const errorMessage = error.response?.data?.message || 'Error al cargar usuarios';
      setError(errorMessage);
      // No lanzar el error para evitar excepciones no capturadas
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Obtener estadísticas
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.getUserStats();
      setStats(data);
      return data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      const errorMessage = error.response?.data?.message || 'Error al cargar estadísticas';
      setError(errorMessage);
      // No lanzar el error para evitar excepciones no capturadas
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Obtener usuario por ID
  const getUserById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.getUserById(id);
      return data;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      const errorMessage = error.response?.data?.message || 'Error al cargar usuario';
      setError(errorMessage);
      // No lanzar el error para evitar excepciones no capturadas
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar rol de usuario
  const updateUserRole = async (id, role) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.updateUserRole(id, role);
      
      // Actualizar en la lista local
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === id ? { ...user, rol: role } : user
        )
      );
      
      return data;
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      const errorMessage = error.response?.data?.message || 'Error al actualizar rol';
      setError(errorMessage);
      // No lanzar el error para evitar excepciones no capturadas
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar usuario (soft delete)
  const deleteUser = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.softDeleteUser(id);
      
      // Remover de la lista local
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
      
      return data;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      const errorMessage = error.response?.data?.message || 'Error al eliminar usuario';
      setError(errorMessage);
      // No lanzar el error para evitar excepciones no capturadas
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Refrescar datos
  const refresh = async () => {
    try {
      await Promise.all([
        fetchUsers(),
        fetchStats()
      ]);
    } catch (error) {
      console.error('Error al refrescar datos:', error);
      // No lanzar error ya que fetchUsers y fetchStats ya manejan sus errores
    }
  };

  return {
    users,
    stats,
    loading,
    error,
    fetchUsers,
    fetchStats,
    getUserById,
    updateUserRole,
    deleteUser,
    refresh
  };
};
