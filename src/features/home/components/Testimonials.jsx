import React from "react";

const Testimonials = () => (
  <section
    id="testimonios"
    className="py-20 px-4 sm:px-6 lg:px-8 scroll-mt-32"
    aria-labelledby="testimonios-heading"
  >
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <p className="text-text-gray font-semibold text-lg uppercase tracking-wide">
            Testimonios
          </p>

          <h2
            id="testimonios-heading"
            className="font-volkhov font-bold text-5xl text-secondary leading-tight"
          >
            Lo que dicen nuestros
            <br />
            viajeros satisfechos
          </h2>

          <div className="flex space-x-4" aria-hidden="true">
            <div className="w-4 h-4 bg-secondary rounded-full"></div>
            <div className="w-4 h-4 bg-light-gray rounded-full"></div>
            <div className="w-4 h-4 bg-light-gray rounded-full"></div>
          </div>
        </div>

        {/* Right Content - Testimonials */}
        <div
          className="relative"
          role="region"
          aria-label="Carrusel de testimonios"
        >
          {/* Main Testimonial */}
          <div className="bg-white rounded-xl p-8 shadow-custom relative z-10">
            <img
              src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/UdPdAgF7PJ.png"
              alt="María González"
              className="w-16 h-16 rounded-full object-cover mb-6"
            />

            <p className="text-text-gray leading-relaxed mb-6">
              "VIADCA hizo que nuestro viaje a Europa fuera perfecto. La
              atención personalizada y el seguimiento durante todo el viaje nos
              dieron total tranquilidad. Definitivamente volveremos a viajar con
              ellos."
            </p>

            <div>
              <h4 className="font-semibold text-lg text-text-gray">
                María González
              </h4>
              <p className="text-text-gray">Durango, México</p>
            </div>
          </div>

          {/* Background Testimonial */}
          <div className="absolute top-8 right-8 bg-white rounded-xl p-8 shadow-custom w-full max-w-md">
            <p className="text-text-gray leading-relaxed mb-6">
              "Excelente servicio desde la cotización hasta el regreso. Los
              asesores de VIADCA conocen muy bien los destinos y nos dieron las
              mejores recomendaciones. Altamente recomendados."
            </p>

            <div>
              <h4 className="font-semibold text-lg text-text-gray">
                Carlos Herrera
              </h4>
              <p className="text-text-gray">Cliente frecuente</p>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 space-y-4">
            <button
              className="w-8 h-8 flex items-center justify-center"
              type="button"
              aria-label="Testimonio anterior"
            >
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center"
              type="button"
              aria-label="Siguiente testimonio"
            >
              <svg
                className="w-4 h-4 text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Testimonials;
