<template lang="pug">
.view.portada
  .modal-bienvenida(v-if="mostrarModalBienvenida")
    .modal-bienvenida__contenido
      h2 Preparación inicial
      p
        | Para una mejor experiencia en la pantalla táctil, instala la aplicación
        |  y habilita el modo de pantalla completa.
      p
        | Presiona el botón para continuar y habilitar la interacción.
      button.modal-bienvenida__boton(@click="entenderYContinuar") Entendido

  .tarjeta
    h1 Mide tu compromiso #[br] con la seguridad
    img.supervisor(v-if="imagenPortadaLista" src="/assets/img/supervisor-ok.png")
    button.btn-inicio(@click="iniciar" :disabled="mostrarModalBienvenida") Iniciar
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useTriviaStore } from '../../stores/trivia';
import { precargarImagen } from '../../utils/imagenes';
const store = useTriviaStore();
const CLAVE_BIENVENIDA = 'trivia_sgs_bienvenida_vista';
const mostrarModalBienvenida = ref(false);
const imagenPortadaLista = ref(false);

const activarPantallaCompleta = async () => {
  try {
    const yaEnPantallaCompleta = document.fullscreenElement != null;
    if (!yaEnPantallaCompleta) {
      await document.documentElement.requestFullscreen();
    }
  } catch (error) {
    console.warn('No se pudo activar pantalla completa automáticamente.', error);
  }
};

const solicitarInstalacionSiDisponible = async () => {
  try {
    if (!window.__pwa) return;

    const yaInstalada = window.__pwa.estaInstaladaComoPWA();
    if (yaInstalada) return;

    await window.__pwa.solicitarInstalacionPWA();
  } catch (error) {
    console.warn('No se pudo solicitar la instalación PWA.', error);
  }
};

const iniciar = async () => {
  store.prepararJuego();
  store.cambiarVista('instrucciones');
};

const entenderYContinuar = async () => {
  await solicitarInstalacionSiDisponible();
  await activarPantallaCompleta();
  localStorage.setItem(CLAVE_BIENVENIDA, 'true');
  mostrarModalBienvenida.value = false;
};

onMounted(() => {
  const bienvenidaVista = localStorage.getItem(CLAVE_BIENVENIDA) === 'true';
  mostrarModalBienvenida.value = !bienvenidaVista;
  precargarImagen('/assets/img/supervisor-ok.png').then(() => {
    imagenPortadaLista.value = true;
  });
});
</script>

<style lang="stylus" scoped>
@import '../../styles/common.styl'

.portada
  display flex
  justify-content center
  position relative
  
  .modal-bienvenida
    position absolute
    inset 0
    z-index 10
    display flex
    align-items center
    justify-content center
    padding 1rem
    background rgba(0, 0, 0, 0.65)

    &__contenido
      width min(90vw, 700px)
      background $sgs-blanco
      border-radius 1rem
      padding 1.5rem
      text-align center
      border 2px solid $sgs-naranja
      box-shadow 0 20px 40px rgba(0, 0, 0, 0.2)

      @media (min-width: 768px)
        padding 2rem
        border-radius 1.25rem

      h2
        margin 0 0 0.75rem
        color $sgs-naranja
        font-size 2.4vh

        @media (min-width: 768px)
          font-size 3vh

      p
        margin 0 0 0.75rem
        color $sgs-carbon
        line-height 1.4
        font-size 2vh

        @media (min-width: 768px)
          font-size 2.2vh

    &__boton
      @extend .boton-primario
      margin-top 0.5rem
  
  .tarjeta
    text-align center
    width 100%
    max-width 85vw
    aspect-ratio 3 / 4;
    
    h1
      font-size 1.8rem
      line-height 1.3
      margin-bottom 1rem
      
      @media (min-width: 480px)
        font-size 2.5rem
      
      @media (min-width: 768px)
        font-size 5rem

  .supervisor
    width 70vw
    height auto
    animation levitacion 3s ease-in-out infinite
    
    @media (min-width: 480px)
      width clamp(180px, 50vw, 960px)
      margin-inline-end: 3%
      margin-block-end: 5%
    
  .btn-inicio
    @extend .boton-primario
    font-size 1.4rem
    padding 0.75rem 2.5rem
    min-width 180px
    
    @media (max-width: 480px)
      font-size 1.1rem
      padding 0.6rem 2rem
    
    @media (min-width: 768px)
      font-size 2.5vh
      padding .5em 2em

@keyframes levitacion
  0%, 100%
    transform translateY(0)
  50%
    transform translateY(-15px)
</style>
