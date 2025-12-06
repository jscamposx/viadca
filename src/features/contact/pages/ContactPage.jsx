import React from "react";
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
  FiArrowRight,
  FiExternalLink,
  FiCalendar,
} from "react-icons/fi";
import {
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";

const ContactPage = () => {
  const { contactInfo } = useContactInfo();
  const { openWhatsApp, onPhoneClick, ToastPortal } = useContactActions();

  // --- Lógica de Coordenadas (Para OpenStreetMap) ---
  const getCoordinates = () => {
    if (contactInfo?.direccion) {
      const coordMatch = contactInfo.direccion.match(
        /(-?\d+\.\d+),\s*(-?\d+\.\d+)/
      );
      if (coordMatch) {
        return {
          lat: parseFloat(coordMatch[1]),
          lng: parseFloat(coordMatch[2]),
        };
      }
    }
    // Default Durango Centro
    return { lat: 24.0277, lng: -104.6532 };
  };

  const coordinates = getCoordinates();
  const osmMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    coordinates.lng - 0.008
  },${coordinates.lat - 0.008},${coordinates.lng + 0.008},${
    coordinates.lat + 0.008
  }&layer=mapnik&marker=${coordinates.lat},${coordinates.lng}`;

  // --- Enlace Inteligente a Google Maps ---
  const googleMapsUrl = contactInfo?.direccion
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        contactInfo.direccion
      )}`
    : `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;

  // --- Datos de Contacto ---
  const contactMethods = [
    {
      id: "whatsapp",
      icon: FaWhatsapp,
      title: "WhatsApp",
      description: "Chat directo y rápido",
      value:
        contactInfo?.whatsapp || contactInfo?.telefono || "+52 618 123 4567",
      action: () =>
        openWhatsApp(
          "Hola! Me gustaría obtener más información sobre sus servicios."
        ),
      gradient: "from-green-500 to-emerald-600",
      bg: "bg-gradient-to-br from-green-50 to-emerald-50",
      btnColor: "bg-green-500 hover:bg-green-600",
      iconColor: "text-green-600",
      show: true,
    },
    {
      id: "phone",
      icon: FiPhone,
      title: "Llámanos",
      description: "Atención personalizada",
      value: contactInfo?.telefono || "+52 618 123 4567",
      action: () => onPhoneClick(),
      gradient: "from-blue-500 to-indigo-600",
      bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
      btnColor: "bg-blue-500 hover:bg-blue-600",
      iconColor: "text-blue-600",
      show: contactInfo?.telefono,
    },
    {
      id: "email",
      icon: FiMail,
      title: "Correo",
      description: "Solicita cotizaciones",
      value: contactInfo?.email || "contacto@viadca.com",
      action: () =>
        (window.location.href = `mailto:${
          contactInfo?.email || "contacto@viadca.com"
        }`),
      gradient: "from-purple-500 to-pink-600",
      bg: "bg-gradient-to-br from-purple-50 to-pink-50",
      btnColor: "bg-purple-500 hover:bg-purple-600",
      iconColor: "text-purple-600",
      show: contactInfo?.email,
    },
  ].filter((method) => method.show);

  // --- Redes Sociales ---
  const socialLinks = [
    {
      icon: <FaFacebook />,
      name: "Facebook",
      url: contactInfo?.facebook,
      gradient: "from-[#1877F2] to-blue-600",
      show: contactInfo?.facebook,
    },
    {
      icon: <FaInstagram />,
      name: "Instagram",
      url: contactInfo?.instagram,
      gradient: "from-pink-500 via-purple-500 to-orange-500",
      show: contactInfo?.instagram,
    },
    {
      icon: <FaTiktok />,
      name: "TikTok",
      url: contactInfo?.tiktok,
      gradient: "from-gray-900 to-black",
      show: contactInfo?.tiktok,
    },
    {
      icon: <FaYoutube />,
      name: "YouTube",
      url: contactInfo?.youtube,
      gradient: "from-[#FF0000] to-red-600",
      show: contactInfo?.youtube,
    },
  ].filter((social) => social.show);

  const parseHorario = () => {
    if (!contactInfo?.horario) {
      return [
        { dia: "Lunes - Viernes", horario: "9:00 AM - 6:00 PM" },
        { dia: "Sábado", horario: "10:00 AM - 2:00 PM" },
        { dia: "Domingo", horario: "Cerrado" },
      ];
    }
    if (typeof contactInfo.horario === "string") {
      const lines = contactInfo.horario.split("\n").filter((l) => l.trim());
      return lines.map((line) => {
        const match = line.match(/^([^:]+):\s*(.+)$/);
        return match
          ? { dia: match[1].trim(), horario: match[2].trim() }
          : { dia: line.trim(), horario: "" };
      });
    }
    return [{ dia: "Horario", horario: String(contactInfo.horario) }];
  };
  const horarios = parseHorario();

  return (
    <>
      <UnifiedNav contactInfo={contactInfo} transparentOnTop={false} />
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white font-sans">
          {/* --- HERO SECTION --- */}
          <section className="relative pt-28 pb-20 md:pb-32 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-100/30 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-100/30 to-transparent rounded-full blur-3xl"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200/50 text-blue-600 text-sm font-semibold uppercase tracking-wider mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                Estamos aquí para ayudarte
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
                Conectemos
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mt-2">
                  tu próxima aventura
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                Diseñamos experiencias únicas. Contáctanos y comencemos a planear
                el viaje perfecto para ti.
              </p>
            </div>
          </section>

          <main className="relative -mt-8 px-4 sm:px-6 lg:px-8 pb-20">
            <div className="max-w-7xl mx-auto">
              {/* --- CONTACT CARDS --- */}
              <div className="grid md:grid-cols-3 gap-6 mb-16">
                {contactMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={method.action}
                    className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 cursor-pointer overflow-hidden border border-slate-200/50 hover:border-transparent transform hover:-translate-y-2"
                  >
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${method.gradient} transition-opacity duration-500`}
                    ></div>

                    <div className="relative z-10">
                      <div
                        className={`w-20 h-20 rounded-2xl ${method.bg} flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:scale-110 transition-all duration-500`}
                      >
                        <method.icon
                          className={`w-10 h-10 ${method.iconColor}`}
                        />
                      </div>

                      <h3 className="text-2xl font-bold text-slate-900 group-hover:text-white mb-2 transition-colors duration-300">
                        {method.title}
                      </h3>
                      <p className="text-slate-500 text-sm mb-6 group-hover:text-white/90 transition-colors duration-300">
                        {method.description}
                      </p>

                      <p className="font-mono text-slate-700 group-hover:text-white text-sm mb-6 transition-colors duration-300">
                        {method.value}
                      </p>

                      <div
                        className={`${method.btnColor} text-white py-3 px-6 rounded-xl font-bold text-sm transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center gap-2`}
                      >
                        Contactar
                        <FiArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* --- MAIN CONTENT GRID (BENTO) --- */}
              <div className="grid lg:grid-cols-3 gap-8 items-stretch">
                {/* COLUMNA IZQUIERDA: Mapa */}
                <div className="lg:col-span-2 flex flex-col h-full">
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-2xl overflow-hidden relative group flex-1 min-h-[500px] h-full">
                    {/* Header del Mapa Mejorado: Tarjeta Flotante Blanca/Glass */}
                    <div className="absolute top-6 left-6 z-20 pointer-events-none max-w-[90%]">
                      <div className="flex items-center gap-4 p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-white/50 shadow-xl pointer-events-auto">
                        <div className="p-3 bg-blue-50 rounded-xl shrink-0 border border-blue-100">
                          <FiMapPin className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-slate-900 font-bold text-base leading-tight">
                            Nuestra Ubicación
                          </h3>
                          <p className="text-slate-600 text-sm mt-0.5 font-medium leading-snug break-words">
                            {contactInfo?.direccion
                              ?.replace(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/, "")
                              .trim() || "Durango, México"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Iframe del Mapa */}
                    <iframe
                      src={osmMapUrl}
                      className="w-full h-full grayscale-0 transition-all duration-700"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      title="Mapa de Ubicación"
                    />

                    {/* Botón flotante Google Maps */}
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-6 right-6 bg-white hover:bg-slate-50 text-slate-900 py-3 px-5 rounded-xl shadow-xl transition-all duration-300 flex items-center gap-3 text-sm font-bold border border-white/20 hover:scale-105 group/btn z-30"
                    >
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                        <FiExternalLink className="w-4 h-4 text-white" />
                      </div>
                      Abrir en Google Maps
                    </a>
                  </div>
                </div>

                {/* COLUMNA DERECHA: Horarios y Redes */}
                <div className="space-y-6 flex flex-col">
                  {/* Horarios Widget */}
                  <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-8 shadow-xl border border-slate-100 flex-1">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                        <FiClock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-xl">
                          Horario de Atención
                        </h3>
                        <p className="text-slate-500 text-sm">Te esperamos</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {horarios.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-4 rounded-xl bg-white hover:bg-blue-50 transition-all duration-300 border border-slate-100 hover:border-blue-200"
                        >
                          <div className="flex items-center gap-3">
                            <FiCalendar className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-700 font-semibold">
                              {item.dia}
                            </span>
                          </div>
                          <span
                            className={`px-3 py-1.5 rounded-lg font-bold text-sm ${
                              item.horario.toLowerCase().includes("cerrado")
                                ? "bg-slate-100 text-slate-500"
                                : "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm"
                            }`}
                          >
                            {item.horario}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Redes Sociales Widget */}
                  {socialLinks.length > 0 && (
                    <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-8 shadow-xl border border-slate-100">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl shadow-lg">
                          <FiMessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-xl">
                            Síguenos
                          </h3>
                          <p className="text-slate-500 text-sm">
                            Únete a la comunidad
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {socialLinks.map((social, idx) => (
                          <a
                            key={idx}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative overflow-hidden p-4 rounded-2xl bg-white hover:bg-slate-50 transition-all duration-500 border border-slate-100 hover:border-transparent hover:shadow-lg"
                          >
                            <div
                              className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${social.gradient} transition-opacity duration-500`}
                            ></div>

                            <div className="relative z-10 flex flex-col items-center justify-center">
                              <div className="mb-3 transform group-hover:scale-110 transition-transform duration-500">
                                {React.cloneElement(social.icon, {
                                  className:
                                    "w-8 h-8 text-slate-700 group-hover:text-white transition-colors duration-300",
                                })}
                              </div>
                              <span className="text-xs font-bold text-slate-700 group-hover:text-white transition-colors duration-300">
                                {social.name}
                              </span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* --- CALL TO ACTION BOTTOM (DISEÑO LIMPIO) --- */}
              <div className="mt-20 pt-12 border-t border-slate-100">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start lg:items-center justify-between">
                  {/* Texto Izquierda */}
                  <div className="max-w-2xl space-y-5">
                    <h2 className="text-3xl font-bold font-volkhov leading-tight text-slate-900">
                      ¿Aún necesitas ayuda?
                    </h2>
                    <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                      Escríbenos y un asesor te responderá personalmente para
                      planificar tu viaje o aclarar cualquier duda que no
                      encontraste arriba.
                    </p>

                    {/* Badges */}
                    <ul className="flex flex-wrap gap-3">
                      <li className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 text-slate-700 text-xs font-medium border border-slate-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        Asesoría personalizada
                      </li>
                      <li className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 text-slate-700 text-xs font-medium border border-slate-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Respuestas rápidas
                      </li>
                      <li className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 text-slate-700 text-xs font-medium border border-slate-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                        Experiencia en viajes
                      </li>
                    </ul>
                  </div>

                  {/* Botones Derecha */}
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => contactMethods[0]?.action()}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <FaWhatsapp className="w-5 h-5" />
                      Chatear por WhatsApp
                    </button>
                    <button
                      onClick={() => contactMethods[1]?.action()}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-700 font-medium border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 group"
                    >
                      <FiPhone className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                      Llamar ahora
                    </button>
                  </div>
                </div>
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

export default ContactPage;