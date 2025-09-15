import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

// LightboxModal: visor a pantalla completa, accesible y sin dependencias externas
// Props:
// - images: string[] (URLs ya resueltas)
// - startIndex: number
// - isOpen: boolean
// - onClose: () => void
// - onIndexChange?: (index: number) => void
export default function LightboxModal({
  images = [],
  startIndex = 0,
  isOpen = false,
  onClose,
  onIndexChange,
}) {
  const [index, setIndex] = useState(startIndex);
  const backdropRef = useRef(null);
  const imgWrapperRef = useRef(null);
  const imgRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const lastTouchRef = useRef({ t: 0, x: 0, y: 0 });
  const pinchRef = useRef({ active: false, dist: 0, startScale: 1 });
  const panRef = useRef({ dragging: false, x: 0, y: 0 });

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", onKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) setIndex(startIndex);
  }, [isOpen, startIndex]);

  useEffect(() => {
    onIndexChange?.(index);
  }, [index, onIndexChange]);

  const goPrev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const goNext = () => setIndex((i) => (i + 1) % images.length);

  const onBackdropClick = (e) => {
    if (e.target === backdropRef.current) onClose?.();
  };

  // Gestos para mobile: swipe, pinch-to-zoom, double tap
  useEffect(() => {
    if (!isOpen) return;
    const el = imgWrapperRef.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let isSwiping = false;
    let moved = false;

    const getDistance = (t1, t2) => {
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isSwiping = true;
        moved = false;
        panRef.current.dragging = scale > 1; // solo pan cuando zoom>1
        panRef.current.x = translate.x;
        panRef.current.y = translate.y;
      } else if (e.touches.length === 2) {
        pinchRef.current.active = true;
        pinchRef.current.dist = getDistance(e.touches[0], e.touches[1]);
        pinchRef.current.startScale = scale;
      }
    };

    const onTouchMove = (e) => {
      if (pinchRef.current.active && e.touches.length === 2) {
        const newDist = getDistance(e.touches[0], e.touches[1]);
        const newScale = Math.min(3, Math.max(1, (newDist / pinchRef.current.dist) * pinchRef.current.startScale));
        setScale(newScale);
        moved = true;
        return;
      }

      if (!isSwiping || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;

      if (scale > 1 && panRef.current.dragging) {
        setTranslate({ x: panRef.current.x + dx, y: panRef.current.y + dy });
        moved = true;
        return;
      }

      // Swipe horizontal para cambiar imagen
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
        moved = true;
      }
    };

    const onTouchEnd = (e) => {
      if (pinchRef.current.active && e.touches.length < 2) {
        pinchRef.current.active = false;
      }

      if (!moved && e.changedTouches.length === 1) {
        // Double tap para zoom toggle
        const now = Date.now();
        const last = lastTouchRef.current;
        const dt = now - last.t;
        const x = e.changedTouches[0].clientX;
        const y = e.changedTouches[0].clientY;
        if (dt < 250) {
          const nextScale = scale > 1 ? 1 : 2;
          setScale(nextScale);
          if (nextScale === 1) setTranslate({ x: 0, y: 0 });
        }
        lastTouchRef.current = { t: now, x, y };
      }

      if (isSwiping && !pinchRef.current.active && scale === 1 && e.changedTouches.length === 1) {
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 50) {
          if (dx < 0) goNext(); else goPrev();
        }
      }

      isSwiping = false;
      panRef.current.dragging = false;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [isOpen, scale, translate.x, translate.y]);

  // Importante: el guard debe ir después de declarar TODOS los hooks
  if (!isOpen) return null;

  return createPortal(
    <div
      ref={backdropRef}
      role="dialog"
      aria-modal="true"
      aria-label="Visor de imágenes"
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center"
      onClick={onBackdropClick}
    >
      {/* Controles */}
      <button
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute top-3 right-3 p-3 rounded-full bg-black/40 hover:bg-black/50 text-white border border-white/20 shadow-lg backdrop-blur-sm touch-manipulation"
      >
        <FiX className="w-6 h-6" />
      </button>

      {images.length > 1 && (
        <>
          {/* Botones laterales: visibles solo en desktop/tablet */}
          <button
            aria-label="Anterior"
            onClick={goPrev}
            className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-3 md:left-6 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/40 hover:bg-black/50 text-white border border-white/20 shadow-lg backdrop-blur-sm items-center justify-center touch-manipulation"
          >
            <FiChevronLeft className="w-7 h-7 md:w-8 md:h-8" />
          </button>
          <button
            aria-label="Siguiente"
            onClick={goNext}
            className="hidden md:flex absolute top-1/2 -translate-y-1/2 right-3 md:right-6 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/40 hover:bg-black/50 text-white border border-white/20 shadow-lg backdrop-blur-sm items-center justify-center touch-manipulation"
          >
            <FiChevronRight className="w-7 h-7 md:w-8 md:h-8" />
          </button>

          {/* Barra inferior en móvil con controles e indicador */}
          <div
            className="md:hidden absolute inset-x-0 bottom-0 flex justify-center pointer-events-none"
            style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}
          >
            <div className="pointer-events-auto mb-1 bg-black/50 backdrop-blur-sm rounded-full border border-white/20 shadow-lg flex items-center gap-6 px-3 py-2">
              <button
                aria-label="Anterior"
                onClick={goPrev}
                className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center"
              >
                <FiChevronLeft className="w-7 h-7" />
              </button>
              <span className="text-white/90 text-sm min-w-[64px] text-center">
                {index + 1} / {images.length}
              </span>
              <button
                aria-label="Siguiente"
                onClick={goNext}
                className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center"
              >
                <FiChevronRight className="w-7 h-7" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Contenido */}
      <div ref={imgWrapperRef} className="max-w-[95vw] max-h-[85vh] w-full h-full flex items-center justify-center px-4 select-none overflow-hidden">
        <img
          ref={imgRef}
          src={images[index]}
          alt={`Imagen ${index + 1}`}
          className="max-w-none max-h-none object-contain shadow-2xl rounded-lg"
          draggable={false}
          style={{
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            maxWidth: scale === 1 ? "100%" : "none",
            maxHeight: scale === 1 ? "100%" : "none",
            transition: pinchRef.current.active ? "none" : "transform 150ms ease-out",
          }}
          onDoubleClick={() => {
            const nextScale = scale > 1 ? 1 : 2;
            setScale(nextScale);
            if (nextScale === 1) setTranslate({ x: 0, y: 0 });
          }}
        />
      </div>

      {/* Indicador: solo en desktop/tablet (en móvil está en la barra inferior) */}
      <div className="hidden md:block absolute bottom-3 left-1/2 -translate-x-1/2 text-white/90 text-sm bg-black/30 px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm">
        {index + 1} / {images.length}
      </div>
    </div>,
    document.body,
  );
}
