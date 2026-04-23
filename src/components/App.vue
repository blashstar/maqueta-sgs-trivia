<template lang="pug">
.aplicacion
  router-view(v-slot="{ Component }")
    transition(name="fade" mode="out-in")
      component(:is="Component")
</template>

<script setup>
// Plugins are registered in src/app.js
</script>

<style lang="stylus">
.aplicacion
  max-width: 100%;
  height 100%;
  aspect-ratio 5/8
  align-self : stretch;
  margin 0 auto
  padding 10% 1% 2%
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

.fade-enter-active, .fade-leave-active
  transition all 0.3s ease

.fade-enter-from, .fade-leave-to
  opacity 0
  transform scale(2) rotate(10deg)
</style>
