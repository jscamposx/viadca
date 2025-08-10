import React, { useEffect, useMemo, useState } from 'react';
import { FiSave, FiRefreshCw, FiTrash2, FiEdit2, FiDatabase, FiPhone, FiMail, FiMapPin, FiClock, FiInstagram, FiFacebook, FiYoutube } from 'react-icons/fi';
import contactService from '../../../api/contactService';

const EMPTY = {
  telefono: '',
  email: '',
  whatsapp: '',
  direccion: '',
  horario: '',
  facebook: '',
  instagram: '',
  tiktok: '',
  youtube: '',
};

const fieldMeta = [
  { key: 'telefono', label: 'Teléfono', icon: FiPhone, type: 'tel', placeholder: '+51 999 999 999' },
  { key: 'email', label: 'Email', icon: FiMail, type: 'email', placeholder: 'contacto@viadca.app' },
  { key: 'whatsapp', label: 'WhatsApp', icon: FiPhone, type: 'tel', placeholder: '+51 999 999 999' },
  { key: 'direccion', label: 'Dirección', icon: FiMapPin, type: 'text', placeholder: 'Av. Principal 123' },
  { key: 'horario', label: 'Horario', icon: FiClock, type: 'text', placeholder: 'L-V 9:00-18:00' },
  { key: 'facebook', label: 'Facebook', icon: FiFacebook, type: 'url', placeholder: 'https://facebook.com/viadca' },
  { key: 'instagram', label: 'Instagram', icon: FiInstagram, type: 'url', placeholder: 'https://instagram.com/viadca' },
  { key: 'tiktok', label: 'TikTok', icon: FiEdit2, type: 'url', placeholder: 'https://tiktok.com/@viadca' },
  { key: 'youtube', label: 'YouTube', icon: FiYoutube, type: 'url', placeholder: 'https://youtube.com/@viadca' },
];

const AdminConfigPage = () => {
  const [data, setData] = useState(EMPTY);
  const [initial, setInitial] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const dirty = useMemo(() => JSON.stringify(data) !== JSON.stringify(initial), [data, initial]);

  const fetchData = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await contactService.getContacto();
      const normalized = Object.fromEntries(Object.entries(res).map(([k, v]) => [k, v ?? '']));
      setData({ ...EMPTY, ...normalized });
      setInitial({ ...EMPTY, ...normalized });
    } catch (e) {
      setMessage('No se pudo cargar el contacto');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // Calcula el diff respecto al estado inicial (ignora cambios solo de espacios)
  const getDiff = (next, prev) => {
    const diff = {};
    Object.keys(next).forEach((k) => {
      const a = (prev[k] ?? '').trim();
      const b = (next[k] ?? '').trim();
      if (a !== b) diff[k] = next[k];
    });
    return diff;
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      // Crear o reemplazar si nunca hubo datos (todas las cadenas vacías) o hacer PATCH si hay datos previos
      const hasAny = Object.values(initial).some((v) => (v ?? '') !== '');
      if (!hasAny) {
        const res = await contactService.createOrReplaceContacto(data);
        const normalized = Object.fromEntries(Object.entries(res).map(([k, v]) => [k, v ?? '']));
        setInitial({ ...EMPTY, ...normalized });
        setData({ ...EMPTY, ...normalized });
        setMessage('Contacto creado / reemplazado');
      } else {
        const partial = getDiff(data, initial);
        const res = await contactService.updateContacto(partial);
        const normalized = Object.fromEntries(Object.entries(res).map(([k, v]) => [k, v ?? '']));
        setInitial({ ...EMPTY, ...normalized });
        setData({ ...EMPTY, ...normalized });
        setMessage('Contacto actualizado');
      }
    } catch (e) {
      setMessage('Error al guardar');
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleClear = async () => {
    if (!confirm('¿Limpiar todos los campos del contacto?')) return;
    setSaving(true);
    setMessage('');
    try {
      const res = await contactService.clearContacto();
      const normalized = Object.fromEntries(Object.entries(res).map(([k, v]) => [k, v ?? '']));
      setInitial({ ...EMPTY, ...normalized });
      setData({ ...EMPTY, ...normalized });
      setMessage('Campos limpiados');
    } catch (e) {
      setMessage('Error al limpiar');
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 sm:p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center shadow">
                <FiDatabase className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Ajustes · Contacto</h1>
                <p className="text-gray-600 text-sm">Gestiona la información pública de contacto</p>
                <div className="mt-2">
                  <span
                    className={
                      'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ' +
                      ((loading || saving)
                        ? 'bg-blue-100 text-blue-800'
                        : dirty
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800')
                    }
                  >
                    {loading || saving ? (
                      <FiRefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : dirty ? (
                      <FiEdit2 className="w-3.5 h-3.5" />
                    ) : (
                      <FiSave className="w-3.5 h-3.5" />
                    )}
                    {loading || saving ? 'Procesando…' : dirty ? 'Cambios sin guardar' : 'Todo guardado'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={fetchData}
                disabled={loading || saving}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Recargar datos"
              >
                <FiRefreshCw className={loading ? 'animate-spin' : ''} />
                Recargar
              </button>
              <button
                onClick={handleClear}
                disabled={saving || loading}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Limpiar todos los campos"
              >
                <FiTrash2 />
                Limpiar
              </button>
              {/* Eliminado botón de "Eliminar fila" */}
              <button
                onClick={handleSave}
                disabled={!dirty || saving || loading}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                title="Guardar cambios"
              >
                <FiSave className={saving ? 'animate-pulse' : ''} />
                Guardar
              </button>
            </div>
          </div>
          {message && (
            <div className="mt-3 text-sm text-gray-700" aria-live="polite">{message}</div>
          )}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fieldMeta.map(({ key, label, icon: Icon, type, placeholder }) => (
              <div key={key} className="space-y-1">
                <label htmlFor={key} className="block text-sm font-medium text-gray-700">{label}</label>
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
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 hover:bg-white disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70"
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">Todos los campos son opcionales. Los cambios se aplican al guardar.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminConfigPage;
