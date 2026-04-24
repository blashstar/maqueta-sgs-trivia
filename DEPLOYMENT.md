# 🚀 Guía de Despliegue Docker - Trivia SGS PWA

## ⚠️ Problema Identificado y Solucionado

### **Causa Raíz del Fallo Offline**
La configuración de nginx estaba **cacheando los archivos de Service Worker** (`sw.js` y `workbox-*.js`) durante **1 año**, lo que impedía que los usuarios recibieran las actualizaciones del service worker con las mejoras de funcionalidad offline.

### **Solución Aplicada**
Se actualizó `nginx.conf` para:
- ✅ Excluir archivos de service worker del cache de larga duración
- ✅ Agregar headers `no-cache` para `sw.js` y `workbox-*.js`
- ✅ Forzar verificación en cada navegación para actualizaciones

---

## 📋 Pasos para Desplegar

### **1. Verificar que el código está actualizado**

```bash
# Asegurarse de estar en la rama main
git checkout main

# Pull de los últimos cambios
git pull origin main
```

### **2. Construir la imagen Docker**

```bash
# Construir imagen (desde el directorio del proyecto)
docker-compose build --no-cache

# O usando docker build directamente
docker build -t trivia-sgs:latest .
```

### **3. Desplegar en Producción**

#### **Opción A: Servidor Local**
```bash
# Detener contenedor existente
docker-compose down

# Iniciar nuevo contenedor
docker-compose up -d

# Verificar que está corriendo
docker-compose ps

# Ver logs
docker-compose logs -f trivia-sgs
```

#### **Opción B: Servidor Remoto (trivia-sgs.scanmee.io)**

**Paso 1: Copiar archivos al servidor**
```bash
# Opción 1: Clonar el repositorio en el servidor
ssh usuario@trivia-sgs.scanmee.io
cd /ruta/al/proyecto
git pull origin main

# Opción 2: Copiar archivos con SCP
scp -r ./* usuario@trivia-sgs.scanmee.io:/ruta/al/proyecto/
```

**Paso 2: Reconstruir y desplegar**
```bash
# SSH al servidor
ssh usuario@trivia-sgs.scanmee.io

# Navegar al directorio del proyecto
cd /ruta/al/proyecto

# Reconstruir la imagen
docker-compose build --no-cache

# Detener el contenedor antiguo
docker-compose down

# Iniciar el nuevo contenedor
docker-compose up -d

# Verificar
docker-compose ps
docker-compose logs -f trivia-sgs
```

**Paso 3: Verificar nginx está sirviendo correctamente**
```bash
# Verificar headers de service worker
curl -I https://trivia-sgs.scanmee.io/sw.js

# Debería mostrar:
# Cache-Control: no-cache, no-store, must-revalidate
# Pragma: no-cache
# X-Service-Worker: true
```

### **4. Verificar Headers HTTP Correctos**

```bash
# Verificar service worker NO tiene cache
curl -I https://trivia-sgs.scanmee.io/sw.js
curl -I https://trivia-sgs.scanmee.io/workbox-*.js

# Verificar assets estáticos SÍ tienen cache (1 año)
curl -I https://trivia-sgs.scanmee.io/assets/img/fondo.png
curl -I https://trivia-sgs.scanmee.io/assets/sonidos/puntaje.mp3
```

**Respuesta esperada para `sw.js`:**
```
HTTP/1.1 200 OK
Server: nginx/1.x.x
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
X-Service-Worker: true
Content-Type: application/javascript
```

**Respuesta esperada para assets:**
```
HTTP/1.1 200 OK
Server: nginx/1.x.x
Cache-Control: public, no-transform
Expires: [date 1 year from now]
Content-Type: image/png
```

---

## 🧪 Pruebas de Funcionalidad Offline

### **Método 1: Chrome DevTools**

1. Abrir `https://trivia-sgs.scanmee.io/#/`
2. Abrir DevTools (F12)
3. Ir a **Application** → **Service Workers**
4. Verificar que el service worker está **activated and running**
5. Ir a **Network** tab
6. Seleccionar **Offline** en el dropdown de throttling
7. Recargar la página
8. ✅ La app debe cargar completamente

### **Método 2: Modo Avión**

1. Cargar la app una vez con internet
2. Esperar 10 segundos (para que el service worker termine de cachear)
3. Activar modo avión en tu dispositivo
4. Recargar la página
5. ✅ La app debe funcionar 100% offline

### **Método 3: Verificar Cache del Service Worker**

```javascript
// Ejecutar en la consola del navegador
caches.keys().then(keys => console.log('Caches:', keys))

// Debería mostrar:
// - "trivia-sgs-precache" (assets principales)
// - "imagenes-trivia" (imágenes runtime)
// - "audios-trivia" (archivos MP3 runtime)
// - "google-fonts-cache" (fuentes)
// - "gstatic-fonts-cache" (fuentes)
```

### **Método 4: Verificar Archivos Cacheados**

```javascript
// Ejecutar en la consola del navegador
caches.open('trivia-sgs-precache').then(cache => {
  cache.keys().then(requests => {
    const urls = requests.map(r => r.url);
    console.log('Archivos cacheados:', urls);
    
    // Verificar que incluye:
    // - / (index.html)
    // - assets/sonidos/*.mp3 (8 archivos)
    // - assets/img/*.png (7 imágenes de supervisor)
    // - _astro/*.js (bundles de JavaScript)
    // - _astro/*.css (bundles de CSS)
  });
});
```

---

## 🔧 Troubleshooting

### **Problema: La app no funciona offline**

**Solución 1: Forzar actualización del Service Worker**
```javascript
// Ejecutar en la consola del navegador
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister();
  }
}).then(() => {
  window.location.reload();
});
```

**Solución 2: Limpiar cache del navegador**
1. Abrir DevTools (F12)
2. Ir a **Application** → **Clear storage**
3. Click en **Clear site data**
4. Recargar la página

**Solución 3: Verificar que nginx está enviando headers correctos**
```bash
curl -I https://trivia-sgs.scanmee.io/sw.js
# Verificar que NO tiene "Cache-Control: public, max-age=31536000"
# Debe tener "Cache-Control: no-cache, no-store"
```

### **Problema: Service Worker no se actualiza**

**Causa:** El navegador está usando una versión cacheada de `sw.js`

**Solución:**
```bash
# En el servidor, verificar nginx.conf
cat /ruta/al/proyecto/nginx.conf

# Debe incluir la sección:
# location ~* ^/(sw|workbox).*\.js$ {
#     expires off;
#     add_header Cache-Control "no-cache, no-store, must-revalidate";
# }
```

### **Problema: Audio no se reproduce offline**

**Verificación:**
```javascript
// Verificar que los archivos MP3 están en el cache
caches.match('/assets/sonidos/puntaje.mp3').then(response => {
  if (response) {
    console.log('✅ Audio cacheado correctamente');
  } else {
    console.log('❌ Audio NO está cacheado');
  }
});
```

---

## 📊 Checklist de Despliegue

- [ ] Código actualizado en rama `main`
- [ ] `nginx.conf` actualizado con headers de service worker
- [ ] Docker image reconstruida con `--no-cache`
- [ ] Contenedor reiniciado (`docker-compose down` + `docker-compose up -d`)
- [ ] Headers HTTP verificados para `sw.js` (no-cache)
- [ ] Headers HTTP verificados para assets estáticos (1 year cache)
- [ ] Service Worker registrado correctamente en el navegador
- [ ] App funciona en modo offline (probado con DevTools)
- [ ] Audio funciona offline (8 archivos MP3 precacheados)
- [ ] Imágenes funcionan offline (7 imágenes de supervisor precacheadas)
- [ ] Fuentes funcionan offline (fallbacks del sistema configurados)

---

## 🎯 Comandos Útiles

```bash
# Ver logs del contenedor
docker-compose logs -f trivia-sgs

# Reiniciar contenedor
docker-compose restart trivia-sgs

# Detener contenedor
docker-compose stop

# Eliminar contenedor e imagen
docker-compose down --rmi all

# Reconstruir y desplegar
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Ver espacio usado por Docker
docker system df

# Limpiar imágenes no usadas
docker system prune -a
```

---

## 📝 Notas Importantes

1. **Siempre usar `--no-cache`** al reconstruir para asegurar que nginx.conf se actualice
2. **Verificar headers HTTP** después de cada despliegue
3. **Los usuarios pueden necesitar refrescar 2 veces** para que el nuevo service worker se active
4. **El primer load SIEMPRE requiere internet** para registrar el service worker y cachear assets
5. **El modo offline funciona DESPUÉS del primer load exitoso**

---

## 🔐 Acceso al Servidor

```bash
# SSH al servidor de producción
ssh usuario@trivia-sgs.scanmee.io

# Verificar contenedor corriendo
docker ps

# Ver logs en tiempo real
docker logs -f trivia-sgs-app
```

---

## 📞 Soporte

Si después del despliegue persisten los problemas:

1. Verificar logs de nginx: `docker exec trivia-sgs-app cat /var/log/nginx/error.log`
2. Verificar que el service worker se registra: Consola del navegador → buscar "✅ La aplicación está lista para usarse sin conexión"
3. Verificar que los assets están cacheados: DevTools → Application → Cache Storage
4. Forzar limpieza completa de cache y service workers en el navegador
