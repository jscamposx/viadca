import React from "react";
import { FiShield, FiHeadphones, FiThumbsUp, FiZap, FiCheckCircle } from "react-icons/fi";

const items = [
  {
    icon: FiShield,
    title: "Pago seguro",
    subtitle: "Transacciones protegidas",
    gradient: "from-emerald-500 to-green-600",
  },
  {
    icon: FiHeadphones,
    title: "Soporte 24/7",
    subtitle: "Acompañamiento constante",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: FiThumbsUp,
    title: "Calidad garantizada",
    subtitle: "Selección de confianza",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: FiZap,
    title: "Respuesta rápida",
    subtitle: "Minutos, no horas",
    gradient: "from-fuchsia-500 to-pink-600",
  },
  {
    icon: FiCheckCircle,
    title: "Mejor precio",
    subtitle: "Transparencia total",
    gradient: "from-cyan-500 to-sky-600",
  },
];

export default function TrustBar({ className = "" }) {
  return (
    <section className={`relative py-8 sm:py-10 lg:py-12 ${className}`}>
      <div
        className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-slate-50/90 via-white/95 to-slate-50/90 sm:from-slate-50 sm:via-white sm:to-slate-50"
        aria-hidden="true"
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {items.map(({ icon: Icon, title, subtitle, gradient }, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-sm md:hover:shadow-lg transition-all duration-300 p-3 sm:p-4"
            >
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-md mb-2 sm:mb-3`}>
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <div className="text-[13px] sm:text-sm font-semibold text-slate-800">{title}</div>
                <div className="text-[11px] sm:text-xs text-slate-600">{subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
