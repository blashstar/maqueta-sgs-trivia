<template lang="pug">
.view.resultado
  h2 ¡Juego Terminado!
  .score-card
    span.label Puntuación Final
    span.value {{ store.puntuacion }}
  
  p Lo has hecho genial. ¡Sigue aprendiendo!
  
  button(@click="reintentar") Reintentar
</template>

<script setup>
import { useTriviaStore } from '../../stores/trivia';
const store = useTriviaStore();

const reintentar = () => {
  store.reiniciar();
};
</script>

<style lang="stylus" scoped>
@import '../../styles/common.styl'

.resultado
  text-align center
  
  h2
    font-size 3rem
    color $sgs-gris-900
    margin-bottom 2rem

  .score-card
    background $sgs-blanco
    padding 3.5rem 2rem
    border-radius 16px
    border 1px solid rgba(0,0,0,0.05)
    box-shadow 0 20px 40px rgba(0,0,0,0.05)
    margin-bottom 3rem
    display flex
    flex-direction column
    
    .label
      color $sgs-carbon
      text-transform uppercase
      letter-spacing 0.1em
      font-size 0.9rem
      font-weight $peso-negrita
      margin-bottom 0.5rem
    
    .value
      font-size 6rem
      font-weight $peso-negrita
      color $sgs-naranja

  p
    color $sgs-carbon
    margin-bottom 2rem
    font-size 1.2rem

  button
    @extend .boton-primario
    font-size 1.2rem
    padding 1rem 3rem
</style>
