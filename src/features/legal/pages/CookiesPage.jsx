import React from "react";
import { Link } from "react-router-dom";
import PageTransition from "../../../components/ui/PageTransition";
import UnifiedNav from "../../../components/layout/UnifiedNav";
import Footer from "../../home/components/Footer";
import { useContactActions } from "../../../hooks/useContactActions";
import { useContactInfo } from "../../../hooks/useContactInfo";

const CookiesPage = () => {
  const lastUpdate = "Agosto 2025";
  const { openWhatsApp, getPhoneHref, onPhoneClick, ToastPortal } =
    useContactActions();
  const { contactInfo } = useContactInfo();
  const whatsappMsg =
    "Hola, tengo dudas sobre su política de cookies. ¿Podrían brindarme más información?";

  return (
    <>
      <UnifiedNav contactInfo={contactInfo} transparentOnTop={true} />
      <PageTransition>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow bg-gradient-to-b from-slate-50 via-white to-purple-50/10 relative">
        {/* Fondo decorativo mejorado */}
        <div
          className="absolute inset-0 pointer-events-none -z-10"
          aria-hidden="true"
        >
          <div className="absolute -top-20 -left-32 w-64 h-64 rounded-full bg-purple-200/20 blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-indigo-200/20 blur-3xl animate-pulse-slow delay-1000" />
          <div className="absolute bottom-20 left-1/3 w-48 h-48 rounded-full bg-pink-200/15 blur-2xl animate-pulse-slow delay-500" />
        </div>

        {/* Sección Hero mejorada */}
        <div className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white pt-28 md:pt-32">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/20"></div>
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 md:mb-8 shadow-2xl">
                <svg
                  className="w-8 h-8 md:w-10 md:h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                Política de Cookies
              </h1>
              <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto mb-6 leading-relaxed">
                Información transparente sobre el uso de cookies y tecnologías similares en nuestro sitio web.
              </p>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <svg
                  className="w-4 h-4 text-purple-200"
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
                <span className="text-sm text-purple-100 font-medium">
                  Última actualización: {lastUpdate}
                </span>
              </div>
            </div>
          </div>

          {/* Onda decorativa */}
          <div className="absolute -bottom-1 left-0 right-0">
            <svg viewBox="0 0 1440 120" className="w-full h-auto" fill="currentColor">
              <path
                fillOpacity="0.1"
                d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
              ></path>
            </svg>
          </div>
        </div>

        {/* Contenido principal */}
        <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/50 p-6 md:p-10 lg:p-12">
            <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-6 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-li:marker:text-purple-500 prose-a:text-purple-600 prose-a:no-underline hover:prose-a:text-purple-700 prose-a:font-medium">
              <div className="bg-purple-50/70 rounded-xl p-6 mb-10 border-l-4 border-purple-500">
                <p className="text-lg font-medium text-purple-800">
                  Esta web utiliza cookies y tecnologías similares para mejorar
                  tu experiencia, analizar el tráfico y, en su caso,
                  personalizar contenido. Al continuar navegando, aceptas su uso
                  según esta política.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h2 className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </span>
                    ¿Qué son las cookies?
                  </h2>
                  <p>
                    Son pequeños archivos que se alojan en tu dispositivo cuando
                    visitas un sitio web. Pueden ser propias o de terceros y
                    permiten reconocer tu navegador o recordar ciertas
                    preferencias.
                  </p>
                </div>

                <div>
                  <h2 className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        />
                      </svg>
                    </span>
                    Tipos de cookies que usamos
                  </h2>
                  <ul>
                    <li className="mb-2 flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 rounded-full mr-2 mt-0.5 flex-shrink-0">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      </span>
                      <span>
                        <strong className="text-slate-800">Esenciales:</strong>{" "}
                        necesarias para el funcionamiento básico del sitio (por
                        ejemplo, navegación, seguridad).
                      </span>
                    </li>
                    <li className="mb-2 flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-amber-100 rounded-full mr-2 mt-0.5 flex-shrink-0">
                        <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
                      </span>
                      <span>
                        <strong className="text-slate-800">Analíticas:</strong>{" "}
                        nos ayudan a entender el uso del sitio para mejorarlo.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 rounded-full mr-2 mt-0.5 flex-shrink-0">
                        <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                      </span>
                      <span>
                        <strong className="text-slate-800">
                          Preferencias:
                        </strong>{" "}
                        recuerdan tus elecciones (por ejemplo, idioma).
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10 mt-12">
                <div>
                  <h2 className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </span>
                    Gestión de cookies
                  </h2>
                  <p>
                    Puedes configurar tu navegador para aceptar, bloquear o
                    eliminar cookies. Ten en cuenta que bloquear ciertas cookies
                    podría afectar la funcionalidad del sitio. Consulta la ayuda
                    de tu navegador para más información.
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
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Configuración recomendada
                    </h3>
                    <p className="text-sm text-slate-600">
                      Para una experiencia óptima, te recomendamos aceptar
                      cookies esenciales y de preferencias. Las cookies
                      analíticas puedes desactivarlas si lo prefieres.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-purple-600"
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
                    Cookies de terceros
                  </h2>
                  <p>
                    Algunas herramientas de terceros (por ejemplo, mapas o
                    reproductores incrustados) pueden establecer sus propias
                    cookies. No controlamos directamente estas cookies;
                    recomendamos revisar sus políticas.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700">
                      Google Analytics
                    </span>
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700">
                      YouTube
                    </span>
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700">
                      Mapas
                    </span>
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700">
                      Redes sociales
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h2 className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-purple-600"
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
                  Actualizaciones
                </h2>
                <p>
                  Podemos modificar esta política para reflejar cambios en las
                  cookies utilizadas o requisitos legales. Publicaremos la
                  versión vigente en esta página.
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
                    Para cambios importantes en nuestra política de cookies, te
                    notificaremos mediante un banner destacado en nuestro sitio
                    web durante al menos 7 días antes de que los cambios entren
                    en vigor.
                  </p>
                </div>
              </div>
            </div>

            {/* Sección de ayuda (eliminado bloque "Gestión de Cookies") */}
            <div className="mt-16">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100/60 shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
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
                  </div>
                  <h3 className="font-semibold text-blue-800 text-lg">
                    ¿Necesitas ayuda?
                  </h3>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  Si tienes preguntas sobre cookies o necesitas asistencia
                  técnica, contáctanos.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => openWhatsApp(whatsappMsg)}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 font-medium text-sm px-4 py-2 rounded-lg transition-colors shadow-sm"
                  >
                    <svg
                      className="w-4 h-4"
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
                    WhatsApp
                  </button>
                  <a
                    href={getPhoneHref()}
                    onClick={onPhoneClick}
                    className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 border border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 font-medium text-sm px-4 py-2 rounded-lg transition-colors shadow-sm"
                  >
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
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    Llamar / Copiar
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium px-7 py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.03] shadow-lg hover:shadow-xl"
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
              cookies según lo descrito en esta política.
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
        <Footer contactInfo={contactInfo} />
        </div>
      </PageTransition>
    </>
  );
};

export default CookiesPage;
