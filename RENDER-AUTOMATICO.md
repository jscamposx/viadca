# 🚀 Solución Automática para Render.com

## ✅ Ventajas de Esta Solución

- ✅ **NO requiere rebuild** cuando agregas paquetes
- ✅ **100% automático** - detecta bots y genera HTML dinámico
- ✅ **Gratis** - usa el free tier de Render
- ✅ **Tiempo real** - cambios en API se reflejan inmediatamente
- ✅ **Zero configuración** después del deploy inicial

---

## 📦 Cómo Funciona

### Para Usuarios Normales:
```
Usuario → viadca.app/paquetes/UnVL0 → React App (normal)
```

### Para Bots (Facebook/WhatsApp):
```
Bot → viadca.app/paquetes/UnVL0 → Servidor detecta bot 
    → Fetch API (datos del paquete) 
    → Genera HTML con meta tags 
    → Bot recibe HTML con imagen/título/descripción
```

---

## 🛠️ Instalación en Render (5 minutos)

### Paso 1: Instalar Dependencias

```powershell
pnpm install express node-fetch
```

### Paso 2: Build del Proyecto

```powershell
pnpm run build
```

### Paso 3: Configurar en Render Dashboard

1. Ve a tu servicio en Render.com
2. **Settings** → **Build & Deploy**
3. Cambia los comandos:

```
Build Command:    pnpm install && pnpm run build
Start Command:    pnpm run start:prod
```

4. **Environment Variables**:
```
VITE_API_URL = https://api.viadca.app
NODE_ENV = production
```

5. Click **Save Changes**

6. **Manual Deploy** → Deploy latest commit

### Paso 4: Verificar que Funciona

Espera 3-5 minutos al deploy, luego:

```powershell
# Test 1: Usuario normal (debe mostrar React)
curl https://viadca.onrender.com/paquetes/UnVL0

# Test 2: Simular bot de Facebook
curl -A "facebookexternalhit/1.1" https://viadca.onrender.com/paquetes/UnVL0
```

El Test 2 debe mostrar HTML con meta tags Open Graph.

---

## 🧪 Probar en Facebook

1. Ve a: https://developers.facebook.com/tools/debug/
2. Pega: `https://viadca.onrender.com/paquetes/UnVL0`
3. Click "Debug"
4. Deberías ver:
   - ✅ Título del paquete
   - ✅ Descripción
   - ✅ Imagen principal
   - ✅ og:type = "product"

---

## 🔄 Agregar Nuevos Paquetes

### ANTES (con pre-render):
```
1. Crear paquete en admin
2. pnpm run build:full
3. Esperar 5-10 minutos
4. Deploy a Render
5. Esperar otros 5 minutos
6. Limpiar caché Facebook
Total: ~20 minutos
```

### AHORA (con servidor dinámico):
```
1. Crear paquete en admin
2. ¡Listo! 
Total: ~0 minutos
```

El servidor automáticamente:
- ✅ Detecta nuevos paquetes en el API
- ✅ Genera meta tags dinámicos
- ✅ Sirve a los bots inmediatamente

---

## 📊 Comparativa

| Aspecto | Pre-render Estático | Servidor Dinámico (Esta solución) |
|---------|---------------------|-----------------------------------|
| Build cada paquete | ✅ Requerido | ❌ No necesario |
| Tiempo deploy | 10-15 min | 0 min |
| Paquetes nuevos | Manual rebuild | Automático |
| Costo Render | Gratis | Gratis |
| Complejidad | Media | Baja |
| Mantenimiento | Alto | Zero |

---

## 🎯 Qué Detecta como Bot

El servidor detecta estos User-Agents:
- ✅ `facebookexternalhit` (Facebook)
- ✅ `Facebot` (Facebook crawler)
- ✅ `WhatsApp` (WhatsApp preview)
- ✅ `LinkedInBot` (LinkedIn)
- ✅ `TwitterBot` (Twitter/X)
- ✅ `Twitterbot` (Twitter crawler)
- ✅ `Slackbot` (Slack)
- ✅ `TelegramBot` (Telegram)
- ✅ `Discordbot` (Discord)
- ✅ Y más...

---

## 🐛 Troubleshooting

### Error: "Cannot GET /paquetes/UnVL0"

**Causa:** Servidor no está corriendo o build falló

**Solución:**
```powershell
# Local
pnpm run build
pnpm run start

# En Render, revisar logs
```

### Facebook muestra info genérica

**Causa:** Paquete no existe en API o codigoUrl incorrecto

**Solución:**
1. Verifica que el paquete existe: `https://api.viadca.app/paquetes/publicos`
2. Verifica que `codigoUrl` es exacto (case-sensitive)
3. Limpia caché de Facebook: "Scrape Again"

### Imagen no aparece

**Causa:** URL de imagen no es pública o no es HTTPS

**Solución:**
- Usa imágenes de Cloudinary
- Verifica que la URL empieza con `https://`
- Tamaño mínimo: 200x200px
- Tamaño recomendado: 1200x630px

### Servidor tarda mucho en responder

**Causa:** API del backend está lento

**Solución:**
Agregar caché en memoria (opcional):

```javascript
// En server-og.js, línea ~150
const cache = new Map();
const CACHE_TTL = 3600000; // 1 hora

// Antes de fetch
const cacheKey = `paquete_${codigoUrl}`;
const cached = cache.get(cacheKey);
if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
  return res.send(cached.html);
}

// Después de generar HTML
cache.set(cacheKey, { html, timestamp: Date.now() });
```

---

## 📱 Resultado Final

### Al compartir en WhatsApp:
```
┌─────────────────────────────────┐
│ [Imagen del paquete]             │
│                                  │
│ Paquete Cancún Todo Incluido    │
│ 5 días · Hotel 5★ · desde       │
│ $12,000 MXN                      │
│                                  │
│ Agencia de Viajes en Durango    │
└─────────────────────────────────┘
```

### Al compartir en Facebook:
```
┌─────────────────────────────────┐
│ [Imagen grande del paquete]      │
│                                  │
│ Paquete Cancún Todo Incluido    │
│                                  │
│ Disfruta de 5 días en Cancún    │
│ con todo incluido. Hotel 5       │
│ estrellas, vuelos, traslados...  │
│                                  │
│ VIADCA.APP                       │
└─────────────────────────────────┘
```

---

## 🔐 Seguridad

El servidor incluye headers de seguridad básicos.

Para mejorar (opcional):
```javascript
// En server-og.js
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  });
  next();
});
```

---

## 📈 Monitoreo

### Ver Logs en Render:

1. Dashboard → Tu servicio → Logs
2. Busca líneas con:
   - `🤖 Bot detectado:` - Cuando un bot visita
   - `📦 Generando OG para:` - Paquete siendo procesado
   - `✅ HTML generado para:` - Éxito
   - `❌ Error generando meta tags:` - Error

### Logs Esperados:

```
🤖 Bot detectado: facebookexternalhit/1.1...
📦 Generando OG para: /paquetes/UnVL0
✅ HTML generado para: Paquete Cancún Todo Incluido
```

---

## 🚀 Deploy Automático (Opcional)

Para que se redeploy automáticamente cuando hagas push:

1. Render Dashboard → Settings
2. **Auto-Deploy**: ON
3. **Branch**: main

Ahora cada `git push` dispara deploy automático.

---

## 💰 Costos

**Render Free Tier:**
- ✅ 750 horas/mes gratis
- ✅ Suficiente para 24/7
- ✅ Bandwidth: 100 GB/mes
- ✅ NO requiere tarjeta de crédito

**Si excedes (muy difícil):**
- Render Starter: $7/mes (más recursos)

---

## ✅ Checklist Post-Deploy

- [ ] Servidor corriendo en Render
- [ ] Build exitoso (sin errores)
- [ ] Start command: `pnpm run start:prod`
- [ ] Variable `VITE_API_URL` configurada
- [ ] Test con curl simula bot: OK
- [ ] Facebook Debugger muestra meta tags: OK
- [ ] WhatsApp preview funciona: OK
- [ ] Usuarios normales ven React: OK

---

## 📞 Soporte

Si algo no funciona:

1. **Revisa logs** en Render Dashboard
2. **Test local** con `pnpm run start`
3. **Verifica API** está respondiendo
4. **Limpia caché** de Facebook

---

**Última actualización:** Octubre 2025  
**Servidor:** server-og.js  
**Configuración:** render.yaml
