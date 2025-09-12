// Sencillo bus en memoria para compartir promesas de operaciones entre páginas
// Clave sugerida: `${tipo}:${id || 'new'}:${timestamp}`
const ops = new Map();

export const setOperation = (key, promise) => {
  if (!key || !promise || typeof promise.then !== "function") return;
  ops.set(key, promise);
};

export const getOperation = (key) => ops.get(key);

export const clearOperation = (key) => {
  ops.delete(key);
};

export const hasOperation = (key) => ops.has(key);
