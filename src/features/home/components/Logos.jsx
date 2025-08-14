import React from "react";

const Logos = ({ logos }) => (
  <section
    id="socios"
    aria-labelledby="logos-heading"
    className="py-16 px-4 sm:px-6 lg:px-8 relative scroll-mt-32"
    role="region"
  >
    <div className="max-w-7xl mx-auto">
      <h2 id="logos-heading" className="text-center text-xl sm:text-2xl font-semibold text-slate-800 mb-6">
        Socios y marcas colaboradoras
      </h2>
      <div className="relative overflow-hidden" aria-live="polite">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-white to-transparent z-10" aria-hidden="true" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-white to-transparent z-10" aria-hidden="true" />
        <ul className="flex w-max items-center gap-24 animate-logo-marquee opacity-90 hover:opacity-100 transition-opacity py-4 will-change-transform" role="list">
          {[...logos, ...logos].map((logo, idx) => (
            <li key={idx} className="shrink-0">
              <div
                className={`flex items-center justify-center ${logo.boxed ? "bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border border-slate-100" : ""}`}
                role="img"
                aria-label={logo.alt}
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className={`${logo.h} w-auto grayscale hover:grayscale-0 transition-all duration-500 ease-linear drop-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600`}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default Logos;
