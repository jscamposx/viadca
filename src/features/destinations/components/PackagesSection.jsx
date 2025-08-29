import React from 'react';
import { AnimatedSection } from '../../../hooks/scrollAnimations';

const PackagesSection = ({ id, title, description, children }) => {
  const count = React.Children.count(children);
  
  return (
    <section id={id} className="py-12 sm:py-16 lg:py-20 relative">
      {/* Decoración de fondo sutil */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 to-transparent pointer-events-none" aria-hidden="true" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fadeInUp" className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="flex-1">
              {/* Badge con contador */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/80 border border-blue-200/60 mb-4">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-sm font-semibold text-blue-700">
                  {count} {count === 1 ? 'paquete disponible' : 'paquetes disponibles'}
                </span>
              </div>
              
              {/* Título mejorado */}
              <h2 className="font-volkhov text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-4 leading-tight">
                <span className="bg-gradient-to-r from-slate-800 via-slate-700 to-blue-800 bg-clip-text text-transparent">
                  {title}
                </span>
              </h2>
              
              {description && (
                <p className="text-slate-600 max-w-2xl text-base sm:text-lg leading-relaxed">
                  {description}
                </p>
              )}
            </div>
            
            {/* Controles de navegación */}
            <div className="flex items-center gap-3">
              <a 
                href="#top" 
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 hover:bg-white border border-slate-200/60 hover:border-slate-300 text-slate-600 hover:text-blue-700 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300"
              >
                <svg className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>Volver arriba</span>
              </a>
              
              <button className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300">
                <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Ver favoritos</span>
              </button>
            </div>
          </div>
        </AnimatedSection>
        
        {/* Grid mejorado con espaciado dinámico */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {children}
        </div>
        
        {/* Separador decorativo */}
        <div className="mt-16 pt-8 border-t border-gradient-to-r from-transparent via-slate-200 to-transparent" aria-hidden="true">
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
