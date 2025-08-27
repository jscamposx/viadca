import React from "react";
import { Link } from "react-router-dom";
import PageTransition from "../../../components/ui/PageTransition";
import { useContactActions } from "../../../hooks/useContactActions"; // nuevo

const PrivacyPage = () => {
  const lastUpdate = "Agosto 2025";
  const { openWhatsApp, getPhoneHref, onPhoneClick, ToastPortal } = useContactActions(); // hook

  const whatsappMsg = "Hola, tengo dudas sobre su política de privacidad. ¿Podrían ayudarme?";

  return (
    <PageTransition animationType="slide-right">
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-orange-50/10 relative overflow-hidden">
        {/* Fondo decorativo mejorado */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute -top-20 -left-32 w-64 h-64 rounded-full bg-blue-200/20 blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-orange-200/20 blur-3xl animate-pulse-slow delay-1000" />
          <div className="absolute bottom-20 left-1/3 w-48 h-48 rounded-full bg-purple-200/15 blur-2xl animate-pulse-slow delay-500" />
          <div className="absolute bottom-1/3 right-1/4 w-32 h-32 rounded-full bg-amber-200/15 blur-2xl animate-pulse-slow delay-1500" />
          <div className="absolute top-1/3 left-1/4 w-40 h-40 rounded-full bg-cyan-200/15 blur-2xl animate-pulse-slow delay-2000" />
        </div>

        {/* Sección Hero mejorada */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 animate-fade-in-down">
                Política de Privacidad
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8 leading-relaxed">
                Tu privacidad es nuestra prioridad. Conoce cómo protegemos y
                utilizamos tu información.
              </p>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 transform transition-transform hover:scale-105">
                <svg
                  className="w-4 h-4 text-blue-200"
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
                <span className="text-sm text-blue-100 font-medium">
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
            <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-6 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-li:marker:text-blue-500 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-700 prose-a:font-medium">
              <div className="bg-blue-50/70 rounded-xl p-6 mb-10 border-l-4 border-blue-500">
                <p className="text-lg font-medium text-blue-800">
                  En{" "}
                  <strong className="font-bold">VIADCA by Zafiro Tours</strong>{" "}
                  nos comprometemos a proteger tu privacidad. Este documento
                  explica qué datos recopilamos, cómo los utilizamos y las
                  opciones que tienes sobre su tratamiento. Operamos en México y
                  cumplimos con la normativa aplicable en materia de protección
                  de datos personales.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h2 className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-blue-600"
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
                    Datos que recopilamos
                  </h2>
                  <ul>
                    <li className="mb-3 flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 rounded-full mr-2 mt-0.5 flex-shrink-0">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      </span>
                      <span>
                        <strong className="text-slate-800">
                          Datos de contacto:
                        </strong>{" "}
                        nombre, correo electrónico, teléfono, y la información
                        que nos facilites al solicitar información o contratar
                        un servicio.
                      </span>
                    </li>
                    <li className="mb-3 flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 rounded-full mr-2 mt-0.5 flex-shrink-0">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      </span>
                      <span>
                        <strong className="text-slate-800">
                          Datos de navegación:
                        </strong>{" "}
                        dirección IP, identificadores de dispositivo y analítica
                        básica para mejorar la experiencia del sitio.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 rounded-full mr-2 mt-0.5 flex-shrink-0">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      </span>
                      <span>
                        <strong className="text-slate-800">
                          Cookies y tecnologías similares:
                        </strong>{" "}
                        ver la{" "}
                        <Link to="/cookies" className="font-medium">
                          Política de Cookies
                        </Link>
                        .
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                        />
                      </svg>
                    </span>
                    Finalidades y base legal
                  </h2>
                  <ul>
                    <li className="mb-2 flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 rounded-full mr-2 mt-0.5 flex-shrink-0">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      </span>
                      <span>
                        Atender consultas y gestionar reservas o presupuestos
                        (ejecución de contrato o medidas precontractuales).
                      </span>
                    </li>
                    <li className="mb-2 flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 rounded-full mr-2 mt-0.5 flex-shrink-0">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      </span>
                      <span>
                        Comunicación comercial relacionada con viajes y ofertas,
                        cuando corresponda (consentimiento revocable).
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 rounded-full mr-2 mt-0.5 flex-shrink-0">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      </span>
                      <span>
                        Mejorar nuestros servicios y la seguridad del sitio
                        (interés legítimo).
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10 mt-12">
                <div>
                  <h2 className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-blue-600"
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
                    </span>
                    Conservación
                  </h2>
                  <p>
                    Conservamos los datos durante el tiempo necesario para
                    cumplir las finalidades indicadas y las obligaciones
                    legales. Transcurridos esos plazos, se eliminarán o
                    anonimizarán de forma segura.
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
                      Plazos de conservación
                    </h3>
                    <p className="text-sm text-slate-600">
                      Los datos personales se conservan durante el tiempo
                      necesario para cumplir con las finalidades para las que
                      fueron recopilados, así como para cumplir con las
                      obligaciones legales y resolver posibles disputas.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </span>
                    Cesiones y encargados
                  </h2>
                  <p>
                    No vendemos datos personales. Podemos compartir información
                    estrictamente necesaria con proveedores de servicios
                    turísticos (mayoristas, aerolíneas, hoteles, aseguradoras)
                    para gestionar tu reserva, así como con proveedores
                    tecnológicos que nos prestan servicios (por ejemplo,
                    alojamiento web), bajo contratos que garantizan la
                    confidencialidad y el tratamiento seguro de los datos.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700">
                      Aerolíneas
                    </span>
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700">
                      Hoteles
                    </span>
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700">
                      Aseguradoras
                    </span>
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700">
                      Proveedores tecnológicos
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10 mt-12">
                <div>
                  <h2 className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </span>
                    Derechos
                  </h2>
                  <p>
                    Puedes ejercer tus derechos de acceso, rectificación,
                    cancelación, oposición, así como solicitar la limitación o
                    portabilidad cuando proceda. Para ello, contáctanos por los
                    medios publicados en la sección de contacto de este sitio.
                  </p>
                  <p className="mt-3">
                    Si consideras que no hemos tratado tus datos conforme a la
                    norma, puedes presentar una reclamación ante la autoridad
                    competente.
                  </p>

                  <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
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
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Ejercer tus derechos
                    </h3>
                    <p className="text-sm text-blue-700">
                      Para ejercer tus derechos, envía una solicitud escrita a
                      nuestro correo electrónico de protección de datos con
                      copia de tu identificación.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-blue-600"
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
                    Seguridad
                  </h2>
                  <p>
                    Aplicamos medidas técnicas y organizativas razonables para
                    proteger tu información. No obstante, ningún sistema es 100%
                    seguro; te recomendamos no compartir información sensible
                    innecesaria a través de canales no cifrados.
                  </p>

                  <div className="mt-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Encriptación de datos en tránsito (SSL/TLS)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Acceso restringido a datos sensibles</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Copias de seguridad regulares</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h2 className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-blue-600"
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
                  Cambios en esta política
                </h2>
                <p>
                  Podremos actualizar esta política cuando sea necesario.
                  Publicaremos la versión vigente en esta página con su fecha de
                  actualización.
                </p>

                <div className="mt-6 bg-blue-50 rounded-xl p-5 border border-blue-100">
                  <h3 className="font-semibold text-blue-800 flex items-center gap-2 mb-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
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
                    Notificaciones de cambios
                  </h3>
                  <p className="text-blue-700 text-sm">
                    Para cambios importantes en nuestra política de privacidad,
                    te notificaremos mediante un banner destacado en nuestro
                    sitio web durante al menos 15 días antes de que los cambios
                    entren en vigor.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl border border-blue-100/60 shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-300">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center">
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
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-slate-800 text-xl mb-3">
                    ¿Tienes dudas sobre tu privacidad?
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Estamos aquí para resolver cualquier pregunta sobre cómo
                    manejamos tu información personal. Nuestro equipo de
                    protección de datos responderá a tu consulta en un plazo
                    máximo de 72 horas.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="button"
                      onClick={() => openWhatsApp(whatsappMsg)}
                      className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-all duration-300 hover:scale-[1.03] shadow-sm hover:shadow-md"
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
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Contáctanos por WhatsApp
                    </button>
                    <a
                      href={getPhoneHref()}
                      onClick={onPhoneClick}
                      className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 font-medium px-5 py-2.5 rounded-lg transition-all duration-300 hover:scale-[1.03] shadow-sm hover:shadow-md"
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
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-7 py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.03] shadow-lg hover:shadow-xl"
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
              Al continuar navegando en nuestro sitio, aceptas nuestro uso de
              tus datos personales según lo descrito en esta política.
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

export default PrivacyPage;
