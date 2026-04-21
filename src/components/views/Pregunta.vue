<template lang="pug">
.vista.pregunta
  .tarjeta
    .header
      span Pregunta {{ store.indicePreguntaActual + 1 }} de {{ store.preguntas.length }}
      span Puntos: {{ store.puntuacion }}
    
    //- Solo mostramos el contenido si hay una pregunta cargada
    div(v-if="preguntaActual && preguntaActual.texto")
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
    align-items: stretch
    justify-self: stretch
    
  
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

  .texto
    color $sgs-naranja
    font-size 2rem
    line-height 1.5
    margin-bottom: 2em
    display: flex
    gap 1rem

    img
      width: 20%
      flex 0 0 20%
      object-fit: contain
      object-position: bottom

    span
      flex 1 1 auto;

  .tiempo-container
    box-sizing border-box
    width 100%
    display flex
    justify-content center
    margin-bottom 3rem
    height 4rem
    align-items center

  .tiempo
    width 100%
    box-sizing border-box
    height 4rem
    background $sgs-naranja
    border-radius 2rem
    display flex
    align-items center
    justify-content center
    color $sgs-blanco
    font-size 1.8rem
    font-weight $peso-negrita
    box-shadow 0 10px 20px rgba(202, 67, 0, 0.2)
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
    gap 1rem
    width 100%
    
    .option
      background $sgs-azul-100
      border 1px solid $sgs-naranja
      text-align left
      font-size 2rem
      line-height: 1.5
      padding 1rem 1.5em
      border-radius 1em
      color $sgs-carbon
      transition all 0.2s ease
      
      &:hover
        background $sgs-naranja
        color $sgs-blanco
        border-color $sgs-naranja
        transform translateY(-2px)
        box-shadow 0 5px 15px rgba(202, 67, 0, 0.2)
</style>
