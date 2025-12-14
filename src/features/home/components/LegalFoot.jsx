import React from "react";

const LEGAL_CONTENT = {
  column1: [
    {
      id: "c1-p1",
      text: "¹\u00A0La disponibilidad instantánea requiere una Cuenta de cheques Square. Los fondos generados mediante los servicios de procesamiento de pagos de Square suelen estar disponibles en el saldo de la Cuenta de cheques Square inmediatamente después de procesar un pago. Es posible que los plazos de disponibilidad de los fondos varíen por cuestiones técnicas.",
    },
    {
      id: "c1-p2",
      text: "La disponibilidad instantánea no se aplica a los fondos que se agregan a la Cuenta de cheques Square a través de transferencias ACH. Las transferencias de crédito ACH a tu cuenta pueden demorar entre uno y dos días hábiles.",
    },
    {
      id: "c1-p3",
      text: "Block, Inc. es una plataforma de servicios financieros y no un banco asegurado por la FDIC. La cobertura del seguro de depósitos de la FDIC solo protege contra la quiebra de una institución de depósito asegurada por la FDIC. Si tienes una Cuenta de cheques Square, hasta $250,000 de tu saldo pueden estar cubiertos por el seguro de la FDIC de forma transferida a través de Sutton Bank, Member FDIC, sujeto a la suma de los fondos del titular de la cuenta depositados en Sutton Bank y si se cumplen ciertas condiciones.",
    },
  ],
  column2: [
    {
      id: "c2-p1",
      content: (
        <>
          ²&nbsp;Los pagos sin conexión se procesarán automáticamente cuando el
          dispositivo se conecte a Internet y se rechazarán si no se conecta en
          el transcurso de las 24 horas posteriores al primer pago sin conexión.
          Al activar esta función, todos los pagos vencidos, rechazados o
          reclamados que hayas aceptado de esta forma serán tu responsabilidad.
          Square no puede brindar información de contacto de los clientes para
          los pagos rechazados en el modo sin conexión. Los pagos sin conexión
          no son compatibles con Square Reader sin contacto y con chip (1.ª
          generación, v1 y v2). Obtén más información sobre cómo habilitar y
          usar los pagos sin conexión{" "}
          <a
            href="https://squareup.com/help/us/es/article/7777-process-card-payments-with-offline-mode"
            className="text-gray-700 underline hover:text-black transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            aquí
          </a>
          .
        </>
      ),
    },
    {
      id: "c2-p2",
      text: "³\u00A0La transferencia instantánea requiere una cuenta bancaria asociada o una tarjeta de débito compatible e implica una comisión por transferencia. Los fondos están sujetos a los horarios de disponibilidad de tu banco. El importe para cada transferencia tiene un mínimo de $25 y un máximo de $10,000. Es posible que los vendedores nuevos de Square tengan un límite de $2,000 al día. Los plazos de disponibilidad de los fondos pueden variar por cuestiones técnicas.",
    },
  ],
};

const LegalFoot = () => {
  return (
    <section
      aria-label="Notas legales"
      className="w-full bg-white  px-6 md:px-12 border-t border-gray-100"
    >
      <div className="max-w-375 mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed text-gray-500">
        <div className="space-y-4">
          {LEGAL_CONTENT.column1.map((item) => (
            <p key={item.id}>{item.text}</p>
          ))}
        </div>

        <div className="space-y-4">
          {LEGAL_CONTENT.column2.map((item) => (
            <p key={item.id}>{item.content || item.text}</p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LegalFoot;
