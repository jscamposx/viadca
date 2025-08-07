import React, { useState } from 'react';
import { FiSettings, FiGlobe, FiBell, FiShield, FiSave, FiMoon, FiSun } from 'react-icons/fi';

const AdminConfigPage = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'es',
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    privacy: {
      profileVisible: true,
      dataCollection: false
    },
    security: {
      twoFactor: false,
      sessionTimeout: 60
    }
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Aquí iría la lógica para guardar las configuraciones
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const updateDirectSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <FiSettings className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
                <p className="text-gray-600">Personaliza tu experiencia en el panel</p>
              </div>
            </div>
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                saved 
                  ? 'bg-green-600 text-white' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <FiSave className="w-4 h-4" />
              {saved ? 'Guardado' : 'Guardar'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Apariencia */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                {settings.theme === 'light' ? (
                  <FiSun className="w-5 h-5 text-blue-600" />
                ) : (
                  <FiMoon className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Apariencia</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => updateDirectSetting('theme', 'light')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                      settings.theme === 'light'
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FiSun className="w-4 h-4" />
                    Claro
                  </button>
                  <button
                    onClick={() => updateDirectSetting('theme', 'dark')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                      settings.theme === 'dark'
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FiMoon className="w-4 h-4" />
                    Oscuro
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
                <select
                  value={settings.language}
                  onChange={(e) => updateDirectSetting('language', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notificaciones */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FiBell className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Notificaciones</h2>
            </div>

            <div className="space-y-4">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      {key === 'email' && 'Notificaciones por email'}
                      {key === 'push' && 'Notificaciones push'}
                      {key === 'sms' && 'Notificaciones por SMS'}
                    </label>
                    <p className="text-xs text-gray-500">
                      {key === 'email' && 'Recibir actualizaciones por correo electrónico'}
                      {key === 'push' && 'Notificaciones en tiempo real en el navegador'}
                      {key === 'sms' && 'Mensajes de texto para alertas importantes'}
                    </p>
                  </div>
                  <button
                    onClick={() => updateSetting('notifications', key, !value)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      value ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transition-transform absolute top-1 ${
                        value ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Seguridad */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <FiShield className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Seguridad</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Autenticación de dos factores
                  </label>
                  <p className="text-xs text-gray-500">
                    Agrega una capa extra de seguridad a tu cuenta
                  </p>
                </div>
                <button
                  onClick={() => updateSetting('security', 'twoFactor', !settings.security.twoFactor)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    settings.security.twoFactor ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform absolute top-1 ${
                      settings.security.twoFactor ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiempo de sesión (minutos)
                </label>
                <select
                  value={settings.security.sessionTimeout}
                  onChange={(e) => updateSetting('security', 'sessionTimeout', Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={30}>30 minutos</option>
                  <option value={60}>1 hora</option>
                  <option value={120}>2 horas</option>
                  <option value={480}>8 horas</option>
                  <option value={0}>Sin límite</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminConfigPage;
