import { createRouter, createWebHashHistory, createMemoryHistory } from 'vue-router';
import Portada from './components/views/Portada.vue';
import Instrucciones from './components/views/Instrucciones.vue';
import Pregunta from './components/views/Pregunta.vue';
import Respuesta from './components/views/Respuesta.vue';
import Resultado from './components/views/Resultado.vue';

const routes = [
  { path: '/', name: 'portada', component: Portada },
  { path: '/instrucciones', name: 'instrucciones', component: Instrucciones },
  { path: '/pregunta', name: 'pregunta', component: Pregunta },
  { path: '/respuesta', name: 'respuesta', component: Respuesta },
  { path: '/resultado', name: 'resultado', component: Resultado },
];

const esServidor = typeof window === 'undefined';

const enrutador = createRouter({
  history: esServidor ? createMemoryHistory() : createWebHashHistory(),
  routes,
});

export default enrutador;
