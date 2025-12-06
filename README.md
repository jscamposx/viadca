# 🌎✨ Viadca Viajes – Frontend

**Plataforma web moderna para gestión y visualización de paquetes de viaje**, construida con un enfoque total en **rendimiento, SEO, seguridad y experiencia de usuario**. Este frontend alimenta tanto el sitio público como el panel de administración de Viadca.

🔗 **Producción:** [https://www.viadca.app](https://www.viadca.app)


<img width="1701" height="918" alt="image" src="https://github.com/user-attachments/assets/73740be3-f368-4920-acdb-eb464fe69d9c" />
<img width="1721" height="868" alt="image" src="https://github.com/user-attachments/assets/4d8dd9ed-3734-4e6b-8a55-48da848dd3d3" />

---

# 🚀 Tech Stack Principal

* **Vite 7** – compilación ultrarrápida
* **React 19 + React Router 7** – SPA optimizada y escalable
* **Tailwind CSS 4** – estilos modernos y consistentes
* **Axios** con `withCredentials` – soporte de cookies para autenticación segura
* **Framer Motion** – animaciones fluidas y de nivel profesional
* **React‑Leaflet / MapTiler / OSM** – mapas dinámicos y personalizables
* **Cloudinary (vía backend)** – carga, optimización y transformaciones de imágenes
* **ESLint + Prettier** – calidad y consistencia de código

---

# 📦 Scripts de Desarrollo

### ▶️ Desarrollo

```bash
pnpm dev
```

### 🏗️ Build de Producción

```bash
pnpm build
```

### 🌐 Build con sitemap dinámico (SEO recomendado)

```powershell
$env:VITE_API_URL = "https://api.viadca.app"; pnpm run build:seo
```

### 🔍 Vista previa del build

```bash
pnpm preview
```

### 🧹 Linter / Formato

```bash
pnpm lint
pnpm format
```

### 📊 Bundle Analyzer

```bash
pnpm run build:analyze
```

---

# 🔐 Variables de Entorno (`.env`)

```ini
VITE_API_BASE_URL=https://api.viadca.app
VITE_CLOUDINARY_CLOUD_NAME=dsh8njsiu
VITE_ES_TILE_URL=
VITE_MAPTILER_KEY=
VITE_API_URL=https://api.viadca.app
```

✔ URLs de API y tiles se resuelven automáticamente
✔ Cookies seguras habilitadas (`withCredentials: true`)
✔ Cloudinary solo mediante endpoints del backend (flujo seguro)

---

# 🧭 Estructura del Proyecto

```text
viadca-main/
├─ public/
│  ├─ HomePage/
│  ├─ videos/
│  ├─ favicon.svg sitemap.xml robots.txt
├─ scripts/
│  └─ generateSitemap.js
├─ src/
│  ├─ api/           # Servicios axios
│  ├─ components/    # UI, modales, rutas protegidas
│  ├─ contexts/      # Auth y Loading
│  ├─ features/      # Home, destinos, paquetes, admin, auth
│  ├─ hooks/         # Fetch, SEO, Cloudinary, etc.
│  ├─ services/      # CloudinaryService
│  ├─ styles/        # Global & animations
│  ├─ utils/         # SEO, imágenes, logs, precios
│  ├─ App.jsx
│  └─ main.jsx
├─ vite.config.js
├─ nginx.conf
└─ package.json
```

---

# 🌍 Rutas Principales

## Públicas

* `/` Inicio
* `/paquetes` Listado
* `/paquetes/:url` Detalle
* `/preguntas-frecuentes`
* `/privacidad`, `/terminos`, `/cookies`
* Autenticación completa: login, registro, verificación, recuperación

## Protegidas (Roles y Sesiones)

* `/perfil`
* `/admin`

  * Dashboard, Paquetes CRUD, Mayoristas CRUD, Usuarios, Papelera, Configuración

Autenticación híbrida: cookies + fallback de token para iOS/Safari.

---

# 🔗 Integración con APIs

* Axios configurado con `interceptors`
* Logs solo en desarrollo
* Endpoints principales: paquetes, mayoristas, contacto, auth
* CRUD completo en panel administrador

---

# 🖼️ Imágenes – Optimización Profesional (Cloudinary)

* URLs transformadas automáticamente para dispositivos y resoluciones
* Generación de `srcset` y formatos (`avif/webp`)
* Subidas vía backend → mayor seguridad

---

# 🗺️ Mapas

* `react‑leaflet` con carga diferida del CSS → mejor LCP
* Soporte para español vía `VITE_ES_TILE_URL` o MapTiler
* Fallback automático a OpenStreetMap

---

# 🔎 SEO & Performance

* Metadatos + JSON‑LD dinámico
* Sitemap y robots generados desde API
* Estrategias de `manualChunks` para dividir vendor/map/ui
* Compresión Brotli + Gzip
* Eliminación de `console` y `debugger` en producción

---

# 🛠️ Desarrollo Local

```bash
pnpm install
pnpm dev
```

Requiere backend corriendo en `VITE_API_BASE_URL`.

---

# ☁️ Despliegue

### 1️⃣ Compilar

```powershell
$env:VITE_API_URL="https://api.viadca.app"; pnpm run build:seo
```

### 2️⃣ Servir `dist/`

Con Nginx, CDN, Render, etc.

### 3️⃣ Backend

* CORS con cookies (`SameSite=None; Secure`)
* Endpoints públicos y privados configurados

---

# 🧪 Testimonios dinámicos

Cargados desde `public/data/testimonials.json` sin modificar React.

```json
{
  "name": "Cliente Demo",
  "location": "Hace 3 días",
  "avatar": "/HomePage/testimonio.avif",
  "quote": "Excelente servicio y atención."
}
```

---

# 🔧 Troubleshooting

**Cookies no se guardan**
✔ Revisar CORS, `Allow-Credentials` y SameSite
✔ HTTPS obligatorio para cookies cross‑site

**Sitemap vacío**
✔ Asegurar `VITE_API_URL` en build SEO

**Imágenes del backend no cargan**
✔ Revisar conversión `/uploads` en `imageUtils`

---

# 🤝 Contribuir

* Commits con AI opcional mediante `pnpm commit`
* PRs con capturas y descripción

---

# 🏷️ Licencia

Repositorio privado – Todos los derechos reservados.

---

# 👤 Autoría

**Propietario:** @jscamposx
**Proyecto:** Viadca Viajes – Frontend
