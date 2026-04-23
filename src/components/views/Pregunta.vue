<template lang="pug">
.vista.pregunta
  .tarjeta
    .header
      span Pregunta {{ store.indicePreguntaActual + 1 }} de {{ store.preguntas.length }}
      span Puntos: {{ store.puntuacion }}
    
    //- Solo mostramos el contenido si hay una pregunta cargada
    div.contenido(v-if="preguntaActual && preguntaActual.texto")
      .texto 
        img(src="/assets/img/supervisor-pensando.png")
        span {{ preguntaActual.texto }} 
      
      .tiempo-container
        .tiempo(ref="barraTiempo", :class="{ 'es-circulo': tiempoRestante === 0 }")
          span {{ tiempoRestante }}

      .options
        button.option(
          v-for="opt in preguntaActual.opciones" 
          :key="opt"
          @click="seleccionar(opt)"
        ) {{ opt }}
</template>

<script setup>
import { computed, onMounted, ref, onUnmounted, watch } from 'vue';
import { useTriviaStore } from '../../stores/trivia';
import gsap from 'gsap';

const store = useTriviaStore();

const barraTiempo = ref(null);
const tiempoRestante = ref(store.configuracion.tiempoPorPregunta || 10);
const tiempoTotal = store.configuracion.tiempoPorPregunta || 10;
let animacion = null;
let esperaFinal = null;

const iniciarReloj = () => {
  if (animacion) animacion.kill();
  if (esperaFinal) esperaFinal.kill();
  
  // Resetear estados iniciales antes de la animación
  tiempoRestante.value = tiempoTotal;
  gsap.set(barraTiempo.value, { 
    width: '100%', 
    borderRadius: '2rem',
    backgroundColor: '#CA4300' // sgs-naranja
  });

  animacion = gsap.to(barraTiempo.value, {
    width: '1%', // El tamaño del círculo (debe coincidir con el min-width en el CSS)
    duration: tiempoTotal,
    ease: 'none',
    onUpdate: () => {
      // Sincronizamos el número con el progreso de la barra
      tiempoRestante.value = Math.ceil(tiempoTotal * (1 - animacion.progress()));
    },
    onComplete: () => {
      // Acción al terminar el tiempo: cambiar color a rojo
      gsap.to(barraTiempo.value, {
        backgroundColor: '#F5262E', // sgs-rojo
        duration: 0.3
      });

      // Esperar un segundo y pasar a la respuesta (incorrecta)
      esperaFinal = gsap.delayedCall(1, () => {
        store.seleccionarRespuesta(null);
      });
    }
  });
};

const preguntaActual = computed(() => {
  return store.preguntas[store.indicePreguntaActual] || null;
});

const seleccionar = (opt) => {
  if (animacion) animacion.pause();
  if (esperaFinal) esperaFinal.kill();
  store.seleccionarRespuesta(opt);
};

onMounted(() => {
  if (!store.preguntas || store.preguntas.length === 0) {
    store.prepararJuego();
  }
  
  // Un pequeño retraso para asegurar que el DOM esté listo
  setTimeout(() => {
    iniciarReloj();
  }, 100);
});

onUnmounted(() => {
  if (animacion) animacion.kill();
});

watch(() => store.indicePreguntaActual, () => {
  iniciarReloj();
});
</script>

<style lang="stylus" scoped>
@import '../../styles/common.styl'

.pregunta
  width 100%

  .glass-container
    background rgba(255, 255, 255, 0.9)
    backdrop-filter blur(16px)
    border 1px solid rgba(255, 255, 255, 0.5)
    padding 3rem
    border-radius 16px
    box-shadow 0 20px 40px rgba(0, 0, 0, 0.05)

  .tarjeta
    max-height 95vh
    align-items stretch
    justify-self: stretch
    padding 1rem
    box-sizing border-box
    justify-content start
    
    @media (min-width: 480px)
      padding 2rem
    
    @media (min-width: 768px)
      padding 4rem 3rem
      aspect-ratio 3/4

  
  .header
    display flex
    justify-content space-between
    color $sgs-carbon
    font-size 0.75rem
    font-weight $peso-negrita
    margin-bottom 1rem
    text-transform uppercase
    letter-spacing 1px
    border-bottom 1px solid rgba(0,0,0,0.05)
    padding-bottom 0.5rem
    
    @media (min-width: 480px)
      font-size 1.5vh
      margin-bottom 1.5rem
      padding-bottom 1rem

  .contenido
    flex 1 1 auto
    display flex
    flex-direction column
    justify-content center

  .texto
    color $sgs-naranja
    font-size 1.2rem
    line-height 1.3
    margin-bottom: 1rem
    display: flex
    gap 3vw
    align-items flex-start
    text-align left
    
    @media (min-width: 480px)
      font-size 1.5rem
      margin-bottom: 1.5rem
    
    @media (min-width: 768px)
      font-size 2vh
      line-height 1.5
      margin-bottom: 2em

    img
      width: 20%
      flex 0 0 20%
      // max-width 80px
      object-fit: contain
      object-position: bottom
      
      @media (min-width: 768px)
        width: 30%
        flex 0 0 30%

    span
      flex 1 1 auto;
      text-wrap balance

  .tiempo-container
    box-sizing border-box
    width 100%
    display flex
    justify-content center
    margin-bottom 1.5rem
    height 3rem
    align-items center
    
    @media (min-width: 480px)
      margin-bottom 2rem
      height 3.5rem
    
    @media (min-width: 768px)
      margin-bottom 3rem
      height 4rem

  .tiempo
    width 100%
    box-sizing border-box
    height 3rem
    background $sgs-naranja
    border-radius 1.5rem
    display flex
    align-items center
    justify-content center
    color $sgs-blanco
    font-size 1.4rem
    font-weight $peso-negrita
    box-shadow 0 10px 20px rgba(202, 67, 0, 0.2)
    min-width 3rem
    
    @media (min-width: 480px)
      height 3.5rem
      font-size 1.6rem
      min-width 3.5rem
    
    @media (min-width: 768px)
      height 4rem
      font-size 1.8rem
      border-radius 2rem
      min-width 4rem
    
    &.es-circulo
      animation pulse .3s infinite alternate

  @keyframes pulse
    from
      transform scale(1)
      box-shadow 0 0 0 0 rgba(245, 38, 46, 0.4)
    to
      transform scale(1.1)
      box-shadow 0 0 20px 10px rgba(245, 38, 46, 0)

  .options
    display flex
    flex-direction column
    gap 0.5rem
    width 100%
    
    @media (min-width: 480px)
      gap 0.75rem
    
    @media (min-width: 768px)
      gap 1rem
    
    .option
      background $sgs-azul-100
      border 1px solid $sgs-naranja
      text-align left
      font-size 1.1rem
      line-height: 1.4
      padding 0.875rem 1.25rem
      border-radius 0.75em
      color $sgs-carbon
      transition all 0.2s ease
      word-wrap break-word
      
      @media (max-width: 480px)
        font-size 1rem
        padding 0.75rem 1rem
      
      @media (min-width: 768px)
        font-size 1.6rem
        line-height: 1.5
        padding 1rem 1.5em
        border-radius 1em
      
      @media (min-width: 1080px)
        font-size 1.8rem
      
      &:hover
        background $sgs-naranja
        color $sgs-blanco
        border-color $sgs-naranja
        transform translateY(-2px)
        box-shadow 0 5px 15px rgba(202, 67, 0, 0.2)
</style>
