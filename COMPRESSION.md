# Configuración de Compresión GZIP

Este proyecto tiene habilitada la compresión GZIP y Brotli para optimizar el rendimiento de carga.

## ¿Qué se ha configurado?

### 1. Plugin de Vite (Desarrollo y Build)
- **vite-plugin-compression**: Genera archivos `.gz` y `.br` durante el build
- **Configuración**: Solo comprime archivos > 1KB
- **Algoritmos**: GZIP y Brotli

### 2. Optimizaciones de Build
- **Code Splitting**: Separación automática en chunks (vendor, maps, ui)
- **Terser**: Minificación avanzada con eliminación de console.logs
- **Sourcemaps**: Habilitados pero comprimidos

### 3. Configuraciones de Servidor

#### Apache (.htaccess)
```apache
# El archivo .htaccess incluye:
- Compresión DEFLATE/GZIP
- Compresión Brotli (si disponible)
- Cache headers optimizados
- Headers de seguridad
- Rewrite rules para SPA
```

#### Nginx (nginx.conf)
```nginx
# El archivo nginx.conf incluye:
- Compresión gzip y brotli
- Cache headers por tipo de archivo
- Headers de seguridad (CSP, HSTS, etc.)
- Configuración SSL ready
- Proxy para API
```

## Scripts Disponibles

```bash
# Build normal con compresión
npm run build

# Analizar el tamaño del bundle
npm run build:analyze

# Ver tamaños comprimidos
npm run build:gzip

# Servir con compresión habilitada
npm run serve:compressed
```

## Verificar Compresión

### En Desarrollo
Ejecuta el build y verifica que se generen archivos .gz y .br:
```bash
npm run build
ls -la dist/assets/
```

### En Producción
Verifica headers HTTP:
```bash
curl -H "Accept-Encoding: gzip" -v https://tu-dominio.com
```

Deberías ver headers como:
```
Content-Encoding: gzip
Vary: Accept-Encoding
```

### DevTools del Navegador
1. Abre DevTools (F12)
2. Ve a Network
3. Recarga la página
4. Revisa la columna "Size" vs "Transferred"

## Tipos de Archivo Comprimidos

✅ **Comprimidos**:
- HTML, CSS, JavaScript
- JSON, XML
- SVG
- Fuentes (TTF, EOT, OTF)

❌ **No Comprimidos**:
- Imágenes (JPG, PNG, GIF, WebP)
- Videos (MP4, WebM)
- Archivos ya comprimidos (ZIP, RAR)

## Beneficios Esperados

- **Reducción de tamaño**: 60-80% para archivos de texto
- **Tiempo de carga**: Hasta 50% más rápido
- **Ancho de banda**: Significativa reducción en transferencia
- **SEO**: Mejor puntuación en Core Web Vitals

## Configuración por Servidor

### Vercel
```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Netlify
```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
    Vary = "Accept-Encoding"
```

### Render.com
Los archivos estáticos se comprimen automáticamente.

## Monitoreo

### Herramientas Recomendadas
- **GTmetrix**: Análisis completo de rendimiento
- **PageSpeed Insights**: Métricas de Google
- **WebPageTest**: Testing detallado
- **Chrome DevTools**: Lighthouse audit

### Métricas a Vigilar
- **First Contentful Paint (FCP)**
- **Largest Contentful Paint (LCP)**
- **Total Blocking Time (TBT)**
- **Transfer Size vs Actual Size**

## Solución de Problemas

### Compresión no funciona
1. Verificar que el servidor soporte gzip
2. Revisar headers Accept-Encoding del cliente
3. Confirmar configuración del servidor web
4. Verificar tamaño mínimo de archivo (threshold)

### Archivos no se comprimen
1. Revisar tipo MIME del archivo
2. Confirmar que supera el threshold (1KB)
3. Verificar que no esté ya comprimido

### Performance issues
1. Revisar nivel de compresión (no usar máximo)
2. Verificar cache headers
3. Monitorear uso de CPU del servidor
4. Considerar CDN con compresión automática
