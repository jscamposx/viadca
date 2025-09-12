import React, { useEffect, useRef, useState } from "react";

// Hook personalizado para animaciones de scroll
function useScrollAnimation(options = {}) {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  const {
    threshold = 0.1,
    rootMargin = "0px 0px -100px 0px",
    triggerOnce = true,
    delay = 0,
  } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasAnimated)) {
          setTimeout(() => {
            setIsVisible(true);
            if (triggerOnce) {
              setHasAnimated(true);
            }
          }, delay);
        } else if (!triggerOnce && !entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, triggerOnce, delay, hasAnimated]);

  return [elementRef, isVisible];
}

// Hook para animaciones escalonadas
function useStaggeredAnimation(itemCount, options = {}) {
  // Crear refs usando useMemo para evitar recrearlos en cada render
  const itemsRef = React.useMemo(
    () => Array.from({ length: itemCount }, () => React.createRef()),
    [itemCount],
  );
  const [visibleItems, setVisibleItems] = useState(new Set());
  const containerRef = useRef(null);

  const {
    threshold = 0.1,
    rootMargin = "0px 0px -50px 0px",
    staggerDelay = 100,
  } = options;

  useEffect(() => {
    const items = itemsRef.map((ref) => ref.current).filter(Boolean);
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = items.indexOf(entry.target);
            if (index !== -1) {
              setTimeout(() => {
                setVisibleItems((prev) => new Set([...prev, index]));
              }, index * staggerDelay);
            }
          }
        });
      },
      {
        threshold,
        rootMargin,
      },
    );

    items.forEach((item) => observer.observe(item));

    return () => {
      items.forEach((item) => observer.unobserve(item));
    };
  }, [itemsRef, staggerDelay, threshold, rootMargin]);

  return [containerRef, itemsRef, visibleItems];
}

// Clases CSS para diferentes tipos de animaciones
const animationClasses = {
  fadeInUp: {
    initial: "opacity-0 translate-y-8",
    animate: "opacity-100 translate-y-0",
    transition: "transition-all duration-700 ease-out",
  },
  fadeInLeft: {
    initial: "opacity-0 -translate-x-8",
    animate: "opacity-100 translate-x-0",
    transition: "transition-all duration-700 ease-out",
  },
  fadeInRight: {
    initial: "opacity-0 translate-x-8",
    animate: "opacity-100 translate-x-0",
    transition: "transition-all duration-700 ease-out",
  },
  fadeIn: {
    initial: "opacity-0",
    animate: "opacity-100",
    transition: "transition-opacity duration-700 ease-out",
  },
  scaleIn: {
    initial: "opacity-0 scale-95",
    animate: "opacity-100 scale-100",
    transition: "transition-all duration-700 ease-out",
  },
  slideInBottom: {
    initial: "opacity-0 translate-y-12",
    animate: "opacity-100 translate-y-0",
    transition: "transition-all duration-800 ease-out",
  },
  bounceIn: {
    initial: "opacity-0 scale-95",
    animate: "opacity-100 scale-100",
    transition: "transition-all duration-600 ease-out transform-gpu",
  },
};

// Componente wrapper para animaciones reutilizable
function AnimatedSection({
  children,
  animation = "fadeInUp",
  delay = 0,
  className = "",
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

// Exportaciones explícitas
export { useScrollAnimation, useStaggeredAnimation, AnimatedSection };
