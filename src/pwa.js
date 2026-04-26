import { registerSW } from 'virtual:pwa-register';

let eventoInstalacionDiferido = null;

const estaInstaladaComoPWA = () => {
  const enModoStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const enIOSStandalone = window.navigator.standalone === true;
  return enModoStandalone || enIOSStandalone;
};

const solicitarInstalacionPWA = async () => {
  if (estaInstaladaComoPWA() || !eventoInstalacionDiferido) {
    return false;
  }

  eventoInstalacionDiferido.prompt();
  const { outcome } = await eventoInstalacionDiferido.userChoice;
  eventoInstalacionDiferido = null;
  return outcome === 'accepted';
};

window.addEventListener('beforeinstallprompt', (evento) => {
  evento.preventDefault();
  eventoInstalacionDiferido = evento;
});

window.addEventListener('appinstalled', () => {
  eventoInstalacionDiferido = null;
  console.log('✅ Aplicación instalada correctamente.');
});

window.__pwa = {
  estaInstaladaComoPWA,
  solicitarInstalacionPWA
};

// Registro del Service Worker con auto-actualización
registerSW({
  immediate: true,
  onNeedRefresh() {
    // Cuando hay nueva versión disponible
    console.log('🔄 Nueva versión disponible. La aplicación se actualizará automáticamente.');
    
    // Notificar al usuario (si tiene permisos)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Trivia SGS - Actualización', {
        body: '🔄 Nueva versión disponible. La app se actualizará en segundo plano.',
        icon: '/favicon.svg',
        badge: '/favicon.svg'
      });
    }
    
    // La actualización se descarga en segundo plano
    // El usuario no necesita recargar manualmente
  },
  onOfflineReady() {
    // Cuando el SW está listo para trabajar offline
    console.log('✅ Service Worker listo - App funcional offline');
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Trivia SGS', {
        body: '✅ App lista para uso offline',
        icon: '/favicon.svg'
      });
    }
  },
  onOnline() {
    // Cuando se recupera la conexión
    console.log('🌐 Conexión restaurada - Sincronizando...');
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Trivia SGS', {
        body: '🌐 Conexión restaurada',
        icon: '/favicon.svg'
      });
    }
  },
  onOffline() {
    // Cuando se pierde la conexión
    console.log('📴 Sin conexión - Usando caché local');
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Trivia SGS', {
        body: '📴 Sin conexión - La app sigue funcionando',
        icon: '/favicon.svg'
      });
    }
  },
  onRegisteredError(error) {
    // Error al registrar el SW
    console.error('❌ Error al registrar Service Worker:', error);
  },
  onRegistered(registration) {
    // SW registrado exitosamente
    console.log('✅ Service Worker registrado correctamente', registration);
    
    // Verificar actualizaciones periódicamente (cada 1 hora)
    if (registration) {
      setInterval(() => {
        console.log('🔍 Verificando actualizaciones...');
        registration.update();
      }, 60 * 60 * 1000); // 1 hora
    }
  },
  // Configuración para actualización automática
  // registerType: 'autoUpdate' está en astro.config.mjs
});
