import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useContactInfo } from "./useContactInfo";

export const useContactActions = () => {
  const { contactInfo } = useContactInfo();

  // Estado del toast y helpers
  const [toast, setToast] = useState({ visible: false, message: "" });
  const toastTimerRef = useRef(null);

  const showToast = useCallback((message) => {
    setToast({ visible: true, message });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
    }, 3000);
  }, []);

  const isMobileDevice = useCallback(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      ua,
    );
  }, []);

  const copyPhoneToClipboard = useCallback(async (toCopy) => {
    if (!toCopy) return false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(toCopy);
      } else {
        const tmp = document.createElement("input");
        tmp.value = toCopy;
        document.body.appendChild(tmp);
        tmp.select();
        document.execCommand("copy");
        document.body.removeChild(tmp);
      }
      return true;
    } catch (err) {
      console.error("Clipboard error:", err);
      return false;
    }
  }, []);

  const openWhatsApp = useCallback(
    (customMessage) => {
      try {
        const raw = contactInfo?.whatsapp || "";
        const phone = raw.replace(/[^\d]/g, ""); // Solo dígitos
        if (!phone) return;
        const defaultText =
          "¡Hola! Estoy interesado/a en agendar un viaje con ustedes. ¿Podrían ayudarme con más detalles, por favor?";
        // Si llega un SyntheticEvent u otro tipo distinto de string, lo ignoramos
        const safeMessage =
          typeof customMessage === "string" && customMessage.trim().length > 0
            ? customMessage.trim()
            : defaultText;
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(safeMessage)}`;
        window.open(url, "_blank");
      } catch (e) {
        console.error("No se pudo abrir WhatsApp:", e);
      }
    },
    [contactInfo],
  );

  const getPhoneHref = useCallback(() => {
    const raw = contactInfo?.telefono || "";
    const phoneTel = raw.replace(/[^0-9+]/g, "");
    return phoneTel ? `tel:${phoneTel}` : undefined;
  }, [contactInfo]);

  const onPhoneClick = useCallback(
    async (e) => {
      const raw = contactInfo?.telefono || "";
      const phoneTel = raw.replace(/[^0-9+]/g, "");
      const mobile = isMobileDevice();
      
      if (mobile) {
        // En móvil: abrir marcador directamente
        if (!phoneTel) {
          showToast("No hay teléfono configurado");
          return;
        }
        window.location.href = `tel:${phoneTel}`;
      } else {
        // En escritorio: copiar al portapapeles
        if (e && typeof e.preventDefault === "function") e.preventDefault();
        if (!phoneTel) {
          showToast("No hay teléfono configurado");
          return;
        }
        const ok = await copyPhoneToClipboard(phoneTel);
        showToast(
          ok
            ? "Número de teléfono copiado al portapapeles"
            : "No se pudo copiar el número. Intenta manualmente.",
        );
      }
    },
    [contactInfo, isMobileDevice, showToast, copyPhoneToClipboard],
  );

  const ToastPortal = () => {
    if (!toast.visible) return null;
    return createPortal(
      <div
        className="fixed inset-x-0 bottom-4 sm:bottom-6 lg:bottom-8 z-[9999] flex justify-center px-4 pointer-events-none"
        role="status"
        aria-live="polite"
      >
        <div className="pointer-events-auto w-full max-w-md">
          <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white text-slate-800 shadow-2xl border border-slate-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-green-500 flex-shrink-0"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.146-.093l3.754-5.25Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm sm:text-base font-medium">
              {toast.message}
            </span>
            <button
              onClick={() => setToast((t) => ({ ...t, visible: false }))}
              className="ml-auto rounded-md px-2 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Cerrar notificación"
            >
              ✕
            </button>
          </div>
        </div>
      </div>,
      document.body,
    );
  };

  return { openWhatsApp, getPhoneHref, onPhoneClick, ToastPortal, showToast };
};
