import React from "react";
import { Link } from "react-router-dom";
import PageTransition from "../../../components/ui/PageTransition";
import UnifiedNav from "../../../components/layout/UnifiedNav";
import Footer from "../../home/components/Footer";
import { useContactActions } from "../../../hooks/useContactActions";
import { useContactInfo } from "../../../hooks/useContactInfo";
import {
  FiShield,
  FiLock,
  FiDatabase,
  FiShare2,
  FiUserCheck,
  FiGlobe,
  FiServer,
  FiAlertTriangle,
  FiCheck,
} from "react-icons/fi";
import { FaWhatsapp, FaCookieBite } from "react-icons/fa";

const PrivacyPage = () => {
  const lastUpdate = "Agosto 2025";
  const { openWhatsApp, getPhoneHref, onPhoneClick, ToastPortal } =
    useContactActions();
  const { contactInfo } = useContactInfo();

  const whatsappMsg =
    "Hola, tengo dudas sobre su política de privacidad. ¿Podrían ayudarme?";

  // Clase reutilizable para los bloques de contenido
  // En móvil: Ancho completo, fondo blanco, borde inferior sutil, sin radio.
  // En escritorio (md): Tarjeta flotante, borde redondeado, sombra suave.
  const sectionClass =
    "bg-white p-6 md:p-10 border-b border-slate-100 md:border md:border-slate-200/60 md:rounded-3xl md:shadow-sm transition-all hover:shadow-md";

  return (
    <>
      <UnifiedNav contactInfo={contactInfo} transparentOnTop={false} hideNavLinks={true} />
      <PageTransition>
        <div className="flex flex-col min-h-screen bg-white md:bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-700">
          
          {/* --- HERO SECTION --- */}
          {/* En móvil reducimos padding lateral para dar aire */}
          <div className="relative pt-32 pb-12 overflow-hidden border-b border-slate-100 md:border-none">
            <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
                <FiShield className="w-3.5 h-3.5" />
                Legal & Transparencia
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 font-volkhov">
                Política de Privacidad
              </h1>

              <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-6 leading-relaxed">
                Tu confianza es nuestra prioridad. Explicamos de forma clara y sin tecnicismos cómo protegemos tus datos en <span className="font-semibold text-slate-900">Viadca Viajes</span>.
              </p>

              <div className="inline-block px-4 py-1.5 rounded-full bg-slate-50 text-slate-500 text-sm font-medium border border-slate-200">
                Última actualización: {lastUpdate}
              </div>
            </div>
          </div>

          {/* --- MAIN CONTENT --- */}
          {/* px-0 en móvil para que los elementos toquen los bordes */}
          <main className="flex-grow relative z-20 px-0 md:px-6 lg:px-8 pb-24 md:-mt-6">
            <div className="max-w-5xl mx-auto space-y-0 md:space-y-8">
              
              {/* --- BLOQUE 1: INTRODUCCIÓN --- */}
              <div className={sectionClass}>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl md:text-3xl shrink-0">
                    <FiUserCheck />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Compromiso de Privacidad</h2>
                    <p className="text-slate-600 leading-relaxed text-base md:text-lg">
                      Operamos bajo la estricta normativa vigente en México. <strong>No vendemos tus datos.</strong> Toda la información que nos compartes se utiliza exclusivamente para diseñar, gestionar y asegurar tus experiencias de viaje.
                    </p>
                  </div>
                </div>
              </div>

              {/* --- BLOQUE 2: GRID DATOS (2 columnas en escritorio, pila en móvil) --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6">
                
                {/* Columna Izquierda: Qué pedimos */}
                <div className={sectionClass}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <FiDatabase className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-slate-900">Datos Solicitados</h2>
                  </div>
                  <ul className="space-y-6">
                    <li className="flex gap-4">
                      <div className="mt-1 text-indigo-500 shrink-0"><FiUserCheck /></div>
                      <div>
                        <strong className="block text-slate-900 text-sm font-semibold">Identidad y Contacto</strong>
                        <span className="text-sm text-slate-500 block mt-1">Nombre completo, teléfono y correo electrónico para la gestión de reservas.</span>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="mt-1 text-indigo-500 shrink-0"><FaCookieBite /></div>
                      <div>
                        <strong className="block text-slate-900 text-sm font-semibold">Navegación (Cookies)</strong>
                        <span className="text-sm text-slate-500 block mt-1">Datos técnicos para mejorar la web. <Link to="/cookies" className="text-indigo-600 hover:underline">Ver política</Link>.</span>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Columna Derecha: Para qué */}
                <div className={sectionClass}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                      <FiGlobe className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-slate-900">Uso de la Información</h2>
                  </div>
                  <div className="space-y-4">
                    {[
                      'Gestionar tus vuelos y hoteles.',
                      'Crear itinerarios a medida.',
                      'Facturación y trámites legales.'
                    ].map((text, i) => (
                      <div key={i} className="flex items-start gap-3 text-slate-600">
                        <FiCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm md:text-base">{text}</span>
                      </div>
                    ))}
                    
                    <div className="mt-6 pt-4 border-t border-slate-100">
                        <p className="text-xs text-slate-400">
                            Nota: Solo enviamos promociones con tu consentimiento explícito.
                        </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- BLOQUE 3: SEGURIDAD (Ya no es negro) --- */}
              {/* Cambiado a un fondo azul muy claro para diferenciarlo sin ser agresivo */}
              <div className="bg-blue-50/50 p-6 md:p-10 border-b border-blue-100 md:border md:border-blue-100 md:rounded-3xl relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                            <FiLock />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900">Seguridad de Alto Nivel</h2>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-8 md:gap-6">
                        <div className="flex flex-col gap-2">
                            <FiServer className="w-6 h-6 text-blue-600 mb-1" />
                            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Encriptación</h3>
                            <p className="text-sm text-slate-600">Protocolos SSL/TLS para blindar tus datos en tránsito.</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <FiShield className="w-6 h-6 text-blue-600 mb-1" />
                            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Acceso Limitado</h3>
                            <p className="text-sm text-slate-600">Solo personal autorizado gestiona tu información sensible.</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <FiAlertTriangle className="w-6 h-6 text-blue-600 mb-1" />
                            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Monitoreo</h3>
                            <p className="text-sm text-slate-600">Sistemas activos de detección de amenazas 24/7.</p>
                        </div>
                    </div>
                </div>
              </div>

              {/* --- BLOQUE 4: COMPARTICIÓN --- */}
              <div className={sectionClass}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <FiShare2 className="w-5 h-5 text-rose-500" />
                            <h2 className="text-lg md:text-xl font-bold text-slate-900">Terceros Necesarios</h2>
                        </div>
                        <p className="text-slate-600 text-sm md:text-base max-w-xl">
                            Solo compartimos los datos estrictamente necesarios con los proveedores que hacen posible tu viaje (tu nombre para el boleto de avión, por ejemplo).
                        </p>
                    </div>
                    
                    {/* Tags visuales */}
                    <div className="flex flex-wrap gap-2 md:justify-end">
                        {['Aerolíneas', 'Hoteles', 'Seguros', 'Tours'].map((item, i) => (
                            <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md border border-slate-200">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
              </div>

              {/* --- CTA FINAL --- */}
              <div className="px-6 md:px-0 mt-12 pt-10 border-t border-slate-100 md:border-transparent">
                <div className="bg-white md:bg-transparent rounded-2xl p-6 md:p-0 border border-slate-100 md:border-none shadow-sm md:shadow-none flex flex-col lg:flex-row gap-8 items-center justify-between">
                  <div className="max-w-lg text-center lg:text-left">
                    <h3 className="text-2xl font-bold font-volkhov text-slate-900 mb-2">
                      ¿Dudas sobre tus derechos ARCO?
                    </h3>
                    <p className="text-slate-500">
                      Tienes derecho a acceder, rectificar o cancelar tus datos en cualquier momento.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => openWhatsApp(whatsappMsg)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                    >
                      <FaWhatsapp className="w-5 h-5" />
                      Chat de Privacidad
                    </button>
                    <a
                      href={getPhoneHref()}
                      onClick={onPhoneClick}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-50 text-slate-700 font-medium border border-slate-200 hover:bg-slate-100 transition-colors"
                    >
                      Soporte
                    </a>
                  </div>
                </div>
              </div>

              <div className="text-center pt-8 pb-4">
                <Link to="/" className="text-sm font-semibold text-slate-400 hover:text-blue-600 transition-colors">
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

export default PrivacyPage;