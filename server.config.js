// Configuración adicional para el servidor de desarrollo
// Este archivo puede ser usado por Express.js o similar en producción

export const compressionConfig = {
  // Configuración para express-compression o similar
  threshold: 1024, // Solo comprimir archivos > 1KB
  level: 6, // Nivel de compresión (1-9)
  chunkSize: 16 * 1024, // Tamaño de chunk de 16KB
  memLevel: 8, // Uso de memoria (1-9)

  // Tipos MIME a comprimir
  filter: (req, res) => {
    // No comprimir si el cliente no acepta gzip
    if (!req.headers["accept-encoding"]) {
      return false;
    }

    // Tipos de contenido que se benefician de la compresión
    const compressibleTypes = [
      "text/html",
      "text/css",
      "text/plain",
      "text/xml",
      "application/json",
      "application/javascript",
      "application/xml+rss",
      "application/atom+xml",
      "image/svg+xml",
      "application/x-font-ttf",
      "application/vnd.ms-fontobject",
      "font/opentype",
    ];

    const contentType = res.getHeader("content-type");
    return compressibleTypes.some(
      (type) => contentType && contentType.includes(type),
    );
  },
};

// Headers de seguridad y performance
export const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Cache-Control": "public, max-age=31536000, immutable",
  Vary: "Accept-Encoding",
};
