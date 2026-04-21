import { registerSW } from 'virtual:pwa-register';

registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('Nuevo contenido disponible. Por favor, recarga la página.');
  },
  onOfflineReady() {
    console.log('La aplicación está lista para usarse sin conexión.');
  },
});
