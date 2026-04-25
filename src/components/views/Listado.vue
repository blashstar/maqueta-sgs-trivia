<template lang="pug">
.vista.listado
  .tarjeta
    h2 Registros Guardados

    .contenedor-tabla(v-if="registros.length > 0")
      table.tabla-registros
        thead
          tr
            th Fecha
            th Nombre
            th Apellido
            th Celular
            th Correo
            th Cargo
            th Empresa
        tbody
          tr(v-for="registro in registros" :key="registro.id")
            td
              span.fecha {{ formatearFecha(registro.fecha) }}
            td {{ registro.nombre }}
            td {{ registro.apellido }}
            td {{ registro.celular }}
            td {{ registro.correo }}
            td {{ registro.cargo }}
            td {{ registro.empresa }}

    .estado(v-else)
      .estado__icono(v-if="cargando")
        p Cargando registros...
      .estado__vacio(v-else)
        p No hay registros guardados.
        p.estado__hint Regístrate desde el menú para ver tus datos aquí.

    button.boton-volver(@click="irAtras") Volver al inicio
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useTriviaStore } from '../../stores/trivia';
import { obtenerRegistros } from '../../db/registroDB';

const store = useTriviaStore();
const registros = ref([]);
const cargando = ref(true);

const formatearFecha = (timestamp) => {
  const fecha = new Date(timestamp);
  return fecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const cargarRegistros = async () => {
  cargando.value = true;
  try {
    registros.value = await obtenerRegistros();
  } catch (error) {
    console.error('Error al cargar registros:', error);
  } finally {
    cargando.value = false;
  }
};

const irAtras = () => {
  store.cambiarVista('portada');
};

onMounted(() => {
  cargarRegistros();
});
</script>

<style lang="stylus" scoped>
@import '../../styles/common.styl'
@import '../../styles/variables.styl'

.listado
  padding-top 5%
  justify-content start

  .tarjeta
    width 100%
    max-width 95vw
    max-height 90vh
    overflow hidden
    display flex
    flex-direction column
    height 100%

    @media (min-width: 768px)
      // max-width 900px
      padding 1vh 3vw 2vh

  h2
    font-size 1.6rem
    margin-bottom 1rem
    text-align center
    flex-shrink 0

    @media (min-width: 480px)
      font-size 2rem

.contenedor-tabla
  overflow-x auto
  overflow-y auto
  flex 1
  min-height 0

.tabla-registros
  width 100%
  table-layout fixed
  border-collapse collapse
  font-size 0.75rem

  @media (min-width: 480px)
    font-size 1vh

  thead
    position sticky
    top 0
    z-index 1

    th
      background $sgs-naranja
      color $sgs-blanco
      padding 0.6rem 0.4rem
      text-align left
      font-weight 600
      white-space nowrap

      &:first-child
        border-radius 0.5rem 0 0 0

      &:last-child
        border-radius 0 0.5rem 0 0

  tbody
    tr
      border-bottom 1px solid rgba($sgs-azul-500, 0.2)

      &:hover
        background rgba($sgs-naranja, 0.05)

    td
      padding 0.5rem 0.4rem
      color $sgs-carbon
      vertical-align middle

      @media (min-width: 480px)
        padding 0.6rem 0.5rem

  .fecha
    white-space nowrap
    font-size 0.7rem
    color rgba($sgs-carbon, 0.7)

.estado
  flex 1
  display flex
  flex-direction column
  align-items center
  justify-content center
  gap 0.5rem

  p
    margin 0
    font-size 1.1rem
    color $sgs-carbon

  &__hint
    font-size 0.9rem
    color rgba($sgs-carbon, 0.6)

.boton-volver
  @extend .boton-secundario
  margin-top 1rem
  flex-shrink 0
  align-self center
  padding 0.6rem 1.5rem
  font-size 1.5vh
</style>
