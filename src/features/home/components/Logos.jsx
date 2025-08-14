import React from 'react'

const Logos = ({ logos }) => (
  <section id="socios" className="py-16 px-4 sm:px-6 lg:px-8 relative scroll-mt-32">
    <div className="max-w-7xl mx-auto">
      <h3 className="sr-only">Socios y marcas colaboradoras</h3>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-white to-transparent z-10" />
        <div className="flex w-max items-center gap-24 animate-logo-marquee opacity-90 hover:opacity-100 transition-opacity py-4 will-change-transform">
          {([...logos, ...logos]).map((logo, idx) => (
            <div key={idx} className={`flex items-center justify-center ${logo.boxed ? 'bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border border-slate-100' : ''}`}>
              <img
                src={logo.src}
                alt={logo.alt}
                className={`${logo.h} w-auto grayscale hover:grayscale-0 transition-all duration-500 ease-linear drop-shadow`}
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
)

export default Logos
