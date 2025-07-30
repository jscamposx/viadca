import { useNotification } from "../pages/AdminLayout";

export const useNotifications = () => {
  const { addNotification, removeNotification, clearAll, updateNotification, notifications } = useNotification();

  const notify = {
    success: (message, options = {}) => 
      addNotification(message, "success", { 
        duration: 4000, 
        ...options 
      }),
    
    error: (message, options = {}) => 
      addNotification(message, "error", { 
        duration: 7000, 
        persistent: options.persistent !== false, 
        ...options 
      }),
    
    warning: (message, options = {}) => 
      addNotification(message, "warning", { 
        duration: 6000, 
        ...options 
      }),
    
    info: (message, options = {}) => 
      addNotification(message, "info", { 
        duration: 5000, 
        ...options 
      }),
    
    loading: (message, options = {}) => 
      addNotification(message, "loading", { 
        persistent: true, 
        ...options 
      }),
    
    urgent: (message, options = {}) => 
      addNotification(message, "urgent", { 
        duration: 10000, 
        persistent: true, 
        ...options 
      }),

    // Métodos de conveniencia
    promise: async (promise, messages = {}) => {
      const loadingId = notify.loading(
        messages.loading || "Procesando...", 
        { title: "Cargando" }
      );

      try {
        const result = await promise;
        removeNotification(loadingId);
        notify.success(
          messages.success || "Operación completada exitosamente",
          { title: "Completado" }
        );
        return result;
      } catch (error) {
        removeNotification(loadingId);
        notify.error(
          messages.error || error.message || "Ocurrió un error",
          { title: "Error" }
        );
        throw error;
      }
    },

    confirm: (message, options = {}) => {
      return new Promise((resolve) => {
        notify.warning(message, {
          title: options.title || "Confirmación requerida",
          persistent: true,
          action: {
            label: options.confirmLabel || "Confirmar",
            onClick: () => {
              resolve(true);
            }
          },
          ...options
        });
      });
    }
  };

  return {
    notify,
    addNotification,
    removeNotification,
    clearAll,
    updateNotification,
    notifications,
    count: notifications.length
  };
};
