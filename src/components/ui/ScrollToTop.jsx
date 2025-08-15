import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Restaura el scroll al tope en cada cambio de ruta.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Si hay ancla en la URL, intenta desplazar hacia ese elemento
    if (hash) {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }

    // Por defecto, ir al inicio de la página
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}
