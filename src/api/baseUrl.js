// Util central para resolver la URL base del API en cualquier contexto (browser / build scripts)
// Prioriza variables definidas y aplica saneamiento de slashes finales.

export function resolveApiBase(options = {}) {
  const {
    fallbackProd = "https://api.viadca.app",
    fallbackDev = "http://localhost:3000",
  } = options;

  // Soportar tanto entornos Vite (import.meta.env) como Node (process.env)
  const viteEnv = typeof import.meta !== "undefined" ? import.meta.env : {};
  const nodeEnv = typeof process !== "undefined" ? process.env : {};

  const candidates = [
    viteEnv?.VITE_API_BASE_URL,
    viteEnv?.VITE_API_URL,
    viteEnv?.VITE_BACKEND_URL,
    nodeEnv?.VITE_API_BASE_URL,
    nodeEnv?.VITE_API_URL,
    nodeEnv?.VITE_BACKEND_URL,
  ].filter(Boolean);

  let base = candidates.find((c) => typeof c === "string" && c.trim().length);

  if (!base) {
    const isDev = !!(viteEnv?.DEV || nodeEnv?.NODE_ENV === "development");
    base = isDev ? fallbackDev : fallbackProd;
  }

  return sanitize(base);
}

export function sanitize(url) {
  return url ? url.replace(/\/$/, "") : url;
}

export default resolveApiBase;