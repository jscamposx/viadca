import React, { useState } from 'react';

const GROWTH_DATA = [
  {
    id: 1,
    title: "Aparece en todas partes",
    description: "Crece con herramientas incorporadas de optimización de motores de búsqueda (SEO) e integraciones con Google y Meta.",
    image: "https://images.ctfassets.net/2d5q1td6cyxq/2sVLYLXAmCQPaCBkpEQI2V/8d925d6f3c35c2cdee600be9b3de43db/PD07134_-_USES_desktop_show_up.png?fm=webp&q=85&fit=fill&w=1400"
  },
  {
    id: 2,
    title: "Envía promociones personalizadas",
    description: "Envía campañas de marketing por correo electrónico y mensaje de texto en cualquier momento.",
    image: "https://images.ctfassets.net/2d5q1td6cyxq/4ovoRcpg57OK30qofHicWV/c9235b5bee6dd276aa27b79ef72b63b5/PD07134_-_USES_desktop_promotions.png?fm=webp&q=85&fit=fill&w=1400"
  },
  {
    id: 3,
    title: "Recompensa a tus clientes frecuentes",
    description: "Impulsa las ventas frecuentes con un programa de recompensas integrado.",
    image: "https://images.ctfassets.net/2d5q1td6cyxq/15Qy90J8Hm8cPCsZB3UQjd/3f1d4cdeade1ebd928e5507b197eaa83/PD07134_-_USES_desktop_loyalty.png?fm=webp&q=85&fit=fill&w=1400"
  },
  {
    id: 4,
    title: "Vende tarjetas de regalo electrónicas",
    description: "Personaliza diseños y ofrece tarjetas de regalo electrónicas directamente en tu sitio.",
    image: "https://images.ctfassets.net/2d5q1td6cyxq/41YYpZ8Wb7QrCpo0vLCp7c/cc370d8eaca00aacb03c44d923dffc0e/PD07134_-_USES_desktop_eGifts.png?fm=webp&q=85&fit=fill&w=1400"
  }
];

const GrowthSection = () => {
  const [activeId, setActiveId] = useState(1);

  return (
    <section className="bg-white w-full py-16 md:py-24 lg:py-32 px-6 md:px-12 font-sans">
      <div className="max-w-375 mx-auto">
        <div className="mb-12 lg:mb-24 max-w-4xl">
          <h2 className="text-4xl md:text-[56px] lg:text-[64px] font-serif font-medium text-gray-900 tracking-tight leading-[1.05]">
            Amplía tu alcance. Vende más.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 xl:gap-x-24 items-start">
          <div className="w-full lg:col-span-5 flex flex-col pt-0 lg:pt-4">
            {GROWTH_DATA.map((item) => {
              const isOpen = activeId === item.id;

              return (
                <div key={item.id} className="border-t border-gray-200 first:border-t-0 md:first:border-t">
                  <button
                    onClick={() => setActiveId(item.id)}
                    className="w-full py-6 md:py-8 flex items-start justify-between group text-left focus:outline-none cursor-pointer"
                  >
                    <h3 className={`text-xl md:text-[19px] font-bold pr-6 transition-colors ${isOpen ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>
                      {item.title}
                    </h3>
                    
                    <div className="relative w-3.5 h-3.5 shrink-0 mt-2 md:mt-1.5">
                      <span className="absolute top-1/2 left-0 w-full h-0.5 bg-black -translate-y-1/2" />
                      <span 
                        className={`absolute top-0 left-1/2 w-0.5 h-full bg-black -translate-x-1/2 transition-transform duration-300 ease-out origin-center ${isOpen ? 'scale-y-0' : 'scale-y-100'}`} 
                      />
                    </div>
                  </button>

                  <div 
                    className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${isOpen ? 'grid-rows-[1fr] pb-8' : 'grid-rows-[0fr]'}`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-[17px] text-gray-600 leading-relaxed max-w-[90%] mb-6">
                        {item.description}
                      </p>

                      <div className="block lg:hidden w-full">
                         <div className="bg-[#EAF0F6] rounded-2xl p-8 flex items-center justify-center">
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              className="w-full h-auto max-h-75 object-contain drop-shadow-sm"
                            />
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hidden lg:block lg:col-span-7 sticky top-12">
            <div 
              className="bg-[#EAF0F6] rounded-4xl w-full max-w-216relative overflow-hidden flex items-center justify-center p-12 mx-auto lg:mx-0"
              style={{ aspectRatio: '864 / 692' }}
            >
               {GROWTH_DATA.map((item) => (
                 <div
                   key={item.id}
                   className={`absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-700 ease-in-out ${activeId === item.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                 >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain drop-shadow-sm"
                    />
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GrowthSection;