import enrutador from './router';
import { createPinia } from 'pinia';

export default (app) => {
  const pinia = createPinia();
  app.use(pinia);
  app.use(enrutador);
};
