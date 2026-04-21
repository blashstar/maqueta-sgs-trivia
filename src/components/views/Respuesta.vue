<template lang="pug">
.view.respuesta(v-if="preguntaActual")
  .tarjeta(:class="{ correcta: esCorrecta, incorrecta: !esCorrecta }")
    h2 {{ esCorrecta ? '¡Correcto!' : '' }}
    p.answer-text La respuesta correcta era: 
      b {{ preguntaActual.opciones[preguntaActual.correcta] }}
    .imagen
      img(:src="esCorrecta ? '/assets/img/supervisor-afirma.png' : '/assets/img/supervisor-apunta.png'")
  
  button(@click="siguiente") {{ esUltima ? 'Ver Resultados' : 'Siguiente Pregunta' }}
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { useTriviaStore } from '../../stores/trivia';

const store = useTriviaStore();

const esCorrecta = computed(() => store.esCorrecta);
const preguntaActual = computed(() => store.preguntas[store.indicePreguntaActual]);
const esUltima = computed(() => store.indicePreguntaActual === store.preguntas.length - 1);

const leerRespuesta = () => {
  if (!preguntaActual.value) return;
  
  const textoRespuesta = preguntaActual.value.opciones[preguntaActual.value.correcta];
  const texto = esCorrecta.value ? '¡Correcto!' : 'La respuesta correcta era: ';

  const mensaje = new SpeechSynthesisUtterance(`${texto} ${textoRespuesta}`);
  mensaje.lang = 'es-ES';
  mensaje.rate = 1;
  window.speechSynthesis.speak(mensaje);
};

const siguiente = () => {
  window.speechSynthesis.cancel();
  if (esUltima.value) {
    store.cambiarVista('resultado');
  } else {
    store.siguientePregunta();
  }
};

onMounted(() => {
  if (!preguntaActual.value) {
    store.cambiarVista('pregunta');
    return;
  }
  leerRespuesta();
});

onUnmounted(() => {
  window.speechSynthesis.cancel();
});
</script>

<style lang="stylus" scoped>
@import '../../styles/common.styl'

.respuesta
  text-align center
  
  .tarjeta
    padding 3rem
    border-radius 16px
    margin-bottom 2rem
    background rgba(255, 255, 255, 0.9)
    border 1px solid rgba(0,0,0,0.05)
    display grid
    grid-template-columns 1fr 25%
    grid-template-rows auto 1fr
    grid-template-areas "titulo imagen" "texto imagen"
    justify-content: center
    
    &.correcta
      border-left 8px solid $sgs-verde
      h2
        color $sgs-verde
    
    &.incorrecta
      border-left 8px solid $sgs-rojo
      h2
        color $sgs-rojo

  .imagen
    grid-area imagen

    img
      width 100%
      height auto
    

  .answer-text
    color $sgs-carbon
    margin-top 1rem
    font-size 2rem
    b
      color $sgs-gris-900
      display block
      font-size 2.5rem
      margin-top 0.5rem

</style>
