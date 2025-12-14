import React from "react";
import { Link } from "react-router-dom";

const LEGAL_CONTENT = {
  column1: [
    {
      id: "c1-p1",
      text: "Viadca actúa como agencia intermediaria; la emisión final y cumplimiento del servicio corresponden a las aerolíneas, hoteles u operadores locales.",
    },
    {
      id: "c1-p2",
      text: "Los precios son dinámicos hasta la emisión del boleto o voucher. Las tarifas promocionales son limitadas y algunas pueden ser no reembolsables; te informamos las condiciones antes de pagar.",
    },
    {
      id: "c1-p3",
      text: "El viajero es responsable de contar con pasaporte, visas y vacunas vigentes. Recomendamos validar requisitos migratorios al menos 60 días antes de la salida.",
    },
    {
      id: "c1-p4",
      text: "Cambios o cancelaciones quedan sujetos a políticas de cada proveedor y pueden implicar cargos adicionales o pérdida total de la tarifa en casos no reembolsables.",
    },
    {
      id: "c1-p5",
      text: "Eventuales retrasos, clima o fuerza mayor pueden afectar tu itinerario. Te acompañamos en la gestión, pero la responsabilidad operativa recae en el proveedor del servicio.",
    },
  ],
  column2: [
    {
      id: "c2-p1",
      content: (
        <>
          Privacidad: no vendemos tus datos y los usamos solo para gestionar tus viajes. Puedes ejercer tus derechos ARCO según nuestra {" "}
          <Link
            to="/privacidad"
            className="text-gray-700 underline hover:text-black transition-colors"
          >
            Política de Privacidad
          </Link>
          .
        </>
      ),
    },
    {
      id: "c2-p2",
      content: (
        <>
          Cookies: utilizamos cookies esenciales, analíticas y de preferencias para mejorar la experiencia. Puedes gestionarlas en tu navegador o revisar la {" "}
          <Link
            to="/cookies"
            className="text-gray-700 underline hover:text-black transition-colors"
          >
            Política de Cookies
          </Link>
          .
        </>
      ),
    },
    {
      id: "c2-p3",
      content: (
        <>
          Actualizaciones: podemos modificar términos y avisos legales. Consulta la versión vigente en {" "}
          <Link
            to="/terminos"
            className="text-gray-700 underline hover:text-black transition-colors"
          >
            Términos y Condiciones
          </Link>
          .
        </>
      ),
    },
    {
      id: "c2-p4",
      content: "Conservamos tus datos solo el tiempo necesario para la gestión de viajes y cumplimiento legal; luego aplicamos eliminación o anonimización segura.",
    },
    {
      id: "c2-p5",
      content: "Puedes ejercer tus derechos de acceso, rectificación o cancelación escribiendo a nuestro canal de soporte; responderemos con la misma transparencia que en nuestras políticas.",
    },
  ],
};

const LegalFoot = () => {
  return (
    <section
      aria-label="Notas legales"
      className="w-full bg-white px-6 md:px-12 border-t border-gray-100"
    >
      <div className="max-w-375 mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed text-gray-500">
        <p className="text-justify">
          {LEGAL_CONTENT.column1.map((item, idx) => (
            <React.Fragment key={item.id}>
              {idx > 0 && " "}
              {item.text}
            </React.Fragment>
          ))}
        </p>

        <p className="text-justify">
          {LEGAL_CONTENT.column2.map((item, idx) => (
            <React.Fragment key={item.id}>
              {idx > 0 && " "}
              {item.content || item.text}
            </React.Fragment>
          ))}
        </p>
      </div>
    </section>
  );
};

export default LegalFoot;
