<template lang="pug">
.vista.instrucciones: .tarjeta
  h2 Instrucciones
  .contenido
    img.supervisor(src="/assets/img/supervisor-diciendo.png")
    .boca
      .burbuja(ref="burbujaRef")
        span.texto {{ textoBurbuja }}
  button(@click="comenzar") ¡Entendido!
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useTriviaStore } from '../../stores/trivia';
import { Howl, Howler } from 'howler';
import gsap from 'gsap';

const store = useTriviaStore();
const textoBurbuja = ref('');
const burbujaRef = ref(null);
let secuenciaActiva = true;

const comenzar = () => {
  secuenciaActiva = false;
  Howler.stop(); // Detener todos los audios en reproducción
  store.cambiarVista('pregunta');
};

/**
 * Función hablar: 
 * - Actualiza el texto de la burbuja y lo anima con GSAP.
 * - Reproduce el audio usando Howler.js.
 * - Retorna una promesa que se resuelve cuando el audio termina o se cancela.
 */
const hablar = (texto, audioRuta) => {
  return new Promise((resolve) => {
    if (!secuenciaActiva) return resolve();

    // Animación de salida (si ya había texto)
    gsap.to(burbujaRef.value, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        if (!secuenciaActiva) return resolve();
        
        textoBurbuja.value = texto;
        
        // Animación de entrada
        gsap.to(burbujaRef.value, {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: 'back.out(1.7)'
        });

        if (audioRuta && secuenciaActiva) {
          const sonido = new Howl({
            src: [audioRuta],
            autoplay: true,
            onend: () => {
              // Esperamos un segundo después del audio para mayor naturalidad
              if (secuenciaActiva) {
                setTimeout(resolve, 800);
              } else {
                resolve();
              }
            },
            onloaderror: resolve,
            onplayerror: resolve
          });
        } else {
          resolve();
        }
      }
    });
  });
};

const listaInstrucciones = [
  {
    texto: `Debes responder ${store.configuracion.preguntasPorJuego} preguntas en total.`,
    audio: '/assets/sonidos/preguntas.mp3'
  },
  {
    texto: `Tienes ${store.configuracion.tiempoPorPregunta} segundos por pregunta.`,
    audio: '/assets/sonidos/tiempo.mp3'
  },
  {
    texto: `Cada acierto suma ${store.configuracion.puntosPorAcierto} puntos.`,
    audio: '/assets/sonidos/puntaje.mp3'
  }
];

/**
 * Ejecuta la secuencia de instrucciones una por una.
 */
const ejecutarSecuencia = async () => {
  for (const instruccion of listaInstrucciones) {
    if (!secuenciaActiva) break;
    await hablar(instruccion.texto, instruccion.audio);
  }
  // Al terminar, si la secuencia sigue activa, ocultamos la burbuja
  if (secuenciaActiva) {
    gsap.to(burbujaRef.value, { scale: 0, opacity: 0, duration: 0.3 });
  }
};

onMounted(() => {
  // Inicializamos la burbuja oculta
  gsap.set(burbujaRef.value, { scale: 0, opacity: 0 });
  ejecutarSecuencia();
});

onUnmounted(() => {
  secuenciaActiva = false;
  Howler.stop();
});
</script>

<style lang="stylus" scoped>
@import '../../styles/common.styl'

.instrucciones
  .tarjeta
    box-sizing border-box
    text-align center
    max-width 100%
    padding 1rem
    
    @media (min-width: 480px)
      max-width 95vw
      padding 2rem
    
    @media (min-width: 768px)
      max-width 85vw
      padding-inline: 10vw
  
  h2
    color $sgs-naranja
    margin-bottom 1rem
    padding-bottom 0.5rem
    font-size 1.8rem
    
    @media (min-width: 480px)
      font-size 2.5rem

  .contenido
    max-width 100%
    margin-inline auto
    position relative
    margin-bottom 1rem
    
    @media (min-width: 480px)
      max-width 80vw
    
    @media (min-width: 768px)
      max-width 60vw

  .supervisor
    width 80vw
    max-width 320px
    height auto
    display block
    margin 0 auto

  .boca
    position: absolute
    top: 31%
    left: 51%
    width 1px
    height: 1px

  .burbuja
    background-color: $sgs-azul-500
    position: absolute
    top -4rem
    left 0
    width 8rem
    padding 1.5rem 1rem
    border-radius 100%
    display: flex
    align-items: center
    justify-content: center
    text-align: center
    color: $sgs-blanco
    font-size: 1rem
    transform-origin bottom left
    
    @media (min-width: 480px)
      top -5rem
      left 1rem
      width 9rem
      padding 2rem 1.5rem
      font-size 1.2rem
    
    @media (min-width: 768px)
      top -6rem
      left 3rem
      width 10rem
      padding 3rem 2rem
      font-size 1.5rem

    &::before
      content ''
      position absolute
      left -1rem
      width 0
      height 0
      border-right: 1.5rem solid $sgs-azul-500
      border-top 1rem solid transparent
      border-bottom 0.5rem solid transparent
      
      @media (min-width: 768px)
        left -1.5rem
        border-right: 2rem solid $sgs-azul-500
        border-top 1.5rem solid transparent
    
    .texto
      text-wrap balance

  button
    @extend .boton-primario
    width 100%
    max-width 320px
    font-size 1.3rem
    padding 0.75rem 2rem
    
    @media (max-width: 480px)
      font-size 1rem
      padding 0.5rem 1.5rem
</style>
