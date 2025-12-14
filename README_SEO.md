# 🌎 Documentación de SEO - Viadca Viajes

Este documento detalla la estrategia de optimización para motores de búsqueda (SEO) implementada en el frontend de Viadca. La aplicación utiliza un enfoque híbrido que combina **Client-Side Rendering (CSR)** para usuarios y **Server-Side Middleware** para bots de redes sociales.

## 🏗️ Arquitectura de SEO

### 1. Navegación de Usuarios (SPA)
Para usuarios normales y crawlers modernos (Googlebot, Bingbot), el SEO se maneja dinámicamente en el cliente usando React.
- **Hook Principal:** `useSEO.js`
- **Funcionamiento:** Actualiza el `<head>` del documento en tiempo real cuando el usuario cambia de ruta.
- **Elementos gestionados:**
  - `<title>` dinámico.
  - `<meta name="description">`.
  - Canonical URLs.
  - JSON-LD (Datos estructurados).
  - Open Graph y Twitter Cards (para actualizaciones en caliente).

### 2. Previsualización en Redes Sociales (SSR para Bots)
Dado que muchos scrapers de redes sociales (Facebook, WhatsApp, Twitter, LinkedIn) no ejecutan JavaScript, se implementó un middleware específico.
- **Archivo:** `server-og.js`
- **Funcionamiento:** Intercepta peticiones basadas en el `User-Agent`. Si detecta un bot social, genera y sirve un HTML estático ligero con los meta tags Open Graph pre-renderizados.
- **Beneficio:** Asegura que los enlaces compartidos en WhatsApp o Facebook muestren siempre la imagen, título y descripción correctos del paquete.

## 📍 SEO Local (Durango)
La estrategia principal es posicionar a Viadca como la agencia líder en Durango.
- **Keywords Específicas:** "Agencia de viajes en Durango", "Tours desde Durango", "Viajes Durango".
- **Geo Tags:** Implementados en `index.html` y JSON-LD.
  - Region: `MX-DUR`
  - Coordenadas: `24.0277, -104.6532`
- **Schema LocalBusiness:** Define claramente la ubicación física y área de servicio en Durango.

## 🔑 Estrategia de Keywords

El sitio utiliza una combinación de keywords estáticas (generales) y dinámicas (específicas del producto).

### 1. Keywords Estáticas (Globales)
Definidas en `index.html`, enfocadas en capturar tráfico local de alta intención:
*   "agencia de viajes en Durango"
*   "agencia de viajes Durango"
*   "viajes Durango"
*   "tours desde Durango"
*   "paquetes vacacionales Durango"
*   "viajes económicos Durango"
*   "agencia viajes Durango Dgo"
*   "viajes todo incluido Durango"
*   "tours nacionales Durango"
*   "viajes internacionales Durango"
*   "mejores agencias de viajes Durango"
*   "viajes baratos Durango"
*   "cruceros desde Durango"
*   "viajes a Europa desde Durango"
*   "viajes a Cancún desde Durango"
*   "tours organizados Durango"

### 2. Keywords Dinámicas (Por Paquete)
Generadas en `seoUtils.js` (`generatePackageKeywords`) para cada viaje específico:

**Generales:**
*   "viajes", "viaje a medida", "tour organizado", "vacaciones", "turismo"

**Locales Reforzadas:**
*   "Viadca Durango", "agencia de viajes en Durango centro", "agencia viajes confiable Durango"

**Transaccionales (Intención de Compra):**
*   "cotizar viaje Durango", "reservar viaje Durango", "comprar paquete viaje Durango"

**Específicas del Producto (Variables):**
*   **Destinos:** "viaje a Mazatlán", "tour Mazatlán desde Durango"
*   **Duración:** "viaje 5 días"
*   **Precio:** "viaje 5000 pesos", "oferta 5000 MXN"
*   **Actividades:** Se extraen automáticamente del texto (ej: "cenotes", "playa", "senderismo", "all inclusive").
*   **Hotel:** Nombre y categoría (ej: "Hotel Riu 5 estrellas").

## 🧬 Datos Estructurados (Schema.org)
Se inyectan scripts JSON-LD para ayudar a Google a entender el contenido.

| Tipo de Schema | Uso |
|----------------|-----|
| **TravelAgency** | Schema principal de la organización. Define logo, dirección, teléfono y redes sociales. |
| **LocalBusiness** | Refuerza la presencia local con horarios y ubicación. |
| **Product** | Utilizado en páginas de Paquetes. Define precio, disponibilidad, imagen y rating. |
| **TourPackage** | Específico para viajes. Define itinerario, duración y destinos. En prueba (Google a veces prefiere Product). |
| **BreadcrumbList** | Indica la jerarquía de navegación (Inicio > Viajes > Paquete). |
| **WebSite** | Para la caja de búsqueda de Google (Sitelinks Search Box). |
| **FAQPage** | Preguntas frecuentes para obtener resultados enriquecidos en la SERP. |

## 🛠️ Archivos Clave

### `src/hooks/useSEO.js`
El motor del SEO en cliente. Recibe un objeto de configuración (título, descripción, imagen, etc.) e inyecta o actualiza las etiquetas en el DOM. Soporta limpieza automática al desmontar componentes.

### `src/utils/seoUtils.js`
Contiene la lógica de negocio para generar el contenido SEO:
- **`generatePackageKeywords`**: Crea keywords long-tail basadas en el destino, duración y precio.
- **`generateSEOTitle` / `generateSEODescription`**: Crea textos persuasivos con emojis y CTAs para mejorar el CTR.
- **`generatePackageJsonLd`**: Construye los objetos JSON complejos para Schema.org.
- **`resolveImageUrlForSEO`**: Asegura que las imágenes siempre tengan una URL absoluta válida (maneja Cloudinary y fallbacks).

### `public/robots.txt`
Configuración de rastreo optimizada:
- **Permisos:** Acceso total a Googlebot.
- **Restricciones:** Bloqueo de áreas administrativas (`/admin`, `/perfil`, `/api`).
- **Sitemaps:** Referencia a `sitemap.xml`.

### `index.html`
Base del SEO estático. Incluye:
- Meta tags por defecto (viewport, charset).
- DNS Prefetch y Preconnect para rendimiento.
- Verificación de propiedad de Google.
- Favicons y configuración PWA.

## 📱 Meta Tags Sociales (Open Graph / Twitter)
Se configuran automáticamente para cada vista.
- **og:image**: Se selecciona inteligentemente (primera imagen del paquete, imagen subida o fallback).
- **product:price:amount**: Para etiquetas de productos en Facebook/Instagram.
- **twitter:card**: Configurado como `summary_large_image` para máximo impacto visual.

## 🚀 Performance y Core Web Vitals
El SEO técnico también incluye optimizaciones de velocidad:
- **Imágenes:** Uso de formatos AVIF/WebP y atributos `srcset` (vía Cloudinary).
- **Carga Diferida:** `DNS-prefetch` a dominios críticos.
- **Sitemap Dinámico:** Se genera en el build para incluir todas las URLs de paquetes activos.

## 📝 Checklist para nuevo contenido
Al crear una nueva página o feature, asegurar:
1.  Llamar a `useSEO()` con título y descripción únicos.
2.  Si es una página pública importante, agregarla a `sitemap.xml`.
3.  Verificar que las imágenes tengan `alt` text descriptivo.
