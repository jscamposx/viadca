import React, { useMemo } from "react";
import { AnimatedSection, useSectionReveal } from "../../../hooks/scrollAnimations";
import FaqSchema from "../components/FaqSchema";
import { useSEO } from "../../../hooks/useSEO";
import Footer from "../../home/components/Footer";
import { useContactInfo } from "../../../hooks/useContactInfo";
import UnifiedNav from "../../../components/layout/UnifiedNav";
import { useContactActions } from "../../../hooks/useContactActions"; // nuevo

// Estructuramos las FAQs en categorías con preguntas y respuestas.
// Para el JSON-LD, sólo necesitamos question/answer plano; combinaremos todas.

const faqCategories = [
  {
    id: "conoce-viadca",
    title: "Conoce Viadca Viajes",
    description:
      "Nuestra identidad, respaldo y por qué somos tu mejor elección.",
    faqs: [
      {
        q: "¿Quiénes son Viadca Viajes y qué experiencia tienen?",
        a: `Somos Viadca Viajes, una agencia de viajes establecida en Durango dedicada a diseñar y organizar aventuras memorables. Formamos parte de la red de Zafiro Tours, lo que nos permite combinar la atención cercana de una agencia local con el respaldo y poder de negociación de un gran grupo internacional.`,
      },
      {
        q: "¿Por qué debería reservar con Viadca Viajes en lugar de hacerlo por mi cuenta en internet?",
        a: `Ofrecemos asesoría experta y personalizada: analizamos tus preferencias, presupuesto y estilo de viaje para construir un itinerario a medida, nos encargamos de la logística completa y te brindamos asistencia humana antes, durante y después del viaje, algo que los portales masivos no ofrecen.`,
      },
      {
        q: "¿Qué significa que Viadca sea parte de Zafiro Tours?",
        a: `Nos otorga acceso a tarifas preferenciales, ofertas exclusivas y una red global de proveedores verificados, garantizando calidad, seguridad y respaldo financiero adicional para tus reservas.`,
      },
      {
        q: "¿Tienen una oficina física en Durango que pueda visitar?",
        a: `Sí. Estamos en Calle Mascareñas 803, Victoria de Durango Zona Centro Oriente, CP 34000, Durango, México. Puedes visitarnos para recibir asesoría personalizada y resolver todas tus dudas.`,
      },
      {
        q: "¿Están afiliados a asociaciones o cuentan con certificaciones?",
        a: "Sí, operamos bajo el paraguas de Zafiro Tours y seguimos estándares de calidad, seguridad y protección al consumidor del sector turístico. Esto te brinda respaldo adicional y transparencia.",
      },
      {
        q: "¿Cómo garantizan la selección de sus proveedores?",
        a: "Validamos reputación, cumplimiento legal, reseñas verificadas, políticas de seguridad y la calidad del servicio. Renovamos acuerdos y monitoreamos satisfacción post‑viaje para mantener sólo a los mejores.",
      },
    ],
  },
  {
    id: "destinos-paquetes",
    title: "Destinos y Paquetes",
    description: "Tipos de viajes, personalización y servicios especiales.",
    faqs: [
      {
        q: "¿Qué tipo de viajes y destinos ofrecen?",
        a: `Viajes nacionales por México, internacionales (Europa, Asia, Sudamérica, Norteamérica, Medio Oriente, África), cruceros y viajes temáticos como lunas de miel, ecoturismo, viajes familiares y gastronómicos.`,
      },
      {
        q: "¿Pueden organizar viajes a medida o personalizados?",
        a: `Sí. Creamos itinerarios a medida según tus intereses, ritmo, presupuesto y fechas. Seleccionamos hoteles, actividades y traslados específicos para una experiencia única.`,
      },
      {
        q: "¿Manejan paquetes de viaje para grupos, congresos o convenciones?",
        a: `Sí. Organizamos viajes de incentivos y corporativos, grupos familiares o de amigos y viajes de interés especial (estudiantes, clubes, etc.), gestionando tarifas grupales y logística integral.`,
      },
      {
        q: '¿Qué incluyen generalmente sus paquetes de viaje "todo incluido"?',
        a: `Normalmente: vuelos redondos, alojamiento, traslados aeropuerto-hotel, alimentos y bebidas, actividades/entretenimiento del hotel, impuestos y propinas (según paquete). Detallamos inclusiones exactas en cada cotización.`,
      },
      {
        q: "¿Ofrecen paquetes especiales para lunas de miel o bodas de destino?",
        a: `Sí. Diseñamos experiencias románticas con detalles especiales (cenas privadas, spa, excursiones) y coordinamos bodas de destino para la pareja e invitados.`,
      },
      {
        q: "¿Puedo combinar varios destinos o países en un mismo viaje?",
        a: "Sí. Diseñamos itinerarios multidestino optimizando conexiones, tiempos de traslado y presupuesto. Recomendamos planificar con antelación para asegurar disponibilidad.",
      },
      {
        q: "¿Incluyen experiencias locales auténticas?",
        a: "Podemos integrar clases culinarias, tours guiados por expertos locales, visitas exclusivas, actividades sostenibles y experiencias inmersivas fuera de lo masivo.",
      },
    ],
  },
  {
    id: "reservas-pagos",
    title: "Reservas, Pagos y Preparativos",
    description: "Cómo cotizar, métodos de pago y documentación necesaria.",
    faqs: [
      {
        q: "¿Cómo puedo solicitar una cotización para un viaje?",
        a: `Puedes hacerlo vía formulario web (viadca.app), teléfono (618-109-8565), WhatsApp o visitándonos en oficina. Un asesor te contactará para preparar una propuesta personalizada.`,
      },
      {
        q: "¿Qué métodos de pago aceptan? ¿Ofrecen meses sin intereses?",
        a: `Aceptamos transferencias, depósitos y tarjetas (Visa, MasterCard, American Express). Frecuentemente contamos con promociones de meses sin intereses con bancos participantes; consulta al cotizar.`,
      },
      {
        q: "¿Cuál es el proceso de reserva una vez que acepto la cotización?",
        a: `Pago inicial para asegurar espacios, confirmación de servicios (vuelos, hotel, tours), plan de pagos hasta la fecha límite y entrega final de documentos de viaje e itinerario.`,
      },
      {
        q: "¿Qué documentación necesito para mi viaje (pasaporte, visas)?",
        a: `Viajes nacionales: identificación oficial vigente. Internacionales: pasaporte con al menos 6 meses de vigencia al regreso; algunos destinos requieren visa. Te orientamos sobre requisitos pero es responsabilidad del viajero tramitar documentos.`,
      },
      {
        q: "¿Con cuánta anticipación debo reservar mi viaje?",
        a: `Internacionales largos: 6–9 meses (más en alta demanda). Cruceros: 8–12 meses. Nacionales: 2–4 meses (más para puentes/feriados). Reservar temprano mejora tarifas y disponibilidad.`,
      },
      {
        q: "¿Puedo congelar una tarifa mientras decido?",
        a: "En algunos servicios (vuelos o circuitos) podemos gestionar “opciones” de reserva por horas o pocos días. Depende del proveedor. Consúltalo al cotizar.",
      },
      {
        q: "¿Emitirán factura fiscal (CFDI)?",
        a: "Sí. Podemos emitir CFDI conforme a la normativa vigente en México. Facilítanos tus datos fiscales al confirmar tu reserva.",
      },
    ],
  },
  {
    id: "seguros-cancelaciones",
    title: "Seguros y Asistencia",
    description: "Protección, cambios y soporte durante el viaje.",
    faqs: [
      {
        q: "¿Es necesario contratar un seguro de viaje? ¿Ustedes lo ofrecen?",
        a: `Sí, lo recomendamos. Cubre asistencia médica, cancelación, interrupción, equipaje y soporte 24/7. Ofrecemos pólizas de compañías líderes adaptadas a tu viaje.`,
      },
      {
        q: "¿Cuál es su política de cancelación?",
        a: `Varía según proveedores (aerolíneas, hoteles, navieras). Antes del pago te entregamos condiciones y penalizaciones específicas para que tomes decisiones informadas.`,
      },
      {
        q: "¿Qué sucede si necesito hacer cambios en mi reserva después de haber pagado?",
        a: `La mayoría de cambios (fechas, nombres) son posibles, sujetos a políticas y cargos de proveedores y diferencias tarifarias. Contáctanos pronto para minimizar costos.`,
      },
      {
        q: "¿Qué tipo de asistencia ofrecen si tengo un problema durante mi viaje?",
        a: `Te damos contactos de emergencia y te apoyamos ante retrasos, incidencias médicas o cambios de último minuto, coordinando con proveedores y aseguradora.`,
      },
      {
        q: "¿El seguro cubre cancelación por enfermedad o COVID-19?",
        a: "Ofrecemos pólizas con coberturas médicas y de cancelación ampliadas (incluyendo COVID-19 según plan). Te detallamos exclusiones antes de comprar.",
      },
      {
        q: "¿Qué hago si se retrasa o cancela mi vuelo?",
        a: "Te asistimos coordinando alternativas con aerolínea, reemisión de cupones, cambios de tramos y reacomodos en itinerario para minimizar impacto.",
      },
    ],
  },
];

// Convertimos a items planos para Schema
const allFaqItems = faqCategories.flatMap((cat) =>
  cat.faqs.map((f) => ({ question: f.q, answer: f.a })),
);

export default function FaqPage() {
  useSEO({
    title: "Preguntas Frecuentes - Centro de Ayuda Viadca Viajes",
    description:
      "Centro de ayuda oficial de Viadca Viajes: respuestas a preguntas sobre reservas, destinos, pagos, seguros y asistencia para viajar con confianza desde Durango.",
    canonical: "https://www.viadca.app/preguntas-frecuentes",
  });

  const { contactInfo, loading: contactLoading } = useContactInfo();
  const currentYear = new Date().getFullYear();
  const { openWhatsApp, getPhoneHref, onPhoneClick, ToastPortal } =
    useContactActions();
  const whatsappMsg =
    "Hola, tengo dudas después de leer las Preguntas Frecuentes. ¿Podrían ayudarme?";

  const toc = useMemo(
    () => faqCategories.map((c) => ({ id: c.id, title: c.title })),
    [],
  );

  const handleFaqClick = (question) => {
    // Evento simple (puede reemplazarse por analytics real)
    if (window && window.dispatchEvent) {
      const ev = new CustomEvent("faq:open", { detail: { question } });
      window.dispatchEvent(ev);
    }
  };

  // BreadcrumbList Schema
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://www.viadca.app/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Preguntas Frecuentes",
        item: "https://www.viadca.app/preguntas-frecuentes",
      },
    ],
  };

  return (
    <>
      {/* Navbar unificada con links a secciones */}
      <UnifiedNav
        transparentOnTop={false}
        sectionLinks={toc.map((t) => ({ id: t.id, label: t.title }))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main className="min-h-screen bg-white pt-24 sm:pt-28 lg:pt-28 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-10">
          {/* Sidebar índice */}
          <aside className="lg:col-span-1 hidden lg:block">
            <nav aria-label="Índice FAQs" className="sticky top-28 space-y-4">
              <h2 className="text-sm font-semibold tracking-wide text-slate-600 uppercase">
                Categorías
              </h2>
              <ul className="space-y-2 text-sm">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="block px-3 py-2 rounded-md hover:bg-white shadow-sm hover:shadow transition text-slate-700 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Contenido principal */}
          <div className="lg:col-span-3 space-y-16">
            <header className="space-y-6 max-w-3xl lg:mt-8">
              <AnimatedSection animation="fadeInUp">
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                  Centro de Ayuda
                </p>
                <h1 className="font-volkhov text-4xl sm:text-5xl font-bold text-slate-800 leading-tight">
                  Preguntas Frecuentes
                </h1>
                <p className="text-lg text-slate-600">
                  Encuentra respuestas claras sobre cómo planificamos,
                  personalizamos y protegemos tu viaje. Información fiable,
                  actualizada y optimizada para ayudarte rápido.
                </p>
              </AnimatedSection>
            </header>

            {/* Navegación de categorías para mobile */}
            <div className="lg:hidden -mt-2">
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 pr-2">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="shrink-0 px-3 py-1.5 rounded-full text-sm bg-slate-50 text-slate-700 ring-1 ring-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:ring-blue-200"
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            </div>

            {faqCategories.map((cat) => (
              <FaqCategorySection key={cat.id} cat={cat} onFaqClick={handleFaqClick} />
            ))}
          </div>
        </div>
        {/* JSON-LD para SEO */}
        <FaqSchema items={allFaqItems} />

        {/* CTA de contacto */}
        <section className="max-w-5xl mx-auto mt-24">
          <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 bg-white text-slate-800 shadow-2xl ring-1 ring-slate-200">
            <div className="pointer-events-none" aria-hidden="true">
              <div className="absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br from-blue-300/60 to-rose-300/60 rounded-full blur-3xl opacity-60" />
              <div className="absolute -bottom-28 -left-24 w-80 h-80 bg-gradient-to-br from-indigo-300/60 to-teal-300/60 rounded-full blur-3xl opacity-60" />
            </div>
            <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-start lg:items-center">
              <div className="flex-1 space-y-4">
                <h2 className="text-3xl sm:text-4xl font-bold font-volkhov leading-tight text-slate-900">
                  ¿Aún necesitas ayuda?
                </h2>
                <p className="text-base sm:text-lg text-slate-600 max-w-2xl">
                  Escríbenos y un asesor te responderá personalmente para
                  planificar tu viaje o aclarar cualquier duda que no
                  encontraste en esta sección.
                </p>
                <ul className="flex flex-wrap gap-3 text-xs text-slate-600">
                  <li className="px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                    Asesoría personalizada
                  </li>
                  <li className="px-3 py-1 rounded-full bg-rose-50 text-rose-700">
                    Respuestas rápidas
                  </li>
                  <li className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
                    Experiencia en viajes
                  </li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => openWhatsApp(whatsappMsg)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium shadow-lg hover:shadow-xl hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 transition"
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
                  WhatsApp
                </button>
                <a
                  href={getPhoneHref()}
                  onClick={onPhoneClick}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium shadow-lg hover:shadow-xl hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 transition"
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
                  Llamar / Copiar
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* ...existing code... */}
      <Footer
        contactInfo={contactInfo}
        contactLoading={contactLoading}
        currentYear={currentYear}
      />
      <ToastPortal />
    </>
  );
}

// Subcomponente para manejar la animación por sección y escalonado de preguntas
function FaqCategorySection({ cat, onFaqClick }) {
  const [sectionRef, visible] = useSectionReveal({ threshold: 0.05, rootMargin: "0px 0px -10% 0px" });
  return (
    <section
      ref={sectionRef}
      id={cat.id}
      aria-labelledby={`${cat.id}-heading`}
      className="space-y-8 scroll-mt-28"
    >
      <AnimatedSection animation="fadeInUp" className="space-y-3" forceVisible={visible}>
        <h2
          id={`${cat.id}-heading`}
          className="text-2xl sm:text-3xl font-bold text-slate-800"
        >
          {cat.title}
        </h2>
        <p className="text-slate-600 max-w-2xl">{cat.description}</p>
      </AnimatedSection>
      <div className="space-y-4">
        {cat.faqs.map((f, idx) => (
          <AnimatedSection
            key={idx}
            animation="fadeInUp"
            forceVisible={visible}
            stagger={90}
            index={idx}
          >
            <details
              className="group bg-white rounded-xl border border-slate-200 shadow-sm transition overflow-hidden"
              onToggle={(e) => e.target.open && onFaqClick(f.q)}
            >
              <summary className="list-none px-5 py-4 sm:px-6 cursor-pointer flex items-center justify-between gap-4 select-none focus-visible:outline-none">
                <h3 className="font-semibold text-slate-800 text-base sm:text-lg">{f.q}</h3>
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 text-slate-500 ring-1 ring-slate-200 group-open:rotate-180 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="px-5 pb-5 sm:px-6 -mt-1">
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                  {f.a}
                </p>
              </div>
            </details>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
