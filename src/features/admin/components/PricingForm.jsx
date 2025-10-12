import React, { useState, useMemo, useEffect } from "react";
import { FiDollarSign, FiPercent, FiAlertTriangle, FiUsers, FiTrendingDown, FiCreditCard, FiTag, FiPackage, FiMapPin } from "react-icons/fi";
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
    const personasRaw = parseInt(formData.personas || 0, 10);
    const personasValidas = !isNaN(personasRaw) && personasRaw > 0 ? personasRaw : null;

    const validDesc = desc > 0 && desc <= base ? desc : desc > base ? base : 0;
    const finalPrice = base - validDesc;
    const montoDescuento = validDesc;
    const porcentajeDescuento = base > 0 && montoDescuento > 0 ? ((montoDescuento / base) * 100).toFixed(1) : 0;
    const porcentajeAnticipo = finalPrice > 0 && anticipo > 0 ? ((anticipo / finalPrice) * 100).toFixed(1) : 0;
    const saldoPendiente = finalPrice - anticipo;
    const sumaDesglose = vuelo + hospedaje;
    const precioPorPersona = personasValidas && finalPrice > 0 ? finalPrice / personasValidas : null;
    const precioBasePersona = personasValidas && base > 0 ? base / personasValidas : null;

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
      personas: personasValidas,
      precioPorPersona,
      precioBasePersona,
    };
  }, [precioBase, descuento, formData.anticipo, enableVuelo, enableHospedaje, formData.precio_vuelo, formData.precio_hospedaje, formData.personas]);

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
    <div className="space-y-6">
      {/* Header con selector de moneda mejorado */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <FiTag className="w-4 h-4 text-blue-600" />
              Moneda
            </label>
            <select
              name="moneda"
              value={moneda}
              onChange={handleMonedaChange}
              className="w-full p-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base font-medium bg-white shadow-sm hover:border-blue-300 transition-colors"
            >
              {MONEDAS.map((m) => (
                <option key={m} value={m}>
                  {m === "MXN" ? "🇲🇽 Peso Mexicano (MXN)" : "🇺🇸 Dólar Americano (USD)"}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sección principal: Precios */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
          <h4 className="font-bold text-slate-900 flex items-center gap-2">
            <FiDollarSign className="w-5 h-5 text-blue-600" />
            Precio Principal
          </h4>
          <p className="text-xs text-slate-600 mt-1">Configura el precio base y descuentos</p>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Grid de inputs principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Precio Base */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <FiDollarSign className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <span className="block">Precio Total *</span>
                  <span className="text-xs font-normal text-slate-500">Antes de descuento</span>
                </div>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-lg">
                  {moneda === "MXN" ? "$" : "$"}
                </span>
                <input
                  type="text"
                  value={formatNumber(precioBase)}
                  onChange={handlePrecioBaseChange}
                  className={`w-full pl-8 pr-3 py-3 border-2 rounded-xl focus:ring-2 text-base font-semibold transition-all ${
                    errors.precio_total 
                      ? "border-red-400 focus:ring-red-500 focus:border-red-500" 
                      : "border-slate-300 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-400"
                  }`}
                  placeholder="20,000"
                  required
                />
              </div>
              {errors.precio_total && (
                <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                  <FiAlertTriangle className="w-3 h-3" />
                  {errors.precio_total}
                </p>
              )}
            </div>

            {/* Descuento */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <div className="p-1.5 bg-green-100 rounded-lg">
                  <FiTrendingDown className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <span className="block">Descuento</span>
                  <span className="text-xs font-normal text-slate-500">Opcional</span>
                </div>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-lg">
                  {moneda === "MXN" ? "$" : "$"}
                </span>
                <input
                  type="text"
                  value={formatNumber(descuento)}
                  onChange={handleDescuentoChange}
                  className={`w-full pl-8 pr-3 py-3 border-2 rounded-xl focus:ring-2 text-base font-semibold transition-all ${
                    parseFloat(descuento||0) > parseFloat(precioBase||0) 
                      ? "border-red-400 focus:ring-red-500 focus:border-red-500" 
                      : "border-slate-300 focus:ring-green-500 focus:border-green-500 hover:border-slate-400"
                  }`}
                  placeholder="1,000"
                />
              </div>
              {parseFloat(descuento || 0) > parseFloat(precioBase || 0) && (
                <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                  <FiAlertTriangle className="w-3 h-3" />
                  No puede exceder el total
                </p>
              )}
              {calculations.montoDescuento > 0 && (
                <p className="mt-2 text-xs text-green-600 font-semibold flex items-center gap-1">
                  <FiPercent className="w-3 h-3" /> 
                  {calculations.porcentajeDescuento}% de ahorro
                </p>
              )}
            </div>

            {/* Anticipo */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <div className="p-1.5 bg-emerald-100 rounded-lg">
                  <FiCreditCard className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <span className="block">Anticipo</span>
                  <span className="text-xs font-normal text-slate-500">Para reservar</span>
                </div>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-lg">
                  {moneda === "MXN" ? "$" : "$"}
                </span>
                <input
                  type="text"
                  name="anticipo"
                  value={formatNumber(formData.anticipo)}
                  onChange={handleNumericChange}
                  className={`w-full pl-8 pr-3 py-3 border-2 rounded-xl focus:ring-2 text-base font-semibold transition-all ${
                    formData.anticipo && parseFloat(formData.anticipo) > calculations.precioFinal 
                      ? "border-red-400 focus:ring-red-500 focus:border-red-500" 
                      : "border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 hover:border-slate-400"
                  }`}
                  placeholder="5,000"
                />
              </div>
              {formData.anticipo && parseFloat(formData.anticipo) > calculations.precioFinal && (
                <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                  <FiAlertTriangle className="w-3 h-3" />
                  Supera el precio final
                </p>
              )}
              {calculations.anticipo > 0 && calculations.precioFinal > 0 && parseFloat(formData.anticipo) <= calculations.precioFinal && (
                <p className="mt-2 text-xs text-emerald-600 font-semibold">
                  {calculations.porcentajeAnticipo}% del total
                </p>
              )}
            </div>

            {/* Personas */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <div className="p-1.5 bg-purple-100 rounded-lg">
                  <FiUsers className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <span className="block">Personas</span>
                  <span className="text-xs font-normal text-slate-500">Capacidad base</span>
                </div>
              </label>
              <input
                type="text"
                name="personas"
                inputMode="numeric"
                pattern="[0-9]*"
                value={formData.personas || ""}
                onChange={(e) =>
                  onFormChange({ target: { name: "personas", value: e.target.value } })
                }
                className={`w-full px-3 py-3 border-2 rounded-xl focus:ring-2 text-base font-semibold transition-all text-center ${
                  errors.personas 
                    ? "border-red-400 focus:ring-red-500 focus:border-red-500" 
                    : "border-slate-300 focus:ring-purple-500 focus:border-purple-500 hover:border-slate-400"
                }`}
                placeholder="2"
              />
              <p className="mt-2 text-xs text-slate-500">Vacío = precio total</p>
              {errors.personas && (
                <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                  <FiAlertTriangle className="w-3 h-3" />
                  {errors.personas}
                </p>
              )}
            </div>
          </div>

          {/* Tarjetas de resumen visual mejorado */}
          {calculations.precioBase > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
                <p className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wide">Precio Base</p>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(calculations.precioBase)}</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
                <p className="text-xs font-semibold text-green-600 mb-1 uppercase tracking-wide">Descuento</p>
                <p className={`text-2xl font-bold ${calculations.montoDescuento > 0 ? "text-green-900" : "text-slate-400"}`}>
                  {calculations.montoDescuento > 0 ? `- ${formatCurrency(calculations.montoDescuento)}` : formatCurrency(0)}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border-2 border-indigo-200">
                <p className="text-xs font-semibold text-indigo-600 mb-1 uppercase tracking-wide">Precio Final</p>
                <p className="text-2xl font-bold text-indigo-900">{formatCurrency(calculations.precioFinal)}</p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border-2 border-orange-200">
                <p className="text-xs font-semibold text-orange-600 mb-1 uppercase tracking-wide">Saldo</p>
                <p className="text-2xl font-bold text-orange-900">
                  {formatCurrency(calculations.saldoPendiente > 0 ? calculations.saldoPendiente : 0)}
                </p>
              </div>
              
              {calculations.personas && (
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
                  <p className="text-xs font-semibold text-purple-600 mb-1 uppercase tracking-wide flex items-center gap-1">
                    <FiUsers className="w-3 h-3" /> 
                    Por Persona ({calculations.personas})
                  </p>
                  <p className="text-2xl font-bold text-purple-900">{formatCurrency(calculations.precioPorPersona)}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sección desglose: Vuelo y Hospedaje */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
          <h4 className="font-bold text-slate-900 flex items-center gap-2">
            <FiPackage className="w-5 h-5 text-blue-600" />
            Desglose de Servicios
          </h4>
          <p className="text-xs text-slate-600 mt-1">Opcional. Muestra vuelo y/o hospedaje sin modificar el precio total</p>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Vuelo */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                className="w-5 h-5 rounded-lg border-2 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 transition-all"
                checked={enableVuelo}
                onChange={(e) => {
                  setEnableVuelo(e.target.checked);
                  if (!e.target.checked) {
                    onFormChange({ target: { name: "precio_vuelo", value: "" } });
                  }
                }}
              />
              <div className="flex items-center gap-2 flex-1">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <FiPackage className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <span className="font-semibold text-slate-800 block">Incluir costo de vuelo</span>
                  <span className="text-xs text-slate-500">Referencial para viajeros</span>
                </div>
              </div>
            </label>
            {enableVuelo && (
              <div className="ml-11 space-y-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-lg">
                    {moneda === "MXN" ? "$" : "$"}
                  </span>
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
                    className="w-full pl-8 pr-3 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base font-semibold bg-white hover:border-blue-300 transition-colors"
                    placeholder="2,500"
                  />
                </div>
                <p className="text-xs text-slate-500">Ingresa solo números (Ej: 2500)</p>
              </div>
            )}
          </div>

          {/* Hospedaje */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                className="w-5 h-5 rounded-lg border-2 border-slate-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500 transition-all"
                checked={enableHospedaje}
                onChange={(e) => {
                  setEnableHospedaje(e.target.checked);
                  if (!e.target.checked) {
                    onFormChange({ target: { name: "precio_hospedaje", value: "" } });
                  }
                }}
              />
              <div className="flex items-center gap-2 flex-1">
                <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                  <FiMapPin className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <span className="font-semibold text-slate-800 block">Incluir costo de hospedaje</span>
                  <span className="text-xs text-slate-500">Referencial para viajeros</span>
                </div>
              </div>
            </label>
            {enableHospedaje && (
              <div className="ml-11 space-y-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-lg">
                    {moneda === "MXN" ? "$" : "$"}
                  </span>
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
                    className="w-full pl-8 pr-3 py-3 border-2 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base font-semibold bg-white hover:border-emerald-300 transition-colors"
                    placeholder="3,800"
                  />
                </div>
                <p className="text-xs text-slate-500">Ingresa solo números (Ej: 3800)</p>
              </div>
            )}
          </div>

          {/* Advertencia si excede */}
          {(enableVuelo || enableHospedaje) && (
            <div className="pt-4 border-t border-slate-200">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs text-slate-600 flex items-center gap-2">
                  <FiAlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Este desglose es informativo. Puedes dejarlo vacío o desactivarlo en cualquier momento.</span>
                </p>
                {calculations.excedeBase && (
                  <p className="text-xs text-red-600 font-semibold flex items-center gap-2 mt-2">
                    <FiAlertTriangle className="w-4 h-4 flex-shrink-0" /> 
                    El desglose supera el precio base del paquete.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Banner inferior de resumen final */}
      {calculations.precioFinal > 0 && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl border-2 border-blue-400 p-6 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-start lg:justify-between">
            {/* Sección de métricas */}
            <div className="flex flex-wrap gap-6">
              <div className="space-y-1">
                <p className="text-blue-100 text-xs font-semibold uppercase tracking-wide flex items-center gap-1">
                  <FiDollarSign className="w-3.5 h-3.5" />
                  Precio Final
                </p>
                <p className="text-3xl font-bold text-white">{formatCurrency(calculations.precioFinal)}</p>
              </div>
              
              {calculations.montoDescuento > 0 && (
                <div className="space-y-1">
                  <p className="text-green-200 text-xs font-semibold uppercase tracking-wide flex items-center gap-1">
                    <FiTrendingDown className="w-3.5 h-3.5" />
                    Descuento
                  </p>
                  <p className="text-xl font-bold text-green-100">
                    - {formatCurrency(calculations.montoDescuento)} 
                    <span className="text-sm ml-2 text-green-200">({calculations.porcentajeDescuento}%)</span>
                  </p>
                </div>
              )}
              
              {calculations.anticipo > 0 && (
                <div className="space-y-1">
                  <p className="text-emerald-200 text-xs font-semibold uppercase tracking-wide flex items-center gap-1">
                    <FiCreditCard className="w-3.5 h-3.5" />
                    Anticipo
                  </p>
                  <p className="text-xl font-bold text-emerald-100">
                    {formatCurrency(calculations.anticipo)}
                    <span className="text-sm ml-2 text-emerald-200">({calculations.porcentajeAnticipo}%)</span>
                  </p>
                </div>
              )}
            </div>
            
            {/* Sección de desglose */}
            <div className="lg:max-w-md space-y-3">
              {calculations.personas && calculations.precioPorPersona && (
                <div className="bg-purple-500/20 backdrop-blur-sm rounded-xl p-4 border border-purple-300/30">
                  <p className="text-xs text-purple-50 leading-relaxed flex items-start gap-2">
                    <FiUsers className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>
                      Equivale a <span className="font-bold text-white">{formatCurrency(calculations.precioPorPersona)}</span> por 
                      persona para <span className="font-bold text-white">{calculations.personas}</span> viajero{calculations.personas > 1 ? "s" : ""}.
                    </span>
                  </p>
                </div>
              )}
              
              {(calculations.precioVuelo > 0 || calculations.precioHospedaje > 0) && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <p className="text-xs font-semibold text-blue-100 mb-2 uppercase tracking-wide">Desglose de Servicios</p>
                  <div className="space-y-1.5">
                    {calculations.precioVuelo > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-blue-50 flex items-center gap-1.5">
                          <FiPackage className="w-3.5 h-3.5" />
                          Vuelo
                        </span>
                        <span className="font-semibold text-white">{formatCurrency(calculations.precioVuelo)}</span>
                      </div>
                    )}
                    {calculations.precioHospedaje > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-blue-50 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          Hospedaje
                        </span>
                        <span className="font-semibold text-white">{formatCurrency(calculations.precioHospedaje)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingForm;
