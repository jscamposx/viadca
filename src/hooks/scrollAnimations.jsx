import React, { useEffect, useRef, useState } from "react";

// Hook simple para animaciones de scroll
function useScrollAnimation(options = {}) {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const isMobile =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(max-width: 640px)").matches;

  const {
    threshold = isMobile ? 0.05 : 0.1,
    rootMargin = isMobile ? "0px 0px 15% 0px" : "0px 0px -100px 0px",
    delay = 0,
    triggerOnce = true,
  } = options;

  useEffect(() => {
    if (triggerOnce && isVisible) return; // evitar recrear observer si ya se mostró
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        } else if (!triggerOnce) {
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
  }, [threshold, rootMargin, delay, triggerOnce, isVisible]);

  return [elementRef, isVisible];
}

// Nuevo hook para disparar TODAS las animaciones internas de una sección al verse cualquier parte de la misma
function useSectionReveal(options = {}) {
  const sectionRef = useRef(null);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const { threshold = 0.05, rootMargin = "0px 0px -10% 0px" } = options;

  useEffect(() => {
    if (isSectionVisible) return; // solo una vez
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsSectionVisible(true);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [threshold, rootMargin, isSectionVisible]);

  return [sectionRef, isSectionVisible];
}

// Hook para detectar preferencia de movimiento reducido
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handle = () => setReduced(mq.matches);
    handle();
    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, []);
  return reduced;
}

// Clases CSS para diferentes tipos de animaciones
const animationClasses = {
  fadeInUp: {
    initial: "opacity-0 translate-y-8",
    animate: "opacity-100 translate-y-0",
    transition: "transition-all duration-700 ease-out will-change-transform",
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
  // Nuevas animaciones mejoradas para destinos
  slideUpCard: {
    initial: "opacity-0 translate-y-12 scale-95",
    animate: "opacity-100 translate-y-0 scale-100",
    transition: "transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)]",
  },
  floatIn: {
    initial: "opacity-0 translate-y-16 rotate-3",
    animate: "opacity-100 translate-y-0 rotate-0",
    transition:
      "transition-all duration-900 ease-[cubic-bezier(0.165,0.84,0.44,1)]",
  },
  bounceIn: {
    initial: "opacity-0 scale-50 translate-y-8",
    animate: "opacity-100 scale-100 translate-y-0",
    transition:
      "transition-all duration-700 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]",
  },
  slideUpTitle: {
    initial: "opacity-0 translate-y-6 blur-sm",
    animate: "opacity-100 translate-y-0 blur-none",
    transition: "transition-all duration-800 ease-out",
  },
  destCard: {
    initial: "opacity-0 translate-y-6 scale-[0.99]",
    animate: "opacity-100 translate-y-0 scale-100",
    transition:
      "transition-all duration-300 ease-out will-change-transform",
  },
};

// Componente wrapper para animaciones
function AnimatedSection({
  children,
  animation = "fadeInUp",
  delay = 0,
  className = "",
  forceVisible = false, // NUEVO: fuerza la animación (para cuando la sección ya es visible)
  triggerOnce = true,
  stagger, // nuevo: tamaño del escalonado en ms
  index = 0, // nuevo: índice del item para escalonado
  ...props
}) {
  const reducedMotion = usePrefersReducedMotion();
  const isMobile =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(max-width: 640px)").matches;
  const [ref, isVisible] = useScrollAnimation({ delay, triggerOnce });
  const animClasses = animationClasses[animation] || animationClasses.fadeInUp;
  const show = reducedMotion ? true : forceVisible || isVisible;
  const style = {};
  if (!reducedMotion && stagger && show) {
    const cap = isMobile ? 300 : 900;
    const totalDelay = index * stagger;
    style.transitionDelay = `${Math.min(totalDelay, cap)}ms`;
  } else if (!reducedMotion && delay) {
    // En mobile, evitar delays largos (máx 150ms)
    style.transitionDelay = `${Math.min(delay, isMobile ? 150 : delay)}ms`;
  }

  // Reducir duración y suavizar en mobile para que se sienta más natural
  if (!reducedMotion && isMobile) {
    style.transitionDuration = "380ms";
    style.transitionTimingFunction = "cubic-bezier(.4,0,.2,1)";
  }

  const appliedClasses = reducedMotion
    ? className
    : `${animClasses.transition} ${show ? animClasses.animate : animClasses.initial} ${className}`;

  return (
    <div ref={ref} className={appliedClasses} style={style} {...props}>
      {children}
    </div>
  );
}

export { useScrollAnimation, useSectionReveal, AnimatedSection };
