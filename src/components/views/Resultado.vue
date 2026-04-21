<template lang="pug">
.view.resultado
  .contenedor-supervisor
    img.supervisor(:src="rutaImagenSupervisor")
  
  h2 ¡Juego Terminado!
  .score-card
    span.label Puntuación Final
    span.value {{ Math.floor(puntajeMostrado) }}%
  
  p.mensaje {{ textoRetroalimentacion }}
  
  button(@click="reiniciar") Reiniciar
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useTriviaStore } from '../../stores/trivia';
import { Howl, Howler } from 'howler';
import gsap from 'gsap';

const store = useTriviaStore();
const puntajeMostrado = ref(0);
const puntajeFinal = store.puntuacion;

const rutaImagenSupervisor = computed(() => {
  return puntajeFinal <= 40 
    ? '/assets/img/supervisor-diciendo.png' 
    : '/assets/img/supervisor-ok.png';
});

const textoRetroalimentacion = computed(() => {
  if (puntajeFinal <= 40) {
    return "Falta reforzar tu compromiso con la seguridad.";
  } else {
    return "Tu nivel de seguridad es de compromiso.";
  }
});

const rutaAudio = computed(() => {
  if (puntajeFinal <= 40) {
    return '/assets/sonidos/falta_reforzar.mp3';
  } else if (puntajeFinal >= 60) {
    return '/assets/sonidos/nivel_compromiso.mp3';
  }
  return null;
});

let sonido = null;

const reiniciar = () => {
  store.reiniciar();
};

onMounted(() => {
  // Animación del puntaje
  gsap.to(puntajeMostrado, {
    value: puntajeFinal,
    duration: 2,
    ease: "power2.in",
  });

  // Reproducción de audio
  if (rutaAudio.value) {
    sonido = new Howl({
      src: [rutaAudio.value],
      autoplay: true,
      volume: 1,
      onend: () => {
        console.log('Audio finalizado');
      }
    });
  }
});

onUnmounted(() => {
  if (sonido) {
    sonido.stop();
    sonido.unload();
  }
  Howler.stop();
});
</script>

<style lang="stylus" scoped>
@import '../../styles/common.styl'

.resultado
  text-align center
  display flex
  flex-direction column
  align-items center
  
  .contenedor-supervisor
    margin-bottom 1rem
    .supervisor
      width 35vw
      height auto
      filter drop-shadow(0 10px 20px rgba(0,0,0,0.1))
      animation levitar 3s ease-in-out infinite alternate

  @keyframes levitar
    from
      transform translateY(0)
    to
      transform translateY(-15px)

  h2
    font-size 2.5rem
    color $sgs-gris-900
    margin-bottom 1.5rem

  .score-card
    background $sgs-blanco
    padding 2.5rem 2rem
    border-radius 16px
    border 1px solid rgba(0,0,0,0.05)
    box-shadow 0 20px 40px rgba(0,0,0,0.05)
    margin-bottom 2rem
    display flex
    flex-direction column
    min-width 300px
    
    .label
      color $sgs-carbon
      text-transform uppercase
      letter-spacing 0.1em
      font-size 1.2rem
      font-weight $peso-negrita
      margin-bottom 0.5rem
    
    .value
      font-size 10rem
      font-weight $peso-negrita
      color $sgs-naranja

  .mensaje
    color $sgs-carbon
    margin-bottom 2.5rem
    font-size 2rem
    max-width 80%
    margin-inline auto
    font-weight $peso-medio
    line-height 1.4
    text-wrap: balance

  button
    @extend .boton-primario
    font-size 1.2rem
    padding 1rem 3rem
</style>
