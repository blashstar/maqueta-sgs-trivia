import enrutador from './router';
import { createPinia } from 'pinia';
import { imagenesTrivia, precargarImagenes } from './utils/imagenes';
import { configurarMonitorConexion } from './utils/conexion';

export default (app) => {
  if (typeof window !== 'undefined') {
    precargarImagenes(imagenesTrivia);
    configurarMonitorConexion();
  }

  const pinia = createPinia();
  app.use(pinia);
  app.use(enrutador);
};
