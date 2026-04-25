<template lang="pug">
.aplicacion
  MenuUsuario
  button.boton-inicio-global(
    v-if="rutaActual.name !== 'portada'"
    type="button"
    @click="triviaStore.cambiarVista('portada')"
    aria-label="Volver al inicio"
  )
    img(src="/assets/img/volver.svg")
  router-view(v-slot="{ Component }")
    transition(name="fade" mode="out-in")
      component(:is="Component")
</template>

<script setup>
import { useTriviaStore } from '../stores/trivia';
import { useRoute } from 'vue-router';
import MenuUsuario from './comun/MenuUsuario.vue';

// Plugins are registered in src/app.js
// biome-ignore lint/correctness/noUnusedVariables: se utiliza en el template Pug
const triviaStore = useTriviaStore();
// biome-ignore lint/correctness/noUnusedVariables: se utiliza en el template Pug
const rutaActual = useRoute();


</script>

<style lang="stylus">
@import '../styles/variables.styl'

.aplicacion
  position relative
  max-width: 100%;
  height 100%;
  aspect-ratio 5/8
  align-self : stretch;
  margin 0 auto
  padding 15% 1% 2%
  box-sizing border-box
  min-height 100%
  display flex
  flex-direction column
  justify-content center
  align-items stretch
  font-family 'Inter', sans-serif

  background-image url(/logo-sgs.png)
  background-size 20%
  background-repeat no-repeat
  background-position 50% 5%

.boton-inicio-global
  position absolute
  top 1rem
  left 1rem
  z-index 20
  border none
  border-radius 0.5rem
  padding 0.5rem 1.5rem
  background-color rgba($sgs-carbon, 0.5)
  color #fff
  cursor pointer

  &:hover
    background-color rgba($sgs-carbon, 0.8)

  &:focus-visible
    outline 2px solid #fff
    outline-offset 2px

  img
    width 4vw

.fade-enter-active, .fade-leave-active
  transition all 0.3s ease

.fade-enter-from, .fade-leave-to
  opacity 0
  transform scale(2) rotate(10deg)
</style>
