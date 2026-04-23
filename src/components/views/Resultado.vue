<template lang="pug">
.view.resultado
  .contenedor-supervisor
    img.supervisor(:src="rutaImagenSupervisor")
  
  h2 ¡Juego Terminado!
  .score-card
    span.label Puntuación Final
    span.value {{ Math.floor(puntajeMostrado) }}%

  svg(width="0" height="0")
    filter#borde-glow
      feMorphology(
        in="SourceAlpha"
        operator="dilate"
        radius="16"
        result="borde"
      )
      feGaussianBlur(
        in="borde"
        stdDeviation="8"
        result="blur"
      )
      feFlood(
        flood-color="white"
        result="color"
      )
      feComposite(
        in="color"
        in2="blur"
        operator="in"
        result="glow"
      )
      feMerge
        feMergeNode(in="glow")
        feMergeNode(in="SourceGraphic")
  
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
  padding 0.5rem
  
  .contenedor-supervisor
    margin-bottom 0.5rem
    .supervisor
      width 50vw
      // max-width 200px
      height auto
      filter drop-shadow(0 10px 20px rgba(0,0,0,0.1))
      animation levitar 3s ease-in-out infinite alternate
      
      @media (min-width: 480px)
        width 40vw
        // max-width 250px
      
      @media (min-width: 768px)
        width 40vw
        // max-width 300px

  @keyframes levitar
    from
      transform translateY(0)
    to
      transform translateY(-15px)

  h2
    font-size 1.8rem
    color $sgs-gris-900
    margin-bottom 1rem
    
    @media (min-width: 480px)
      font-size 2.2rem
      margin-bottom 1.2rem
    
    @media (min-width: 768px)
      font-size 2.5rem
      margin-bottom 1.5rem

  .score-card
    background $sgs-blanco
    padding 1.5rem 1rem
    border-radius 12px
    border 1px solid rgba(0,0,0,0.05)
    box-shadow 0 10px 30px rgba(0,0,0,0.05)
    margin-bottom 1.5rem
    display flex
    flex-direction column
    justify-content center
    min-width auto
    // width 90%
    // max-width 280px
    box-sizing border-box

    
    @media (min-width: 480px)
      padding 2rem 1.5rem
      border-radius 14px
      // max-width 320px
    
    @media (min-width: 768px)
      padding 5vmin
      min-width 300px
      aspect-ratio 1;
      // max-width 400px
      border-radius 100%;
      margin-block 2vh
      box-shadow 0 0 10svh $sgs-carbon
    
    .label
      color $sgs-carbon
      text-transform uppercase
      letter-spacing 0.1em
      font-size 1rem
      font-weight $peso-negrita
      margin-bottom 0.5rem
      
      @media (min-width: 480px)
        font-size 1.1rem
      
      @media (min-width: 768px)
        font-size 1.5vh
    
    .value
      font-size 5rem
      font-weight $peso-negrita
      color $sgs-naranja
      line-height 1
      
      @media (min-width: 480px)
        font-size 7rem
      
      @media (min-width: 768px)
        font-size 10rem

  .mensaje
    color $sgs-carbon
    // text-shadow 0 0 1em black
    // filter: drop-shadow(0 0 1em black);
    // -webkit-text-stroke: 1px black;
    filter: url(#borde-glow);
    margin-bottom 1.5rem
    font-size 1.3rem
    max-width 95%
    margin-inline auto
    font-weight bold
    line-height 1.3
    text-wrap: balance
    
    @media (min-width: 480px)
      font-size 1.6rem
      max-width 90%
    
    @media (min-width: 768px)
      font-size 2.5vh
      max-width 80%
      margin-bottom 2.5rem

  button
    @extend .boton-primario
    font-size 1.2vh
    padding 0.75rem 2rem
    
    @media (max-width: 480px)
      font-size 1.5vh
      padding 0.5rem 1.5rem
    
    @media (min-width: 768px)
      font-size 2vh
      padding 1rem 3rem
</style>
