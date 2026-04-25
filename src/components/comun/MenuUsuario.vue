<template lang="pug">
.menu-usuario
  button.menu-usuario__boton(
    type="button"
    @click="alternarMenu"
    :aria-expanded="menuAbierto"
    aria-label="Abrir menú de usuario"
  )
    img.icono-menu(src="/assets/img/menu.svg" alt="Menú")

  transition(name="menu-fade")
    .menu-usuario__desplegable(v-if="menuAbierto" ref="menuRef")
      button.menu-usuario__opcion(
        type="button"
        @click="irAListado"
      )
        img.icono-opcion(src="/assets/img/lista.svg" alt="")
        span Ver registros
      button.menu-usuario__opcion(
        type="button"
        @click="irARegistro"
      )
        img.icono-opcion(src="/assets/img/registro.svg" alt="")
        span Registrarse
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useTriviaStore } from '../../stores/trivia';

const store = useTriviaStore();
const menuAbierto = ref(false);
const menuRef = ref(null);

const alternarMenu = () => {
  menuAbierto.value = !menuAbierto.value;
};

const cerrarMenu = (evento) => {
  if (menuRef.value && !menuRef.value.contains(evento.target)) {
    menuAbierto.value = false;
  }
};

const irAListado = () => {
  menuAbierto.value = false;
  store.cambiarVista('listado');
};

const irARegistro = () => {
  menuAbierto.value = false;
  store.cambiarVista('registro');
};

onMounted(() => {
  document.addEventListener('click', cerrarMenu);
});

onUnmounted(() => {
  document.removeEventListener('click', cerrarMenu);
});
</script>

<style lang="stylus" scoped>
@import '../../styles/variables.styl'

.menu-usuario
  position absolute
  top 1rem
  right 1rem
  z-index 30

  &__boton
    border none
    border-radius 0.5rem
    padding 0.5rem
    background-color rgba($sgs-carbon, 0.5)
    cursor pointer
    transition background-color 0.2s ease

    &:hover
      background-color rgba($sgs-carbon, 0.9)

    &:focus-visible
      outline 2px solid $sgs-naranja
      outline-offset 2px

  .icono-menu
    width 5vw
    min-width 24px
    max-width 32px
    display block

  &__desplegable
    position absolute
    top calc(100% + 0.5rem)
    right 0
    background $sgs-blanco
    border-radius 0.75rem
    box-shadow 0 8px 32px rgba($sgs-carbon, 0.25)
    overflow hidden
    min-width 160px

  &__opcion
    display flex
    align-items center
    gap 0.75rem
    width 100%
    padding 0.875rem 1.25rem
    border none
    background transparent
    color $sgs-carbon
    font-size 1rem
    font-weight 500
    text-align left
    cursor pointer
    transition background-color 0.15s ease

    &:hover
      background-color rgba($sgs-naranja, 0.1)
      color $sgs-naranja

    &:focus-visible
      outline none
      background-color rgba($sgs-naranja, 0.15)

    .icono-opcion
      width 20px
      height 20px
      flex-shrink 0

.menu-fade-enter-active,
.menu-fade-leave-active
  transition all 0.2s ease

.menu-fade-enter-from,
.menu-fade-leave-to
  opacity 0
  transform translateY(-8px)
</style>
