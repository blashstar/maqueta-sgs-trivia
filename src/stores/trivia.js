import { defineStore } from 'pinia';
import enrutador from '../router';
import configuracionJSON from '../../.cfg.json';

// Preparar las preguntas del JSON mapeando el indiceCorrecto a la propiedad 'correcta'
const todasLasPreguntas = configuracionJSON.preguntas.map(p => ({
  id: p.id,
  texto: p.texto,
  opciones: p.opciones,
  correcta: p.indiceCorrecto // Índice numérico de la respuesta correcta
}));

export const useTriviaStore = defineStore('trivia', {
  state: () => ({
    vistaActual: 'portada',
    puntuacion: 0,
    indicePreguntaActual: 0,
    preguntas: [], // Se llenará con prepararJuego()
    respuestaSeleccionada: null,
    esCorrecta: false,
    
    // Integración completa de la configuración del JSON
    configuracion: {
      ...configuracionJSON.configuracion,
      preguntasCargadas: todasLasPreguntas.length
    }
  }),
  actions: {
    // Nueva acción para seleccionar una cantidad aleatoria de preguntas
    prepararJuego() {
      // Validamos que tengamos preguntas cargadas antes de iniciar
      if (!todasLasPreguntas || todasLasPreguntas.length === 0) {
        console.error('No hay preguntas disponibles para preparar el juego.');
        return;
      }

      const cantidad = Math.min(
        this.configuracion.preguntasPorJuego || 5, 
        todasLasPreguntas.length
      );

      // Reiniciamos el estado del progreso para evitar inconsistencias si se llama en medio de un juego
      this.indicePreguntaActual = 0;
      this.puntuacion = 0;
      this.respuestaSeleccionada = null;
      this.esCorrecta = false;

      this.preguntas = [...todasLasPreguntas]
        .sort(() => Math.random() - 0.5)
        .slice(0, cantidad);
    },

    cambiarVista(vista) {
      this.vistaActual = vista;
      enrutador.push({ name: vista });
    },

    siguientePregunta() {
      if (this.indicePreguntaActual < this.preguntas.length - 1) {
        this.indicePreguntaActual++;
        this.respuestaSeleccionada = null;
        this.cambiarVista('pregunta');
      } else {
        this.cambiarVista('resultado');
      }
    },

    seleccionarRespuesta(respuesta) {
      const preguntaActual = this.preguntas[this.indicePreguntaActual];
      this.respuestaSeleccionada = respuesta;
      
      // Comparamos el texto seleccionado con el texto en el índice correcto
      const indiceSeleccionado = preguntaActual.opciones.indexOf(respuesta);
      this.esCorrecta = indiceSeleccionado === preguntaActual.correcta;
      
      if (this.esCorrecta) {
        this.puntuacion += this.configuracion.puntosPorAcierto;
      }
      this.cambiarVista('respuesta');
    },

    reiniciar() {
      this.prepararJuego(); // Barajar nuevas preguntas y resetear progreso
      this.cambiarVista('portada');
    }
  }
});
