import React from "react";

/**
 * ErrorBoundary: captura errores de render, ciclo de vida y descendientes.
 * Uso: envolver la parte alta de la app (Routes) para mostrar un fallback limpio.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("[ErrorBoundary]", error, info);
    }
  }

  handleRecover = () => {
    // Intento de recuperación ligera: resetea estado local
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-md bg-white/80 backdrop-blur rounded-2xl shadow-xl p-8 border border-blue-100">
            <h1 className="text-2xl font-bold text-slate-800 mb-3">
              Ha ocurrido un error
            </h1>
            <p className="text-slate-600 text-sm mb-6">
              Algo inesperado impidió mostrar esta sección. Puedes intentar
              recargar o volver al inicio.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRecover}
                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
              >
                Reintentar
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 transition"
              >
                Recargar
              </button>
            </div>
            {process.env.NODE_ENV !== "production" && this.state.error && (
              <pre className="mt-6 text-left text-xs whitespace-pre-wrap max-h-40 overflow-auto bg-slate-900/90 text-rose-200 p-3 rounded-md border border-slate-700">
                {this.state.error?.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
