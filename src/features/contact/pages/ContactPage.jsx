import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageTransition from "../../../components/ui/PageTransition";
import UnifiedNav from "../../../components/layout/UnifiedNav";
import Footer from "../../home/components/Footer";
import { useContactInfo } from "../../../hooks/useContactInfo";
import { useContactActions } from "../../../hooks/useContactActions";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiMessageSquare,
  FiShare2,
} from "react-icons/fi";
import { FaWhatsapp, FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

const ContactPage = () => {
  const { contactInfo, loading } = useContactInfo();
  const { openWhatsApp, getPhoneHref, onPhoneClick, ToastPortal } =
    useContactActions();

  // Parse coordinates from direccion or use default
  const getCoordinates = () => {
    if (contactInfo?.direccion) {
      // Intentar extraer coordenadas si están en el formato "lat,lng" al final
      const coordMatch = contactInfo.direccion.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
      if (coordMatch) {
        return {
          lat: parseFloat(coordMatch[1]),
          lng: parseFloat(coordMatch[2])
        };
      }
    }
    // Coordenadas por defecto (Durango, México)
    return { lat: 24.0277, lng: -104.6532 };
  };

  const coordinates = getCoordinates();
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${coordinates.lat},${coordinates.lng}&zoom=15`;
  
  // Alternative: OpenStreetMap iframe (no API key needed)
  const osmMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lng - 0.01},${coordinates.lat - 0.01},${coordinates.lng + 0.01},${coordinates.lat + 0.01}&layer=mapnik&marker=${coordinates.lat},${coordinates.lng}`;

  const contactMethods = [
    {
      icon: FaWhatsapp,
      title: "WhatsApp",
      description: "Respuesta rápida y directa",
      value: contactInfo?.whatsapp || contactInfo?.telefono || "+52 618 123 4567",
      action: () => openWhatsApp("Hola! Me gustaría obtener más información sobre sus servicios."),
      color: "from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700",
      show: true,
    },
    {
      icon: FiPhone,
      title: "Teléfono",
      description: "Llámanos directamente",
      value: contactInfo?.telefono || "+52 618 123 4567",
      action: () => onPhoneClick(),
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700",
      show: contactInfo?.telefono,
    },
    {
      icon: FiMail,
      title: "Email",
      description: "Escríbenos cuando gustes",
      value: contactInfo?.email || "contacto@viadca.com",
      action: () => window.location.href = `mailto:${contactInfo?.email || "contacto@viadca.com"}`,
      color: "from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700",
      show: contactInfo?.email,
    },
  ].filter(method => method.show);

  const socialLinks = [
    {
      icon: <FaFacebook className="w-6 h-6 text-white" />,
      name: "Facebook",
      url: contactInfo?.facebook,
      color: "bg-gradient-to-br from-blue-600 to-blue-700",
      show: contactInfo?.facebook,
    },
    {
      icon: <FaInstagram className="w-6 h-6 text-white" />,
      name: "Instagram",
      url: contactInfo?.instagram,
      color: "bg-gradient-to-br from-pink-600 to-purple-600",
      show: contactInfo?.instagram,
    },
    {
      icon: <FaTiktok className="w-6 h-6 text-white" />,
      name: "TikTok",
      url: contactInfo?.tiktok,
      color: "bg-gradient-to-br from-slate-800 to-slate-900",
      show: contactInfo?.tiktok,
    },
    {
      icon: <FaYoutube className="w-6 h-6 text-white" />,
      name: "YouTube",
      url: contactInfo?.youtube,
      color: "bg-gradient-to-br from-red-600 to-red-700",
      show: contactInfo?.youtube,
    },
    {
      icon: <FaWhatsapp className="w-6 h-6 text-white" />,
      name: "WhatsApp",
      url: contactInfo?.whatsapp ? `https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}` : null,
      color: "bg-gradient-to-br from-green-500 to-green-600",
      show: contactInfo?.whatsapp,
    },
  ].filter(social => social.show);

  // Parse horario
  const parseHorario = () => {
    if (!contactInfo?.horario) {
      return [
        { dia: "Lunes - Viernes", horario: "9:00 AM - 6:00 PM" },
        { dia: "Sábado", horario: "10:00 AM - 2:00 PM" },
        { dia: "Domingo", horario: "Cerrado" },
      ];
    }
    
    // Si horario es un string, intentar parsearlo
    if (typeof contactInfo.horario === 'string') {
      const lines = contactInfo.horario.split('\n').filter(l => l.trim());
      return lines.map(line => {
        // Buscar formatos comunes: "Lunes: 9:00 - 18:00" o "Lunes - Viernes: 9:00 - 18:00"
        const match = line.match(/^([^:]+):\s*(.+)$/);
        if (match) {
          return {
            dia: match[1].trim(),
            horario: match[2].trim()
          };
        }
        // Si no hay formato, devolver la línea completa
        return {
          dia: line.trim(),
          horario: ''
        };
      });
    }
    
    return [{ dia: "Horario", horario: String(contactInfo.horario) }];
  };

  const horarios = parseHorario();

  return (
    <>
      <UnifiedNav contactInfo={contactInfo} transparentOnTop={true} />
      <PageTransition>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow bg-gradient-to-b from-slate-50 via-white to-blue-50/10 relative">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 pointer-events-none -z-10" aria-hidden="true">
              <div className="absolute -top-20 -left-32 w-64 h-64 rounded-full bg-blue-200/20 blur-3xl animate-pulse-slow" />
              <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-indigo-200/20 blur-3xl animate-pulse-slow delay-1000" />
              <div className="absolute bottom-20 left-1/3 w-48 h-48 rounded-full bg-cyan-200/15 blur-2xl animate-pulse-slow delay-500" />
            </div>

            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white pt-28 md:pt-32">
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/20"></div>
              <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 md:mb-8 shadow-2xl">
                    <FiMessageSquare className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                    Contáctanos
                  </h1>
                  <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-6 leading-relaxed">
                    Estamos aquí para ayudarte a planificar el viaje de tus sueños
                  </p>
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

            {/* Main Content */}
            <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
              {/* Contact Methods Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-16">
                {contactMethods.map((method, index) => (
                  <div
                    key={index}
                    onClick={method.action}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 cursor-pointer border border-slate-200/50 hover:-translate-y-2"
                  >
                    <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${method.color} rounded-xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <method.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{method.title}</h3>
                    <p className="text-slate-600 text-sm mb-3">{method.description}</p>
                    <p className="text-slate-800 font-semibold break-all">{method.value}</p>
                  </div>
                ))}
              </div>

              {/* Two Column Layout */}
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Map Section */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden">
                  <div className="p-6 md:p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                        <FiMapPin className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                          Nuestra Ubicación
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                          {contactInfo?.direccion?.replace(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/, '').trim() || "Durango, México"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Interactive Map */}
                  <div className="relative h-96 bg-slate-100">
                    <iframe
                      src={osmMapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Mapa de ubicación"
                      className="w-full h-full"
                    ></iframe>
                    {/* Link to open in Google Maps */}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-4 right-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2 text-sm"
                    >
                      <FiMapPin className="w-4 h-4" />
                      Abrir en Google Maps
                    </a>
                  </div>
                </div>

                {/* Information Cards */}
                <div className="space-y-6">
                  {/* Business Hours */}
                  {horarios && horarios.length > 0 && (
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-200/50 p-8 md:p-10">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                          <FiClock className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-900">
                            Horario de Atención
                          </h3>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {horarios.map((item, index) => (
                          <div
                            key={index}
                            className={`flex justify-between items-center py-3 px-4 rounded-xl ${
                              item.horario.toLowerCase() === 'cerrado'
                                ? 'bg-slate-50 text-slate-400'
                                : 'bg-blue-50/50 text-slate-700'
                            }`}
                          >
                            <span className="font-semibold">
                              {item.dia}
                            </span>
                            <span className={
                              item.horario.toLowerCase() === 'cerrado'
                                ? 'text-slate-400 font-medium'
                                : 'text-blue-700 font-semibold'
                            }>
                              {item.horario}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Social Media */}
                  {socialLinks.length > 0 && (
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-200/50 p-8 md:p-10">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                          <FiShare2 className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-900">
                            Síguenos en Redes
                          </h3>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {socialLinks.map((social, index) => (
                          <a
                            key={index}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl ${social.color} hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group`}
                            title={social.name}
                          >
                            <div className="transform group-hover:scale-110 transition-transform duration-300">
                              {social.icon}
                            </div>
                            <span className="text-white font-semibold text-sm">
                              {social.name}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* FAQ Quick Links */}
              <div className="mt-16 bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl border-2 border-orange-100 p-8 md:p-10">
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                    ¿Tienes dudas?
                  </h2>
                  <p className="text-slate-600 max-w-2xl mx-auto">
                    Visita nuestra sección de preguntas frecuentes o explora nuestros paquetes de viaje
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/preguntas-frecuentes"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-all shadow-md hover:shadow-xl transform hover:scale-[1.02] border border-slate-200"
                  >
                    Preguntas Frecuentes
                  </Link>
                  <Link
                    to="/paquetes"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    Ver Paquetes
                  </Link>
                </div>
              </div>
            </section>
          </main>
          <Footer contactInfo={contactInfo} />
        </div>
      </PageTransition>
      <ToastPortal />
    </>
  );
};

export default ContactPage;
