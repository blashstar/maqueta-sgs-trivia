<template lang="pug">
.vista.pregunta
  .glass-container
    .header
      span Pregunta {{ store.indicePreguntaActual + 1 }} de {{ store.preguntas.length }}
      span Puntos: {{ store.puntuacion }}
    
    //- Solo mostramos el contenido si hay una pregunta cargada
    div(v-if="preguntaActual && preguntaActual.texto")
      h3 {{ preguntaActual.texto }}
      
      .options
        button.option(
          v-for="opt in preguntaActual.opciones" 
          :key="opt"
          @click="seleccionar(opt)"
        ) {{ opt }}
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useTriviaStore } from '../../stores/trivia';
const store = useTriviaStore();

const preguntaActual = computed(() => {
  return store.preguntas[store.indicePreguntaActual] || null;
});

const seleccionar = (opt) => {
  store.seleccionarRespuesta(opt);
};

onMounted(() => {
  // Verificamos si hay preguntas seleccionadas. Si no, las preparamos.
  if (!store.preguntas || store.preguntas.length === 0) {
    store.prepararJuego();
  }
});
</script>

<style lang="stylus" scoped>
@import '../../styles/common.styl'

.pregunta
  width 100%
  max-width 700px

  .glass-container
    background rgba(255, 255, 255, 0.9)
    backdrop-filter blur(16px)
    border 1px solid rgba(255, 255, 255, 0.5)
    padding 3rem
    border-radius 16px
    box-shadow 0 20px 40px rgba(0, 0, 0, 0.05)
  
  .header
    display flex
    justify-content space-between
    color $sgs-carbon
    font-size 0.9rem
    font-weight $peso-negrita
    margin-bottom 2rem
    text-transform uppercase
    letter-spacing 1px
    border-bottom 1px solid rgba(0,0,0,0.05)
    padding-bottom 1rem

  h3
    font-size 2rem
    color $sgs-gris-900
    margin-bottom 2.5rem
    line-height 1.3
    text-align center

  .options
    display grid
    gap 1rem
    width 100%
    
    .option
      background $sgs-azul-100
      border 1px solid rgba(0,0,0,0.05)
      text-align left
      font-size 1.15rem
      padding 1.25rem 1.5rem
      border-radius 8px
      color $sgs-carbon
      transition all 0.2s ease
      
      &:hover
        background $sgs-naranja
        color $sgs-blanco
        border-color $sgs-naranja
        transform translateY(-2px)
        box-shadow 0 5px 15px rgba(202, 67, 0, 0.2)
</style>
