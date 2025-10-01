# Viadca Viajes – Frontend (Vite + React)

Aplicación frontend de Viadca Viajes construida con Vite, React y Tailwind, enfocada en performance, SEO y UX. Incluye un panel de administración protegido, vistas públicas de paquetes/destinos, subida/optimización de imágenes y utilidades para SEO y mapas.

Producción: <https://www.viadca.app>


## Stack principal

- Vite 7, React 19, React Router 7
- Tailwind CSS 4 (a través de `@tailwindcss/vite`)
- Axios para llamadas HTTP con cookies (withCredentials)
- Framer Motion para animaciones y transiciones
- Leaflet/React-Leaflet para mapas (opcional MapTiler)
- Cloudinary (vía backend) para gestión/optimización de imágenes
- ESLint + Prettier (config básico) para calidad de código


## Scripts de desarrollo

- Desarrollo (arranca Vite):

```powershell
pnpm dev
```

- Build de producción:

```powershell
pnpm build
```

- Build con sitemap dinámico y robots.txt (recomendado para SEO):

Este script ejecuta `scripts/generateSitemap.js` ANTES del build. El script del sitemap usa la variable de entorno `VITE_API_URL` (en entorno Node), para consultar paquetes públicos y generar rutas; si no está definida, usa `http://localhost:3000`.

PowerShell (Windows):

```powershell
$env:VITE_API_URL = "https://api.jscamposx.dev"; pnpm run build:seo
```

- Vista previa del build localmente:

```powershell
pnpm preview
```

- Linter y formato:

```powershell
pnpm lint
pnpm format
```

- Análisis de bundle (opcional):

```powershell
pnpm run build:analyze
```

- Generar solo sitemap/robots sin compilar:

```powershell
pnpm run generate-sitemap
```

Notas:
- El script `env-check` figura en package.json pero no hay archivo `env-check.js` en el repo. Si lo necesitas, añádelo o elimina el script.


## Variables de entorno

Coloca un archivo `.env` en la raíz (para Vite deben empezar con `VITE_`). Ejemplos:

```ini
VITE_API_BASE_URL=https://api.jscamposx.dev
VITE_CLOUDINARY_CLOUD_NAME=dsh8njsiu
# Opcional: tiles en español (si no usas MAPTILER)
VITE_ES_TILE_URL=
# Opcional: clave gratuita de MapTiler
VITE_MAPTILER_KEY=

# Solo para el script Node del sitemap (build time)
# Si no lo defines, usa http://localhost:3000
VITE_API_URL=https://api.jscamposx.dev
```

Detalles importantes:

- API Base URL: si `VITE_API_BASE_URL` no está definido, en desarrollo se usa `http://localhost:3000` y en producción `https://api.jscamposx.dev` (ver `src/api/axiosConfig.js`).
- Cookies y CORS: Axios está configurado con `withCredentials: true`. Asegúrate de que tu backend permita cookies cross-site (CORS correcto, SameSite/secure y origen).
- Cloudinary: la subida de imágenes NO va directo a Cloudinary desde el cliente; se hace vía endpoints del backend (`/admin/upload/*`). `VITE_CLOUDINARY_CLOUD_NAME` se usa para construir URLs optimizadas al mostrar imágenes.
- Mapas: si defines `VITE_ES_TILE_URL`, se usa esa fuente. Si no, y defines `VITE_MAPTILER_KEY`, se usan tiles de MapTiler en español. En su defecto, se usan tiles públicos de OpenStreetMap.


## Estructura del proyecto

```text
viadca-main/
├─ public/                  # Activos estáticos servidos tal cual
│  ├─ HomePage/ ...
│  ├─ videos/
│  ├─ favicon.svg robots.txt sitemap.xml viadca-icon.avif viadcalogo.avif
├─ scripts/
│  └─ generateSitemap.js   # Genera sitemap.xml y robots.txt a partir del API
├─ src/
│  ├─ api/                 # Axios + servicios de dominio (paquetes, mayoristas, auth, contacto)
│  ├─ components/          # UI reutilizable (inputs, modales, paginator, etc.) + rutas protegidas
│  ├─ contexts/            # Contextos (Auth, Loading)
│  ├─ features/            # Vistas por dominio (home, destinos, paquete, admin, auth, legal, perfil)
│  ├─ hooks/               # Hooks personalizados (fetch, SEO, Cloudinary, etc.)
│  ├─ services/            # CloudinaryService (mostrar/optimizar URLs)
│  ├─ styles/              # Animaciones/globales
│  ├─ utils/               # SEO, imágenes, logs, precios, etc.
│  ├─ App.jsx main.jsx     # Rutas y bootstrap de la app
├─ vite.config.js          # Plugins (React SWC, Tailwind, compresión gzip/brotli, terser)
├─ nginx.conf              # Ejemplo de configuración Nginx para SPA
├─ server.config.js        # Configs sugeridas (compresión y headers)
├─ eslint.config.js        # ESLint + React Hooks + React Refresh + Prettier
├─ postcss.config.cjs      # PostCSS (Tailwind se inyecta vía plugin de Vite)
├─ package.json pnpm-lock.yaml
└─ README.md
```


## Rutas principales de la app

- Públicas
  - `/` Inicio (Home)
  - `/paquetes` Listado público (features/destinations)
  - `/paquetes/:url` Detalle de paquete (features/package)
  - `/preguntas-frecuentes` (carga diferida con skeleton)
  - `/privacidad`, `/terminos`, `/cookies`
  - Autenticación: `/iniciar-sesion`, `/registro`, `/verificar-correo`, `/recuperar-contraseña`, `/restablecer-contraseña`, `/aprobacion-pendiente`

- Protegidas (requieren sesión y rol)
  - `/perfil` Perfil de usuario (protegida)
  - `/admin` Área de administración (ProtectedRoute con `requiredRole="admin"`)
    - Dashboard, Paquetes (CRUD), Mayoristas (CRUD), Usuarios, Papelera, Perfil, Configuración

Autenticación:

- El backend maneja la sesión con cookies. En iOS/Safari, como fallback, el backend puede devolver `access_token`; el cliente lo guarda en memoria/sessionStorage y lo envía como `Authorization: Bearer` si el navegador no envía cookies.


## Integración con APIs

- Base Axios (`src/api/axiosConfig.js`):
  - `baseURL` desde `VITE_API_BASE_URL` o fallbacks
  - `withCredentials: true` para cookies
  - Interceptores con logs solo en desarrollo (ocultan tokens en consola)

- Servicios principales (`src/api`):
  - `packagesService`: CRUD de paquetes, listado público `/paquetes/listado`, exportar Excel, stats, toggle favorito, hoteles custom
  - `mayoristasService`: CRUD y stats de mayoristas
  - `authService`: registro, login/logout, verificación de correo, recuperación/restablecimiento, profile y administración de usuarios
  - `contactService`: obtener/crear/actualizar/eliminar información de contacto con caché en memoria


## Imágenes y Cloudinary

- `src/services/cloudinaryService.js` expone utilidades para:
  - Subida/eliminación de imágenes vía backend (`/admin/upload/*`)
  - Construcción de URLs optimizadas (transformaciones) y `srcset`
  - Funciones para generar versiones responsivas/optimizar Pexels/Cloudinary
- `src/utils/imageUtils.js` integra CloudinaryService y resuelve URLs del backend (`/uploads/...`) y del front (`public/*`).


## Mapas

- `react-leaflet` con carga diferida del CSS de Leaflet para optimizar LCP
- Fuente de tiles prioriza español (`VITE_ES_TILE_URL`), o MapTiler con `VITE_MAPTILER_KEY`; si no, OpenStreetMap.


## SEO y rendimiento

- Meta tags y JSON-LD base en `index.html`
- Utilidades SEO en `src/utils/seoUtils.js` para títulos, descripciones, keywords y datos estructurados por paquete
- `scripts/generateSitemap.js` construye `public/sitemap.xml` y `public/robots.txt` desde el API (usar `VITE_API_URL` en build time)
- `vite.config.js`:
  - Compresión gzip y brotli (archivos `.gz` y `.br`)
  - `terser` con drop de `console` y `debugger`
  - `manualChunks` para dividir vendor/ui/maps


## Desarrollo local

Requisitos:

- Node 18+ recomendado
- pnpm 8+

Pasos:

1. Instalar dependencias

  ```powershell
  pnpm install
  ```

1. Definir `.env` (al menos `VITE_API_BASE_URL` si no usas el fallback)

1. Arrancar el servidor de desarrollo

```powershell
pnpm dev
```

El front asume un backend disponible en `VITE_API_BASE_URL` (o `http://localhost:3000`).


## Despliegue

1. Compilar

- Build estándar: `pnpm build`
- Build recomendado con sitemap:

  ```powershell
  $env:VITE_API_URL = "https://api.jscamposx.dev"; pnpm run build:seo
  ```

1. Servir carpeta `dist/` con tu servidor preferido (Nginx, CDN, Render, etc.)

- El repo incluye `nginx.conf` con:
  - SPA fallback `try_files ... /index.html`
  - Cache agresiva para estáticos y compresión gzip/brotli
  - Headers de seguridad recomendados

1. Backend/API

- Asegura CORS y cookies cross-site para el dominio del front
- Endpoints usados por el front (no exhaustivo):
  - Público: `GET /paquetes/listado`, `GET /paquetes/:codigoUrl`, `GET /contacto`
  - Admin: `POST /admin/upload/image(s)`, `CRUD /admin/paquetes`, `CRUD /admin/mayoristas`, `GET /admin/usuarios`, etc.


## Calidad de código

- ESLint: reglas base + hooks + react-refresh + prettier

  ```powershell
  pnpm lint
  ```

- Formato con Prettier

  ```powershell
  pnpm format
  ```


## Solución de problemas (FAQ)

- CORS/Autenticación: veo `withCredentials: true`. Si no se mantiene la sesión:
  - Verifica `Access-Control-Allow-Credentials: true` en backend y origen permitido
  - Cookies con `SameSite=None; Secure` si es cross-site sobre HTTPS
  - En iOS/Safari, el cliente puede usar `Authorization: Bearer` como fallback

## Testimonios (Home) – Gestión vía JSON

Los testimonios mostrados en el carrusel de la Home ahora se cargan dinámicamente desde `public/data/testimonials.json` (fetch en cliente). Puedes actualizar o añadir nuevos testimonios sin tocar el código React.

Formato de cada objeto en el array:

```jsonc
[
  {
    "name": "Nombre del Cliente",
    "location": "Hace 3 días" // o ciudad/fecha relativa
    "avatar": "/HomePage/testimonio-user1.avif", // ruta pública (puede ser externa absoluta)
    "quote": "Texto del testimonio",
    "accentFrom": "from-indigo-500", // opcional Tailwind gradient start
    "accentTo": "to-violet-500"      // opcional Tailwind gradient end
  }
]
```

Notas:
- `accentFrom` y `accentTo` son opcionales; si faltan, el componente asigna un par de colores cíclico.
- Para forzar recarga en producción (cache de CDN) puedes cambiar el nombre del archivo o un query param manual (`/data/testimonials.json?refresh=123`). El componente ya añade un timestamp `_` para evitar cache demasiado agresivo en navegadores.
- Procura mantener el array relativamente corto (≤ 20) para no aumentar el tiempo de carga inicial. Si necesitas muchos, considera paginar o cargar bajo demanda.
- Imágenes: ideal servirlas como `.avif` o `.webp` optimizadas y cuadradas (min 128x128) para mayor nitidez.

Si eliminas todos los testimonios, el carrusel mostrará un mensaje: "No hay testimonios disponibles".

- Mapas sin tiles o en inglés:
  - Define `VITE_ES_TILE_URL` o `VITE_MAPTILER_KEY`

- Imágenes del backend no cargan:
  - Revisa que `VITE_API_BASE_URL` sea correcto. `imageUtils` convierte `/uploads/...` a `${API}/uploads/...`

- Sitemap vacío en build:seo
  - Define `VITE_API_URL` en el entorno del proceso de Node al ejecutar `generateSitemap.js`


## Contribuir

- Commits asistidos (opcional): `pnpm commit` o `pnpm commit-es` usan `aicommits` si lo tienes instalado globalmente.
- Haz PRs con descripciones claras y, cuando aplique, incluye capturas o GIFs.


## Licencia

Este repositorio está marcado como `"private": true`. Todos los derechos reservados a su(s) autor(es).


## Autoría

- Propietario: @jscamposx
- Proyecto: Viadca Viajes – Frontend

