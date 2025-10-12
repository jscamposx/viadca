import { useState, useEffect, useRef } from "react";
import contactService from "../api/contactService";

export const useContactInfo = () => {
  const [contactInfo, setContactInfo] = useState({
    telefono: "999 242 3321",
    email: "viadca@zafirotours.mx",
    whatsapp: "5216181098565",
    direccion: "Mascareñas #803, Durango Dgo, México. 34000, Durango, Mexico",
    horario: "L-V 9:00-18:00",
    facebook: "https://www.facebook.com/viajes.viadca/",
    instagram: "https://www.instagram.com/viajesviadca",
    tiktok: "https://www.tiktok.com/@viajes.viadca.age",
    youtube: "https://youtube.com/@viadca",
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
          telefono: data.telefono || "999 242 3321",
          email: data.email || "viadca@zafirotours.mx",
          whatsapp: data.whatsapp || "5216181098565",
          direccion:
            data.direccion ||
            "Mascareñas #803, Durango Dgo, México. 34000, Durango, Mexico",
          horario: data.horario || "L-V 9:00-18:00",
          facebook:
            data.facebook || "https://www.facebook.com/viajes.viadca/",
          instagram:
            data.instagram || "https://www.instagram.com/viajesviadca",
          tiktok: data.tiktok || "https://www.tiktok.com/@viajes.viadca.age",
          youtube: data.youtube || "https://youtube.com/@viadca",
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
