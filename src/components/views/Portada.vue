<template lang="pug">
.view.portada
  .tarjeta
    h1 Mide tu compromiso con la seguridad
    img.supervisor(src="/assets/img/supervisor-ok.png")
    button.btn-inicio(@click="iniciar") Iniciar
</template>

<script setup>
import { useTriviaStore } from '../../stores/trivia';
const store = useTriviaStore();

const iniciar = () => {
  store.prepararJuego();
  store.cambiarVista('instrucciones');
};
</script>

<style lang="stylus" scoped>
@import '../../styles/common.styl'

.portada
  display flex
  justify-content center
  
  .tarjeta
    text-align center
    width 100%
    max-width 100%
    
    h1
      font-size 1.8rem
      line-height 1.3
      margin-bottom 1rem
      
      @media (min-width: 480px)
        font-size 2.5rem
      
      @media (min-width: 768px)
        font-size 3.5rem

  .supervisor
    width 70vw
    max-width 280px
    height auto
    animation levitacion 3s ease-in-out infinite
    
    @media (min-width: 480px)
      width clamp(180px, 40vw, 500px)
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
      font-size 1.6rem
      padding 1rem 3rem

@keyframes levitacion
  0%, 100%
    transform translateY(0)
  50%
    transform translateY(-15px)
</style>
