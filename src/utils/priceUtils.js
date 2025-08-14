// Utilidades de precios y moneda

/**
 * Normaliza el valor de moneda a 'MXN' | 'USD'. Fallback: 'MXN'
 * @param {string | undefined | null} moneda
 * @returns {'MXN' | 'USD'}
 */
export const sanitizeMoneda = (moneda) => {
  if (moneda === "USD" || moneda === "MXN") return moneda;
  return "MXN";
};

/**
 * Formatea un valor numérico como moneda según el código proporcionado.
 * - Acepta number | string | null/undefined
 * - Si es null/undefined/'' retorna cadena vacía
 * - Si no es un número válido, retorna cadena vacía
 * @param {number | string | null | undefined} valor
 * @param {'MXN'|'USD'|undefined|null} moneda
 * @returns {string}
 */
export const formatPrecio = (valor, moneda) => {
  if (valor === null || valor === undefined || valor === "") return "";
  const n = typeof valor === "string" ? Number(valor) : valor;
  if (Number.isNaN(n)) return "";
  const m = sanitizeMoneda(moneda);
  const locales = m === "MXN" ? "es-MX" : "en-US";
  return new Intl.NumberFormat(locales, {
    style: "currency",
    currency: m,
  }).format(n);
};
