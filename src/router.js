import { createRouter, createWebHashHistory, createMemoryHistory } from 'vue-router';
import Portada from './components/views/Portada.vue';
import Instrucciones from './components/views/Instrucciones.vue';
import Pregunta from './components/views/Pregunta.vue';
import Respuesta from './components/views/Respuesta.vue';
import Resultado from './components/views/Resultado.vue';
import Registro from './components/views/Registro.vue';
import Listado from './components/views/Listado.vue';

const routes = [
  { path: '/', name: 'portada', component: Portada },
  { path: '/instrucciones', name: 'instrucciones', component: Instrucciones },
  { path: '/pregunta', name: 'pregunta', component: Pregunta },
  { path: '/respuesta', name: 'respuesta', component: Respuesta },
  { path: '/resultado', name: 'resultado', component: Resultado },
  { path: '/registro', name: 'registro', component: Registro },
  { path: '/listado', name: 'listado', component: Listado },
];

const esServidor = typeof window === 'undefined';

const enrutador = createRouter({
  history: esServidor ? createMemoryHistory() : createWebHashHistory(),
  routes,
});

export default enrutador;
