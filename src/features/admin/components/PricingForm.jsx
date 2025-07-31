import React, { useState, useMemo, useEffect } from "react";
import { FiDollarSign, FiTag, FiX, FiPercent } from "react-icons/fi";

const PricingForm = ({ formData, onFormChange }) => {
  const [showDiscount, setShowDiscount] = useState(!!formData.descuento);
  const [precioOriginal, setPrecioOriginal] = useState(
    formData.precio_original || "",
  );
  const [precioConDescuento, setPrecioConDescuento] = useState(
    formData.precio_total || "",
  );

  // Efecto para sincronizar estados locales con formData cuando cambia
  useEffect(() => {
    // Si hay descuento, calcular el precio original
    if (formData.descuento && parseFloat(formData.descuento) > 0 && formData.precio_total) {
      const original = parseFloat(formData.precio_total) + parseFloat(formData.descuento);
      setPrecioOriginal(original.toString());
      setPrecioConDescuento(formData.precio_total);
      setShowDiscount(true);
    } 
    // Si no hay descuento pero sí precio total, usar precio total como original
    else if (formData.precio_total && (!formData.descuento || parseFloat(formData.descuento) === 0)) {
      setPrecioOriginal(formData.precio_total);
      setPrecioConDescuento("");
      setShowDiscount(false);
    }
    // Si no hay precio con descuento pero sí precio total
    else if (formData.precio_total && !precioConDescuento) {
      setPrecioConDescuento(formData.precio_total);
    }
  }, [formData.precio_total, formData.descuento, formData.precio_original]);

  const formatNumber = (value) => {
    if (!value) return "";
    const numberValue = parseFloat(String(value).replace(/,/g, ""));
    return isNaN(numberValue) ? "" : numberValue.toLocaleString("es-MX");
  };

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return "$0";
    return parseFloat(value).toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const calculations = useMemo(() => {
    const original = parseFloat(precioOriginal || 0);
    const conDescuento = parseFloat(precioConDescuento || 0);
    const anticipo = parseFloat(formData.anticipo || 0);

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
    };
  }, [precioOriginal, precioConDescuento, formData.anticipo, showDiscount]);

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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {showDiscount ? "Precio Original *" : "Precio Total *"}
            <span className="text-xs text-gray-500 block">
              {showDiscount
                ? "(Antes del descuento)"
                : "(Lo que paga el cliente)"}
            </span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <FiDollarSign />
            </span>
            <input
              type="text"
              value={formatNumber(precioOriginal)}
              onChange={handlePrecioOriginalChange}
              className="w-full pl-8 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Ej. 5,000"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Anticipo
            <span className="text-xs text-gray-500 block">(Para reservar)</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <FiDollarSign />
            </span>
            <input
              type="text"
              name="anticipo"
              value={formatNumber(formData.anticipo)}
              onChange={handleNumericChange}
              className="w-full pl-8 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
            <div className="flex flex-col justify-end h-full">
              <button
                type="button"
                onClick={handleToggleDiscount}
                className="flex items-center justify-center w-full py-3 px-4 border border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 text-green-600 transition-all duration-200"
              >
                <FiTag className="mr-2" /> Agregar descuento
              </button>
            </div>
          ) : (
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio Final *
                <span className="text-xs text-gray-500 block">
                  (Con descuento aplicado)
                </span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <FiDollarSign />
                </span>
                <input
                  type="text"
                  value={formatNumber(precioConDescuento)}
                  onChange={handlePrecioConDescuentoChange}
                  className="w-full pl-8 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="Ej. 4,500"
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleToggleDiscount}
                className="absolute top-0 right-0 p-1 text-gray-500 hover:text-red-500 transition-colors"
                title="Quitar descuento"
              >
                <FiX />
              </button>
            </div>
          )}
        </div>
      </div>

      {showDiscount && calculations.montoDescuento > 0 && (
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
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
