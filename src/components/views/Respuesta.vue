<template lang="pug">
.view.respuesta(v-if="preguntaMostrada")
  .tarjeta(:class="{ correcta: esCorrectaMostrada, incorrecta: !esCorrectaMostrada }")
    h2 {{ esCorrectaMostrada ? '¡Correcto!' : '' }}
    p.answer-text La respuesta correcta era: 
      b {{ preguntaMostrada.opciones[preguntaMostrada.correcta] }}
    .imagen
      img(:src="esCorrectaMostrada ? '/assets/img/supervisor-afirma.png' : '/assets/img/supervisor-apunta.png'")
  
  button(@click="siguiente") {{ esUltima ? 'Ver Resultados' : 'Siguiente Pregunta' }}
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useTriviaStore } from '../../stores/trivia';

const store = useTriviaStore();

const preguntaMostrada = ref(null);
const esCorrectaMostrada = ref(false);
const esUltima = computed(() => store.indicePreguntaActual === store.preguntas.length - 1);

const leerRespuesta = () => {
  if (!preguntaMostrada.value) return;
  
  const textoRespuesta = preguntaMostrada.value.opciones[preguntaMostrada.value.correcta];
  const texto = esCorrectaMostrada.value ? '¡Correcto!' : 'La respuesta correcta era: ';

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
  const preguntaActual = store.preguntas[store.indicePreguntaActual];
  if (!preguntaActual) {
    store.cambiarVista('pregunta');
    return;
  }

  // Congela el contenido mostrado para evitar que cambie durante la transición de vista.
  preguntaMostrada.value = preguntaActual;
  esCorrectaMostrada.value = store.esCorrecta;

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
  padding 0.5rem
  
  .tarjeta
    padding 1.5rem
    border-radius 12px
    margin-bottom 1.5rem
    background rgba(255, 255, 255, 0.9)
    border 1px solid rgba(0,0,0,0.05)
    display flex
    flex-direction column
    align-items center
    max-width 100%
    box-sizing border-box
    
    @media (min-width: 600px)
      display grid
      grid-template-columns 1fr 35%
      grid-template-rows auto 1fr
      grid-template-areas "titulo imagen" "texto imagen"
      justify-content center
      align-items start
      padding 2rem
    
    @media (min-width: 768px)
      padding 3rem
      border-radius 16px
    
    &.correcta
      border-left 6px solid $sgs-verde
      
      @media (min-width: 768px)
        border-left 8px solid $sgs-verde
      
      h2
        color $sgs-verde
    
    &.incorrecta
      border-left 6px solid $sgs-rojo
      
      @media (min-width: 768px)
        border-left 8px solid $sgs-rojo
      
      h2
        color $sgs-rojo
  
  h2
    font-size 1.8rem
    margin-bottom 1rem
    
    @media (min-width: 480px)
      font-size 2.2rem
    
    @media (min-width: 768px)
      font-size 2.5rem

  .imagen
    width 50%
    // max-width 200px
    margin 1rem 0
    align-self end
    
    @media (min-width: 600px)
      grid-area imagen
      width 100%
      margin 0

    img
      width 100%
      height auto
    

  .answer-text
    color $sgs-carbon
    margin-top 0.5rem
    font-size 1.2rem
    line-height 1.4
    
    @media (min-width: 480px)
      font-size 1.5rem
      margin-top 1rem
    
    @media (min-width: 768px)
      font-size 2vh
    
    b
      color $sgs-gris-900
      display block
      font-size 1.4rem
      margin-top 0.5rem
      word-wrap break-word
      
      @media (min-width: 480px)
        font-size 2vh
      
      @media (min-width: 768px)
        font-size 3vh

  button
    font-size 1.2rem
    padding 0.75rem 2rem
    min-width 200px
    max-width 90%
    
    @media (max-width: 480px)
      font-size 1rem
      padding 0.5rem 1.5rem
      min-width 180px
    
    @media (min-width: 768px)
      font-size 2vh
      padding 1rem 3rem
      min-width 250px

</style>
