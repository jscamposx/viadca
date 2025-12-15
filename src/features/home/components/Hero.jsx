import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Check } from "lucide-react";
import defaultVideo from "/videos/destinations-hero.mp4";
import { useContactActions } from "../../../hooks/useContactActions";

gsap.registerPlugin(ScrollTrigger);

const contentData = {
  mexico: {
    label: "México",
    title: "Explora México con Viadca",
    desc: "Vuelos y hoteles en los destinos más queridos: playas, pueblos mágicos y escapadas urbanas.",
    features: ["Paquetes con vuelo + hotel", "Traslados y seguros opcionales", "Pagos en meses con costo financiero"],
    video: defaultVideo,
  },
  internacionales: {
    label: "Internacionales",
    title: "Aventura fuera de México",
    desc: "Circuitos y escapadas internacionales con operadores confiables y soporte en ruta.",
    features: ["Guías y traslados incluidos", "Reprogramaciones con el equipo Viadca", "Contacto 24/7"],
    video: defaultVideo,
  },
  destacados: {
    label: "Destacados",
    title: "Selección destacada por Viadca",
    desc: "Rutas favoritas de nuestra comunidad con tarifas negociadas y extras incluidos.",
    features: ["Tarifas especiales", "Bloqueos anticipados", "Bonos y upgrades sujetos a disponibilidad"],
    video: defaultVideo,
  },
  todos: {
    label: "Todos",
    title: "Explora todos los paquetes",
    desc: "Consulta el catálogo completo y encuentra tu próximo viaje en minutos.",
    features: ["Filtros por destino y fecha", "Opciones familiares y corporativas", "Asesoría de nuestro equipo"],
    video: defaultVideo,
  },
};

const Hero = () => {
  const [activeTab, setActiveTab] = useState("mexico");
  const containerRef = useRef(null);
  const rightSideWrapperRef = useRef(null);
  const videoInnerRef = useRef(null);
  const overlayRef = useRef(null);
  const textRef = useRef(null);
  const leftContentRef = useRef(null);
  const leftContentInnerRef = useRef(null);
  const { openWhatsApp, onPhoneClick, getPhoneHref, ToastPortal } =
    useContactActions();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.set(leftContentRef.current, {
          width: "0%",
          height: "100%",
          opacity: 0,
        });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=250%",
            scrub: 1,
            pin: true,
            pinSpacing: true,
          },
        });
        tl.to(videoInnerRef.current, {
          width: "95vw",
          height: "95vh",
          borderRadius: "0px",
          duration: 1,
        });
        tl.to(
          overlayRef.current,
          {
            opacity: 1,
            backdropFilter: "blur(16px)",
            backgroundColor: "rgba(0,0,0,0.4)",
            duration: 1,
          },
          ">-0.5"
        );
        tl.fromTo(
          textRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          "<"
        );
        tl.to(textRef.current, { y: -50, opacity: 0, duration: 0.5 }, "+=0.2");
        tl.addLabel("splitMove");
        tl.to(
          leftContentRef.current,
          { width: "50%", opacity: 1, duration: 2 },
          "splitMove"
        );
        tl.fromTo(
          leftContentInnerRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.5 },
          "splitMove+=0.5"
        );
        tl.to(
          rightSideWrapperRef.current,
          { width: "50%", padding: "2rem", duration: 2 },
          "splitMove"
        );
        tl.to(
          videoInnerRef.current,
          {
            width: "100%",
            height: "70vh",
            borderRadius: "32px",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            duration: 2,
          },
          "splitMove"
        );
        tl.to(overlayRef.current, { opacity: 0, duration: 1 }, "splitMove+=1");
      });

      mm.add("(max-width: 1023px)", () => {
        gsap.set(leftContentRef.current, {
          width: "100%",
          height: "0%",
          opacity: 0,
        });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=200%",
            scrub: 1,
            pin: true,
          },
        });

        tl.to(videoInnerRef.current, {
          width: "100%",
          height: "100vh",
          borderRadius: "0px",
          duration: 1,
        });
        tl.to(
          rightSideWrapperRef.current,
          { padding: "0px", duration: 1 },
          "<"
        );
        tl.to(
          overlayRef.current,
          {
            opacity: 1,
            backdropFilter: "blur(12px)",
            backgroundColor: "rgba(0,0,0,0.4)",
            duration: 1,
          },
          ">-0.5"
        );
        tl.fromTo(
          textRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          "<"
        );
        tl.to(textRef.current, { opacity: 0, duration: 0.5 }, "+=0.2");

        tl.addLabel("mobileSplit");

        tl.to(
          rightSideWrapperRef.current,
          { height: "35%", width: "100%", padding: "1rem", duration: 2 },
          "mobileSplit"
        );
        tl.to(
          videoInnerRef.current,
          { width: "100%", height: "100%", borderRadius: "20px", duration: 2 },
          "mobileSplit"
        );
        tl.to(
          leftContentRef.current,
          { height: "85%", width: "100%", opacity: 1, duration: 2 },
          "mobileSplit"
        );
        tl.fromTo(
          leftContentInnerRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.5 },
          "mobileSplit+=0.5"
        );
        tl.to(
          overlayRef.current,
          { opacity: 0, duration: 1 },
          "mobileSplit+=1"
        );
      });
    },
    { scope: containerRef }
  );

  const currentContent = contentData[activeTab];

  return (
    <div className="bg-white w-full overflow-x-hidden pt-30">
      <section className="flex flex-col items-center justify-center w-full max-w-375 mx-auto px-6 relative pt-4 pb-12 md:pt-10 md:pb-20">
        <div className="w-full `max-w-177 flex justify-center mb-4 md:mb-0">
          <span className="text-[15px] md:text-[28px] font-bold uppercase text-gray-900 tracking-wide md:-tracking-[0.14px] text-center block">
            Agencia de viajes
          </span>
        </div>
        <div className="w-full max-w-307.5mt-2 md:mt-4 mb-8 md:mb-12">
          <h1 className="text-[42px] leading-[1.05] md:text-[90px] md:leading-none font-serif text-center text-gray-900 font-medium tracking-tight md:-tracking-[2.7px]">
            Vive experiencias únicas <br /> y viaja tranquilo con Viadca
          </h1>
        </div>
        <div className="flex flex-row flex-wrap items-center gap-2 justify-center px-2 sm:px-0 w-full max-w-full">
          <button
            type="button"
            onClick={() =>
              openWhatsApp(
                "Hola, quiero cotizar mi viaje con Viadca. ¿Me ayudas con opciones?",
              )
            }
            className="group px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-full border-2 border-black bg-white text-black font-semibold text-xs sm:text-sm md:text-base leading-tight cursor-pointer transition-colors duration-200 hover:bg-gray-50 whitespace-nowrap"
          >
            <span className="block transition-transform duration-300 group-hover:scale-[0.952]">
              Consultar en WhatsApp
            </span>
          </button>
          <a
            href={getPhoneHref()}
            onClick={onPhoneClick}
            className="group px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-full border-2 border-black bg-black text-white font-semibold text-xs sm:text-sm md:text-base leading-tight cursor-pointer transition-colors duration-200 hover:bg-gray-800 whitespace-nowrap"
          >
            <span className="block transition-transform duration-300 group-hover:scale-[0.952]">
              Llamar ahora
            </span>
          </a>
        </div>
      </section>

      <div
        ref={containerRef}
        className="w-full h-screen flex flex-col lg:flex-row items-stretch overflow-hidden relative bg-white"
      >
        <div
          ref={leftContentRef}
          className="bg-white z-30 flex flex-col justify-start lg:justify-center relative border-r border-gray-100 order-2 lg:order-1 overflow-hidden"
        >
          <div
            ref={leftContentInnerRef}
            className="w-full max-w-xl mx-auto px-6 lg:px-12 flex flex-col justify-start lg:justify-center h-full py-8 lg:py-0"
          >
            {/* TABS */}
            <div className="flex overflow-x-auto pb-4 lg:pb-0 lg:flex-wrap gap-2 mb-4 lg:mb-8 no-scrollbar mask-gradient -mx-2 px-2 items-center min-h-[60px]">
              {Object.keys(contentData).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                    className={`inline-flex items-center justify-center h-11 px-3 sm:px-4 rounded-full border text-[11px] sm:text-sm font-semibold leading-none transition-all duration-200 cursor-pointer hover:shadow-md whitespace-nowrap
                                ${
                                  activeTab === key
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                                }`}
                >
                  {contentData[key].label}
                </button>
              ))}
            </div>

            <div className="w-full h-px bg-gray-200 mb-4 lg:mb-8 hidden lg:block"></div>

            <div className="space-y-4 lg:space-y-6">
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 font-serif leading-tight">
                {currentContent.title}
              </h2>
              <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
                {currentContent.desc}
              </p>

              <div>
                <p className="text-sm font-bold text-gray-900 uppercase tracking-wide pt-2 mb-2">
                  Te ayudamos con:
                </p>
                <ul className="space-y-2">
                  {currentContent.features.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start text-base text-gray-700 font-medium"
                    >
                      <div className="mt-1 mr-3 p-0.5 bg-black rounded-full shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <a
                  href="/paquetes"
                  className="inline-flex items-center text-base lg:text-lg font-bold text-black hover:underline group transition-all"
                >
                  Ver paquetes
                  <ArrowUpRight className="ml-2 w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={rightSideWrapperRef}
          className="grow h-full flex items-center justify-center relative z-20 order-1 lg:order-2 p-4 lg:p-0"
        >
          <div
            ref={videoInnerRef}
            className="relative overflow-hidden shadow-2xl bg-black w-full h-full lg:w-[85%] lg:h-[80vh] rounded-3xl"
          >
            <video
              key={activeTab}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover absolute inset-0 z-0 transition-opacity duration-500"
            >
              <source src={currentContent.video} type="video/webm" />
              <source src={currentContent.video} type="video/mp4" />
            </video>

            <div
              ref={overlayRef}
              className="absolute inset-0 z-10 pointer-events-none opacity-0"
              style={{ backdropFilter: "blur(0px)" }}
            ></div>

            <div
              ref={textRef}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 text-center pointer-events-none opacity-0"
            >
              <h2 className="text-white text-3xl lg:text-6xl font-bold leading-tight drop-shadow-lg font-serif">
                Planea tu siguiente viaje <br /> con Viadca.
              </h2>
            </div>
          </div>
        </div>
      </div>
      <ToastPortal />
    </div>
  );
};

export default Hero;
