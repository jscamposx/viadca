import React from "react";
import { Link } from "react-router-dom";
import PageTransition from "../../../components/ui/PageTransition";
import UnifiedNav from "../../../components/layout/UnifiedNav";
import Footer from "../../home/components/Footer";
import { useContactActions } from "../../../hooks/useContactActions";
import { useContactInfo } from "../../../hooks/useContactInfo";
import {
  FiSettings,
  FiLayers,
  FiUsers,
  FiBell,
  FiCheck,
  FiInfo,
  FiToggleRight,
  FiShield
} from "react-icons/fi";
import { FaCookieBite, FaWhatsapp } from "react-icons/fa";

const CookiesPage = () => {
  const lastUpdate = "Agosto 2025";
  const { openWhatsApp, getPhoneHref, onPhoneClick, ToastPortal } =
    useContactActions();
  const { contactInfo } = useContactInfo();
  const whatsappMsg =
    "Hola, tengo dudas sobre su política de cookies. ¿Podrían brindarme más información?";

  // Clase reutilizable para consistencia de diseño
  // Móvil: Flush (plano) | Escritorio: Card (tarjeta flotante)
  const sectionClass =
    "bg-white p-6 md:p-10 border-b border-slate-100 md:border md:border-slate-200/60 md:rounded-3xl md:shadow-sm transition-all hover:shadow-md h-full";

  return (
    <>
      <UnifiedNav contactInfo={contactInfo} transparentOnTop={false} />
      <PageTransition>
        <div className="flex flex-col min-h-screen bg-white md:bg-slate-50 font-sans selection:bg-purple-100 selection:text-purple-700">
          
          {/* --- HERO SECTION --- */}
          <div className="relative pt-32 pb-12 overflow-hidden border-b border-slate-100 md:border-none bg-white">
            <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider mb-6">
                <FaCookieBite className="w-3.5 h-3.5" />
                Transparencia Digital
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 font-volkhov">
                Política de Cookies
              </h1>

              <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-6 leading-relaxed">
                No usamos "magia negra", usamos tecnología para mejorar tu experiencia. Aquí te explicamos qué guardamos y para qué.
              </p>

              <div className="inline-block px-4 py-1.5 rounded-full bg-slate-50 text-slate-500 text-sm font-medium border border-slate-200">
                Última actualización: {lastUpdate}
              </div>
            </div>
          </div>

          {/* --- MAIN CONTENT --- */}
          <main className="flex-grow relative z-20 px-0 md:px-6 lg:px-8 pb-24 md:-mt-6">
            <div className="max-w-6xl mx-auto space-y-0 md:space-y-8">

              {/* --- BLOQUE 1: ¿QUÉ SON? --- */}
              <div className={sectionClass}>
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl md:text-3xl shrink-0">
                    <FaCookieBite />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">¿Qué son las Cookies?</h2>
                    <p className="text-slate-600 leading-relaxed text-base md:text-lg">
                      Son pequeños archivos de texto que se guardan en tu navegador cuando visitas nuestra web. No son virus ni espías; funcionan como una "memoria" para recordar tus preferencias (como tu idioma o moneda) y agilizar tu próxima visita.
                    </p>
                  </div>
                </div>
              </div>

              {/* --- GRID (2 COLUMNAS) --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6">
                
                {/* Columna: Tipos de Cookies */}
                <div className={sectionClass}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <FiLayers className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-slate-900">Las que usamos</h2>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="flex gap-4">
                        <div className="mt-1 bg-blue-100 text-blue-600 p-1 rounded-full text-xs h-fit w-fit shrink-0"><FiShield /></div>
                        <div>
                            <strong className="block text-slate-900 text-sm">Esenciales</strong>
                            <p className="text-sm text-slate-500">Imprescindibles para que la web funcione (seguridad, navegación).</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="mt-1 bg-amber-100 text-amber-600 p-1 rounded-full text-xs h-fit w-fit shrink-0"><FiLayers /></div>
                        <div>
                            <strong className="block text-slate-900 text-sm">Analíticas</strong>
                            <p className="text-sm text-slate-500">Nos ayudan a entender qué secciones gustan más (Google Analytics).</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="mt-1 bg-emerald-100 text-emerald-600 p-1 rounded-full text-xs h-fit w-fit shrink-0"><FiToggleRight /></div>
                        <div>
                            <strong className="block text-slate-900 text-sm">Preferencias</strong>
                            <p className="text-sm text-slate-500">Recuerdan tus elecciones previas.</p>
                        </div>
                    </div>
                  </div>
                </div>

                {/* Columna: Gestión / Control */}
                <div className={sectionClass}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
                      <FiSettings className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-slate-900">Tú tienes el control</h2>
                  </div>
                  
                  <p className="text-slate-600 text-sm mb-6">
                    Puedes configurar tu navegador para bloquear o eliminar las cookies en cualquier momento.
                  </p>

                  <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-5">
                     <h3 className="font-semibold text-purple-900 text-sm mb-2 flex items-center gap-2">
                        <FiCheck className="text-purple-600"/> Recomendación
                     </h3>
                     <p className="text-xs text-purple-800/80 leading-relaxed">
                        Para la mejor experiencia de reserva, sugerimos mantener activas las <strong>Esenciales</strong> y de <strong>Preferencias</strong>. Si las bloqueas todas, algunas funciones del sitio podrían fallar.
                     </p>
                  </div>
                </div>

                {/* Columna: Terceros */}
                <div className={sectionClass}>
                   <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <FiUsers className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-slate-900">Cookies de Terceros</h2>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">
                      Usamos herramientas externas confiables que pueden instalar sus propias cookies:
                  </p>
                  <div className="flex flex-wrap gap-2">
                     {['Google Analytics', 'Google Maps', 'YouTube', 'Facebook Pixel'].map((item, i) => (
                        <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md border border-slate-200">
                            {item}
                        </span>
                     ))}
                  </div>
                </div>

                {/* Columna: Actualizaciones */}
                <div className={sectionClass}>
                   <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                      <FiBell className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-slate-900">Cambios en la Política</h2>
                  </div>
                  <div className="flex gap-4 items-start">
                      <FiInfo className="mt-1 text-slate-400 shrink-0" />
                      <p className="text-sm text-slate-600">
                          Si realizamos cambios importantes en cómo usamos las cookies, te avisaremos mediante un banner visible en la web al menos 7 días antes.
                      </p>
                  </div>
                </div>

              </div>

              {/* --- CTA FINAL --- */}
              <div className="px-6 md:px-0 mt-12 pt-10 border-t border-slate-100 md:border-transparent">
                <div className="bg-white md:bg-transparent rounded-2xl p-6 md:p-0 border border-slate-100 md:border-none shadow-sm md:shadow-none flex flex-col lg:flex-row gap-8 items-center justify-between">
                  <div className="max-w-lg text-center lg:text-left">
                    <h3 className="text-2xl font-bold font-volkhov text-slate-900 mb-2">
                      ¿Problemas técnicos?
                    </h3>
                    <p className="text-slate-500">
                      Si tienes dificultades navegando o dudas sobre tu privacidad, nuestro equipo técnico está listo para ayudarte.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => openWhatsApp(whatsappMsg)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors shadow-sm hover:shadow-md"
                    >
                      <FaWhatsapp className="w-5 h-5" />
                      Soporte Técnico
                    </button>
                    <a
                      href={getPhoneHref()}
                      onClick={onPhoneClick}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-50 text-slate-700 font-medium border border-slate-200 hover:bg-slate-100 transition-colors"
                    >
                      Llamar
                    </a>
                  </div>
                </div>
              </div>

              <div className="text-center pt-8 pb-4">
                <Link to="/" className="text-sm font-semibold text-slate-400 hover:text-purple-600 transition-colors">
                  &larr; Volver al inicio
                </Link>
              </div>

            </div>
          </main>
          <Footer contactInfo={contactInfo} />
        </div>
      </PageTransition>
      <ToastPortal />
    </>
  );
};

export default CookiesPage;