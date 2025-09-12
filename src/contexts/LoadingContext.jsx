import { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading debe ser usado dentro de un LoadingProvider");
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState({});

  const setLoading = (key, isLoading) => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: isLoading,
    }));
  };

  const isLoading = (key) => !!loadingStates[key];

  const isAnyLoading = () =>
    Object.values(loadingStates).some((state) => state);

  return (
    <LoadingContext.Provider
      value={{
        setLoading,
        isLoading,
        isAnyLoading,
      }}
    >
      {children}
      {/* Indicador global de loading opcional */}
      {isAnyLoading() && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Cargando...</span>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};
