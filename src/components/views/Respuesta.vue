<template lang="pug">
.view.respuesta
  .feedback(:class="{ correct: store.esCorrecta, incorrect: !store.esCorrecta }")
    h2 {{ store.esCorrecta ? '¡Correcto!' : 'Incorrecto' }}
    p.answer-text La respuesta correcta era: 
      b {{ preguntaActual.opciones[preguntaActual.correcta] }}
  
  button(@click="siguiente") {{ esUltima ? 'Ver Resultados' : 'Siguiente Pregunta' }}
</template>

<script setup>
import { computed } from 'vue';
import { useTriviaStore } from '../../stores/trivia';
const store = useTriviaStore();

const preguntaActual = computed(() => store.preguntas[store.indicePreguntaActual]);
const esUltima = computed(() => store.indicePreguntaActual === store.preguntas.length - 1);

const siguiente = () => {
  if (esUltima.value) {
    store.cambiarVista('resultado');
  } else {
    store.siguientePregunta();
  }
};
</script>

<style lang="stylus" scoped>
@import '../../styles/common.styl'

.respuesta
  text-align center
  
  .feedback
    padding 3rem
    border-radius 16px
    margin-bottom 2rem
    background rgba(255, 255, 255, 0.9)
    border 1px solid rgba(0,0,0,0.05)
    
    &.correct
      border-left 8px solid $sgs-verde
      h2
        color $sgs-verde
    
    &.incorrect
      border-left 8px solid $sgs-rojo
      h2
        color $sgs-rojo

  .answer-text
    color $sgs-carbon
    margin-top 1rem
    font-size 1.2rem
    b
      color $sgs-gris-900
      display block
      font-size 1.5rem
      margin-top 0.5rem

  button
    @extend .boton-primario
</style>
