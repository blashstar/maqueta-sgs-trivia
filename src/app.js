import enrutador from './router';
import { createPinia } from 'pinia';
import { imagenesTrivia, precargarImagenes } from './utils/imagenes';

export default (app) => {
  if (typeof window !== 'undefined') {
    precargarImagenes(imagenesTrivia);
  }

  const pinia = createPinia();
  app.use(pinia);
  app.use(enrutador);
};
