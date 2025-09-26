import React, { useState, useMemo, useEffect, useCallback } from "react";
import { FiDollarSign, FiTag, FiX, FiPercent } from "react-icons/fi";
import { formatPrecio, sanitizeMoneda } from "../../../utils/priceUtils";

const PricingForm = ({ formData, onFormChange, errors = {} }) => {
  const [showDiscount, setShowDiscount] = useState(!!formData.descuento);
  const [precioOriginal, setPrecioOriginal] = useState(
    formData.precio_original || formData.precio_total || "",
  );
  const [precioConDescuento, setPrecioConDescuento] = useState(
    formData.descuento ? formData.precio_total || "" : "",
  );
  // Toggles para desgloses opcionales
  const [enableVuelo, setEnableVuelo] = useState(
    formData.precio_vuelo !== undefined && formData.precio_vuelo !== null && formData.precio_vuelo !== ""
  );
  const [enableHospedaje, setEnableHospedaje] = useState(
    formData.precio_hospedaje !== undefined && formData.precio_hospedaje !== null && formData.precio_hospedaje !== ""
  );

  // Moneda
  const MONEDAS = ["MXN", "USD"];
  const moneda = sanitizeMoneda(formData.moneda || "MXN");

  useEffect(() => {
    if (
      formData.descuento &&
      parseFloat(formData.descuento) > 0 &&
      formData.precio_total
    ) {
      const original =
        parseFloat(formData.precio_total) + parseFloat(formData.descuento);
      setPrecioOriginal(original.toString());
      setPrecioConDescuento(formData.precio_total);
      setShowDiscount(true);
    } else if (
      formData.precio_total &&
      (!formData.descuento || parseFloat(formData.descuento) === 0)
    ) {
      setPrecioOriginal(formData.precio_total);
      setPrecioConDescuento("");
      setShowDiscount(false);
    } else if (formData.precio_total && !precioConDescuento) {
      setPrecioConDescuento(formData.precio_total);
    }
  }, [formData.precio_total, formData.descuento, formData.precio_original]);

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
    const original = parseFloat(precioOriginal || 0);
    const conDescuento = parseFloat(precioConDescuento || 0);
    const anticipo = parseFloat(formData.anticipo || 0);
    const vuelo = enableVuelo ? parseFloat(formData.precio_vuelo || 0) : 0;
    const hospedaje = enableHospedaje
      ? parseFloat(formData.precio_hospedaje || 0)
      : 0;

    const montoDescuento =
      showDiscount && original > 0 && conDescuento > 0
        ? original - conDescuento
        : 0;

    const porcentajeDescuento =
      original > 0 && montoDescuento > 0
        ? ((montoDescuento / original) * 100).toFixed(1)
        : 0;

    const precioFinal = showDiscount ? conDescuento : original;

    const porcentajeAnticipo =
      precioFinal > 0 && anticipo > 0
        ? ((anticipo / precioFinal) * 100).toFixed(1)
        : 0;

    return {
      precioOriginal: original,
      precioFinal: precioFinal,
      montoDescuento: montoDescuento,
      porcentajeDescuento: porcentajeDescuento,
      anticipo: anticipo,
      porcentajeAnticipo: porcentajeAnticipo,
      saldoPendiente: precioFinal - anticipo,
      vuelo,
      hospedaje,
    };
  }, [
    precioOriginal,
    precioConDescuento,
    formData.anticipo,
    showDiscount,
    enableVuelo,
    enableHospedaje,
    formData.precio_vuelo,
    formData.precio_hospedaje,
  ]);

  const sumComponentsToTotal = useCallback(() => {
    const vuelo = enableVuelo ? parseFloat(formData.precio_vuelo || 0) : 0;
    const hospedaje = enableHospedaje
      ? parseFloat(formData.precio_hospedaje || 0)
      : 0;
    const base = showDiscount
      ? parseFloat(precioConDescuento || 0)
      : parseFloat(precioOriginal || 0);
    const sum = [base, vuelo, hospedaje]
      .filter((v) => !isNaN(v) && v > 0)
      .reduce((a, b) => a + b, 0);
    if (sum > 0) {
      onFormChange({ target: { name: "precio_total", value: String(sum) } });
      if (showDiscount) {
        setPrecioConDescuento(String(sum));
      } else {
        setPrecioOriginal(String(sum));
      }
    }
  }, [
    enableVuelo,
    enableHospedaje,
    formData.precio_vuelo,
    formData.precio_hospedaje,
    showDiscount,
    precioOriginal,
    precioConDescuento,
    onFormChange,
  ]);

  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    const rawValue = value.replace(/,/g, "");
    if (!isNaN(rawValue) || rawValue === "") {
      onFormChange({ target: { name, value: rawValue } });
    }
  };

  const handlePrecioOriginalChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (!isNaN(rawValue) || rawValue === "") {
      setPrecioOriginal(rawValue);

      if (!showDiscount) {
        onFormChange({ target: { name: "precio_total", value: rawValue } });
      }

      if (showDiscount && rawValue && precioConDescuento) {
        const original = parseFloat(rawValue);
        const conDesc = parseFloat(precioConDescuento);
        const desc = original - conDesc;
        if (desc >= 0) {
          onFormChange({
            target: { name: "descuento", value: desc.toString() },
          });
        }
      }
    }
  };

  const handlePrecioConDescuentoChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (!isNaN(rawValue) || rawValue === "") {
      setPrecioConDescuento(rawValue);

      onFormChange({ target: { name: "precio_total", value: rawValue } });

      if (rawValue && precioOriginal) {
        const original = parseFloat(precioOriginal);
        const conDesc = parseFloat(rawValue);
        const desc = original - conDesc;
        if (desc >= 0) {
          onFormChange({
            target: { name: "descuento", value: desc.toString() },
          });
        }
      }
    }
  };

  const handleToggleDiscount = () => {
    if (showDiscount) {
      onFormChange({ target: { name: "precio_total", value: precioOriginal } });
      onFormChange({ target: { name: "descuento", value: "" } });
      setPrecioConDescuento("");
    } else {
      setPrecioConDescuento(precioOriginal);
    }
    setShowDiscount(!showDiscount);
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
        {/* Columna principal precios / descuento */}
        <div className="space-y-6 xl:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                {showDiscount ? "Precio Original *" : "Precio Total *"}
                <span className="text-xs text-gray-500 block">
                  {showDiscount
                    ? "(Antes del descuento)"
                    : "(Lo que paga el cliente)"}
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formatNumber(precioOriginal)}
                  onChange={handlePrecioOriginalChange}
                  className={`w-full p-2.5 sm:p-3 border rounded-lg sm:rounded-md focus:ring-2 text-sm sm:text-base ${
                    errors.precio_total ? "border-red-400 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="Ej. 5,000"
                  required
                />
                {errors.precio_total && (
                  <p className="mt-1 text-xs text-red-600">{errors.precio_total}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Anticipo
                <span className="text-xs text-gray-500 block">(Para reservar)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="anticipo"
                  value={formatNumber(formData.anticipo)}
                  onChange={handleNumericChange}
                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-md focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="Ej. 1,000"
                />
              </div>
              {calculations.anticipo > 0 && (
                <p className="text-xs text-blue-600 mt-1">
                  {calculations.porcentajeAnticipo}% del precio final
                </p>
              )}
            </div>
            <div>
              {!showDiscount ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    <span className="opacity-0">Placeholder</span>
                    <span className="text-xs text-gray-500 block opacity-0">
                      (Placeholder)
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={handleToggleDiscount}
                    className="flex items-center justify-center w-full p-2.5 sm:p-3 border border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 text-green-600 transition-all duration-200 text-sm sm:text-base"
                  >
                    <FiTag className="mr-2 w-4 h-4" /> Agregar descuento
                  </button>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Precio Final *
                    <span className="text-xs text-gray-500 block">
                      (Con descuento aplicado)
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formatNumber(precioConDescuento)}
                      onChange={handlePrecioConDescuentoChange}
                      className={`w-full pr-10 p-2.5 sm:p-3 border rounded-lg sm:rounded-md focus:ring-2 text-sm sm:text-base ${
                        errors.precio_total ? "border-red-400 focus:ring-red-500" : "border-gray-300 focus:ring-green-500"
                      }`}
                      placeholder="4,500"
                      required
                    />
                    {errors.precio_total && (
                      <p className="mt-1 text-xs text-red-600">{errors.precio_total}</p>
                    )}
                    <button
                      type="button"
                      onClick={handleToggleDiscount}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-red-500 transition-colors"
                      title="Quitar descuento"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Columna desglose opcional */}
        <div className="space-y-4">
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Detalle de precios</h4>
                <p className="text-xs text-slate-500 mt-0.5">Agrega vuelo y/o hospedaje si quieres mostrarlo separado</p>
              </div>
              <button
                type="button"
                onClick={sumComponentsToTotal}
                className="text-xs px-2.5 py-1.5 rounded-md bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 font-medium shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={!enableVuelo && !enableHospedaje}
              >
                Actualizar total
              </button>
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
                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-400">
                  Puedes dejar cualquiera vacío o quitarlo.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showDiscount && calculations.montoDescuento > 0 && (
        <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex items-center text-green-700">
                <FiPercent className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">
                  Descuento aplicado: {calculations.porcentajeDescuento}%
                </span>
              </div>
              <div className="text-green-600 text-sm">
                Ahorro: {formatCurrency(calculations.montoDescuento)}
              </div>
            </div>
            <div className="text-green-800 font-semibold">
              {formatCurrency(calculations.precioOriginal)} →{" "}
              {formatCurrency(calculations.precioFinal)}
            </div>
          </div>
        </div>
      )}

      {calculations.precioFinal > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(calculations.precioFinal)}
              </div>
              <div className="text-sm text-blue-500">
                Precio final por persona
              </div>
            </div>
            {(enableVuelo || enableHospedaje) && (
              <div className="md:col-span-2 flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-slate-600">
                {enableVuelo && (
                  <div>
                    Vuelo: {formatCurrency(calculations.vuelo)}
                  </div>
                )}
                {enableHospedaje && (
                  <div>
                    Hospedaje: {formatCurrency(calculations.hospedaje)}
                  </div>
                )}
                <button
                  type="button"
                  onClick={sumComponentsToTotal}
                  className="px-3 py-1.5 bg-white border border-blue-200 rounded-md shadow-sm hover:bg-blue-50 text-blue-600 text-xs"
                >
                  Actualizar total
                </button>
              </div>
            )}
            {calculations.anticipo > 0 && (
              <div>
                <div className="text-xl font-semibold text-green-600">
                  {formatCurrency(calculations.anticipo)}
                </div>
                <div className="text-sm text-green-500">
                  Anticipo ({calculations.porcentajeAnticipo}%)
                </div>
              </div>
            )}
            {calculations.saldoPendiente > 0 && (
              <div>
                <div className="text-xl font-semibold text-orange-600">
                  {formatCurrency(calculations.saldoPendiente)}
                </div>
                <div className="text-sm text-orange-500">Saldo pendiente</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingForm;
