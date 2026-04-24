# 🔧 Guía de Pruebas Offline - Trivia SGS PWA

## ✅ Cambios Realizados para Soporte Offline Completo

### 1. **Service Worker Mejorado**
- ✅ Todos los assets precacheados (JS, CSS, HTML, imágenes, audio)
- ✅ Caché específica para imágenes (`imagenes-trivia`)
- ✅ Caché específica para audios (`audios-trivia`) - **NUEVO**
- ✅ Caché para Google Fonts con fallback
- ✅ Navegación offline habilitada

### 2. **Assets Incluidos en Precache**
- ✓ Todas las imágenes del supervisor (7 archivos PNG)
- ✓ Todos los archivos de audio (8 archivos MP3)
- ✓ JavaScript de la aplicación
- ✓ CSS y estilos
- ✓ Logo y fondos
- ✓ Favicon y manifest

### 3. **Fonts Fallback**
- ✅ Sistema de fuentes fallback configurado
- ✅ Si Google Fonts no está disponible, usa fuentes del sistema
- ✅ La app se ve bien incluso sin conexión en la primera carga

### 4. **Monitor de Conexión**
- ✅ Detección automática de estado online/offline
- ✅ Logs en consola para debugging
- ✅ Indicador visual del estado de conexión

---

## 🧪 Cómo Probar el Funcionamiento Offline

### Método 1: Chrome DevTools (Recomendado)

1. **Abrir la aplicación**
   ```
   http://localhost:4322
   ```

2. **Abrir DevTools** (F12)

3. **Ir a la pestaña Application**
   - En el panel izquierdo, expandir "Service Workers"
   - Verificar que el SW está registrado y activado
   - Deberías ver: `Status: activated and is running`

4. **Verificar el caché**
   - En el panel izquierdo, expandir "Cache Storage"
   - Deberías ver:
     - `precache-v-...` (contiene todos los assets)
     - `imagenes-trivia`
     - `audios-trivia`
     - `google-fonts-cache`

5. **Activar modo offline**
   - Ir a la pestaña "Network"
   - Cambiar "Online" a "Offline" en el dropdown
   - **La app debe seguir funcionando completamente**

6. **Probar todas las funcionalidades**:
   - ✅ Navegar a todas las vistas (Portada, Instrucciones, Pregunta, Respuesta, Resultado)
   - ✅ Reproducir audios
   - ✅ Ver imágenes
   - ✅ Responder preguntas
   - ✅ Ver resultados

### Método 2: Desconectar Internet

1. **Primera carga (CON internet)**
   - Abrir la app con internet activado
   - Esperar a que cargue completamente
   - Ver en consola: `✅ La aplicación está lista para usarse sin conexión.`

2. **Desconectar internet**
   - Desactivar WiFi/desconectar cable de red
   - **NO cerrar el navegador**

3. **Recargar la página** (Ctrl+R)
   - La app debe cargar desde el caché
   - Todas las funcionalidades deben trabajar

4. **Probar el juego completo**
   - Iniciar trivia
   - Ver instrucciones con audio
   - Responder preguntas
   - Ver resultados

### Método 3: Modo Avión en Móvil

1. **Instalar como PWA** (opcional pero recomendado)
   - En Chrome móvil: Menú → "Add to Home Screen"
   - En escritorio: Icono de instalación en la barra de URL

2. **Abrir la app instalada**

3. **Activar modo avión**

4. **Usar la app normalmente**
   - Debe funcionar 100% offline

---

## 🔍 Verificación de Funcionalidades Offline

### ✅ DEBE funcionar sin internet:
- [x] Cargar la página principal
- [x] Navegar entre vistas (router hash)
- [x] Ver todas las imágenes del supervisor
- [x] Reproducir todos los audios
- [x] Ver el logo de SGS
- [x] Ver fondos y backgrounds
- [x] Iniciar juego de trivia
- [x] Ver instrucciones
- [x] Ver preguntas
- [x] Seleccionar respuestas
- [x] Ver feedback de respuestas
- [x] Ver resultados finales
- [x] Reiniciar juego
- [x] Timer con animación GSAP
- [x] Transiciones entre vistas

### ⚠️ Puede NO funcionar sin internet (esperado):
- [ ] Google Fonts en PRIMERA carga (usa fallback del sistema)
- [ ] SpeechSynthesis API (depende del navegador/SO)

---

## 🐛 Solución de Problemas

### El Service Worker no se registra
**Problema:** No aparece en DevTools
**Solución:**
1. Verificar que estás en HTTPS o localhost
2. Limpiar caché del navegador
3. Hard reload (Ctrl+Shift+R)

### La app no carga offline
**Problema:** Página en blanco sin internet
**Solución:**
1. Asegurarte de haber cargado la app AL MENOS UNA VEZ con internet
2. Verificar en DevTools → Application → Cache Storage que los archivos están cacheados
3. Si no están, recargar con internet y esperar a ver el mensaje "✅ La aplicación está lista"

### Los audios no suenan
**Problema:** No se escuchan los MP3
**Solución:**
1. Verificar que los audios están en caché (DevTools → Cache Storage → audios-trivia)
2. Verificar volumen del dispositivo
3. Algunos navegadores requieren interacción del usuario antes de reproducir audio

### Las imágenes no aparecen
**Problema:** Imágenes rotas
**Solución:**
1. Verificar precache en DevTools
2. Si es la primera carga, las imágenes pueden estar cargándose
3. Esperar a que termine la precarga

---

## 📊 Logs de Consola para Debugging

Cuando la app carga correctamente offline, deberías ver:

```javascript
✅ La aplicación está lista para usarse sin conexión.
Estado de conexión: ✅ En línea
// o
Estado de conexión: 📴 Sin conexión
```

Al cambiar entre online/offline:
```javascript
✅ Conexión restaurada
// o
📴 Modo offline activado
```

---

## 🎯 Checklist de Pruebas Rápidas

### Prueba #1: Primera Visita Offline
1. Instalar/cargar app CON internet ✅
2. Esperar mensaje de "lista para offline" ✅
3. Activar modo offline ✅
4. Recargar página ✅
5. **Resultado esperado:** App carga completamente ✅

### Prueba #2: Juego Completo Offline
1. Modo offline activado ✅
2. Iniciar trivia ✅
3. Ver instrucciones (con audio) ✅
4. Responder 5 preguntas ✅
5. Ver resultados ✅
6. **Resultado esperado:** Todo funciona sin errores ✅

### Prueba #3: Navegación Offline
1. Modo offline activado ✅
2. Navegar: Portada → Instrucciones → Pregunta → Respuesta → Resultado ✅
3. Botón "Volver al inicio" funciona ✅
4. **Resultado esperado:** Navegación fluida sin errores ✅

---

## 📝 Notas Importantes

1. **Primera carga SIEMPRE requiere internet** para registrar el Service Worker y cachear assets
2. **Google Fonts**: Si no se cargaron en la primera visita, se usan fuentes del sistema (se ve bien igual)
3. **SpeechSynthesis**: Es una API del navegador, puede o no funcionar offline dependiendo del SO
4. **Cómolerun**: Después de la primera carga, la app es 100% funcional sin internet

---

## 🚀 Próximos Pasos (Opcionales)

Para mejorar aún más la experiencia offline:

1. **Agregar icono de estado offline en la UI**
2. **Precache más agresivo de fonts** (descargar Inter localmente)
3. **Agregar IndexedDB para persistir puntajes**
4. **Background sync para sincronizar cuando vuelva internet**
5. **Agregar notificación push cuando hay actualizaciones**

---

## ✨ Estado Actual

**La aplicación es completamente funcional offline después de la primera carga.**

Todos los recursos críticos están precacheados:
- ✅ 7 imágenes del supervisor
- ✅ 8 archivos de audio
- ✅ JavaScript y CSS de la app
- ✅ Assets estáticos (logo, favicon, etc.)
- ✅ Configuración de preguntas (embebida en el bundle)

**La app funciona como una PWA completa con soporte offline total.** 🎉
