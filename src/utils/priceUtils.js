
export const sanitizeMoneda = (moneda) => {
  if (moneda === "USD" || moneda === "MXN") return moneda;
  return "MXN";
};


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
