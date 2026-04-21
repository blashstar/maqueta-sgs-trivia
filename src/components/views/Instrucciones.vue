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
import { ref, onMounted } from 'vue';
import { useTriviaStore } from '../../stores/trivia';
import { Howl } from 'howler';
import gsap from 'gsap';

const store = useTriviaStore();
const textoBurbuja = ref('');
const burbujaRef = ref(null);

const comenzar = () => {
  store.cambiarVista('pregunta');
};

/**
 * Función hablar: 
 * - Actualiza el texto de la burbuja y lo anima con GSAP.
 * - Reproduce el audio usando Howler.js.
 * - Retorna una promesa que se resuelve cuando el audio termina.
 */
const hablar = (texto, audioRuta) => {
  return new Promise((resolve) => {
    // Animación de salida (si ya había texto)
    gsap.to(burbujaRef.value, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        textoBurbuja.value = texto;
        
        // Animación de entrada
        gsap.to(burbujaRef.value, {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: 'back.out(1.7)'
        });

        if (audioRuta) {
          const sonido = new Howl({
            src: [audioRuta],
            autoplay: true,
            onend: () => {
              // Esperamos un segundo después del audio para mayor naturalidad
              setTimeout(resolve, 800);
            }
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
    await hablar(instruccion.texto, instruccion.audio);
  }
  // Al terminar, ocultamos la burbuja
  gsap.to(burbujaRef.value, { scale: 0, opacity: 0, duration: 0.3 });
};

onMounted(() => {
  // Inicializamos la burbuja oculta
  gsap.set(burbujaRef.value, { scale: 0, opacity: 0 });
  ejecutarSecuencia();
});
</script>

<style lang="stylus" scoped>
@import '../../styles/common.styl'

.instrucciones
  .tarjeta
    box-sizing border-box
    text-align left
    max-width 85vw
    padding-inline: 15vw;
  
  h2
    color $sgs-naranja
    margin-bottom 1.5rem
    padding-bottom 0.5rem
    font-size 2rem

  .contenido
    max-width: 60vw
    margin-inline: auto
    position relative

  .supervisor
    width 100%

  .boca
    position: absolute
    top: 31%
    left: 51%
    width 1px
    height: 1px

  .burbuja
    background-color: $sgs-azul-500
    position: absolute
    top -100px
    left 50px
    width 25vw
    padding 6vw 4vw
    border-radius 100%
    display: flex
    align-items: center
    justify-content: center
    text-align: center
    color: $sgs-blanco
    font-size: 1.5rem
    transform-origin bottom left

    &::before
      content ''
      position absolute
      top 90px
      left -25px
      width 0
      height 0
      border-right: 40px solid $sgs-azul-500
      border-top 10px solid transparent
      border-bottom 30px solid transparent
    
    .texto
      text-wrap balance

  button
    @extend .boton-primario
    width 100%
</style>
