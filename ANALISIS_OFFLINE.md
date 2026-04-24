# 🔍 Análisis del Fallo Offline en Producción

## ❌ Problema Reportado
**URL:** https://trivia-sgs.scanmee.io/#/  
**Síntoma:** La aplicación no funciona correctamente en modo offline

---

## 🎯 Causa Raíz Identificada

### **Problema Crítico: Service Worker Cacheado por Nginx**

El archivo `nginx.conf` tenía una configuración de cache que afectaba **TODOS los archivos `.js`**, incluyendo los archivos de Service Worker:

```nginx
# ❌ CONFIGURACIÓN INCORRECTA (antes)
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|mp3)$ {
    expires 1y;  # Cache de 1 AÑO para TODOS los JS
    add_header Cache-Control "public, no-transform";
}
```

### **¿Por qué esto rompe el modo offline?**

1. **Service Workers son archivos JavaScript** (`sw.js`, `workbox-*.js`)
2. Nginx los cacheaba con `Cache-Control: public, max-age=31536000` (1 año)
3. Los navegadores usan la versión cacheada de `sw.js` **sin verificar si hay una nueva**
4. Los usuarios **NUNCA reciben el service worker actualizado** con:
   - ✅ Precaching de archivos de audio (8 MP3)
   - ✅ Runtime caching para `/assets/sonidos/*.mp3`
   - ✅ Mejoras de funcionalidad offline

### **Flujo del Problema:**

```
Usuario visita la app (con internet)
    ↓
Nginx sirve sw.js con cache de 1 año
    ↓
Browser cachea sw.js antiguo (sin audio precaching)
    ↓
Usuario vuelve a la app
    ↓
Browser usa sw.js cacheado (NO verifica si hay nuevo)
    ↓
Service Worker antiguo NO cachea archivos de audio
    ↓
Usuario activa modo offline
    ↓
❌ FALLO: Los audios no están disponibles
```

---

## ✅ Solución Implementada

### **1. Actualizar nginx.conf**

Se agregaron reglas específicas para **EXCLUIR** los archivos de Service Worker del cache agresivo:

```nginx
# ✅ CONFIGURACIÓN CORRECTA (después)

# Cache normal para assets estáticos (EXCLUYE service workers)
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|mp3)$ {
    # Excluir archivos de service worker
    if ($uri ~* "^/(sw|workbox).*\.js$") {
        set $skip_cache 1;
    }
    
    # Solo aplicar cache largo si NO es service worker
    if ($skip_cache != 1) {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}

# Service Workers - SIN CACHE (crítico para actualizaciones)
location ~* ^/(sw|workbox).*\.js$ {
    expires off;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header X-Service-Worker "true";
}
```

### **2. ¿Qué hace esta solución?**

| Archivo | Cache Anterior | Cache Nuevo | ¿Por qué? |
|---------|---------------|-------------|-----------|
| `sw.js` | 1 año ❌ | `no-cache` ✅ | Debe verificarse en cada navegación |
| `workbox-*.js` | 1 año ❌ | `no-cache` ✅ | Biblioteca del service worker |
| `assets/img/*.png` | 1 año ✅ | 1 año ✅ | Imágenes estáticas, seguro cachear |
| `assets/sonidos/*.mp3` | 1 año ✅ | 1 año ✅ | Audios estáticos, seguro cachear |
| `_astro/*.js` | 1 año ✅ | 1 año ✅ | Bundles versionados con hash |

### **3. Headers HTTP Resultantes**

**Para `sw.js`:**
```http
HTTP/1.1 200 OK
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
X-Service-Worker: true
```

**Para assets estáticos:**
```http
HTTP/1.1 200 OK
Cache-Control: public, no-transform
Expires: [1 año en el futuro]
```

---

## 🔄 Nuevo Flujo Correcto

```
Usuario visita la app (con internet)
    ↓
Nginx sirve sw.js con headers no-cache
    ↓
Browser registra service worker NUEVO (con audio precaching)
    ↓
Service Worker precachea:
  ✅ 8 archivos MP3
  ✅ 7 imágenes de supervisor
  ✅ Backgrounds y logos
  ✅ JavaScript y CSS bundles
    ↓
Service Worker completa instalación
    ↓
Usuario activa modo offline
    ↓
✅ ÉXITO: La app funciona 100% offline
```

---

## 📋 Pasos para Aplicar la Solución

### **En tu máquina local:**

```bash
# 1. Asegurarse de tener los cambios
git pull origin main

# 2. Verificar que nginx.conf está actualizado
cat nginx.conf | grep -A 5 "Service Worker files"

# 3. Reconstruir imagen Docker
docker-compose build --no-cache

# 4. Desplegar
docker-compose down
docker-compose up -d

# 5. Verificar
docker-compose ps
```

### **En el servidor de producción:**

```bash
# SSH al servidor
ssh usuario@trivia-sgs.scanmee.io

# Navegar al proyecto
cd /ruta/al/proyecto

# Pull de cambios
git pull origin main

# Reconstruir y desplegar
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Verificar headers
curl -I https://trivia-sgs.scanmee.io/sw.js
# Debe mostrar: Cache-Control: no-cache, no-store
```

---

## 🧪 Cómo Verificar que Funciona

### **1. Verificar Headers HTTP**

```bash
# Service worker NO debe tener cache
curl -I https://trivia-sgs.scanmee.io/sw.js

# Debe mostrar:
# Cache-Control: no-cache, no-store, must-revalidate

# Assets SÍ deben tener cache
curl -I https://trivia-sgs.scanmee.io/assets/img/fondo.png

# Debe mostrar:
# Cache-Control: public, no-transform
# Expires: [fecha 1 año en el futuro]
```

### **2. Verificar en el Navegador**

```javascript
// Abrir DevTools → Consola

// 1. Verificar service worker registrado
navigator.serviceWorker.ready.then(reg => {
  console.log('✅ Service Worker registrado:', reg.active.scriptURL);
});

// 2. Verificar assets cacheados
caches.keys().then(keys => {
  console.log('Caches disponibles:', keys);
  // Debe incluir:
  // - "trivia-sgs-precache"
  // - "imagenes-trivia"
  // - "audios-trivia"
});

// 3. Verificar audios cacheados
caches.match('/assets/sonidos/puntaje.mp3').then(response => {
  console.log('Audio cacheado:', response ? '✅ SÍ' : '❌ NO');
});
```

### **3. Prueba Offline**

1. Cargar la app con internet: `https://trivia-sgs.scanmee.io/#/`
2. Esperar 10-15 segundos
3. Abrir DevTools → Network → Seleccionar **Offline**
4. Recargar la página
5. ✅ La app debe cargar completamente y funcionar

---

## 🚨 Importante para Usuarios Existentes

Los usuarios que **YA visitaron la app** antes de este fix tendrán un service worker antiguo cacheado. Para forzar la actualización:

### **Opción 1: Esperar**
- El navegador verificará `sw.js` en la próxima navegación (puede tardar hasta 24h)
- Con los nuevos headers `no-cache`, se verificará en **cada visita**

### **Opción 2: Forzar actualización manual**
```javascript
// Ejecutar en la consola del navegador
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
  window.location.reload();
});
```

### **Opción 3: Limpiar datos del sitio**
1. DevTools → Application → Clear storage
2. Click "Clear site data"
3. Recargar la página

---

## 📊 Métricas de la Corrección

| Aspecto | Antes | Después |
|---------|-------|---------|
| Service Worker Update | ❌ 1 año de cache | ✅ Verificación en cada navegación |
| Audio Offline | ❌ No disponible | ✅ 8 archivos MP3 precacheados |
| Tiempo de Update | ❌ Hasta 1 año | ✅ Inmediato (próxima visita) |
| Imágenes Offline | ✅ Sí | ✅ Sí (sin cambios) |
| Fonts Offline | ✅ Fallbacks | ✅ Fallbacks (sin cambios) |

---

## 🎓 Lecciones Aprendidas

1. **NUNCA cachear agresivamente archivos de Service Worker**
2. **Siempre verificar headers HTTP** después de desplegar cambios de PWA
3. **Los service workers son archivos `.js`** y pueden ser afectados por reglas genéricas de cache
4. **Probar offline en producción**, no solo en desarrollo
5. **Documentar la estrategia de cache** para futuros despliegues

---

## 📚 Documentación Relacionada

- `DEPLOYMENT.md` - Guía completa de despliegue Docker
- `OFFLINE_TESTING.md` - Guía de pruebas offline
- `CORRECCIONES_OFFLINE.md` - Detalles técnicos de las correcciones PWA
- `nginx.conf` - Configuración actualizada de nginx

---

**Fecha de Análisis:** 2026-04-24  
**Estado:** ✅ Solucionado y listo para desplegar  
**Commit:** `8e1b873` - fix: add nginx service worker cache headers for PWA offline updates
