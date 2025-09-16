import { useState, useEffect } from "react";
import { FiSearch, FiTrash2, FiDownload, FiHash, FiLink } from "react-icons/fi";
import { useNotifications } from "../../admin/hooks/useNotifications";
import { exportToExcel, getPaqueteByUrl } from "../../../api/packagesService";
import apiClient from "../../../api/axiosConfig";
import { formatPrecio, sanitizeMoneda } from "../../../utils/priceUtils";
import { getImageUrl } from "../../../utils/imageUtils";
import OptimizedImage from "../../../components/ui/OptimizedImage";

/**
 * Panel para buscar paquetes por su código URL y generar una lista temporal
 * utilizable para exportar datos (por ejemplo hacia Excel externo). No altera el backend.
 */
export default function PackageLookupPanel() {
  const [codigo, setCodigo] = useState("");
  const [items, setItems] = useState([]); // {data, loading, error}
  // Estado mínimo: sin exportaciones masivas ni CSV
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  // Resolución silenciosa de ID (bandera interna opcional)
  const [resolvingId, setResolvingId] = useState(false); // TODO: podría eliminarse si no se requiere feedback interno
  const { notify } = useNotifications();
  const STORAGE_KEY = "cotizador_paquetes";

  // Cargar desde localStorage al montar
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch (e) {
      if (import.meta.env.DEV) console.warn("No se pudo leer localStorage cotizador", e);
    }
  }, []);

  // Guardar cambios
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      if (import.meta.env.DEV) console.warn("No se pudo guardar localStorage cotizador", e);
    }
  }, [items]);

  const handleAdd = async (e) => {
    e.preventDefault();
    // Permitir pegar URL completa y extraer último segmento
    let trimmed = codigo.trim();
    if (/^https?:\/\//i.test(trimmed)) {
      try {
        const urlObj = new URL(trimmed);
        const parts = urlObj.pathname.split("/").filter(Boolean);
        trimmed = parts[parts.length - 1] || trimmed;
      } catch (_) {
        // si falla, seguimos con el texto original
      }
    }
    if (!trimmed) return;
  // evitar duplicados por código URL
    if (items.some((i) => i.data?.codigo_url === trimmed)) {
      setError("Ya agregado");
      return;
    }
    setIsFetching(true);
    setError(null);
    try {
      const resp = await getPaqueteByUrl(trimmed);
      let raw = resp?.data ?? resp;
      if (raw && typeof raw === 'object' && raw.paquete && typeof raw.paquete === 'object') {
        // Si viene envuelto
        raw = { ...raw.paquete };
      }
      const normalized = {
        ...raw,
        id: raw?.id || raw?._id || raw?.paquete_id || raw?.paqueteId || null,
        codigo: raw?.codigo || raw?.codigo_url || raw?.codigoUrl || trimmed,
        codigo_url: raw?.codigo_url || raw?.codigoUrl || raw?.codigo || trimmed,
        codigoUrl: raw?.codigoUrl || raw?.codigo_url || raw?.codigo || trimmed,
      };
      if (!normalized.id) {
        console.warn('[Cotizador] Paquete sin id detectable', normalized);
      }
      setItems((prev) => [
        ...prev,
        { id: Date.now(), data: normalized, addedAt: new Date().toISOString() },
      ]);
      notify.success("Paquete añadido a la lista");
      setCodigo("");
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "No se encontró el paquete por ese código";
      setError(msg);
      notify.error(msg);
    } finally {
      setIsFetching(false);
    }
  };

  const handleRemove = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearAll = () => {
    setItems([]);
    try { window.localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    notify.info("Lista vaciada");
  };

  const handleCopyField = async (value) => {
    try {
      await navigator.clipboard.writeText(String(value || ""));
    } catch (e) {
      console.warn("No se pudo copiar", e);
    }
  };

  const slugify = (str = "") =>
    String(str)
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, 80) || "cotizacion";

  const handleExportSingle = async (rawId, codigoRef, itemId) => {
    let paqueteId = rawId || null;
    // Resolver silenciosamente si falta ID
    if (!paqueteId && itemId) {
      const target = items.find(i => i.id === itemId);
      const code = target?.data?.codigo_url || target?.data?.codigoUrl || target?.data?.codigo;
      if (code) {
        paqueteId = await resolveIdFromAdmin(code);
        if (paqueteId) {
          setItems(prev => prev.map(it => it.id === itemId ? { ...it, data: { ...it.data, id: paqueteId } } : it));
        }
      }
    }
    if (!paqueteId) {
      notify.error("No se pudo resolver el ID del paquete para exportar");
      return;
    }

    const target = items.find(i => i.id === itemId) || {};
    const data = target.data || {};
    const titulo = data.titulo || codigoRef || paqueteId;
    const fileSlug = slugify(titulo);

    await notify.operation(
      async () => {
        const resp = await exportToExcel(paqueteId);
        const url = window.URL.createObjectURL(new Blob([resp.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `cotizacion-${fileSlug}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      },
      {
        loadingMessage: "Generando archivo Excel...",
        successMessage: "Archivo Excel descargado",
        errorMessage: "No fue posible generar el Excel",
        loadingTitle: "Cotizando",
        successTitle: "Cotización lista",
        errorTitle: "Error",
      }
    );
  };

  const resolveIdFromAdmin = async (codigoUrl) => {
    if (!codigoUrl) return null;
    setResolvingId(true);
    try {
      const resp = await apiClient.get("/admin/paquetes", { params: { search: codigoUrl, limit: 20 } });
      const list = resp?.data?.data || resp?.data || [];
      if (Array.isArray(list)) {
        // buscar coincidencia exacta en cualquier forma del código
        const found = list.find(p => [p.codigo, p.codigo_url, p.codigoUrl].some(c => c && String(c).toLowerCase() === String(codigoUrl).toLowerCase()));
        return found?.id || found?._id || null;
      }
      return null;
    } catch (e) {
      console.warn("No se pudo resolver ID vía admin", e);
      return null;
    } finally {
      setResolvingId(false);
    }
  };

  const handleResolveMissingId = async (itemId) => {
    // Mantener función (ahora silenciosa) para futura resolución automática
    const idx = items.findIndex(i => i.id === itemId);
    if (idx === -1) return;
    const current = items[idx];
    const codigoRef = current?.data?.codigo_url || current?.data?.codigoUrl || current?.data?.codigo;
    if (!codigoRef) return;
    const newId = await resolveIdFromAdmin(codigoRef);
    if (newId) {
      setItems(prev => prev.map(it => it.id === itemId ? { ...it, data: { ...it.data, id: newId } } : it));
    }
  };

  // Se eliminaron: exportación masiva y generación de CSV para versión simplificada

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 lg:p-6">
      <div className="mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
          <FiHash className="w-5 h-5 text-blue-600" /> Cotizador de Paquetes
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Escribe el código URL del paquete. También puedes pegar la URL completa y lo detectamos.
        </p>
  <p className="text-xs text-gray-400 mt-1">Ejemplo: si la URL es https://www.viadca.app/paquetes/WMYv0 el código es WMYv0</p>
      </div>
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="ej: WMYv0 o aventura-en-costa-rica"
            className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={isFetching || !codigo.trim()}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm disabled:opacity-50"
        >
          <FiSearch className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          Añadir
        </button>
        {items.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm"
          >
            Limpiar
          </button>
        )}
      </form>
      {error && (
        <div className="mb-4 text-sm text-red-600 font-medium bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
      )}
      {!items.length && (
        <div className="text-sm text-gray-500 italic">No hay paquetes listados todavía.</div>
      )}
      {items.length > 0 && (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700 border-y">
                <th className="text-left font-semibold px-4 py-2">Código URL</th>
                <th className="text-left font-semibold px-4 py-2">Título</th>
                <th className="text-left font-semibold px-4 py-2 whitespace-nowrap">Precio</th>
                <th className="text-left font-semibold px-4 py-2">Estado</th>
                <th className="text-left font-semibold px-4 py-2">Favorito</th>
                <th className="text-left font-semibold px-4 py-2">Duración</th>
                <th className="text-left font-semibold px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const p = item.data || {};
                const showId = p.id || p._id || p.paquete_id || p.paqueteId || null;
                const showCodigo = p.codigo_url || p.codigoUrl || p.codigo || null;
                return (
                  <tr key={item.id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="px-4 py-2">
                      {showCodigo ? (
                        <button onClick={() => handleCopyField(showCodigo)} title="Copiar código" className="text-blue-600 hover:underline">{showCodigo}</button>
                      ) : (
                        <span className="text-red-500" title="Código no disponible">(sin código)</span>
                      )}
                    </td>
                    <td className="px-4 py-2 max-w-xs">
                      <div className="flex items-center gap-2">
                        {p.primera_imagen && (
                          <OptimizedImage
                            src={getImageUrl(p.primera_imagen)}
                            alt={p.titulo}
                            width={50}
                            height={38}
                            quality="auto"
                            format="webp"
                            crop="fill"
                            className="w-10 h-9 object-cover rounded-md border border-gray-200"
                          />
                        )}
                        <button
                          onClick={() => handleCopyField(p.titulo)}
                          className="text-left hover:underline line-clamp-2"
                          title="Copiar título"
                        >
                          {p.titulo}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-2 font-semibold text-gray-900">
                      {formatPrecio(p.precio_total, sanitizeMoneda(p.moneda))}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full border ${p.activo ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"}`}>
                        {p.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${p.favorito ? "bg-yellow-400" : "bg-gray-300"}`} title={p.favorito ? "Favorito" : "Normal"}></span>
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-600">
                      {p.duracion_dias ? `${p.duracion_dias}d` : "-"}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleExportSingle(showId, showCodigo, item.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition text-xs font-medium"
                          title="Cotizar (Excel)"
                        >
                          <FiDownload className="w-4 h-4" />
                          Cotizar
                        </button>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                          title="Quitar"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
