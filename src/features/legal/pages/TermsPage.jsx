import React from "react";
import { Link } from "react-router-dom";
import PageTransition from "../../../components/ui/PageTransition";
import { useContactActions } from "../../../hooks/useContactActions"; // nuevo

const TermsPage = () => {
  const lastUpdate = "Agosto 2025";
  const { openWhatsApp, getPhoneHref, onPhoneClick, ToastPortal } = useContactActions();
  const whatsappMsg = "Hola, tengo dudas sobre sus términos y condiciones. ¿Podrían orientarme?";

  return (
    <PageTransition>
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-orange-50/10 relative overflow-hidden">
        {/* Fondo decorativo mejorado */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute -top-20 -left-32 w-64 h-64 rounded-full bg-orange-200/20 blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-red-200/20 blur-3xl animate-pulse-slow delay-1000" />
          <div className="absolute bottom-20 left-1/3 w-48 h-48 rounded-full bg-amber-200/15 blur-2xl animate-pulse-slow delay-500" />
          <div className="absolute bottom-1/3 right-1/4 w-32 h-32 rounded-full bg-yellow-200/15 blur-2xl animate-pulse-slow delay-1500" />
          <div className="absolute top-1/3 left-1/4 w-40 h-40 rounded-full bg-rose-200/15 blur-2xl animate-pulse-slow delay-2000" />
        </div>

        {/* Sección Hero mejorada */}
        <div className="relative bg-gradient-to-r from-orange-600 via-orange-700 to-red-700 text-white">
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/10"></div>
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-xl mb-8 transform transition-transform duration-500 hover:rotate-12">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 animate-fade-in-down">
                Términos y Condiciones
              </h1>
              <p className="text-xl text-orange-100 max-w-2xl mx-auto mb-8 leading-relaxed">
                Conoce las condiciones que rigen nuestros servicios de viajes y
                turismo.
              </p>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 transform transition-transform hover:scale-105">
                <svg
                  className="w-4 h-4 text-orange-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm text-orange-100 font-medium">
                  Última actualización: {lastUpdate}
                </span>
              </div>
            </div>
          </div>

          {/* Onda decorativa */}
          <div className="absolute -bottom-1 left-0 right-0">
            <svg viewBox="0 0 1440 120" className="w-full h-auto text-white">
              <path
                fill="currentColor"
                fillOpacity="1"
                d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
              ></path>
            </svg>
          </div>
        </div>

        {/* Contenido principal */}
        <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 -mt-6">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-white/80 p-6 md:p-10 lg:p-12 transform transition-all duration-300 hover:shadow-2xl">
            <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-6 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-li:marker:text-orange-500 prose-a:text-orange-600 prose-a:no-underline hover:prose-a:text-orange-700 prose-a:font-medium">
              <div className="bg-orange-50/70 rounded-xl p-6 mb-10 border-l-4 border-orange-500">
                <p className="text-lg font-medium text-orange-800">
                  Estos Términos regulan el uso del sitio web y los servicios de{" "}
                  <strong className="font-bold">VIADCA by Zafiro Tours</strong>.
                  Al utilizar el sitio o solicitar servicios, aceptas estas
                  condiciones.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h2 className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </span>
                    Objeto del servicio
                  </h2>
                  <p>
                    VIADCA actúa como intermediario entre el cliente y los
                    proveedores de servicios turísticos (mayoristas, aerolíneas,
                    hoteles, operadores locales, aseguradoras, entre otros). La
                    contratación efectiva del servicio se perfecciona con el
                    proveedor correspondiente, quien es responsable de su
                    ejecución.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-orange-100 rounded-full text-xs font-medium text-orange-800">
                      Aerolíneas
                    </span>
                    <span className="px-3 py-1 bg-orange-100 rounded-full text-xs font-medium text-orange-800">
                      Hoteles
                    </span>
                    <span className="px-3 py-1 bg-orange-100 rounded-full text-xs font-medium text-orange-800">
                      Operadores locales
                    </span>
                    <span className="px-3 py-1 bg-orange-100 rounded-full text-xs font-medium text-orange-800">
                      Aseguradoras
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </span>
                    Precios y disponibilidad
                  </h2>
                  <ul>
                    <li className="mb-3 flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-orange-100 rounded-full mr-2 mt-0.5 flex-shrink-0">
                        <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span>
                      </span>
                      <span>
                        Los precios son variables y están sujetos a cambios sin
                        previo aviso según disponibilidad y cambio de divisas.
                      </span>
                    </li>
                    <li className="mb-3 flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-orange-100 rounded-full mr-2 mt-0.5 flex-shrink-0">
                        <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span>
                      </span>
                      <span>
                        Las tarifas no se garantizan hasta la emisión del
                        boleto, voucher o confirmación definitiva del proveedor.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-orange-100 rounded-full mr-2 mt-0.5 flex-shrink-0">
                        <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span>
                      </span>
                      <span>
                        Los cupos y promociones pueden agotarse en cualquier
                        momento.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10 mt-12">
                <div>
                  <h2 className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                        />
                      </svg>
                    </span>
                    Pagos y cancelaciones
                  </h2>
                  <ul>
                    <li className="mb-3 flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-orange-100 rounded-full mr-2 mt-0.5 flex-shrink-0">
                        <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span>
                      </span>
                      <span>
                        Las condiciones de pago, cambios y cancelaciones
                        dependen de cada proveedor. Te informaremos las
                        políticas aplicables antes de confirmar.
                      </span>
                    </li>
                    <li className="mb-3 flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-orange-100 rounded-full mr-2 mt-0.5 flex-shrink-0">
                        <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span>
                      </span>
                      <span>
                        Algunas tarifas pueden ser no reembolsables o tener
                        penalizaciones. Revisa detenidamente las condiciones.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-orange-100 rounded-full mr-2 mt-0.5 flex-shrink-0">
                        <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span>
                      </span>
                      <span>
                        Las devoluciones, en su caso, se tramitan conforme a los
                        plazos y procedimientos de los proveedores.
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"
                        />
                      </svg>
                    </span>
                    Responsabilidad
                  </h2>
                  <p>
                    VIADCA no asume responsabilidad por incumplimientos,
                    retrasos, cancelaciones, accidentes, pérdidas o daños
                    atribuibles a los proveedores o a circunstancias de fuerza
                    mayor. Nuestra responsabilidad se limita a la debida
                    diligencia en la intermediación y gestión de reservas.
                  </p>
                  <div className="mt-4 bg-orange-50 rounded-xl p-4 border border-orange-100">
                    <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-orange-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      Fuerza mayor
                    </h3>
                    <p className="text-sm text-slate-600">
                      Se consideran circunstancias de fuerza mayor: desastres
                      naturales, pandemias, conflictos bélicos, huelgas, actos
                      gubernamentales u otros eventos fuera de nuestro control.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10 mt-12">
                <div>
                  <h2 className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </span>
                    Documentación y requisitos
                  </h2>
                  <p>
                    Es responsabilidad del cliente contar con documentación
                    válida (pasaporte, visas, permisos, vacunas) y cumplir con
                    requisitos migratorios y sanitarios del destino.
                    Recomendamos verificar con antelación la información oficial
                    correspondiente.
                  </p>

                  <div className="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      Recomendaciones
                    </h3>
                    <p className="text-sm text-slate-600">
                      Verifica los requisitos de entrada al menos 60 días antes
                      de tu viaje. Algunos destinos requieren visas con meses de
                      anticipación o vacunas específicas.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c-1.657 0-3-4.03-3-9s1.343-9 3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                        />
                      </svg>
                    </span>
                    Uso del sitio
                  </h2>
                  <p>
                    Te comprometes a usar este sitio de forma lícita y a no
                    realizar acciones que puedan afectar su disponibilidad o
                    integridad. El contenido del sitio puede cambiar sin previo
                    aviso.
                  </p>

                  <div className="mt-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                      <svg
                        className="w-4 h-4 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span>
                        No está permitido el scraping o extracción masiva de
                        datos
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                      <svg
                        className="w-4 h-4 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span>
                        Prohibido realizar ataques de denegación de servicio
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <svg
                        className="w-4 h-4 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span>
                        No se permite el acceso no autorizado a sistemas
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h2 className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                      />
                    </svg>
                  </span>
                  Modificaciones
                </h2>
                <p>
                  Podemos actualizar estos Términos cuando sea necesario. La
                  versión vigente estará disponible en esta página.
                </p>

                <div className="mt-6 bg-orange-50 rounded-xl p-5 border border-orange-100">
                  <h3 className="font-semibold text-orange-800 flex items-center gap-2 mb-2">
                    <svg
                      className="w-5 h-5 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                      />
                    </svg>
                    Notificación de cambios
                  </h3>
                  <p className="text-orange-700 text-sm">
                    Para cambios importantes en nuestros términos, te
                    notificaremos mediante un correo electrónico al menos 30
                    días antes de que entren en vigor, siempre que tengamos tu
                    dirección de contacto.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 p-8 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-100/60 shadow-sm transition-all duration-300 hover:shadow-md hover:border-orange-300">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-orange-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-slate-800 text-xl mb-3">
                    ¿Dudas sobre estos términos?
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Si necesitas aclaraciones sobre condiciones, pagos, cancelaciones o responsabilidades, estamos listos para ayudarte y explicarte cada punto con transparencia.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="button"
                      onClick={() => openWhatsApp(whatsappMsg)}
                      className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium px-5 py-2.5 rounded-lg transition-all duration-300 hover:scale-[1.03] shadow-sm hover:shadow-md"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      Consultar por WhatsApp
                    </button>
                    <a
                      href={getPhoneHref()}
                      onClick={onPhoneClick}
                      className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-orange-700 font-medium px-5 py-2.5 rounded-lg transition-all duration-300 hover:scale-[1.03] shadow-sm hover:shadow-md"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      Llamar / Copiar teléfono
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-medium px-7 py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.03] shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver al inicio
            </Link>

            <p className="mt-8 text-sm text-slate-500 max-w-md mx-auto">
              Al continuar utilizando nuestros servicios, aceptas los términos y
              condiciones descritos anteriormente.
            </p>
          </div>
        </section>

        <style jsx>{`
          .animate-pulse-slow {
            animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }

          @keyframes pulse {
            0%,
            100% {
              opacity: 0.2;
            }
            50% {
              opacity: 0.4;
            }
          }

          .animate-fade-in-down {
            animation: fadeInDown 0.8s ease-out forwards;
          }

          @keyframes fadeInDown {
            0% {
              opacity: 0;
              transform: translateY(-20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .delay-500 {
            animation-delay: 500ms;
          }

          .delay-1000 {
            animation-delay: 1000ms;
          }

          .delay-1500 {
            animation-delay: 1500ms;
          }

          .delay-2000 {
            animation-delay: 2000ms;
          }
        `}</style>
        <ToastPortal />
      </main>
    </PageTransition>
  );
};

export default TermsPage;
