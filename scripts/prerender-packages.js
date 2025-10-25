/**
 * Pre-render dinámico de paquetes para Open Graph
 * 
 * Este script genera páginas HTML estáticas para cada paquete público
 * con los meta tags Open Graph correctos para compartir en redes sociales.
 * 
 * Uso: node scripts/prerender-packages.js
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const API_URL = process.env.VITE_API_URL || 'https://api.viadca.app';
const SITE_URL = 'https://www.viadca.app';
const DIST_DIR = path.resolve(__dirname, '../dist');
const TEMPLATE_PATH = path.resolve(DIST_DIR, 'index.html');

// Template HTML base para paquetes
const generatePackageHTML = (paquete, baseHTML) => {
  const titulo = paquete.titulo || 'Viaje';
  const descripcion = paquete.descripcion?.substring(0, 155) || `Descubre ${titulo} con Viadca`;
  const imagen = paquete.primera_imagen || `${SITE_URL}/HomePage/Hero-Image.avif`;
  const url = `${SITE_URL}/paquetes/${paquete.codigoUrl}`;
  
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

  // Título SEO optimizado
  const tituloSEO = `${titulo}${destinoStr} · ${paquete.duracion_dias || 0} días | Agencia Durango`;
  
  // Descripción optimizada
  const hotel = paquete.hotel ? ` Hotel ${paquete.hotel.estrellas}★` : '';
  const descripcionSEO = `Viaje${destinoStr} · ${paquete.duracion_dias || 0} días${hotel}${precio}. Agencia de viajes en Durango | Viadca`;

  // Reemplazar meta tags
  let html = baseHTML;
  
  // Title
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${tituloSEO}</title>`
  );
  
  // Description
  html = html.replace(
    /<meta name="description" content=".*?">/,
    `<meta name="description" content="${descripcionSEO.replace(/"/g, '&quot;')}">`
  );
  
  // Open Graph
  html = html.replace(
    /<meta property="og:type" content=".*?">/,
    `<meta property="og:type" content="product">`
  );
  
  html = html.replace(
    /<meta property="og:title" content=".*?">/,
    `<meta property="og:title" content="${titulo.replace(/"/g, '&quot;')}">`
  );
  
  html = html.replace(
    /<meta property="og:description" content=".*?">/,
    `<meta property="og:description" content="${descripcion.replace(/"/g, '&quot;')}">`
  );
  
  html = html.replace(
    /<meta property="og:image" content=".*?">/,
    `<meta property="og:image" content="${imagen}">`
  );
  
  html = html.replace(
    /<meta property="og:url" content=".*?">/,
    `<meta property="og:url" content="${url}">`
  );
  
  // Twitter Card
  const twitterTitleRegex = /<meta name="twitter:title" content=".*?">/;
  if (twitterTitleRegex.test(html)) {
    html = html.replace(
      twitterTitleRegex,
      `<meta name="twitter:title" content="${titulo.replace(/"/g, '&quot;')}">`
    );
  } else {
    html = html.replace(
      '</head>',
      `    <meta name="twitter:title" content="${titulo.replace(/"/g, '&quot;')}">\n  </head>`
    );
  }
  
  const twitterDescRegex = /<meta name="twitter:description" content=".*?">/;
  if (twitterDescRegex.test(html)) {
    html = html.replace(
      twitterDescRegex,
      `<meta name="twitter:description" content="${descripcion.replace(/"/g, '&quot;')}">`
    );
  } else {
    html = html.replace(
      '</head>',
      `    <meta name="twitter:description" content="${descripcion.replace(/"/g, '&quot;')}">\n  </head>`
    );
  }
  
  const twitterImageRegex = /<meta name="twitter:image" content=".*?">/;
  if (twitterImageRegex.test(html)) {
    html = html.replace(
      twitterImageRegex,
      `<meta name="twitter:image" content="${imagen}">`
    );
  } else {
    html = html.replace(
      '</head>',
      `    <meta name="twitter:image" content="${imagen}">\n  </head>`
    );
  }
  
  // Canonical
  const canonicalRegex = /<link rel="canonical" href=".*?">/;
  if (canonicalRegex.test(html)) {
    html = html.replace(
      canonicalRegex,
      `<link rel="canonical" href="${url}">`
    );
  } else {
    html = html.replace(
      '</head>',
      `    <link rel="canonical" href="${url}">\n  </head>`
    );
  }
  
  return html;
};

// Fetch paquetes públicos del API
const fetchPublicPackages = async () => {
  try {
    console.log(`📡 Fetching paquetes desde: ${API_URL}/paquetes/publicos`);
    
    const response = await fetch(`${API_URL}/paquetes/publicos`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    const paquetes = data.data || data;
    
    console.log(`✅ Obtenidos ${paquetes.length} paquetes públicos`);
    return Array.isArray(paquetes) ? paquetes : [];
  } catch (error) {
    console.error('❌ Error fetching paquetes:', error.message);
    return [];
  }
};

// Main
const main = async () => {
  try {
    console.log('🚀 Iniciando pre-rendering de paquetes...\n');
    
    // 1. Verificar que existe dist/
    try {
      await fs.access(DIST_DIR);
    } catch {
      console.error(`❌ Directorio dist/ no encontrado. Ejecuta 'pnpm build' primero.`);
      process.exit(1);
    }
    
    // 2. Leer template HTML
    console.log('📄 Leyendo template HTML...');
    const baseHTML = await fs.readFile(TEMPLATE_PATH, 'utf-8');
    
    // 3. Fetch paquetes
    const paquetes = await fetchPublicPackages();
    
    if (paquetes.length === 0) {
      console.log('⚠️  No se encontraron paquetes para pre-renderizar.');
      return;
    }
    
    // 4. Crear directorio paquetes/ si no existe
    const paquetesDir = path.join(DIST_DIR, 'paquetes');
    await fs.mkdir(paquetesDir, { recursive: true });
    
    // 5. Generar HTML para cada paquete
    console.log(`\n📦 Generando páginas para ${paquetes.length} paquetes...\n`);
    
    let successCount = 0;
    for (const paquete of paquetes) {
      if (!paquete.codigoUrl) {
        console.log(`⚠️  Saltando paquete sin codigoUrl: ${paquete.titulo || paquete.id}`);
        continue;
      }
      
      try {
        const html = generatePackageHTML(paquete, baseHTML);
        const outputDir = path.join(paquetesDir, paquete.codigoUrl);
        const outputPath = path.join(outputDir, 'index.html');
        
        await fs.mkdir(outputDir, { recursive: true });
        await fs.writeFile(outputPath, html, 'utf-8');
        
        console.log(`  ✅ /paquetes/${paquete.codigoUrl}/ → ${paquete.titulo}`);
        successCount++;
      } catch (error) {
        console.error(`  ❌ Error en ${paquete.codigoUrl}: ${error.message}`);
      }
    }
    
    console.log(`\n✨ Pre-rendering completado: ${successCount}/${paquetes.length} páginas generadas`);
    console.log(`📂 Archivos en: ${paquetesDir}\n`);
    
    // 6. Instrucciones
    console.log('📋 PRÓXIMOS PASOS:\n');
    console.log('1. Verifica las páginas generadas en dist/paquetes/');
    console.log('2. Despliega a producción (Vercel, Netlify, etc.)');
    console.log('3. Prueba compartir en Facebook: https://developers.facebook.com/tools/debug/');
    console.log('4. Ejecuta este script después de cada build con nuevos paquetes\n');
    
  } catch (error) {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  }
};

main();
