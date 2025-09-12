import { useState, useEffect, useRef } from "react";
import contactService from "../api/contactService";

export const useContactInfo = () => {
  const [contactInfo, setContactInfo] = useState({
    telefono: "+526181658730",
    email: "jscamposx@gmail.com",
    whatsapp: "+526182463777",
    direccion: "Predio las mesas",
    horario: "L-V 10:00 19:00",
    facebook: "https://www.facebook.com/jscamposx",
    instagram: "https://www.instagram.com/",
    tiktok: "https://www.tiktok.com/",
    youtube: "https://www.youtube.com/",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const didInitRef = useRef(false);
  const inFlightRef = useRef(null);

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    const fetchContactInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!inFlightRef.current) {
          inFlightRef.current = contactService.getContacto().finally(() => {
            inFlightRef.current = null;
          });
        }
        const data = await inFlightRef.current;

        const processedData = {
          telefono: data.telefono || "+526181658730",
          email: data.email || "jscamposx@gmail.com",
          whatsapp: data.whatsapp || "+526182463777",
          direccion: data.direccion || "Predio las mesas",
          horario: data.horario || "L-V 10:00 19:00",
          facebook: data.facebook || "https://www.facebook.com/jscamposx",
          instagram: data.instagram || "https://www.instagram.com/",
          tiktok: data.tiktok || "https://www.tiktok.com/",
          youtube: data.youtube || "https://www.youtube.com/",
        };

        setContactInfo(processedData);
      } catch (err) {
        console.error("Error al cargar información de contacto:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  return { contactInfo, loading, error };
};
