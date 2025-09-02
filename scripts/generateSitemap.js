import fs from 'fs';
import path from 'path';

/**
 * Script para generar sitemap.xml dinámico con paquetes
 * Ejecutar en build time: node scripts/generateSitemap.js
 */

const DOMAIN = 'https://www.viadca.app';
const API_URL = process.env.VITE_API_URL || 'http://localhost:3000';

async function fetchPackages() {
  try {
    const response = await fetch(`${API_URL}/paquetes/listado?limit=1000`);
    const data = await response.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error('Error fetching packages:', error);
    return [];
  }
}

function formatDate(date) {
  return new Date(date || Date.now()).toISOString().split('T')[0];
}

function generateSitemap(packages = []) {
  const staticUrls = [
    { loc: '', priority: '1.0', changefreq: 'daily' },
    { loc: '/paquetes', priority: '0.9', changefreq: 'daily' },
    { loc: '/destinos', priority: '0.8', changefreq: 'weekly' },
    { loc: '/preguntas-frecuentes', priority: '0.7', changefreq: 'weekly' },
    { loc: '/contacto', priority: '0.6', changefreq: 'monthly' },
    { loc: '/aviso-privacidad', priority: '0.3', changefreq: 'yearly' },
    { loc: '/terminos', priority: '0.3', changefreq: 'yearly' },
  ];

  const urls = [
    // Static pages
    ...staticUrls.map(page => `  <url>
    <loc>${DOMAIN}${page.loc}</loc>
    <lastmod>${formatDate()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`),
    
    // Package pages
    ...packages.filter(pkg => pkg.activo && pkg.codigoUrl).map(pkg => {
      const imageTag = pkg.primera_imagen ? `
    <image:image>
      <image:loc>${pkg.primera_imagen}</image:loc>
      <image:title>${pkg.titulo}</image:title>
      <image:caption>Paquete de ${pkg.duracion_dias} días - ${pkg.titulo}</image:caption>
    </image:image>` : '';
      
      return `  <url>
    <loc>${DOMAIN}/paquetes/${pkg.codigoUrl}</loc>
    <lastmod>${formatDate(pkg.fecha_modificacion || pkg.fecha_creacion)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${imageTag}
  </url>`;
    })
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>`;
}

async function main() {
  console.log('🗺️ Generando sitemap dinámico...');
  
  try {
    const packages = await fetchPackages();
    console.log(`📦 ${packages.length} paquetes encontrados`);
    
    const sitemap = generateSitemap(packages);
    const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    
    fs.writeFileSync(outputPath, sitemap, 'utf-8');
    console.log(`✅ Sitemap generado: ${outputPath}`);
    
    // Generar robots.txt mejorado
    const robotsTxt = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${DOMAIN}/sitemap.xml

# Disallow admin areas
Disallow: /admin
Disallow: /login
Disallow: /dashboard

# Allow important pages
Allow: /paquetes
Allow: /destinos
Allow: /contacto

# Crawl delay (optional)
Crawl-delay: 1`;

    const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
    fs.writeFileSync(robotsPath, robotsTxt, 'utf-8');
    console.log(`🤖 robots.txt actualizado: ${robotsPath}`);
    
  } catch (error) {
    console.error('❌ Error generando sitemap:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateSitemap, fetchPackages };
