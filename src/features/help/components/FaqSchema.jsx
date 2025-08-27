import React from 'react';

// Componente que inyecta el JSON-LD FAQPage para SEO.
// Recibe un array de objetos { question: string, answer: string }
export default function FaqSchema({ items = [] }) {
  if (!items.length) return null;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(it => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: it.answer,
      }
    }))
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
