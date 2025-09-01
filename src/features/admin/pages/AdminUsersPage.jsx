import {
  useState,
  useEffect,
  useMemo,
  lazy,
  Suspense,
  useDeferredValue,
  useRef,
} from "react";
import { useUsers } from "../../../hooks/useUsers";
import { useAuth } from "../../../contexts/AuthContext";
import { useNotifications } from "../hooks/useNotifications";
const ConfirmDialog = lazy(() => import("../components/ConfirmDialog"));
const UserCard = lazy(() => import("../components/UserCard"));
import Pagination from "../../../components/ui/Pagination";

import {
  FiUsers,
  FiSearch,
  FiFilter,
  FiMoreVertical,
  FiTrash2,
  FiRotateCcw,
  FiAlertTriangle,
  FiShield,
  FiUser,
  FiMail,
  FiCalendar,
  FiRefreshCw,
  FiTrendingUp,
  FiCheckCircle,
  FiClock,
  FiX,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";

const AdminUsersPage = () => {
  const { user: currentUser } = useAuth();
  const { notify } = useNotifications();
  const {
    users,
    stats,
    loading,
    error,
    fetchUsers,
    fetchStats,
    updateUserRole,
    deleteUser,
    refresh,
    // Paginación
    page,
    limit,
    totalPages,
    totalItems,
    goToPage,
    setItemsPerPage,
    // búsqueda backend
    search,
    setSearch,
  } = useUsers();

  // Evitar doble montaje/llamadas en StrictMode (dev) para la carga inicial
  const didInitRef = useRef(false);

  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearch = useDeferredValue(searchTerm);
  const [roleFilter, setRoleFilter] = useState("todos");
  const [verificationFilter, setVerificationFilter] = useState("todos");
  const [sortConfig, setSortConfig] = useState({
    key: "usuario",
    direction: "asc",
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: "",
    user: null,
    newRole: null,
  });

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    // Evitar doble carga de usuarios: el hook ya hace fetch inicial.
    // Solo obtenemos stats aquí.
    fetchStats().catch((e) => {
      console.error("Error en carga inicial de estadísticas de usuarios:", e);
    });
  }, []);

  // Estado de carga inicial para evitar bloquear el layout (mejora LCP)
  const isInitialLoading = loading && users.length === 0;

  // Función para limpiar todos los filtros
  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("todos");
    setVerificationFilter("todos");
    setSortConfig({ key: "usuario", direction: "asc" });
    setIsFiltersOpen(false);
    setIsSortMenuOpen(false);
  };

  // Función para manejar ordenamiento
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setIsSortMenuOpen(false); // Cerrar el menú después de seleccionar
  };

  // Función para verificar si el usuario está verificado (unificada y robusta)
  const isUserVerified = (user) => {
    if (!user || typeof user !== "object") return false;

    const truthy = (val) => [true, "true", 1, "1"].includes(val);
    const falsy = (val) =>
      [false, "false", 0, "0", null, undefined, ""].includes(val);

    // Campos booleanos / flags posibles
    const booleanFlags = [
      user.email_verificado, // variante español snake
      user.emailVerificado, // camel español
      user.email_verified, // english snake
      user.emailVerified, // english camel
      user.verificado, // genérico
      user.isVerified,
      user.verified,
    ];

    for (const flag of booleanFlags) {
      if (truthy(flag)) return true;
      if (falsy(flag)) continue; // ignora explícitos false para seguir buscando otra evidencia
    }

    // Campos fecha/timestamp de verificación
    const dateCandidates = [
      user.email_verified_at,
      user.emailVerificadoEn,
      user.email_verificado_en,
      user.fecha_verificacion,
      user.fechaVerificacion,
    ];
    for (const val of dateCandidates) {
      if (!val) continue;
      if (val instanceof Date && !isNaN(val.getTime())) return true;
      if (typeof val === "number" && val > 0) return true;
      if (typeof val === "string") {
        const d = new Date(val);
        if (!isNaN(d.getTime())) return true;
      }
    }

    return false; // por defecto no verificado
  };

  // Estadísticas efectivas con datos calculados localmente si no hay stats del backend
  const effectiveStats = stats || {
    total: users.length,
    porRol: users.reduce((acc, user) => {
      const rol = user.rol || "sin-rol";
      acc[rol] = (acc[rol] || 0) + 1;
      return acc;
    }, {}),
    verificados: users.filter(isUserVerified).length,
    pendientes: users.filter((user) => !isUserVerified(user)).length,
  };

  // Calcular contadores específicos para garantizar que siempre tengan valores
  const adminCount = users.filter((user) => user.rol === "admin").length;
  const preAuthCount = users.filter(
    (user) => user.rol === "pre-autorizado",
  ).length;
  const userCount = users.filter((user) => user.rol === "usuario").length;
  const verifiedCount = users.filter((user) => isUserVerified(user)).length;

  // Skeleton de tarjetas de usuario para carga inicial (evitar pantalla en blanco y CLS)
  const renderSkeletonCards = (count = 8) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6 [content-visibility:auto] [contain-intrinsic-size:600px_900px]">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 sm:p-5 animate-pulse min-h-[220px]"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gray-200" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2" />
          <div className="h-3 bg-gray-200 rounded w-5/6 mb-4" />
          <div className="flex gap-2 mt-auto">
            <div className="h-9 bg-gray-200 rounded-xl w-20" />
            <div className="h-9 bg-gray-200 rounded-xl w-24" />
          </div>
        </div>
      ))}
    </div>
  );

  // Filtrar usuarios (memoizado para reducir trabajo en el primer render)
  const filteredUsers = useMemo(() => {
    const list = users
      .filter((user) => {
        // La búsqueda se delega al backend, no filtrar por deferredSearch aquí.
        const matchesSearch = true;

        const matchesRole = roleFilter === "todos" || user.rol === roleFilter;

        const matchesVerification =
          verificationFilter === "todos" ||
          (verificationFilter === "verificado" && isUserVerified(user)) ||
          (verificationFilter === "pendiente" && !isUserVerified(user));

        return matchesSearch && matchesRole && matchesVerification;
      })
      .sort((a, b) => {
        const { key, direction } = sortConfig;
        let aVal = a[key];
        let bVal = b[key];

        if (key === "fechaCreacion") {
          aVal = new Date(
            a.fecha_creacion || a.fechaCreacion || a.created_at || 0,
          );
          bVal = new Date(
            b.fecha_creacion || b.fechaCreacion || b.created_at || 0,
          );
        }

        if (!(aVal instanceof Date)) {
          aVal = String(aVal || "").toLowerCase();
          bVal = String(bVal || "").toLowerCase();
        }

        if (aVal < bVal) return direction === "asc" ? -1 : 1;
        if (aVal > bVal) return direction === "asc" ? 1 : -1;
        return 0;
      });

    return list;
  }, [users, /*deferredSearch,*/ roleFilter, verificationFilter, sortConfig]);

  const confirmRoleChange = async () => {
    try {
      if (!confirmDialog.user?.id || !confirmDialog.newRole) {
        throw new Error("Datos de usuario o rol inválidos");
      }

      await notify.operation(
        () => updateUserRole(confirmDialog.user.id, confirmDialog.newRole),
        {
          loadingMessage: `Actualizando rol de "${confirmDialog.user.usuario}" a ${confirmDialog.newRole}...`,
          successMessage: `Rol de "${confirmDialog.user.usuario}" actualizado a ${confirmDialog.newRole}`,
          errorMessage: "Error al cambiar el rol del usuario",
          loadingTitle: "Actualizando usuario",
          successTitle: "Usuario actualizado",
          errorTitle: "Error al actualizar",
        },
      );

      setConfirmDialog({ isOpen: false, type: "", user: null, newRole: null });
      setShowActionMenu(null);
      // Actualizar estadísticas después del cambio
      fetchStats();
    } catch (error) {
      console.error("Error al cambiar el rol del usuario:", error);
      // El error ya se maneja en notify.operation
    }
  };

  const handleRoleChange = (user, newRole) => {
    // Validación de datos
    if (!user || !user.id) {
      console.error("Usuario inválido o sin ID:", user);
      notify.error("Error: Usuario inválido", { title: "Error de validación" });
      return;
    }

    if (!newRole) {
      console.error("Rol inválido:", newRole);
      notify.error("Error: Rol inválido", { title: "Error de validación" });
      return;
    }

    if (newRole === "admin") {
      setConfirmDialog({
        isOpen: true,
        type: "role-admin",
        user,
        newRole,
      });
    } else {
      // Para otros roles, hacer el cambio directamente usando los parámetros
      notify
        .operation(() => updateUserRole(user.id, newRole), {
          loadingMessage: `Actualizando rol de "${user.usuario}" a ${newRole}...`,
          successMessage: `Rol de "${user.usuario}" actualizado a ${newRole}`,
          errorMessage: "Error al cambiar el rol del usuario",
          loadingTitle: "Actualizando usuario",
          successTitle: "Usuario actualizado",
          errorTitle: "Error al actualizar",
        })
        .then(() => {
          setShowActionMenu(null);
          fetchStats();
        })
        .catch((error) => {
          console.error("Error al cambiar el rol del usuario:", error);
          // El error ya se maneja en notify.operation
        });
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const userToDelete = users.find((u) => u.id === userId);
      const userName = userToDelete?.usuario || "usuario";

      await notify.operation(() => deleteUser(userId), {
        loadingMessage: `Moviendo "${userName}" a la papelera...`,
        successMessage: `"${userName}" movido a la papelera`,
        errorMessage: "Error al eliminar usuario",
        loadingTitle: "Eliminando usuario",
        successTitle: "Usuario eliminado",
        errorTitle: "Error al eliminar",
      });

      setConfirmDialog({ isOpen: false, type: "", user: null, newRole: null });
      setShowActionMenu(null);
      // Actualizar estadísticas después de la eliminación
      fetchStats();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      // El error ya se maneja en notify.operation
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "pre-autorizado":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <FiShield className="w-3 h-3" />;
      case "pre-autorizado":
        return <FiUsers className="w-3 h-3" />;
      default:
        return <FiUser className="w-3 h-3" />;
    }
  };

  useEffect(() => {
    // Evitar setSearch redundante que causaría un segundo fetch inmediato.
    if ((deferredSearch || "") !== (search || "")) {
      setSearch(deferredSearch || "");
    }
  }, [deferredSearch, setSearch, search]);

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-5 lg:p-6 xl:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md border border-gray-100 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="text-center sm:text-left lg:text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Gestión de Usuarios
              </h1>
              {/* Texto de soporte con skeleton para carga inicial */}
              {isInitialLoading ? (
                <div className="mt-2 h-4 sm:h-5 w-48 sm:w-64 bg-gray-200 rounded animate-pulse mx-auto sm:mx-0" />
              ) : (
                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                  Administra todos los usuarios del sistema (
                  {effectiveStats?.total || 0} total)
                </p>
              )}
            </div>

            <button
              onClick={() => {
                refresh(); // Forzar actualización unificada (sin notificaciones)
              }}
              className="w-full sm:w-auto lg:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-semibold py-3 px-5 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-xl text-sm sm:text-base whitespace-nowrap"
              disabled={loading}
            >
              <FiRefreshCw
                className={`${loading ? "animate-spin" : ""} w-4 h-4 sm:w-5 sm:h-5`}
              />
              <span>Actualizar</span>
            </button>
          </div>
        </div>

        {/* Contenedor principal unificado */}
        <div className="bg-gradient-to-br from-white/95 via-purple-50/30 to-blue-50/30 backdrop-blur-sm border border-white/40 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
          <div className="space-y-3 sm:space-y-4">
            {/* Búsqueda principal */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <FiSearch className="text-purple-400 text-base sm:text-lg" />
              </div>
              <input
                placeholder="Buscar por usuario, email o rol..."
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg sm:rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm bg-purple-50/50 font-medium shadow-md focus:shadow-lg transition-all duración-200"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-3">
              {/* Controles móviles */}
              <div className="grid grid-cols-2 gap-2 md:hidden">
                <button
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className={`flex items-center justify-center gap-2 font-medium py-3 px-3 rounded-lg transition text-xs ${
                    isFiltersOpen
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <FiFilter className="w-4 h-4" />
                  <span>Filtros</span>
                </button>
                <button
                  onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                  className={`flex items-center justify-center gap-2 py-3 px-3 rounded-lg font-medium transition text-xs ${
                    isSortMenuOpen
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {sortConfig.direction === "asc" ? (
                    <FiArrowUp className="w-4 h-4" />
                  ) : (
                    <FiArrowDown className="w-4 h-4" />
                  )}
                  <span>Ordenar</span>
                </button>
              </div>

              {/* Estadísticas móviles (mejoradas) */}
              <div className="grid grid-cols-2 gap-3 md:hidden">
                <div
                  className="rounded-xl p-3 bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md"
                  aria-label="Administradores"
                >
                  <div className="flex items-center gap-2">
                    <FiShield className="w-4 h-4 opacity-95" />
                    <span className="text-xs font-medium">Administradores</span>
                  </div>
                  <div className="mt-1 text-2xl font-extrabold leading-none tabular-nums">
                    {isInitialLoading ? (
                      <div className="h-7 w-8 bg-white/30 rounded animate-pulse" />
                    ) : (
                      <span className="inline-block w-8 text-center">
                        {adminCount}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className="rounded-xl p-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md"
                  aria-label="Pre-autorizados"
                >
                  <div className="flex items-center gap-2">
                    <FiClock className="w-4 h-4 opacity-95 animate-pulse" />
                    <span className="text-xs font-medium">Pre-autorizados</span>
                  </div>
                  <div className="mt-1 text-2xl font-extrabold leading-none tabular-nums">
                    {isInitialLoading ? (
                      <div className="h-7 w-8 bg-white/30 rounded animate-pulse" />
                    ) : (
                      <span className="inline-block w-8 text-center">
                        {preAuthCount}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className="rounded-xl p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                  aria-label="Usuarios"
                >
                  <div className="flex items-center gap-2">
                    <FiUsers className="w-4 h-4 opacity-95" />
                    <span className="text-xs font-medium">Usuarios</span>
                  </div>
                  <div className="mt-1 text-2xl font-extrabold leading-none tabular-nums">
                    {isInitialLoading ? (
                      <div className="h-7 w-8 bg-white/30 rounded animate-pulse" />
                    ) : (
                      <span className="inline-block w-8 text-center">
                        {userCount}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className="rounded-xl p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                  aria-label="Verificados"
                >
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="w-4 h-4 opacity-95" />
                    <span className="text-xs font-medium">Verificados</span>
                  </div>
                  <div className="mt-1 text-2xl font-extrabold leading-none tabular-nums">
                    {isInitialLoading ? (
                      <div className="h-7 w-8 bg-white/30 rounded animate-pulse" />
                    ) : (
                      <span className="inline-block w-8 text-center">
                        {verifiedCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Controles desktop */}
              <div className="hidden md:flex md:items-center md:justify-between md:flex-col lg:flex-row gap-3 lg:gap-0">
                <div className="grid grid-cols-2 gap-2 w-full lg:w-auto">
                  <button
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    className={`flex items-center justify-center gap-2 font-medium py-3 px-3 lg:px-4 rounded-xl transition text-xs lg:text-sm ${
                      isFiltersOpen
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    <FiFilter className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="hidden lg:inline">Filtros avanzados</span>
                    <span className="lg:hidden">Filtros</span>
                  </button>
                  <button
                    onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                    className={`flex items-center justify-center gap-2 py-3 px-3 lg:px-4 rounded-xl font-medium transition text-xs lg:text-sm ${
                      isSortMenuOpen
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {sortConfig.direction === "asc" ? (
                      <FiArrowUp className="w-3 h-3 lg:w-4 lg:h-4" />
                    ) : (
                      <FiArrowDown className="w-3 h-3 lg:w-4 lg:h-4" />
                    )}
                    <span>Ordenar</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 lg:gap-3">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 px-3 lg:px-4 rounded-xl font-medium text-xs lg:text-sm flex items-center gap-2 shadow-md">
                    <FiShield className="w-3 h-3 lg:w-4 lg:h-4" />
                    {isInitialLoading ? (
                      <div className="h-5 w-6 bg-white/30 rounded animate-pulse" />
                    ) : (
                      <span className="font-bold tabular-nums inline-block w-6 text-center">
                        {adminCount}
                      </span>
                    )}
                    <span className="hidden sm:inline">administradores</span>
                    <span className="sm:hidden">admin</span>
                  </div>
                  <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white py-2.5 px-3 lg:px-4 rounded-xl font-medium text-xs lg:text-sm flex items-center gap-2 shadow-md">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    {isInitialLoading ? (
                      <div className="h-5 w-6 bg-white/30 rounded animate-pulse" />
                    ) : (
                      <span className="font-bold tabular-nums inline-block w-6 text-center">
                        {preAuthCount}
                      </span>
                    )}
                    <span className="hidden sm:inline">pre-autorizados</span>
                    <span className="sm:hidden">pre-auth</span>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2.5 px-3 lg:px-4 rounded-xl font-medium text-xs lg:text-sm flex items-center gap-2 shadow-md">
                    <FiCheckCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                    {isInitialLoading ? (
                      <div className="h-5 w-6 bg-white/30 rounded animate-pulse" />
                    ) : (
                      <span className="font-bold tabular-nums inline-block w-6 text-center">
                        {userCount}
                      </span>
                    )}
                    <span className="hidden sm:inline">usuarios</span>
                    <span className="sm:hidden">users</span>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2.5 px-3 lg:px-4 rounded-xl font-medium text-xs lg:text-sm flex items-center gap-2 shadow-md">
                    <FiCheckCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                    {isInitialLoading ? (
                      <div className="h-5 w-6 bg-white/30 rounded animate-pulse" />
                    ) : (
                      <span className="font-bold tabular-nums inline-block w-6 text-center">
                        {verifiedCount}
                      </span>
                    )}
                    <span className="hidden sm:inline">verificados</span>
                    <span className="sm:hidden">verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Menú de ordenamiento */}
          {isSortMenuOpen && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  className={`px-3 py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2 text-sm ${
                    sortConfig.key === "usuario"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => handleSort("usuario")}
                >
                  <span>Usuario</span>
                  {sortConfig.key === "usuario" &&
                    (sortConfig.direction === "asc" ? (
                      <FiArrowUp className="w-3 h-3" />
                    ) : (
                      <FiArrowDown className="w-3 h-3" />
                    ))}
                </button>
                <button
                  className={`px-3 py-2.5 rounded-lg font-medium transición flex items-center justify-center gap-2 text-sm ${
                    sortConfig.key === "correo"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => handleSort("correo")}
                >
                  <span>Email</span>
                  {sortConfig.key === "correo" &&
                    (sortConfig.direction === "asc" ? (
                      <FiArrowUp className="w-3 h-3" />
                    ) : (
                      <FiArrowDown className="w-3 h-3" />
                    ))}
                </button>
                <button
                  className={`px-3 py-2.5 rounded-lg font-medium transición flex items-center justify-center gap-2 text-sm ${
                    sortConfig.key === "rol"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => handleSort("rol")}
                >
                  <span>Rol</span>
                  {sortConfig.key === "rol" &&
                    (sortConfig.direction === "asc" ? (
                      <FiArrowUp className="w-3 h-3" />
                    ) : (
                      <FiArrowDown className="w-3 h-3" />
                    ))}
                </button>
              </div>
            </div>
          )}

          {/* Filtros avanzados */}
          {isFiltersOpen && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-white via-purple-50/40 to-blue-50/40 rounded-lg sm:rounded-xl lg:rounded-2xl ">
              <div className="flex justify-between items-center mb-3 sm:mb-4 lg:mb-6">
                <h3 className="text-sm sm:text-base lg:text-xl font-semibold text-gray-800">
                  Filtros avanzados
                </h3>
                <button
                  onClick={() => setIsFiltersOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-200 transition"
                >
                  <FiX className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                {/* Filtro por rol */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 lg:mb-3">
                    <FiUsers className="inline w-4 h-4 mr-1" />
                    Rol de Usuario
                  </label>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full px-3 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                  >
                    <option value="todos">Todos los roles</option>
                    <option value="admin">Administradores</option>
                    <option value="pre-autorizado">Pre-autorizados</option>
                    <option value="usuario">Usuarios estándar</option>
                  </select>
                </div>

                {/* Filtro por verificación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 lg:mb-3">
                    <FiCheckCircle className="inline w-4 h-4 mr-1" />
                    Estado de Verificación
                  </label>
                  <select
                    value={verificationFilter}
                    onChange={(e) => setVerificationFilter(e.target.value)}
                    className="w-full px-3 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                  >
                    <option value="todos">Todos los estados</option>
                    <option value="verificado">Email verificado</option>
                    <option value="pendiente">No verificados</option>
                  </select>
                </div>

                {/* Filtro por ordenamiento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 lg:mb-3">
                    <FiTrendingUp className="inline w-4 h-4 mr-1" />
                    Ordenar por
                  </label>
                  <select
                    value={`${sortConfig.key}-${sortConfig.direction}`}
                    onChange={(e) => {
                      const [key, direction] = e.target.value.split("-");
                      setSortConfig({ key, direction });
                    }}
                    className="w-full px-3 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                  >
                    <option value="usuario-asc">Usuario (A-Z)</option>
                    <option value="usuario-desc">Usuario (Z-A)</option>
                    <option value="correo-asc">Email (A-Z)</option>
                    <option value="correo-desc">Email (Z-A)</option>
                    <option value="rol-asc">Rol (A-Z)</option>
                    <option value="rol-desc">Rol (Z-A)</option>
                    <option value="fechaCreacion-desc">Más recientes</option>
                    <option value="fechaCreacion-asc">Más antiguos</option>
                  </select>
                </div>
              </div>

              {/* Botones de acción de filtros */}
              <div className="flex flex-col lg:flex-row justify-between items-center pt-4 lg:pt-6 gap-3 lg:gap-4 border-t border-gray-200 mt-4 lg:mt-6">
                <div className="text-sm lg:text-base text-gray-600 order-2 lg:order-1 text-center lg:text-left">
                  <span className="font-semibold text-blue-600">
                    {filteredUsers.length}
                  </span>
                  <span>
                    {" "}
                    usuario{filteredUsers.length !== 1 ? "s" : ""} encontrado
                    {filteredUsers.length !== 1 ? "s" : ""}
                  </span>
                  <span className="text-gray-500 ml-2">
                    de {users.length} total
                  </span>
                </div>
                <div className="flex gap-3 lg:gap-4 order-1 lg:order-2 w-full lg:w-auto">
                  <button
                    onClick={clearFilters}
                    className="flex-1 lg:flex-none px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-medium rounded-lg lg:rounded-xl transition-all duración-200 text-sm lg:text-base shadow-sm hover:shadow-md"
                  >
                    Limpiar todo
                  </button>
                  <button
                    onClick={() => setIsFiltersOpen(false)}
                    className="flex-1 lg:flex-none px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-lg lg:rounded-xl transition-all duración-200 text-sm lg:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <FiFilter className="w-4 h-4" />
                    Aplicar filtros
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filtros Rápidos - Mejorado para móvil */}
        <section
          className="bg-gradient-to-r from-white via-gray-50 to-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-4 lg:p-5 mb-4 sm:mb-6"
          aria-labelledby="filtros-rapidos-usuarios"
        >
          <div className="space-y-3 sm:space-y-4">
            {/* Header de filtros */}
            <div className="flex items-center justify-between gap-2 sm:gap-3 flex-wrap">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-1 h-4 sm:h-6 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full"></div>
                <h2
                  id="filtros-rapidos-usuarios"
                  className="text-xs sm:text-sm font-semibold text-gray-800"
                >
                  Filtros Rápidos
                </h2>
              </div>
            </div>

            {/* Filtros principales */}
            <div
              className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3"
              role="group"
              aria-labelledby="filtros-rapidos-usuarios"
            >
              <button
                onClick={() => {
                  setRoleFilter("todos");
                  setVerificationFilter("todos");
                  setIsFiltersOpen(false);
                }}
                aria-pressed={
                  roleFilter === "todos" && verificationFilter === "todos"
                }
                aria-label="Mostrar todos los usuarios sin filtros"
                className={`group relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duración-200 ${
                  roleFilter === "todos" && verificationFilter === "todos"
                    ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-700 border border-gray-200 hover:border-purple-200"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <FiUsers className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Todos</span>
                  <span className="sm:hidden">Todos</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setRoleFilter("admin");
                  setVerificationFilter("todos");
                  setIsFiltersOpen(false);
                }}
                aria-pressed={roleFilter === "admin"}
                aria-label="Mostrar solo administradores"
                className={`group relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duración-200 ${
                  roleFilter === "admin"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-red-50 hover:text-red-700 border border-gray-200 hover:border-red-200"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <FiShield className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Administradores</span>
                  <span className="sm:hidden">Admin</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setRoleFilter("pre-autorizado");
                  setVerificationFilter("todos");
                  setIsFiltersOpen(false);
                }}
                aria-pressed={roleFilter === "pre-autorizado"}
                aria-label="Mostrar solo usuarios pre-autorizados"
                className={`group relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duración-200 ${
                  roleFilter === "pre-autorizado"
                    ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-700 border border-gray-200 hover:border-orange-200"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <FiClock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Pre-autorizados</span>
                  <span className="sm:hidden">Pre-auth</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setRoleFilter("usuario");
                  setVerificationFilter("todos");
                  setIsFiltersOpen(false);
                }}
                aria-pressed={roleFilter === "usuario"}
                aria-label="Mostrar solo usuarios regulares"
                className={`group relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duración-200 ${
                  roleFilter === "usuario"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 hover:border-blue-200"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <FiUser className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Usuarios</span>
                  <span className="sm:hidden">User</span>
                </div>
              </button>
            </div>

            {/* Filtros por verificación */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  Estado de Verificación:
                </span>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setVerificationFilter("verificado");
                    setIsFiltersOpen(false);
                  }}
                  aria-pressed={verificationFilter === "verificado"}
                  aria-label="Mostrar solo usuarios verificados"
                  className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duración-200 ${
                    verificationFilter === "verificado"
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                      : "bg-white text-gray-600 hover:bg-green-50 hover:text-green-700 border border-gray-200 hover:border-green-200"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FiCheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Verificados</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setVerificationFilter("pendiente");
                    setIsFiltersOpen(false);
                  }}
                  aria-pressed={verificationFilter === "pendiente"}
                  aria-label="Mostrar solo usuarios no verificados"
                  className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duración-200 ${
                    verificationFilter === "pendiente"
                      ? "bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg"
                      : "bg-white text-gray-600 hover:bg-yellow-50 hover:text-yellow-700 border border-gray-200 hover:border-yellow-200"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FiClock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>No verificados</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Botón Limpiar filtros al fondo de la sección */}
            {(searchTerm ||
              roleFilter !== "todos" ||
              verificationFilter !== "todos") && (
              <div className="pt-2 sm:pt-2 border-t border-gray-200">
                <button
                  onClick={clearFilters}
                  aria-label="Limpiar todos los filtros aplicados"
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium bg-gradient-to-r from-red-50 to-pink-50 text-red-600 hover:from-red-100 hover:to-pink-100 border border-red-200 hover:border-red-300 transition-all duración-200 flex items-center justify-center gap-2"
                >
                  <FiX className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Limpiar filtros</span>
                  <span className="sm:hidden">Limpiar</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Lista de usuarios */}
        <div className="rounded-xl sm:rounded-2xl  ">
          {loading ? (
            // Mostrar skeleton siempre que esté cargando (no solo en carga inicial)
            renderSkeletonCards(10)
          ) : filteredUsers.length > 0 ? (
            <>
              <Suspense fallback={renderSkeletonCards(8)}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6 [content-visibility:auto] [contain-intrinsic-size:600px_900px]">
                  {filteredUsers.map((user) => (
                    <UserCard
                      key={user.id}
                      user={user}
                      currentUser={currentUser}
                      showActionMenu={showActionMenu}
                      setShowActionMenu={setShowActionMenu}
                      handleRoleChange={handleRoleChange}
                      setConfirmDialog={setConfirmDialog}
                      getRoleColor={getRoleColor}
                      getRoleIcon={getRoleIcon}
                      loading={loading}
                    />
                  ))}
                </div>
              </Suspense>

              {/* Paginación */}
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalItems || users.length}
                itemsPerPage={limit}
                onPageChange={goToPage}
              />
            </>
          ) : (
            // Estado vacío (solo cuando NO está cargando y no hay resultados)
            <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 lg:p-12 text-center border border-gray-200">
              <div className="max-w-md mx-auto">
                {/* Icono central con animación */}
                <div className="relative inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-500 mb-4 sm:mb-6">
                  <FiUsers className="w-10 h-10 sm:w-12 sm:h-12" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 animate-ping"></div>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                  No se encontraron usuarios
                </h3>

                <p className="text-gray-600 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                  {deferredSearch
                    ? `No hay resultados para "${deferredSearch}".`
                    : roleFilter !== "todos"
                      ? `No hay usuarios con el rol "${roleFilter}".`
                      : verificationFilter !== "todos"
                        ? `No hay usuarios ${verificationFilter === "verificado" ? "verificados" : "no verificados"}.`
                        : "Parece que no hay usuarios disponibles."}{" "}
                  Intenta ajustar los filtros de búsqueda o verifica que haya
                  usuarios registrados.
                </p>

                {/* Filtros aplicados */}
                {(deferredSearch ||
                  roleFilter !== "todos" ||
                  verificationFilter !== "todos") && (
                  <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl border border-gray-200">
                    <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                      FILTROS APLICADOS
                    </p>
                    <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                      {deferredSearch && (
                        <span className="px-2 sm:px-3 py-1 sm:py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs rounded-lg sm:rounded-xl font-medium shadow-md">
                          <span className="hidden sm:inline">Búsqueda: "</span>
                          {deferredSearch}
                          <span className="hidden sm:inline">"</span>
                        </span>
                      )}
                      {roleFilter !== "todos" && (
                        <span className="px-2 sm:px-3 py-1 sm:py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs rounded-lg sm:rounded-xl font-medium shadow-md">
                          <span className="hidden sm:inline">Rol: </span>
                          {roleFilter}
                        </span>
                      )}
                      {verificationFilter !== "todos" && (
                        <span
                          className={`px-2 sm:px-3 py-1 sm:py-2 bg-gradient-to-r ${verificationFilter === "pendiente" ? "from-yellow-500 to-orange-600" : "from-green-500 to-emerald-600"} text-white text-xs rounded-lg sm:rounded-xl font-medium shadow-md`}
                        >
                          <span className="hidden sm:inline">Estado: </span>
                          {verificationFilter === "pendiente"
                            ? "no verificados"
                            : verificationFilter}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setRoleFilter("todos");
                      setVerificationFilter("todos");
                    }}
                    className="group px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold rounded-xl sm:rounded-2xl transición-all duración-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 text-sm sm:text-base"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <FiX className="w-4 h-4 group-hover:rotate-90 transición-transform duración-200" />
                      <span className="hidden sm:inline">Limpiar filtros</span>
                      <span className="sm:hidden">Limpiar</span>
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      refresh(); // Actualizar lista sin notificaciones
                    }}
                    className="group px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transición-all duración-300 transform hover:-translate-y-1 text-sm sm:text-base"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <FiRefreshCw className="w-4 h-4 group-hover:rotate-180 transición-transform duración-300" />
                      <span className="hidden sm:inline">Actualizar lista</span>
                      <span className="sm:hidden">Actualizar</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal de confirmación */}
        <Suspense fallback={null}>
          <ConfirmDialog
            isOpen={confirmDialog.isOpen}
            onClose={() =>
              setConfirmDialog({
                isOpen: false,
                type: "",
                user: null,
                newRole: null,
              })
            }
            onConfirm={() => {
              if (confirmDialog.type === "delete") {
                handleDeleteUser(confirmDialog.user.id);
              } else if (confirmDialog.type === "role-admin") {
                confirmRoleChange();
              }
            }}
            title={
              confirmDialog.type === "role-admin"
                ? "Advertencia: Rol Administrador"
                : "Mover a papelera"
            }
            message={
              confirmDialog.type === "role-admin"
                ? `⚠️ Estás a punto de otorgar permisos de ADMINISTRADOR a "${confirmDialog.user?.usuario}". Los administradores tienen acceso completo al sistema, incluyendo la gestión de otros usuarios, paquetes y configuraciones críticas. ¿Estás seguro de continuar?`
                : `¿Estás seguro de que quieres mover al usuario "${confirmDialog.user?.usuario}" a la papelera? Podrás restaurarlo desde la sección de papelera.`
            }
            confirmText={
              confirmDialog.type === "role-admin"
                ? "Sí, hacer administrador"
                : "Mover a papelera"
            }
            cancelText="Cancelar"
            type={confirmDialog.type === "role-admin" ? "warning" : "danger"}
            itemName={confirmDialog.user?.usuario}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default AdminUsersPage;
