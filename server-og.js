/**
 * Express Middleware para Meta Tags Dinámicos (Render.com)
 * 
 * Este middleware intercepta peticiones de bots de redes sociales
 * y genera HTML dinámico con meta tags Open Graph específicos del paquete.
 * 
 * NO REQUIERE REBUILD - Todo es dinámico en tiempo real
 * 
 * INSTALACIÓN EN RENDER:
 * 1. Agregar este archivo a tu proyecto
 * 2. Instalar: npm install express node-fetch
 * 3. Configurar en render.yaml o en el dashboard
 * 4. Start Command: node server-og.js
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const API_URL = process.env.VITE_API_URL || 'https://api.viadca.app';
const DIST_DIR = path.join(__dirname, 'dist');

// Lista de bots que necesitan meta tags
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
  'SkypeUriPreview',
  'Pinterest',
  'redditbot',
];

// Detectar si es un bot de redes sociales
function isSocialBot(userAgent) {
  if (!userAgent) return false;
  return SOCIAL_BOTS.some(bot => userAgent.toLowerCase().includes(bot.toLowerCase()));
}

// Generar HTML con meta tags dinámicos
function generateOGHtml(paquete, codigoUrl) {
  const titulo = paquete.titulo || 'Viaje';
  const descripcion = paquete.descripcion?.substring(0, 155) || `Descubre ${titulo} con Viadca`;
  const imagen = paquete.primera_imagen || 'https://www.viadca.app/HomePage/Hero-Image.avif';
  const fullUrl = `https://www.viadca.app/paquetes/${codigoUrl}`;
  
  // Destinos
  const destinos = Array.isArray(paquete.destinos) && paquete.destinos.length > 0
    ? paquete.destinos.map(d => d.ciudad || d.destino).filter(Boolean).slice(0, 2).join(', ')
    : '';
  const destinoStr = destinos ? ` a ${destinos}` : '';
  
  // Precio
  const moneda = paquete.moneda || 'MXN';
  const precio = paquete.precio_total 
    ? ` desde $${paquete.precio_total} ${moneda}`
    : '';

  const tituloSEO = `${titulo}${destinoStr} · ${paquete.duracion_dias || 0} días | Agencia Durango`;
  const hotel = paquete.hotel ? ` Hotel ${paquete.hotel.estrellas}★` : '';
  const descripcionSEO = `Viaje${destinoStr} · ${paquete.duracion_dias || 0} días${hotel}${precio}. Agencia de viajes en Durango | Viadca`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO -->
    <title>${tituloSEO}</title>
    <meta name="description" content="${descripcionSEO.replace(/"/g, '&quot;')}">
    <link rel="canonical" href="${fullUrl}">
    
    <!-- Open Graph -->
    <meta property="og:type" content="product">
    <meta property="og:title" content="${titulo.replace(/"/g, '&quot;')}">
    <meta property="og:description" content="${descripcion.replace(/"/g, '&quot;')}">
    <meta property="og:image" content="${imagen}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:url" content="${fullUrl}">
    <meta property="og:site_name" content="Viadca Durango">
    <meta property="og:locale" content="es_MX">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${titulo.replace(/"/g, '&quot;')}">
    <meta name="twitter:description" content="${descripcion.replace(/"/g, '&quot;')}">
    <meta name="twitter:image" content="${imagen}">
    <meta name="twitter:site" content="@viadcaviajes">
    
    <!-- Redirect para que el bot indexe pero usuarios vean React -->
    <script>
      // Solo redirigir si es un navegador real, no un bot
      if (!/bot|crawler|spider|crawling/i.test(navigator.userAgent)) {
        window.location.href = '${fullUrl}';
      }
    </script>
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px;">
    <h1>${titulo}</h1>
    <img src="${imagen}" alt="${titulo}" style="max-width: 100%; height: auto; border-radius: 12px; margin: 20px 0;">
    <p style="font-size: 18px; line-height: 1.6; color: #333;">${descripcion}</p>
    <div style="margin: 30px 0; padding: 20px; background: #f0f9ff; border-radius: 8px;">
      <p><strong>Duración:</strong> ${paquete.duracion_dias || 0} días</p>
      ${destinos ? `<p><strong>Destinos:</strong> ${destinos}</p>` : ''}
      ${precio ? `<p><strong>Precio:</strong> ${precio}</p>` : ''}
    </div>
    <a href="${fullUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px;">
      Ver Detalles Completos →
    </a>
    <p style="margin-top: 40px; color: #666; font-size: 14px;">
      Si no eres redirigido automáticamente, 
      <a href="${fullUrl}" style="color: #667eea;">haz clic aquí</a>
    </p>
</body>
</html>`;
}

// Middleware para interceptar rutas de paquetes
app.get('/paquetes/:codigoUrl', async (req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';
  const { codigoUrl } = req.params;
  
  // Si NO es un bot, servir el index.html de React
  if (!isSocialBot(userAgent)) {
    return res.sendFile(path.join(DIST_DIR, 'index.html'));
  }
  
  // Si ES un bot, generar HTML dinámico
  try {
    console.log(`🤖 Bot detectado: ${userAgent.substring(0, 50)}...`);
    console.log(`📦 Generando OG para: /paquetes/${codigoUrl}`);
    
    // Fetch data del paquete desde tu API
    const response = await fetch(`${API_URL}/paquetes/publicos`);
    
    if (!response.ok) {
      throw new Error(`API respondió con status ${response.status}`);
    }
    
    const data = await response.json();
    const paquetes = data.data || data;
    
    // Buscar el paquete por codigoUrl
    const paquete = Array.isArray(paquetes) 
      ? paquetes.find(p => p.codigoUrl === codigoUrl)
      : null;
    
    if (!paquete) {
      console.log(`❌ Paquete no encontrado: ${codigoUrl}`);
      return res.sendFile(path.join(DIST_DIR, 'index.html'));
    }
    
    // Generar HTML con meta tags
    const html = generateOGHtml(paquete, codigoUrl);
    
    console.log(`✅ HTML generado para: ${paquete.titulo}`);
    
    res.set({
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600', // Cache 1 hora
    });
    
    return res.send(html);
  } catch (error) {
    console.error('❌ Error generando meta tags:', error.message);
    // Si falla, servir React normal
    return res.sendFile(path.join(DIST_DIR, 'index.html'));
  }
});

// Servir archivos estáticos de Vite build
app.use(express.static(DIST_DIR));

// Todas las demás rutas sirven index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║  🚀 Servidor OG Meta Tags (Render.com)            ║
║  📡 Puerto: ${PORT}                                    ║
║  🌐 API: ${API_URL}           ║
║  📂 Static: ${DIST_DIR}                  ║
║  ✅ Listo para detectar bots y servir meta tags   ║
╚════════════════════════════════════════════════════╝
  `);
});

export default app;
