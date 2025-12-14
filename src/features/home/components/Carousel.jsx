import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight, ArrowRightLeft } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const ROUTES_DATA = [
  {
    id: 1,
    cityFrom: "Bangkok",
    cityTo: "Thailand",
    dates: "Fri, May 31 - Mon, Jun 10",
    price: "670.00",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=600&auto=format&fit=crop",
    alt: "Scenic view of Wat Arun temple in Bangkok, Thailand"
  },
  {
    id: 2,
    cityFrom: "Sydney",
    cityTo: "Australia",
    dates: "Fri, May 31 - Mon, Jun 10",
    price: "890.00",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=600&auto=format&fit=crop",
    alt: "Sydney Opera House"
  },
  {
    id: 3,
    cityFrom: "Cairo",
    cityTo: "Egypt",
    dates: "Fri, May 31 - Mon, Jun 30",
    price: "1200.00",
    image: "https://images.unsplash.com/photo-1539650116455-29cb533e0b3b?q=80&w=600&auto=format&fit=crop",
    alt: "The Great Pyramid of Giza"
  },
  {
    id: 4,
    cityFrom: "Chicago",
    cityTo: "Dubai",
    dates: "Fri, May 31 - Mon, Jun 10",
    price: "980.00",
    image: "https://images.unsplash.com/photo-1512453979798-5ea904ac66de?q=80&w=600&auto=format&fit=crop",
    alt: "Dubai Skyline"
  },
  {
    id: 5,
    cityFrom: "London",
    cityTo: "New York",
    dates: "Thu, Jul 4 - Sun, Jul 14",
    price: "850.00",
    image: "https://images.unsplash.com/photo-1496442226666-8d4a0e62e6e9?q=80&w=600&auto=format&fit=crop",
    alt: "New York City"
  },
  {
    id: 6,
    cityFrom: "Tokyo",
    cityTo: "Seoul",
    dates: "Sat, Aug 10 - Sat, Aug 17",
    price: "320.00",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=600&auto=format&fit=crop",
    alt: "Tokyo"
  }
];

const Carousel = () => {
  const containerRef = useRef(null);
  const carouselRef = useRef(null);

  useGSAP(() => {
    gsap.from(".route-card", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      clearProps: "all"
    });
  }, { scope: containerRef });

  const scroll = (direction) => {
    if (carouselRef.current) {
      const cardWidth = 320; 
      const gap = 24; 
      const scrollAmount = cardWidth + gap;

      const leftPos = direction === 'left' 
        ? -scrollAmount 
        : scrollAmount;

      carouselRef.current.scrollBy({
        left: leftPos,
        behavior: 'smooth' 
      });
    }
  };

  return (
    <section
      ref={containerRef}
      className="bg-white min-h-screen w-full flex items-center justify-center px-6 md:px-12 py-16 font-sans"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .font-inter { font-family: 'Inter', sans-serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="w-full max-w-375 mx-auto font-inter">
        
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-12 gap-4 sm:gap-0">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tighter uppercase text-center sm:text-left">
            Routes
          </h1>

          {/* Botones ocultos en móvil (hidden) y visibles en tablet/desktop (sm:flex) */}
          <div className="hidden sm:flex gap-4">
            <button
              onClick={() => scroll('left')}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 hover:border-gray-400 transition-all focus:outline-none active:scale-95 z-10 shadow-sm"
              aria-label="Scroll left"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 hover:border-gray-400 transition-all focus:outline-none active:scale-95 z-10 shadow-sm"
              aria-label="Scroll right"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div
            ref={carouselRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-8 snap-x snap-mandatory px-2 scroll-smooth"
          >
            {ROUTES_DATA.map((route, index) => (
              <div
                key={route.id}
                // width: 85vw en móvil (más inmersivo) y 320px fijo en desktop
                className="route-card flex-none w-[85vw] sm:w-[320px] snap-center group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-3xl aspect-3/4 mb-5 shadow-sm hover:shadow-xl transition-shadow duration-300 bg-gray-200">
                  <img
                    src={route.image}
                    alt={route.alt}
                    loading={index < 2 ? "eager" : "lazy"} 
                    decoding="async"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-3 text-xl font-bold text-gray-900 tracking-tight">
                    <span>{route.cityFrom}</span>
                    <ArrowRightLeft className="w-4 h-4 text-gray-400" />
                    <span>{route.cityTo}</span>
                  </div>
                  
                  <p className="text-sm font-medium text-gray-500">
                    {route.dates}
                  </p>
                  
                  <p className="text-base font-bold text-gray-900">
                    <span className="text-gray-400 font-normal text-xs mr-1 uppercase tracking-wide">From</span>
                    ${route.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Carousel;