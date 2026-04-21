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
    width fit-content

  .supervisor
    width clamp(200px, 45vw, 800px)
    margin-inline-end: 3%
    margin-block-end: 5%
    animation levitacion 3s ease-in-out infinite
    
  .btn-inicio
    @extend .boton-primario

@keyframes levitacion
  0%, 100%
    transform translateY(0)
  50%
    transform translateY(-15px)
</style>
