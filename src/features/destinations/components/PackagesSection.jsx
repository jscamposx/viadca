import React from 'react';
import { AnimatedSection } from '../../../hooks/scrollAnimations';

const PackagesSection = ({ id, title, description, children }) => {
  return (
    <section id={id} className="py-14 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fadeInUp" className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <h2 className="font-volkhov text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-3">
                {title}
              </h2>
              {description && (
                <p className="text-slate-600 max-w-2xl text-sm sm:text-base">
                  {description}
                </p>
              )}
            </div>
            <a href="#top" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline self-start sm:self-auto">
              Volver arriba
            </a>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-7">
          {children}
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
