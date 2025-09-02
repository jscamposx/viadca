import React from "react";
import { Link } from "react-router-dom";
import { useContactActions } from "../../../hooks/useContactActions"; // nuevo hook para unificar lógica
import OptimizedImage from "../../../components/ui/OptimizedImage.jsx";

const Footer = ({ contactInfo, contactLoading, currentYear }) => {
  const { openWhatsApp, getPhoneHref, onPhoneClick, ToastPortal } =
    useContactActions();
  const whatsappFooterMsg = "Hola, me gustaría planificar un viaje con Viadca.";

  return (
    <footer
      id="footer"
      role="contentinfo"
      aria-labelledby="footer-heading"
      className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-orange-50/20 text-slate-700 pt-20 pb-8 overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-20 -left-32 w-64 h-64 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-48 h-48 rounded-full bg-purple-200/20 blur-2xl" />

        {/* Geometric patterns */}
        <div className="absolute top-10 left-10 opacity-10" aria-hidden="true">
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>

        <div
          className="absolute bottom-10 right-10 opacity-10"
          aria-hidden="true"
        >
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 border border-orange-400 rotate-45"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute -top-[1px] left-0 w-full" aria-hidden="true">
        <svg
          className="w-full h-16"
          viewBox="0 0 1440 64"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0 32L60 29.3C120 26.7 240 21.3 360 24C480 26.7 600 37.3 720 40C840 42.7 960 37.3 1080 29.3C1200 21.3 1320 10.7 1380 5.3L1440 0V64H1380C1320 64 1200 64 1080 64C960 64 840 64 720 64C600 64 480 64 360 64C240 64 120 64 60 64H0V32Z"
            fill="url(#footerGradient)"
          />
          <defs>
            <linearGradient
              id="footerGradient"
              x1="0"
              x2="1440"
              y1="0"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#f8fafc" />
              <stop offset="0.5" stopColor="#eff6ff" />
              <stop offset="1" stopColor="#fef7ed" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="footer-heading" className="sr-only">
          Información del pie de página
        </h2>
        {/* Main Content */}
        <div
          className="grid lg:grid-cols-3 gap-12 lg:gap-16"
          role="presentation"
        >
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <OptimizedImage
                  src="/viadcalogo.avif"
                  alt="Logo de VIADCA agencia de viajes en Durango, México"
                  width={200}
                  height={64}
                  sizes="(max-width:640px) 160px, 180px"
                  className="h-16 w-auto drop-shadow-sm hover:scale-105 transition-transform duration-300"
                  placeholder={false}
                  lazy={true}
                  fetchPriority="low"
                  decoding="async"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                VIADCA by Zafiro Tours
              </h3>
              <p className="text-slate-700 leading-relaxed max-w-sm">
                Tu agencia de viajes de confianza en Durango. Más de 15 años
                creando experiencias inolvidables y conectando sueños con
                destinos únicos alrededor del mundo.
              </p>
            </div>

            {/* Quick Stats */}
            <ul
              className="grid grid-cols-3 gap-4 py-4"
              role="list"
              aria-label="Estadísticas rápidas"
            >
              <li className="text-center">
                <div className="text-2xl font-bold text-blue-700">200+</div>
                <div className="text-xs text-slate-700 uppercase tracking-wide">
                  Destinos
                </div>
              </li>
              <li className="text-center">
                <div className="text-2xl font-bold text-orange-700">5K+</div>
                <div className="text-xs text-slate-700 uppercase tracking-wide">
                  Clientes
                </div>
              </li>
              <li className="text-center">
                <div className="text-2xl font-bold text-green-700">15+</div>
                <div className="text-xs text-slate-700 uppercase tracking-wide">
                  Años
                </div>
              </li>
            </ul>

            {/* Social Media */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                Síguenos
              </h4>
              <div className="flex items-center gap-3">
                {contactInfo.facebook &&
                  contactInfo.facebook !== "https://www.facebook.com/" && (
                    <a
                      href={contactInfo.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative w-11 h-11 bg-white hover:bg-blue-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
                      aria-label="Facebook de Viadca"
                    >
                      <svg
                        className="w-5 h-5 text-blue-700 group-hover:text-white transition-colors duration-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                  )}

                {contactInfo.instagram &&
                  contactInfo.instagram !== "https://www.instagram.com/" && (
                    <a
                      href={contactInfo.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative w-11 h-11 bg-white hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-purple-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-600"
                      aria-label="Instagram de Viadca"
                    >
                      <svg
                        className="w-5 h-5 text-purple-700 group-hover:text-white transition-colors duration-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                  )}

                {contactInfo.tiktok &&
                  contactInfo.tiktok !== "https://www.tiktok.com/" && (
                    <a
                      href={contactInfo.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative w-11 h-11 bg-white hover:bg-black rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900"
                      aria-label="TikTok de Viadca"
                    >
                      <svg
                        className="w-5 h-5 text-black group-hover:text-white transition-colors duration-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05 0-12.07z" />
                      </svg>
                    </a>
                  )}

                {contactInfo.youtube &&
                  contactInfo.youtube !== "https://www.youtube.com/" && (
                    <a
                      href={contactInfo.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative w-11 h-11 bg-white hover:bg-red-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-600"
                      aria-label="YouTube de Viadca"
                    >
                      <svg
                        className="w-5 h-5 text-red-700 group-hover:text-white transition-colors duration-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </a>
                  )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                Contacto
              </h3>

              {contactLoading ? (
                <div className="space-y-4 animate-pulse" aria-busy="true">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {contactInfo.direccion && (
                    <div className="group flex items-start gap-4 p-3 rounded-lg hover:bg-white/60 transition-all duration-300">
                      <div
                        className="w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                        aria-hidden="true"
                      >
                        <svg
                          className="w-5 h-5 text-blue-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-slate-700 uppercase tracking-wide mb-1">
                          Dirección
                        </div>
                        <div className="text-sm text-slate-800 font-medium">
                          {contactInfo.direccion}
                        </div>
                      </div>
                    </div>
                  )}

                  {contactInfo.telefono && (
                    <div className="group flex items-start gap-4 p-3 rounded-lg hover:bg-white/60 transition-all duration-300">
                      <div
                        className="w-10 h-10 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                        aria-hidden="true"
                      >
                        <svg
                          className="w-5 h-5 text-green-700"
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
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-slate-700 uppercase tracking-wide mb-1">
                          Teléfono
                        </div>
                        <a
                          href={getPhoneHref()}
                          onClick={onPhoneClick}
                          className="text-sm text-slate-800 font-medium hover:text-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
                        >
                          {contactInfo.telefono}
                        </a>
                        <p className="sr-only">
                          Haz click para llamar en móvil o copiar el número en
                          escritorio.
                        </p>
                      </div>
                    </div>
                  )}

                  {contactInfo.whatsapp && (
                    <div className="group flex items-start gap-4 p-3 rounded-lg hover:bg-white/60 transition-all duration-300">
                      <div
                        className="w-10 h-10 bg-emerald-100 group-hover:bg-emerald-200 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                        aria-hidden="true"
                      >
                        <svg
                          className="w-5 h-5 text-emerald-700"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-slate-700 uppercase tracking-wide mb-1">
                          WhatsApp
                        </div>
                        <button
                          type="button"
                          onClick={() => openWhatsApp(whatsappFooterMsg)}
                          className="text-left text-sm text-slate-800 font-medium hover:text-emerald-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-600"
                          aria-label="Abrir conversación de WhatsApp"
                        >
                          {contactInfo.whatsapp}
                        </button>
                      </div>
                    </div>
                  )}

                  {contactInfo.email && (
                    <div className="group flex items-start gap-4 p-3 rounded-lg hover:bg-white/60 transition-all duration-300">
                      <div
                        className="w-10 h-10 bg-purple-100 group-hover:bg-purple-200 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                        aria-hidden="true"
                      >
                        <svg
                          className="w-5 h-5 text-purple-700"
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
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-slate-700 uppercase tracking-wide mb-1">
                          Email
                        </div>
                        <a
                          href={`mailto:${contactInfo.email}`}
                          className="text-sm text-slate-800 font-medium hover:text-purple-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-600"
                        >
                          {contactInfo.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {contactInfo.horario && (
                    <div className="group flex items-start gap-4 p-3 rounded-lg hover:bg-white/60 transition-all duration-300">
                      <div
                        className="w-10 h-10 bg-orange-100 group-hover:bg-orange-200 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                        aria-hidden="true"
                      >
                        <svg
                          className="w-5 h-5 text-orange-700"
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
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-slate-700 uppercase tracking-wide mb-1">
                          Horario
                        </div>
                        <div className="text-sm text-slate-800 font-medium">
                          {contactInfo.horario}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Map Section */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                Ubicación
              </h3>

              <div className="relative group">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"
                  aria-hidden="true"
                ></div>
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                  <div className="aspect-[4/3] w-full">
                    <iframe
                      title="Mapa de ubicación"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(contactInfo.direccion || "Durango, Mexico")}&output=embed`}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full border-0"
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/80">
                <p className="text-sm text-slate-700 leading-relaxed">
                  {contactInfo.direccion
                    ? `📍 Nos encontramos en ${contactInfo.direccion}. ¡Te esperamos para planificar tu próxima aventura!`
                    : "📍 Contáctanos para conocer nuestra ubicación exacta y agendar una visita."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-white/60">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <p className="text-sm text-slate-700">
                © {currentYear}{" "}
                <span className="font-semibold text-slate-900">
                  VIADCA by Zafiro Tours
                </span>
                . Todos los derechos reservados.
              </p>
              <div className="flex items-center gap-1 text-xs text-slate-700">
                <span>Hecho con</span>
                <svg
                  className="w-4 h-4 text-red-600 animate-pulse"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span>en México</span>
              </div>
            </div>

            <nav
              className="flex flex-wrap items-center gap-4 text-sm"
              aria-label="Enlaces legales"
            >
              <Link
                to="/preguntas-frecuentes"
                className="text-slate-700 hover:text-blue-700 transition-colors duration-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
              >
                Ayuda / FAQ
              </Link>
              <span className="text-slate-400" aria-hidden="true">
                •
              </span>
              <Link
                to="/privacidad"
                className="text-slate-700 hover:text-blue-700 transition-colors duration-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
              >
                Privacidad
              </Link>
              <span className="text-slate-400" aria-hidden="true">
                •
              </span>
              <Link
                to="/terminos"
                className="text-slate-700 hover:text-blue-700 transition-colors duration-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
              >
                Términos
              </Link>
              <span className="text-slate-400" aria-hidden="true">
                •
              </span>
              <Link
                to="/cookies"
                className="text-slate-700 hover:text-blue-700 transition-colors duration-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
              >
                Cookies
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <ToastPortal />
    </footer>
  );
};

export default Footer;
