import React from 'react';

/**
 * Cabecera reutilizable para páginas de administración.
 * - En mobile (por defecto) muestra tarjeta glass (estilo del dashboard que te gustó)
 * - En pantallas >= lg mantiene el estilo clásico (o se puede ajustar con props)
 * Props:
 *  - title: string
 *  - description: string | node (opcional)
 *  - loading: boolean (para skeleton de description)
 *  - actions: node (botones derecha)
 *  - icon: optional React component (icono decorativo opcional)
 *  - className: extra classes wrapper
 *  - persistentGlass: si true fuerza glass también en desktop
 */
export default function AdminHeaderCard({
  title,
  description,
  loading = false,
  actions = null,
  icon: Icon = null,
  className = '',
  persistentGlass = false,
}) {
  return (
    <div
      className={[
        'rounded-2xl mb-4 sm:mb-6 transition-colors',
        'glass-panel glass-border-gradient shadow-lg p-4 sm:p-5',
        !persistentGlass ? 'lg:bg-white lg:shadow-md lg:border lg:border-gray-100' : '',
        className || ''
      ].filter(Boolean).join(' ')}
    >
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5">
        <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            {Icon && (
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600 shadow-sm">
                <Icon className="w-5 h-5" />
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {title}
            </h1>
          </div>
          {loading ? (
            <div className="mt-1 h-4 w-60 max-w-full mx-auto sm:mx-0 bg-white/50 rounded animate-pulse" />
          ) : description ? (
            <p className="text-gray-600/90 text-sm sm:text-base max-w-2xl mx-auto sm:mx-0">
              {description}
            </p>
          ) : null}
        </div>
        {actions && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
