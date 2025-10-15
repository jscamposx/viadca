import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSave,
  FiRefreshCw,
  FiSettings,
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiInstagram,
  FiFacebook,
  FiYoutube,
  FiLink,
  FiInfo,
  FiCheckCircle,
  FiAlertCircle,
  FiEye,
} from "react-icons/fi";
import contactService from "../../../api/contactService";

const EMPTY = {
  telefono: "",
  email: "",
  whatsapp: "",
  direccion: "",
  horario: "",
  facebook: "",
  instagram: "",
  tiktok: "",
  youtube: "",
};

const fieldMeta = [
  {
    key: "telefono",
    label: "Teléfono",
    icon: FiPhone,
    type: "tel",
    placeholder: "+51 999 999 999",
    group: "contacto",
  },
  {
    key: "email",
    label: "Email",
    icon: FiMail,
    type: "email",
    placeholder: "contacto@viadca.app",
    group: "contacto",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: FiPhone,
    type: "tel",
    placeholder: "+51 999 999 999",
    group: "contacto",
  },
  {
    key: "direccion",
    label: "Dirección",
    icon: FiMapPin,
    type: "text",
    placeholder: "Av. Principal 123",
    group: "contacto",
  },
  {
    key: "horario",
    label: "Horario",
    icon: FiClock,
    type: "text",
    placeholder: "L-V 9:00-18:00",
    group: "contacto",
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: FiFacebook,
    type: "url",
    placeholder: "https://facebook.com/viadca",
    group: "redes",
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: FiInstagram,
    type: "url",
    placeholder: "https://instagram.com/viadca",
    group: "redes",
  },
  {
    key: "tiktok",
    label: "TikTok",
    icon: FiLink,
    type: "url",
    placeholder: "https://tiktok.com/@viadca",
    group: "redes",
  },
  {
    key: "youtube",
    label: "YouTube",
    icon: FiYoutube,
    type: "url",
    placeholder: "https://youtube.com/@viadca",
    group: "redes",
  },
];

const AdminConfigPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(EMPTY);
  const [initial, setInitial] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const dirty = useMemo(
    () => JSON.stringify(data) !== JSON.stringify(initial),
    [data, initial],
  );

  const fetchData = async (force = false) => {
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await contactService.getContacto(force);
      const normalized = Object.fromEntries(
        Object.entries(res).map(([k, v]) => [k, v ?? ""]),
      );
      setData({ ...EMPTY, ...normalized });
      setInitial({ ...EMPTY, ...normalized });
    } catch (e) {
      setMessage({ text: "No se pudo cargar el contacto", type: "error" });
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(false);
  }, []);

  const handleChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const getDiff = (next, prev) => {
    const diff = {};
    Object.keys(next).forEach((k) => {
      const a = (prev[k] ?? "").trim();
      const b = (next[k] ?? "").trim();
      if (a !== b) diff[k] = next[k];
    });
    return diff;
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ text: "", type: "" });
    try {
      const hasAny = Object.values(initial).some((v) => (v ?? "") !== "");
      if (!hasAny) {
        const res = await contactService.createOrReplaceContacto(data);
        const normalized = Object.fromEntries(
          Object.entries(res).map(([k, v]) => [k, v ?? ""]),
        );
        setInitial({ ...EMPTY, ...normalized });
        setData({ ...EMPTY, ...normalized });
        setMessage({ text: "Contacto creado exitosamente", type: "success" });
      } else {
        const partial = getDiff(data, initial);
        const res = await contactService.updateContacto(partial);
        const normalized = Object.fromEntries(
          Object.entries(res).map(([k, v]) => [k, v ?? ""]),
        );
        setInitial({ ...EMPTY, ...normalized });
        setData({ ...EMPTY, ...normalized });
        setMessage({
          text: "Cambios guardados correctamente",
          type: "success",
        });
      }
    } catch (e) {
      setMessage({ text: "Error al guardar los cambios", type: "error" });
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // Reemplaza "Limpiar" por vista previa del sitio (footer) en nueva pestaña
  const handlePreview = () => {
    const url = `${window.location.origin}/#footer`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Agrupar campos por categoría
  const groupedFields = fieldMeta.reduce((acc, field) => {
    if (!acc[field.group]) acc[field.group] = [];
    acc[field.group].push(field);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 sm:items-center">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg ring-1 ring-white/70 shrink-0">
                <FiSettings className="w-5 h-5 sm:w-6 sm:h-6 flex-none" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-800 leading-tight">
                  Configuración de Contacto
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Administra la información de contacto pública
                </p>
              </div>
            </div>

            {/* Botones: mejor responsive en móvil */}
            <div className="grid grid-cols-2 w-full gap-2 sm:w-auto sm:flex sm:flex-wrap sm:justify-center sm:gap-3">
              <button
                onClick={() => fetchData(true)}
                disabled={loading || saving}
                className="col-span-1 w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                <FiRefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                <span>Recargar</span>
              </button>
              <button
                onClick={handlePreview}
                disabled={saving || loading}
                className="col-span-1 w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                title="Abrir vista previa del footer en una nueva pestaña"
              >
                <FiEye className="w-4 h-4" />
                <span>Vista previa</span>
              </button>
              <button
                onClick={handleSave}
                disabled={!dirty || saving || loading}
                className="col-span-2 w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                <FiSave
                  className={`w-4 h-4 ${saving ? "animate-pulse" : ""}`}
                />
                <span>Guardar</span>
              </button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  loading || saving
                    ? "bg-blue-500 animate-pulse"
                    : dirty
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
              ></div>
              <span className="text-sm font-medium text-gray-700">
                {loading || saving
                  ? "Procesando..."
                  : dirty
                    ? "Cambios sin guardar"
                    : "Todo guardado"}
              </span>
            </div>

            {message.text && (
              <div
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                  message.type === "error"
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {message.type === "error" ? (
                  <FiAlertCircle className="w-5 h-5" />
                ) : (
                  <FiCheckCircle className="w-5 h-5" />
                )}
                {message.text}
              </div>
            )}
          </div>
        </div>

        {/* Form Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sección de Contacto */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FiPhone className="text-blue-500" />
                Información de Contacto
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Detalles para que los clientes puedan contactarte
              </p>
            </div>

            <div className="p-6 grid grid-cols-1 gap-5">
              {groupedFields.contacto.map(
                ({ key, label, icon: Icon, type, placeholder }) => (
                  <div key={key} className="space-y-2">
                    <label
                      htmlFor={key}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {label}
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <input
                        id={key}
                        name={key}
                        type={type}
                        value={data[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                        placeholder={placeholder}
                        disabled={loading || saving}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Sección de Redes Sociales */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FiInstagram className="text-purple-500" />
                Redes Sociales
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Enlaces a tus perfiles en redes sociales
              </p>
            </div>

            <div className="p-6 grid grid-cols-1 gap-5">
              {groupedFields.redes.map(
                ({ key, label, icon: Icon, type, placeholder }) => (
                  <div key={key} className="space-y-2">
                    <label
                      htmlFor={key}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {label}
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <input
                        id={key}
                        name={key}
                        type={type}
                        value={data[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                        placeholder={placeholder}
                        disabled={loading || saving}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Nota informativa */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
          <div className="mt-1">
            <FiInfo className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-sm text-blue-700">
            Todos los campos son opcionales. Los cambios se aplicarán
            inmediatamente después de guardar. Las URLs deben incluir el
            protocolo (ej: https://).
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminConfigPage;
