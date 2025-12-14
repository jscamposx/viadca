import React from 'react';
import { ArrowRight } from 'lucide-react';

const GetStartedSection = () => {
  return (
    <section className="w-full bg-white py-24 md:py-40 px-6 md:px-12 border-t border-gray-100">
      <div className="max-w-375 mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
        <div className="max-w-4xl">
          <h2 className="text-6xl md:text-[100px] font-serif font-medium text-gray-900 leading-[0.9] tracking-tight mb-4">
            Prueba Square
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <a
            href="https://app.squareup.com/signup/es-US"
            className="group relative inline-flex items-center justify-center px-8 py-5 text-lg font-bold text-white bg-gray-900 rounded-full overflow-hidden transition-all duration-300 hover:bg-black hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 w-full sm:w-auto"
          >
            <span className="relative z-10 flex items-center">
              Comenzar
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </a>

          <a
            href="http://squareup.com/us/es/sales/contact?page=/us/es/point-of-sale"
            className="group inline-flex items-center justify-center px-8 py-5 text-lg font-bold text-gray-900 bg-white border-2 border-gray-200 rounded-full transition-all duration-300 hover:border-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 w-full sm:w-auto"
          >
            Contactar ventas
          </a>
        </div>
      </div>
    </section>
  );
};

export default GetStartedSection;