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
  console.log('Aplicación instalada correctamente.');
});

window.__pwa = {
  estaInstaladaComoPWA,
  solicitarInstalacionPWA
};

registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('Nuevo contenido disponible. Por favor, recarga la página.');
  },
  onOfflineReady() {
    console.log('✅ La aplicación está lista para usarse sin conexión.');
    // Mostrar notificación al usuario
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Trivia SGS', {
        body: '✅ App lista para uso offline',
        icon: '/favicon.svg'
      });
    }
  },
  onRegisteredError(error) {
    console.error('❌ Error al registrar el Service Worker:', error);
  },
});
