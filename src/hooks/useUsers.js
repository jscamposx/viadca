import { useState, useEffect, useRef } from "react";
import authService from "../api/authService";

// Caché y promesas en vuelo a nivel de módulo para deduplicar entre montajes/componentes
let usersCache = null; // Array de usuarios
let usersCacheKey = null; // Key JSON.stringify(params)
let usersInFlight = null; // Promise
let usersInFlightKey = null; // Key asociada a la promesa

let statsCache = null; // Objeto de estadísticas
let statsInFlight = null; // Promise

const setCacheUsers = (data, key) => {
  usersCache = Array.isArray(data) ? data : [];
  usersCacheKey = key || null;
};
const clearUsersCache = () => setCacheUsers([], null);
const setCacheStats = (data) => {
  statsCache = data || null;
};
const clearStatsCache = () => setCacheStats(null);

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Deduplicación de peticiones en vuelo por instancia (respaldo)
  const inFlightUsersRef = useRef(null);
  const inFlightUsersKeyRef = useRef(null);
  const inFlightStatsRef = useRef(null);

  // Obtener todos los usuarios con caché global y promesa en vuelo
  const fetchUsers = async (params = {}, force = false) => {
    const key = JSON.stringify(params || {});

    // Si hay caché global válida y no es forzado, úsala
    if (!force && usersCache && usersCacheKey === key) {
      if (!isInitialized) setIsInitialized(true);
      // sincroniza estado local sin disparar nueva petición
      setUsers(usersCache);
      return usersCache;
    }

    // Reutilizar promesa en vuelo global si coincide la key y no es forzado
    if (!force && usersInFlight && usersInFlightKey === key) {
      try {
        const data = await usersInFlight;
        setUsers(data);
        if (!isInitialized) setIsInitialized(true);
        return data;
      } catch (_) {
        // caer al flujo de abajo
      }
    }

    // Respaldo: reutilizar promesa en vuelo por instancia si coincide la key y no es forzado
    if (!force && inFlightUsersRef.current && inFlightUsersKeyRef.current === key) {
      try {
        const data = await inFlightUsersRef.current;
        setUsers(data);
        if (!isInitialized) setIsInitialized(true);
        return data;
      } catch (_) {
        // seguirá flujo de abajo si falla
      }
    }

    try {
      setLoading(true);
      setError(null);
      const promise = authService.getAllUsers(params);
      // Guardar promesa en vuelo global e instancia
      usersInFlight = promise;
      usersInFlightKey = key;
      inFlightUsersRef.current = promise;
      inFlightUsersKeyRef.current = key;

      const data = await promise;
      setCacheUsers(data, key);
      setUsers(data);
      if (Object.keys(params).length === 0) {
        setIsInitialized(true);
      }
      return data;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      const errorMessage =
        error.response?.data?.message || "Error al cargar usuarios";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
      usersInFlight = null;
      usersInFlightKey = null;
      inFlightUsersRef.current = null;
      inFlightUsersKeyRef.current = null;
    }
  };

  // Obtener estadísticas con caché global y promesa en vuelo
  const fetchStats = async (force = false) => {
    // Usar caché si existe y no es forzado
    if (!force && statsCache) {
      setStats(statsCache);
      return statsCache;
    }

    // Reutilizar promesa en vuelo global si existe y no es forzado
    if (!force && statsInFlight) {
      try {
        const data = await statsInFlight;
        setStats(data);
        return data;
      } catch (_) {
        // continuar
      }
    }

    // Respaldo por instancia
    if (!force && inFlightStatsRef.current) {
      try {
        const data = await inFlightStatsRef.current;
        setStats(data);
        return data;
      } catch (_) {
        // continuar
      }
    }

    try {
      setLoading(true);
      setError(null);
      const promise = authService.getUserStats();
      // Guardar promesa en vuelo global e instancia
      statsInFlight = promise;
      inFlightStatsRef.current = promise;
      const data = await promise;
      setCacheStats(data);
      setStats(data);
      return data;
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      const errorMessage =
        error.response?.data?.message || "Error al cargar estadísticas";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
      statsInFlight = null;
      inFlightStatsRef.current = null;
    }
  };

  // Obtener usuario por ID (opcionalmente usar caché local si está)
  const getUserById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      // Intentar resolver desde caché primero
      const fromCache = Array.isArray(usersCache)
        ? usersCache.find((u) => u.id === id)
        : null;
      if (fromCache) return fromCache;

      const data = await authService.getUserById(id);
      return data;
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      const errorMessage =
        error.response?.data?.message || "Error al cargar usuario";
      setError(errorMessage);
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
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === id ? { ...user, rol: role } : user)),
      );
      // Actualizar caché global
      if (Array.isArray(usersCache)) {
        setCacheUsers(
          usersCache.map((u) => (u.id === id ? { ...u, rol: role } : u)),
          usersCacheKey,
        );
      }
      // Invalidar estadísticas (se recomputarán en siguiente fetch)
      clearStatsCache();

      return data;
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      const errorMessage =
        error.response?.data?.message || "Error al actualizar rol";
      setError(errorMessage);
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
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      // Remover de la caché global
      if (Array.isArray(usersCache)) {
        setCacheUsers(usersCache.filter((u) => u.id !== id), usersCacheKey);
      }
      // Invalidar estadísticas
      clearStatsCache();

      return data;
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      const errorMessage =
        error.response?.data?.message || "Error al eliminar usuario";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Refrescar datos
  const refresh = async () => {
    try {
      await Promise.all([fetchUsers({}, true), fetchStats(true)]);
    } catch (error) {
      console.error("Error al refrescar datos:", error);
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
    refresh,
  };
};
