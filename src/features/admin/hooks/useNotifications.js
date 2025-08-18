import { useNotification } from "../pages/AdminLayout";
import { useMemo } from "react";

export const useNotifications = () => {
  const {
    addNotification,
    removeNotification,
    clearAll,
    updateNotification,
    notifications,
  } = useNotification();

  // Memoizar el objeto para mantener referencia estable y evitar re-ejecuciones de efectos
  const notify = useMemo(
    () => ({
      success: (message, options = {}) =>
        addNotification(message, "success", {
          duration: 4000,
          ...options,
        }),

      error: (message, options = {}) =>
        addNotification(message, "error", {
          duration: 7000,
          persistent: options.persistent !== false,
          ...options,
        }),

      warning: (message, options = {}) =>
        addNotification(message, "warning", {
          duration: 6000,
          ...options,
        }),

      info: (message, options = {}) =>
        addNotification(message, "info", {
          duration: 5000,
          ...options,
        }),

      loading: (message, options = {}) =>
        addNotification(message, "loading", {
          persistent: true,
          ...options,
        }),

      urgent: (message, options = {}) =>
        addNotification(message, "urgent", {
          duration: 10000,
          persistent: true,
          ...options,
        }),

      promise: async (promise, messages = {}) => {
        const loadingId = addNotification(
          messages.loading || "Procesando...",
          "loading",
          {
            title: "Cargando",
            persistent: true,
          },
        );

        try {
          const result = await promise;
          // Actualizar a éxito y autocerrar
          updateNotification(loadingId, {
            type: "success",
            message: messages.success || "Operación completada exitosamente",
            title: "Completado",
            persistent: false,
            duration: 4000,
          });
          return result;
        } catch (error) {
          updateNotification(loadingId, {
            type: "error",
            message: messages.error || error.message || "Ocurrió un error",
            title: "Error",
            persistent: false,
            duration: 5000,
          });
          throw error;
        }
      },

      // Método mejorado para operaciones de CRUD con estado de proceso (in-place)
      operation: async (operation, config = {}) => {
        const {
          loadingMessage = "Procesando...",
          successMessage = "Operación completada exitosamente",
          errorMessage = "Ocurrió un error",
          loadingTitle = "Procesando",
          successTitle = "Completado",
          errorTitle = "Error",
          successDuration = 4000,
          errorDuration = 5000,
        } = config;

        // Crear notificación de carga persistente
        const id = addNotification(loadingMessage, "loading", {
          title: loadingTitle,
          persistent: true,
        });

        try {
          const result = await operation();
          // Actualizar la misma notificación a éxito y permitir autocierre
          updateNotification(id, {
            type: "success",
            message: successMessage,
            title: successTitle,
            persistent: false,
            duration: successDuration,
          });
          return result;
        } catch (error) {
          const finalErrorMessage =
            error?.response?.data?.message || error?.message || errorMessage;
          // Actualizar la misma notificación a error y permitir autocierre
          updateNotification(id, {
            type: "error",
            message: finalErrorMessage,
            title: errorTitle,
            persistent: false,
            duration: errorDuration,
          });
          throw error;
        }
      },

      // Transformar una notificación de carga a éxito/error en el mismo id
      updateLoadingNotification: (loadingId, type, message, options = {}) => {
        if (type === "success") {
          return updateNotification(loadingId, {
            type: "success",
            message,
            title: options.title || "Completado",
            persistent: false,
            duration: options.duration ?? 4000,
          });
        }
        if (type === "error") {
          return updateNotification(loadingId, {
            type: "error",
            message,
            title: options.title || "Error",
            persistent: false,
            duration: options.duration ?? 5000,
          });
        }
      },

      confirm: (message, options = {}) => {
        return new Promise((resolve) => {
          addNotification(message, "warning", {
            title: options.title || "Confirmación requerida",
            persistent: true,
            action: {
              label: options.confirmLabel || "Confirmar",
              onClick: () => {
                resolve(true);
              },
            },
            ...options,
          });
        });
      },
    }),
    [addNotification, removeNotification, updateNotification],
  );

  return {
    notify,
    addNotification,
    removeNotification,
    clearAll,
    updateNotification,
    notifications,
    count: notifications.length,
  };
};
