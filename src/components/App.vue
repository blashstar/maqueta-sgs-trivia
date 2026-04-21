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
  width: 100%;
  align-self : stretch;
  margin 0 auto
  padding 1%
  box-sizing border-box
  min-height 100%
  display flex
  flex-direction column
  justify-content center
  align-items stretch
  font-family 'Inter', sans-serif

.fade-enter-active, .fade-leave-active
  transition opacity 0.3s ease

.fade-enter-from, .fade-leave-to
  opacity 0
</style>
