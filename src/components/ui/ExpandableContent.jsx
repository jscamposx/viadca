import React, { useEffect, useId, useRef, useState } from "react";

/**
 * ExpandableContent
 * - Limita la altura del contenido y muestra un botón "Ver más/Ver menos" para expandir/contraer.
 * - Útil para mantener tarjetas con alturas consistentes.
 *
 * Props:
 * - children: contenido a renderizar
 * - collapsedHeight: número en px (por defecto 192)
 * - className: clases adicionales para el contenedor
 * - buttonPosition: "right" | "center" (por defecto "right")
 * - labels: { more: string, less: string }
 */
export default function ExpandableContent({
  children,
  collapsedHeight = 192,
  className = "",
  buttonPosition = "right",
  labels = { more: "Ver más", less: "Ver menos" },
}) {
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const internalId = useId();
  const contentId = `expandable-${internalId}`;
  const contentRef = useRef(null);

  const btnAlign =
    buttonPosition === "center" ? "justify-center" : "justify-end";

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const check = () => {
      const full = el.scrollHeight || 0;
      const needs = full > collapsedHeight + 1; // tolerancia
      setCanExpand(needs);
      if (!needs && expanded) setExpanded(false);
    };

    // Observa cambios de tamaño de contenido
    const ro = new ResizeObserver(() => check());
    ro.observe(el);
    // Chequeo inicial
    check();
    return () => {
      try {
        ro.disconnect();
      } catch {}
    };
  }, [collapsedHeight, expanded, children]);

  return (
    <div className={className}>
      <div className="relative">
        <div
          id={contentId}
          ref={contentRef}
          className={`${expanded ? "max-h-none" : "overflow-hidden"}`}
          style={expanded ? undefined : { maxHeight: `${collapsedHeight}px` }}
        >
          {children}
        </div>
        {!expanded && canExpand && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/90 to-transparent rounded-b-xl"
          />
        )}
      </div>

      {canExpand && (
        <div className={`mt-3 flex ${btnAlign}`}>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-2 text-blue-700 font-semibold text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded px-2 py-1"
            aria-expanded={expanded}
            aria-controls={contentId}
          >
            {expanded ? labels.less : labels.more}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : "rotate-0"}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
