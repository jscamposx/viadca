import { useState, useEffect, useRef } from "react";
import authService from "../api/authService";

let usersCache = null;
let usersCacheKey = null;
let usersInFlight = null;
let usersInFlightKey = null;

let statsCache = null;
let statsInFlight = null;

const setCacheUsers = (data, key) => {
  usersCache = Array.isArray(data) ? data : [];
  usersCacheKey = key || null;
};
const clearUsersCache = () => setCacheUsers([], null);
const setCacheStats = (data) => {
  statsCache = data || null;
};
const clearStatsCache = () => setCacheStats(null);

const normalizeUsersResult = (resp) => {
  let list = [];
  let totalPages = 0;
  let totalItems = 0;

  if (Array.isArray(resp)) {
    list = resp;
  } else if (resp && typeof resp === "object") {
    if (Array.isArray(resp.data)) {
      list = resp.data;
      if (resp.pagination) {
        totalPages = Number(resp.pagination.totalPages) || 0;
        totalItems = Number(resp.pagination.totalItems) || 0;
      }
    } else if (Array.isArray(resp.users)) {
      list = resp.users;
    }
  }

  return { list, totalPages, totalItems };
};

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");

  const inFlightUsersRef = useRef(null);
  const inFlightUsersKeyRef = useRef(null);
  const inFlightStatsRef = useRef(null);

  const keyRef = useRef(JSON.stringify({ page: 1, limit: 6, search: "" }));

  const fetchUsers = async (params = {}, force = false) => {
    const effectiveParams = Object.keys(params || {}).length
      ? params
      : { page, limit, search };
    const key = JSON.stringify(effectiveParams);
    keyRef.current = key;

    if (!force && usersCache && usersCacheKey === key) {
      if (!isInitialized) setIsInitialized(true);
      setUsers(usersCache);
      return usersCache;
    }

    if (!force && usersInFlight && usersInFlightKey === key) {
      try {
        const data = await usersInFlight;
        let {
          list,
          totalPages: tp,
          totalItems: ti,
        } = normalizeUsersResult(data);

        if (!tp && ti)
          tp = Math.ceil(ti / (effectiveParams.limit || limit || 1));
        if (keyRef.current === key) {
          setUsers(list);
          setTotalPages(tp);
          setTotalItems(ti);
          if (!isInitialized) setIsInitialized(true);
        }
        return list;
      } catch (_) {}
    }

    if (
      !force &&
      inFlightUsersRef.current &&
      inFlightUsersKeyRef.current === key
    ) {
      try {
        const data = await inFlightUsersRef.current;
        let {
          list,
          totalPages: tp,
          totalItems: ti,
        } = normalizeUsersResult(data);
        if (!tp && ti)
          tp = Math.ceil(ti / (effectiveParams.limit || limit || 1));
        if (keyRef.current === key) {
          setUsers(list);
          setTotalPages(tp);
          setTotalItems(ti);
          if (!isInitialized) setIsInitialized(true);
        }
        return list;
      } catch (_) {}
    }

    try {
      setLoading(true);
      setError(null);
      const promise = authService.getAllUsers(effectiveParams);

      usersInFlight = promise;
      usersInFlightKey = key;
      inFlightUsersRef.current = promise;
      inFlightUsersKeyRef.current = key;

      const data = await promise;
      let { list, totalPages: tp, totalItems: ti } = normalizeUsersResult(data);
      if (!tp && ti) tp = Math.ceil(ti / (effectiveParams.limit || limit || 1));
      setCacheUsers(list, key);
      if (keyRef.current === key) {
        setUsers(list);
        setTotalPages(tp);
        setTotalItems(ti);
        if (
          Object.keys(effectiveParams).length === 0 ||
          (effectiveParams.page === 1 &&
            effectiveParams.limit === 6 &&
            (effectiveParams.search ?? "") === "")
        ) {
          setIsInitialized(true);
        }
      }
      return list;
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

  useEffect(() => {
    fetchUsers({ page, limit, search });
  }, [page, limit, search]);

  const fetchStats = async (force = false) => {
    if (!force && statsCache) {
      setStats(statsCache);
      return statsCache;
    }

    if (!force && statsInFlight) {
      try {
        const data = await statsInFlight;
        setStats(data);
        return data;
      } catch (_) {}
    }

    if (!force && inFlightStatsRef.current) {
      try {
        const data = await inFlightStatsRef.current;
        setStats(data);
        return data;
      } catch (_) {}
    }

    try {
      setLoading(true);
      setError(null);
      const promise = authService.getUserStats();

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

  const getUserById = async (id) => {
    try {
      setLoading(true);
      setError(null);

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

  const updateUserRole = async (id, role) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.updateUserRole(id, role);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, rol: role } : user,
        ),
      );

      if (Array.isArray(usersCache)) {
        setCacheUsers(
          usersCache.map((u) => (u.id === id ? { ...u, rol: role } : u)),
          usersCacheKey,
        );
      }

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

  const deleteUser = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.softDeleteUser(id);

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));

      if (Array.isArray(usersCache)) {
        setCacheUsers(
          usersCache.filter((u) => u.id !== id),
          usersCacheKey,
        );
      }

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

  const refresh = async () => {
    try {
      await Promise.all([
        fetchUsers({ page, limit, search }, true),
        fetchStats(true),
      ]);
    } catch (error) {
      console.error("Error al refrescar datos:", error);
    }
  };

  const goToPage = (newPage) => {
    if (newPage >= 1 && (totalPages === 0 || newPage <= totalPages)) {
      setPage(newPage);
    }
  };
  const nextPage = () => {
    if (totalPages === 0 || page < totalPages) setPage((p) => p + 1);
  };
  const prevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };
  const setItemsPerPage = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const setSearchQuery = (value) => {
    setSearch(value || "");
    setPage(1);
  };

  return {
    users,
    stats,
    loading,
    error,
    page,
    limit,
    totalPages,
    totalItems,
    fetchUsers,
    fetchStats,
    getUserById,
    updateUserRole,
    deleteUser,
    refresh,
    goToPage,
    nextPage,
    prevPage,
    setItemsPerPage,
    search,
    setSearch: setSearchQuery,
  };
};
