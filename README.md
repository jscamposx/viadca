<<<<<<< HEAD

# VIADCA – Frontend (React + Vite + Tailwind + Framer Motion)

Este proyecto es el frontend de VIADCA construido con Vite, React 19, Tailwind v4 y Framer Motion.

## Scripts

- `pnpm dev`: servidor de desarrollo
- `pnpm build`: compilar para producción
- `pnpm preview`: previsualizar el build
- `pnpm lint`: lint del proyecto

## Solución de problemas (animaciones y transiciones)

Si notas que las animaciones/transiciones no funcionan:

1. Preferencia del sistema “Reducir movimiento”

- En Windows/macOS/iOS/Android, si el sistema tiene activado “reducir movimiento”, el proyecto respeta esa preferencia y desactiva animaciones por accesibilidad.
- Para fines de pruebas, puedes forzarlas temporalmente:
  - Atajo: pulsa Ctrl + Alt + M para alternar el modo “permitir animaciones”.
  - Esto añade la clase `allow-motion` al elemento `<html>` y Framer Motion usa `reducedMotion="never"`.

1. Clases CSS de animación

- Las utilidades están en `src/styles/animations.css` y `src/index.css`/`src/App.css` (por ejemplo: `animate-fade-in`, `nav-hover-lift`, `animate-logo-marquee`). Asegúrate de que `src/index.css` se importa en `src/main.jsx` (ya está).

1. Transiciones de página

- Las páginas usan `<PageTransition/>` y `<AnimatePresence/>` (Framer Motion). Si no ves las transiciones al cambiar de ruta, verifica que no haya errores en consola y que la ruta cambie (clave por pathname).

1. Animaciones por scroll

- Hay hooks utilitarios en `src/hooks/scrollAnimations.jsx` y `src/hooks/useScrollAnimations.jsx` que aplican clases con IntersectionObserver. Comprueba que el componente que quieras animar use `<AnimatedSection>` o los hooks correspondientes.

1. Efectos duplicados en desarrollo

- React `StrictMode` ejecuta ciertos efectos dos veces en dev. Esto puede hacer que algunas animaciones parezcan “parpadear”. En producción no ocurre.

Si después de esto siguen sin funcionar, abre un issue con la página, el componente y el paso exacto para reproducir.

=======

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

> > > > > > > a43597ef0d0800863cc9a06891b89c03d846e990
