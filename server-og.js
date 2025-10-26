import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const API_URL = process.env.VITE_API_URL || 'https://api.viadca.app';
const DIST_DIR = path.join(__dirname, 'dist');

// Lista de User-Agents de bots de redes sociales
const SOCIAL_BOTS = [
  'facebookexternalhit',
  'Facebot',
  'WhatsApp',
  'LinkedInBot',
  'TwitterBot',
  'Twitterbot',
  'Slackbot',
  'TelegramBot',
  'Discordbot',
  'Pinterest',
  'redditbot'
];

// Middleware para servir archivos estáticos
app.use(express.static(DIST_DIR));

// Función para detectar si es un bot de redes sociales
const isSocialBot = (userAgent) => {
  if (!userAgent) return false;
  const lowerUA = userAgent.toLowerCase();
  return SOCIAL_BOTS.some(bot => lowerUA.includes(bot.toLowerCase()));
};

// Función para generar HTML con Open Graph tags
const generateOGHtml = (paquete, codigoUrl) => {
  if (!paquete) {
    // Fallback a la página principal
    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Viadca Durango">
  <meta property="og:title" content="Agencia de Viajes en Durango - Tours y Viajes | Viadca">
  <meta property="og:description" content="Agencia de viajes en Durango con los mejores tours y viajes vacacionales. Viajes nacionales e internacionales.">
  <meta property="og:image" content="https://www.viadca.app/seo%20image.png">
  <meta property="og:url" content="https://www.viadca.app">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Agencia de Viajes en Durango | Viadca">
  <meta name="twitter:description" content="Los mejores tours y viajes vacacionales desde Durango">
  <meta name="twitter:image" content="https://www.viadca.app/seo%20image.png">
  <meta http-equiv="refresh" content="0;url=https://www.viadca.app">
</head>
<body>
  <p>Redirigiendo...</p>
</body>
</html>`;
  }

  const titulo = paquete.titulo || 'Viaje';
  const descripcion = paquete.descripcion || `Descubre este increíble viaje de ${paquete.duracion_dias} días`;
  const imagen = paquete.imagenes?.[0]?.cloudinary_url || 
                 paquete.imagenes?.[0]?.url || 
                 paquete.primera_imagen || 
                 'https://www.viadca.app/seo%20image.png';
  
  const destinos = paquete.destinos?.map(d => d.ciudad || d.destino).filter(Boolean).join(', ') || '';
  const precio = paquete.precio_total ? `desde $${paquete.precio_total.toLocaleString('es-MX')} ${paquete.moneda || 'MXN'}` : '';
  const dias = paquete.duracion_dias ? `${paquete.duracion_dias} días` : '';

  const fullDescription = `${descripcion.substring(0, 150)}... ${dias}${destinos ? ' · ' + destinos : ''}${precio ? ' · ' + precio : ''}`;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${titulo} | Viadca Durango</title>
  
  <!-- Open Graph Tags -->
  <meta property="og:type" content="product">
  <meta property="og:site_name" content="Viadca Durango">
  <meta property="og:title" content="${titulo} · ${dias} | Agencia Durango">
  <meta property="og:description" content="${fullDescription}">
  <meta property="og:image" content="${imagen}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="https://www.viadca.app/paquetes/${codigoUrl}">
  <meta property="og:locale" content="es_MX">
  
  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@viadcaviajes">
  <meta name="twitter:title" content="${titulo}">
  <meta name="twitter:description" content="${fullDescription}">
  <meta name="twitter:image" content="${imagen}">
  <meta name="twitter:image:alt" content="${titulo}">
  
  <!-- Product Schema -->
  ${precio ? `
  <meta property="product:price:amount" content="${paquete.precio_total}">
  <meta property="product:price:currency" content="${paquete.moneda || 'MXN'}">
  ` : ''}
  
  <!-- Redirect para navegadores (no para bots) -->
  <script>
    if (!/bot|crawler|spider|crawling/i.test(navigator.userAgent)) {
      window.location.href = 'https://www.viadca.app/paquetes/${codigoUrl}';
    }
  </script>
  
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
      text-align: center;
    }
    img {
      max-width: 100%;
      border-radius: 8px;
      margin: 20px 0;
    }
    h1 {
      color: #333;
      margin-bottom: 10px;
    }
    p {
      color: #666;
      line-height: 1.6;
    }
    .price {
      font-size: 1.5em;
      color: #2563eb;
      font-weight: bold;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <img src="${imagen}" alt="${titulo}">
  <h1>${titulo}</h1>
  <p>${descripcion}</p>
  ${precio ? `<div class="price">${precio}</div>` : ''}
  <p>⏰ ${dias}${destinos ? ' · 📍 ' + destinos : ''}</p>
  <p><em>Redirigiendo a la aplicación...</em></p>
</body>
</html>`;
};

// Ruta para manejar paquetes individuales
app.get('/paquetes/:codigoUrl', async (req, res) => {
  const { codigoUrl } = req.params;
  const userAgent = req.headers['user-agent'] || '';
  
  console.log(`🔍 Solicitud a /paquetes/${codigoUrl}`);
  console.log(`👤 User-Agent: ${userAgent.substring(0, 100)}...`);

  // Si NO es un bot, servir el index.html de React
  if (!isSocialBot(userAgent)) {
    console.log(`👨‍💻 Usuario regular - sirviendo React app`);
    return res.sendFile(path.join(DIST_DIR, 'index.html'));
  }

  console.log(`🤖 Bot detectado: ${userAgent.substring(0, 50)}...`);
  console.log(`📦 Generando OG para: /paquetes/${codigoUrl}`);

  try {
    // Fetch del paquete desde la API
    const response = await fetch(`${API_URL}/paquetes/publicos`);
    
    if (!response.ok) {
      throw new Error(`API respondió con status ${response.status}`);
    }

    const paquetes = await response.json();
    const paquete = paquetes.find(p => p.codigoUrl === codigoUrl);

    if (!paquete) {
      console.log(`❌ Viaje no encontrado: ${codigoUrl}`);
      // Servir React app para que maneje el 404
      return res.sendFile(path.join(DIST_DIR, 'index.html'));
    }

    console.log(`✅ HTML generado para: ${paquete.titulo}`);
    const html = generateOGHtml(paquete, codigoUrl);
    
    // Headers para caché (1 hora)
    res.set({
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    });

    return res.send(html);

  } catch (error) {
    console.error(`❌ Error generando meta tags para ${codigoUrl}:`, error.message);
    // En caso de error, servir la app React normal
    return res.sendFile(path.join(DIST_DIR, 'index.html'));
  }
});

// Todas las demás rutas sirven la SPA de React
app.get('*', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor OG Meta Tags corriendo en puerto ${PORT}`);
  console.log(`📁 Sirviendo archivos desde: ${DIST_DIR}`);
  console.log(`🌐 API URL: ${API_URL}`);
  console.log(`🤖 Detectando bots para generar meta tags dinámicos`);
});
