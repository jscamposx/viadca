import React, { useState, useMemo, useEffect } from "react";
import { FiDollarSign, FiPercent, FiAlertTriangle } from "react-icons/fi";
import { formatPrecio, sanitizeMoneda } from "../../../utils/priceUtils";

const PricingForm = ({ formData, onFormChange, errors = {} }) => {
  // Nuevo enfoque: el usuario ingresa el Total (precio base) y un Descuento opcional.
  // El precio_total (enviado al backend) SIEMPRE representará el precio final (base - descuento).
  // El backend / frontend público reconstruyen precio original = precio_total + descuento.
  const initialBase = (() => {
    const total = parseFloat(formData?.precio_total || 0);
    const desc = parseFloat(formData?.descuento || 0);
    if (total && desc) return (total + desc).toString();
    if (total) return total.toString();
    return "";
  })();
  const [precioBase, setPrecioBase] = useState(initialBase); // Campo que edita el usuario
  const [descuento, setDescuento] = useState(formData?.descuento || "");
  // Toggles para desgloses opcionales
  const [enableVuelo, setEnableVuelo] = useState(() => {
    const v = parseFloat(formData?.precio_vuelo);
    return !isNaN(v) && v > 0;
  });
  const [enableHospedaje, setEnableHospedaje] = useState(() => {
    const h = parseFloat(formData?.precio_hospedaje);
    return !isNaN(h) && h > 0;
  });

  // Moneda
  const MONEDAS = ["MXN", "USD"];
  const moneda = sanitizeMoneda(formData.moneda || "MXN");

  // Sincronizar cambios externos (modo edición) si formData cambia externamente
  useEffect(() => {
    const total = parseFloat(formData?.precio_total || 0);
    const desc = parseFloat(formData?.descuento || 0);
    const nuevoBase = total || desc ? (total + desc).toString() : "";
    // Solo sincronizar si realmente cambió el valor numérico (para evitar loop)
    const currentBaseNum = parseFloat(precioBase || 0);
    const nuevoBaseNum = parseFloat(nuevoBase || 0);
    if ((nuevoBase || precioBase) && nuevoBaseNum !== currentBaseNum) {
      setPrecioBase(nuevoBase);
    }
    // Descuento: comparar numéricamente
    const descuentoNum = parseFloat(descuento || 0);
    if (desc !== descuentoNum) {
      // desc ya es numérico parseado; si formData.descuento representa lo mismo no lo cambiamos
      const formDescRaw = formData?.descuento || "";
      if (formDescRaw === "") {
        if (descuento !== "") setDescuento("");
      } else if (!isNaN(parseFloat(formDescRaw)) && parseFloat(formDescRaw) !== descuentoNum) {
        setDescuento(formData.descuento);
      }
    }
    // Sincronizar toggles de vuelo/hospedaje si llegan valores > 0 (edición de paquete)
    const v = parseFloat(formData?.precio_vuelo);
    if (!isNaN(v) && v > 0 && !enableVuelo) setEnableVuelo(true);
    if ((isNaN(v) || v <= 0) && enableVuelo && (formData?.precio_vuelo === "" || formData?.precio_vuelo == null)) {
      // Mantener habilitado si el usuario lo activó manualmente; no forzar false aquí para no perder intención
    }
    const h = parseFloat(formData?.precio_hospedaje);
    if (!isNaN(h) && h > 0 && !enableHospedaje) setEnableHospedaje(true);
    if ((isNaN(h) || h <= 0) && enableHospedaje && (formData?.precio_hospedaje === "" || formData?.precio_hospedaje == null)) {
      // Igual que arriba: no desactivar automáticamente si el usuario lo encendió
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.precio_total, formData.descuento, formData.precio_vuelo, formData.precio_hospedaje]);

  const formatNumber = (value) => {
    if (!value) return "";
    const numberValue = parseFloat(String(value).replace(/,/g, ""));
    return isNaN(numberValue) ? "" : numberValue.toLocaleString("es-MX");
  };

  const formatCurrency = (value) => {
    // Reemplaza lógica fija por utilidad con moneda actual
    if (!value || isNaN(value)) return formatPrecio(0, moneda);
    return formatPrecio(value, moneda);
  };

  const calculations = useMemo(() => {
    const base = parseFloat(precioBase || 0);
    const desc = parseFloat(descuento || 0);
    const anticipo = parseFloat(formData.anticipo || 0);
    const vuelo = enableVuelo ? parseFloat(formData.precio_vuelo || 0) : 0;
    const hospedaje = enableHospedaje ? parseFloat(formData.precio_hospedaje || 0) : 0;

    const validDesc = desc > 0 && desc <= base ? desc : desc > base ? base : 0;
    const finalPrice = base - validDesc;
    const montoDescuento = validDesc;
    const porcentajeDescuento = base > 0 && montoDescuento > 0 ? ((montoDescuento / base) * 100).toFixed(1) : 0;
    const porcentajeAnticipo = finalPrice > 0 && anticipo > 0 ? ((anticipo / finalPrice) * 100).toFixed(1) : 0;
    const saldoPendiente = finalPrice - anticipo;
    const sumaDesglose = vuelo + hospedaje;

    return {
      precioBase: base,
      precioFinal: finalPrice,
      montoDescuento,
      porcentajeDescuento,
      anticipo,
      porcentajeAnticipo,
      saldoPendiente,
      vuelo,
      hospedaje,
      sumaDesglose,
      excedeBase: base > 0 && sumaDesglose > base,
    };
  }, [precioBase, descuento, formData.anticipo, enableVuelo, enableHospedaje, formData.precio_vuelo, formData.precio_hospedaje]);

  // Cada vez que cambia base o descuento, actualizar precio_total final en formData
  useEffect(() => {
    const base = parseFloat(precioBase || 0);
    const desc = parseFloat(descuento || 0);
    if (!isNaN(base)) {
      const validDesc = !isNaN(desc) ? Math.min(desc, base) : 0;
      const finalPrice = base - validDesc;
      const finalStr = finalPrice ? finalPrice.toString() : "";
      const descStr = validDesc ? validDesc.toString() : "";
      // Solo emitir cambios si difieren de formData (para prevenir renders en cadena)
      if (formData.precio_total !== finalStr) {
        onFormChange({ target: { name: "precio_total", value: finalStr } });
      }
      if (formData.descuento !== descStr) {
        onFormChange({ target: { name: "descuento", value: descStr } });
      }
    } else {
      if (formData.precio_total !== "") {
        onFormChange({ target: { name: "precio_total", value: "" } });
      }
      if (formData.descuento !== "") {
        onFormChange({ target: { name: "descuento", value: "" } });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [precioBase, descuento, formData.precio_total, formData.descuento]);

  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    const rawValue = value.replace(/,/g, "");
    if (!isNaN(rawValue) || rawValue === "") {
      onFormChange({ target: { name, value: rawValue } });
    }
  };

  const handlePrecioBaseChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (!isNaN(rawValue) || rawValue === "") setPrecioBase(rawValue);
  };

  const handleDescuentoChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (!isNaN(rawValue) || rawValue === "") setDescuento(rawValue);
  };

  const handleMonedaChange = (e) => {
    const value = sanitizeMoneda(e.target.value);
    onFormChange({ target: { name: "moneda", value } });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Selector de moneda */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          Moneda
        </label>
        <select
          name="moneda"
          value={moneda}
          onChange={handleMonedaChange}
          className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-md focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        >
          {MONEDAS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Columna principal: Total base, Descuento, Anticipo */}
        <div className="space-y-6 xl:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-start">
            <div className="flex flex-col h-full">
              <label className="flex flex-col text-sm font-medium text-gray-700 mb-1 sm:mb-2 min-h-[40px] sm:min-h-[44px] justify-start">
                Total del Paquete *
                <span className="text-xs text-gray-500 block">Precio base antes de descuento</span>
              </label>
              <input
                type="text"
                value={formatNumber(precioBase)}
                onChange={handlePrecioBaseChange}
                className={`w-full p-2.5 sm:p-3 border rounded-lg sm:rounded-md focus:ring-2 text-sm sm:text-base ${errors.precio_total ? "border-red-400 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                placeholder="Ej. 20,000"
                required
              />
              {errors.precio_total && (
                <p className="mt-1 text-xs text-red-600">{errors.precio_total}</p>
              )}
            </div>
            <div className="flex flex-col h-full">
              <label className="flex flex-col text-sm font-medium text-gray-700 mb-1 sm:mb-2 min-h-[40px] sm:min-h-[44px] justify-start">
                Descuento
                <span className="text-xs text-gray-500 block">Cantidad a restar</span>
              </label>
              <input
                type="text"
                value={formatNumber(descuento)}
                onChange={handleDescuentoChange}
                className={`w-full p-2.5 sm:p-3 border rounded-lg sm:rounded-md focus:ring-2 text-sm sm:text-base ${parseFloat(descuento||0) > parseFloat(precioBase||0) ? "border-red-400 focus:ring-red-500" : "border-gray-300 focus:ring-green-500"}`}
                placeholder="Ej. 1,000"
              />
              {parseFloat(descuento || 0) > parseFloat(precioBase || 0) && (
                <p className="mt-1 text-xs text-red-600">El descuento no puede exceder el total.</p>
              )}
              {calculations.montoDescuento > 0 && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <FiPercent className="w-3 h-3" /> {calculations.porcentajeDescuento}% de descuento
                </p>
              )}
            </div>
            <div className="flex flex-col h-full">
              <label className="flex flex-col text-sm font-medium text-gray-700 mb-1 sm:mb-2 min-h-[40px] sm:min-h-[44px] justify-start">
                Anticipo
                <span className="text-xs text-gray-500 block">Para reservar</span>
              </label>
              <input
                type="text"
                name="anticipo"
                value={formatNumber(formData.anticipo)}
                onChange={handleNumericChange}
                className={`w-full p-2.5 sm:p-3 border rounded-lg sm:rounded-md focus:ring-2 text-sm sm:text-base ${formData.anticipo && parseFloat(formData.anticipo) > calculations.precioFinal ? "border-red-400 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                placeholder="Ej. 5,000"
              />
              {formData.anticipo && parseFloat(formData.anticipo) > calculations.precioFinal && (
                <p className="mt-1 text-xs text-red-600">El anticipo supera el precio final.</p>
              )}
              {calculations.anticipo > 0 && calculations.precioFinal > 0 && parseFloat(formData.anticipo) <= calculations.precioFinal && (
                <p className="text-xs text-blue-600 mt-1">{calculations.porcentajeAnticipo}% del precio final</p>
              )}
            </div>
          </div>
          {/* Resumen dinámico */}
          {calculations.precioBase > 0 && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-slate-500 font-medium">Base</p>
                <p className="font-semibold text-slate-800">{formatCurrency(calculations.precioBase)}</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Descuento</p>
                <p className={`font-semibold ${calculations.montoDescuento > 0 ? "text-green-600" : "text-slate-400"}`}>
                  {calculations.montoDescuento > 0 ? `- ${formatCurrency(calculations.montoDescuento)}` : formatCurrency(0)}
                </p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Final</p>
                <p className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {formatCurrency(calculations.precioFinal)}
                </p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Saldo</p>
                <p className="font-semibold text-orange-600">
                  {formatCurrency(calculations.saldoPendiente > 0 ? calculations.saldoPendiente : 0)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Columna desglose (no altera total) */}
        <div className="space-y-4">
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 backdrop-blur-sm">
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-slate-800">Desglose (informativo)</h4>
              <p className="text-xs text-slate-500 mt-0.5">No modifica el total. Útil para mostrar vuelo y/o hospedaje.</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer select-none text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 focus:ring-blue-500"
                    checked={enableVuelo}
                    onChange={(e) => {
                      setEnableVuelo(e.target.checked);
                      if (!e.target.checked) {
                        onFormChange({ target: { name: "precio_vuelo", value: "" } });
                      }
                    }}
                  />
                  Incluir vuelo
                </label>
                {enableVuelo && (
                  <div>
                    <input
                      type="text"
                      name="precio_vuelo"
                      value={formatNumber(formData.precio_vuelo)}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/,/g, "");
                        if (!isNaN(raw) || raw === "") {
                          onFormChange({ target: { name: "precio_vuelo", value: raw } });
                        }
                      }}
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                      placeholder="Ej. 2,500"
                    />
                    <p className="mt-1 text-[11px] text-slate-500">Ejemplo: 2500 (sin símbolo)</p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer select-none text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 focus:ring-blue-500"
                    checked={enableHospedaje}
                    onChange={(e) => {
                      setEnableHospedaje(e.target.checked);
                      if (!e.target.checked) {
                        onFormChange({ target: { name: "precio_hospedaje", value: "" } });
                      }
                    }}
                  />
                  Incluir hospedaje
                </label>
                {enableHospedaje && (
                  <div>
                    <input
                      type="text"
                      name="precio_hospedaje"
                      value={formatNumber(formData.precio_hospedaje)}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/,/g, "");
                        if (!isNaN(raw) || raw === "") {
                          onFormChange({ target: { name: "precio_hospedaje", value: raw } });
                        }
                      }}
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                      placeholder="Ej. 3,800"
                    />
                    <p className="mt-1 text-[11px] text-slate-500">Ejemplo: 3800</p>
                  </div>
                )}
              </div>
              {(enableVuelo || enableHospedaje) && (
                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-400 flex flex-col gap-1">
                  <span>Puedes dejar cualquiera vacío o quitarlo.</span>
                  {calculations.excedeBase && (
                    <span className="flex items-center gap-1 text-red-500 font-medium">
                      <FiAlertTriangle className="w-3 h-3" /> El desglose supera el total base.
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Banner inferior de resumen final */}
      {calculations.precioFinal > 0 && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div>
              <p className="text-blue-600 font-semibold leading-tight">Precio Final</p>
              <p className="text-xl font-bold text-blue-700">{formatCurrency(calculations.precioFinal)}</p>
            </div>
            {calculations.montoDescuento > 0 && (
              <div>
                <p className="text-green-600 font-semibold leading-tight">Descuento</p>
                <p className="text-sm text-green-700 font-medium">- {formatCurrency(calculations.montoDescuento)} ({calculations.porcentajeDescuento}%)</p>
              </div>
            )}
            {calculations.anticipo > 0 && (
              <div>
                <p className="text-emerald-600 font-semibold leading-tight">Anticipo</p>
                <p className="text-sm text-emerald-700 font-medium">{formatCurrency(calculations.anticipo)} ({calculations.porcentajeAnticipo}%)</p>
              </div>
            )}
            {calculations.saldoPendiente > 0 && (
              <div>
                <p className="text-orange-600 font-semibold leading-tight">Saldo</p>
                <p className="text-sm text-orange-700 font-medium">{formatCurrency(calculations.saldoPendiente)}</p>
              </div>
            )}
          </div>
          <div className="text-[11px] text-blue-700 font-medium">
            El "Precio Final" se enviará como precio_total. El precio original se mostrará públicamente como Final + Descuento.
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingForm;
