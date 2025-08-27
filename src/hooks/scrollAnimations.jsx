import React, { useEffect, useRef, useState } from 'react';

// Hook simple para animaciones de scroll
function useScrollAnimation(options = {}) {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const {
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px',
    delay = 0
  } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, delay]);

  return [elementRef, isVisible];
}

// Clases CSS para diferentes tipos de animaciones
const animationClasses = {
  fadeInUp: {
    initial: 'opacity-0 translate-y-8',
    animate: 'opacity-100 translate-y-0',
    transition: 'transition-all duration-700 ease-out'
  },
  fadeInLeft: {
    initial: 'opacity-0 -translate-x-8',
    animate: 'opacity-100 translate-x-0',
    transition: 'transition-all duration-700 ease-out'
  },
  fadeInRight: {
    initial: 'opacity-0 translate-x-8',
    animate: 'opacity-100 translate-x-0',
    transition: 'transition-all duration-700 ease-out'
  },
  fadeIn: {
    initial: 'opacity-0',
    animate: 'opacity-100',
    transition: 'transition-opacity duration-700 ease-out'
  },
  scaleIn: {
    initial: 'opacity-0 scale-95',
    animate: 'opacity-100 scale-100',
    transition: 'transition-all duration-700 ease-out'
  }
};

// Componente wrapper para animaciones
function AnimatedSection({ 
  children, 
  animation = 'fadeInUp', 
  delay = 0, 
  className = '',
  ...props 
}) {
  const [ref, isVisible] = useScrollAnimation({ delay });
  const animClasses = animationClasses[animation];

  return (
    <div
      ref={ref}
      className={`${animClasses.transition} ${
        isVisible ? animClasses.animate : animClasses.initial
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export {
  useScrollAnimation,
  AnimatedSection
};
