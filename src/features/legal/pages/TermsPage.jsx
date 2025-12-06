import React from "react";
import { Link } from "react-router-dom";
import PageTransition from "../../../components/ui/PageTransition";
import UnifiedNav from "../../../components/layout/UnifiedNav";
import Footer from "../../home/components/Footer";
import { useContactActions } from "../../../hooks/useContactActions";
import { useContactInfo } from "../../../hooks/useContactInfo";
import {
  FiFileText,
  FiDollarSign,
  FiCreditCard,
  FiAlertCircle,
  FiGlobe,
  FiShield,
  FiRefreshCw,
  FiCheck,
  FiAlertTriangle
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const TermsPage = () => {
  const lastUpdate = "Agosto 2025";
  const { openWhatsApp, getPhoneHref, onPhoneClick, ToastPortal } =
    useContactActions();
  const { contactInfo } = useContactInfo();

  const whatsappMsg =
    "Hola, tengo dudas sobre sus términos y condiciones. ¿Podrían orientarme?";

  // Clase reutilizable para mantener consistencia con la página de privacidad
  const sectionClass =
    "bg-white p-6 md:p-10 border-b border-slate-100 md:border md:border-slate-200/60 md:rounded-3xl md:shadow-sm transition-all hover:shadow-md h-full";

  return (
    <>
      <UnifiedNav contactInfo={contactInfo} transparentOnTop={false} />
      <PageTransition>
        <div className="flex flex-col min-h-screen bg-white md:bg-slate-50 font-sans selection:bg-orange-100 selection:text-orange-700">
          
          {/* --- HERO SECTION --- */}
          <div className="relative pt-32 pb-12 overflow-hidden border-b border-slate-100 md:border-none bg-white">
            <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-6">
                <FiFileText className="w-3.5 h-3.5" />
                Marco Legal
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 font-volkhov">
                Términos y Condiciones
              </h1>

              <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-6 leading-relaxed">
                Claridad ante todo. Conoce las reglas del juego y las condiciones que rigen nuestros servicios de viajes y turismo.
              </p>

              <div className="inline-block px-4 py-1.5 rounded-full bg-slate-50 text-slate-500 text-sm font-medium border border-slate-200">
                Última actualización: {lastUpdate}
              </div>
            </div>
          </div>

          {/* --- MAIN CONTENT --- */}
          <main className="flex-grow relative z-20 px-0 md:px-6 lg:px-8 pb-24 md:-mt-6">
            <div className="max-w-6xl mx-auto space-y-0 md:space-y-8">

              {/* --- INTRODUCCIÓN --- */}
              <div className={sectionClass}>
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-2xl md:text-3xl shrink-0">
                    <FiFileText />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Objeto del Servicio</h2>
                    <p className="text-slate-600 leading-relaxed text-base md:text-lg">
                      VIADCA actúa como intermediario entre tú y los proveedores de servicios (aerolíneas, hoteles, tours). La contratación final se realiza con ellos, pero nosotros te acompañamos en todo el proceso.
                    </p>
                    
                    {/* Chips de proveedores */}
                    <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                        {['Aerolíneas', 'Hoteles', 'Operadores Locales', 'Aseguradoras'].map((tag, i) => (
                            <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md border border-slate-200">
                                {tag}
                            </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* --- GRID DE CONTENIDO (2 Columnas en Desktop) --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6">

                {/* Bloque: Precios */}
                <div className={sectionClass}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                      <FiDollarSign className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-slate-900">Precios y Disponibilidad</h2>
                  </div>
                  <ul className="space-y-4 text-slate-600">
                    <li className="flex gap-3 items-start">
                        <FiCheck className="mt-1 text-green-500 shrink-0" />
                        <span className="text-sm">Los precios son dinámicos y pueden cambiar hasta la emisión del boleto.</span>
                    </li>
                    <li className="flex gap-3 items-start">
                        <FiCheck className="mt-1 text-green-500 shrink-0" />
                        <span className="text-sm">Las tarifas no se garantizan sin una confirmación definitiva o voucher.</span>
                    </li>
                    <li className="flex gap-3 items-start">
                        <FiCheck className="mt-1 text-green-500 shrink-0" />
                        <span className="text-sm">Los cupos promocionales son limitados.</span>
                    </li>
                  </ul>
                </div>

                {/* Bloque: Pagos */}
                <div className={sectionClass}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <FiCreditCard className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-slate-900">Pagos y Cancelaciones</h2>
                  </div>
                  <div className="space-y-4 text-slate-600">
                     <p className="text-sm">Las reglas de juego las pone cada proveedor:</p>
                     <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm">
                        <strong>Importante:</strong> Algunas tarifas son <span className="text-rose-600 font-medium">no reembolsables</span>. Te informaremos las condiciones específicas antes de que pagues.
                     </div>
                     <p className="text-sm text-slate-500">
                        Cualquier devolución se tramitará según los tiempos y procesos de la aerolínea u hotel.
                     </p>
                  </div>
                </div>

                 {/* Bloque: Documentación */}
                 <div className={sectionClass}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                      <FiGlobe className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-slate-900">Documentación de Viaje</h2>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">
                      Es tu responsabilidad contar con pasaporte vigente, visas y vacunas necesarias.
                  </p>
                  <div className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg text-blue-800 text-sm border border-blue-100">
                      <FiAlertCircle className="mt-0.5 shrink-0" />
                      <span>Recomendación: Verifica los requisitos migratorios al menos 60 días antes de viajar.</span>
                  </div>
                </div>

                {/* Bloque: Responsabilidad */}
                <div className={sectionClass}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                      <FiAlertTriangle className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-slate-900">Limitación de Responsabilidad</h2>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">
                      No somos responsables por retrasos de aerolíneas, clima o situaciones de fuerza mayor.
                  </p>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <h4 className="font-semibold text-slate-900 text-xs uppercase mb-1">Fuerza Mayor</h4>
                      <p className="text-xs text-slate-500">
                          Incluye desastres naturales, pandemias, huelgas o actos gubernamentales fuera de nuestro control.
                      </p>
                  </div>
                </div>

              </div>

              {/* --- FOOTER DEL CONTENIDO (Uso del sitio & Modificaciones) --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6">
                 {/* Uso */}
                 <div className={sectionClass}>
                    <div className="flex gap-4">
                        <FiShield className="text-slate-400 w-6 h-6 mt-1" />
                        <div>
                            <h3 className="font-bold text-slate-900">Uso Correcto del Sitio</h3>
                            <p className="text-sm text-slate-500 mt-1">
                                Queda prohibido el scraping, extracción masiva de datos o intentos de ataque al servidor.
                            </p>
                        </div>
                    </div>
                 </div>

                 {/* Modificaciones */}
                 <div className={sectionClass}>
                    <div className="flex gap-4">
                        <FiRefreshCw className="text-slate-400 w-6 h-6 mt-1" />
                        <div>
                            <h3 className="font-bold text-slate-900">Modificaciones</h3>
                            <p className="text-sm text-slate-500 mt-1">
                                Podemos actualizar estos términos. Te notificaremos cambios importantes vía email si estás suscrito.
                            </p>
                        </div>
                    </div>
                 </div>
              </div>

              {/* --- CTA FINAL --- */}
              <div className="px-6 md:px-0 mt-12 pt-10 border-t border-slate-100 md:border-transparent">
                <div className="bg-white md:bg-transparent rounded-2xl p-6 md:p-0 border border-slate-100 md:border-none shadow-sm md:shadow-none flex flex-col lg:flex-row gap-8 items-center justify-between">
                  <div className="max-w-lg text-center lg:text-left">
                    <h3 className="text-2xl font-bold font-volkhov text-slate-900 mb-2">
                      ¿Dudas sobre la letra pequeña?
                    </h3>
                    <p className="text-slate-500">
                      Estamos aquí para explicarte cualquier punto con total transparencia antes de que reserves.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => openWhatsApp(whatsappMsg)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-medium transition-colors shadow-sm hover:shadow-md"
                    >
                      <FaWhatsapp className="w-5 h-5" />
                      Consultar en WhatsApp
                    </button>
                    <a
                      href={getPhoneHref()}
                      onClick={onPhoneClick}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-50 text-slate-700 font-medium border border-slate-200 hover:bg-slate-100 transition-colors"
                    >
                      Llamar a Soporte
                    </a>
                  </div>
                </div>
              </div>

              <div className="text-center pt-8 pb-4">
                <Link to="/" className="text-sm font-semibold text-slate-400 hover:text-orange-600 transition-colors">
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

export default TermsPage;