<template lang="pug">
.vista.listado
  .tarjeta
    h2 Registros Guardados

    .toolbar
      button.boton-excel(
        type="button"
        @click="exportarExcel"
        :disabled="!tabla || registros.length === 0"
      )
        img.icono-excel(src="/assets/img/excel.svg" alt="")
        span Exportar Excel

    .contenedor-tabla(ref="tablaContainer")
      .estado(v-if="cargando")
        p Cargando registros...
      .estado(v-else-if="registros.length === 0")
        p No hay registros guardados.
        p.estado__hint Regístrate desde el menú para ver tus datos aquí.

    //- button.boton-volver(@click="irAtras") Volver al inicio
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useTriviaStore } from '../../stores/trivia';
import { obtenerRegistros } from '../../db/registroDB';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator.min.css';

const store = useTriviaStore();
const registros = ref([]);
const cargando = ref(true);
const tabla = ref(null);
const tablaContainer = ref(null);

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

const columnas = [
  {
    title: 'Fecha',
    field: 'fecha',
    formatter: (cell) => formatearFecha(cell.getValue()),
    width: 120,
    headerFilter: false
  },
  {
    title: 'Nombre',
    field: 'nombre',
    width: 150,
    headerFilter: 'input'
  },
  {
    title: 'Apellido',
    field: 'apellido',
    width: 150,
    headerFilter: 'input'
  },
  {
    title: 'Celular',
    field: 'celular',
    width: 100,
    headerFilter: 'input'
  },
  {
    title: 'Correo',
    field: 'correo',
    width: 200,
    headerFilter: 'input'
  },
  {
    title: 'Cargo',
    field: 'cargo',
    width: 150,
    headerFilter: 'input'
  },
  {
    title: 'Empresa',
    field: 'empresa',
    width: 180,
    headerFilter: 'input'
  }
];

const inicializarTabla = () => {
  if (!tablaContainer.value) return;

  tabla.value = new Tabulator(tablaContainer.value, {
    data: registros.value,
    columns: columnas,
    layout: 'fitColumns',
    pagination: 'local',
    paginationSize: 20,
    paginationSizeSelector: [20, 50, 100],
    paginationButtonCount: 3,
    paginationCounter: 'rows',
    movableColumns: true,
    resizableRows: false,
    autoColumns: false,
    headerSort: true,
    headerFilterLiveFilter: true,
    langs: {
      'es-es': {
        pagination: {
          first: 'Primero',
          prev: 'Anterior',
          next: 'Siguiente',
          last: 'Último',
          counter: '{count} registros'
        },
        data: {
          loading: 'Cargando...',
          error: 'Error'
        }
      }
    },
    locale: 'es-es'
  });
};

const exportarExcel = () => {
  if (!tabla.value) return;
  tabla.value.download('xlsx', 'registros_sgs.xlsx', {
    sheetName: 'Registros',
    fileName: `registros_sgs_${new Date().toISOString().split('T')[0]}`
  });
};

const cargarRegistros = async () => {
  cargando.value = true;
  try {
    registros.value = await obtenerRegistros();

    if (tabla.value) {
      tabla.value.setData(registros.value);
    } else {
      setTimeout(() => {
        inicializarTabla();
      }, 100);
    }
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

onUnmounted(() => {
  if (tabla.value) {
    tabla.value.destroy();
    tabla.value = null;
  }
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
      padding 1vh 3vw 2vh

  h2
    font-size 1.6rem
    margin-bottom 1rem
    text-align center
    flex-shrink 0

    @media (min-width: 480px)
      font-size 2rem

.toolbar
  display flex
  justify-content flex-end
  margin-bottom 1rem
  padding 0 0.5rem
  width 100%

.boton-excel
  display flex
  align-items center
  gap 0.5rem
  padding 0.6rem 1.2rem
  background-color $sgs-verde
  color $sgs-blanco
  border none
  border-radius 0.5rem
  font-size 0.9rem
  font-weight 600
  cursor pointer
  transition all 0.2s ease

  &:hover:not(:disabled)
    background-color darken($sgs-verde, 10%)

  &:disabled
    opacity 0.5
    cursor not-allowed

  .icono-excel
    width 20px
    height 20px

.contenedor-tabla
  flex 1
  overflow auto
  min-height 0
  border-radius 0.5rem
  border 1px solid rgba($sgs-azul-500, 0.2)
  width 100%

.estado
  flex 1
  display flex
  flex-direction column
  align-items center
  justify-content center
  gap 0.5rem
  padding 2rem

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

<style lang="stylus">
@import '../../styles/variables.styl'

// Tema personalizado SGS para Tabulator
.tabulator
  font-family $fuente-principal
  font-size 0.85rem
  border 1px solid rgba($sgs-azul-500, 0.3)
  border-radius 0.5rem
  overflow hidden

  .tabulator-header
    background-color $sgs-naranja
    color $sgs-blanco
    font-weight 600
    border-bottom 2px solid $sgs-naranja

    .tabulator-col
      background-color $sgs-naranja
      color $sgs-blanco
      border-right 1px solid rgba($sgs-blanco, 0.2)
      padding 0.75rem 0.5rem

      &:hover
        background-color darken($sgs-naranja, 5%)

      .tabulator-col-content
        .tabulator-col-title
          white-space nowrap

      .tabulator-header-filter
        input
          background $sgs-blanco
          border 1px solid rgba($sgs-azul-500, 0.3)
          border-radius 0.25rem
          padding 0.4rem
          font-size 0.8rem
          color $sgs-carbon

          &:focus
            outline none
            border-color $sgs-naranja
            box-shadow 0 0 0 2px rgba($sgs-naranja, 0.15)

  .tabulator-tableholder
    .tabulator-table
      background-color $sgs-blanco

      .tabulator-row
        border-bottom 1px solid rgba($sgs-azul-500, 0.15)

        &:nth-child(even)
          background-color rgba($sgs-azul-100, 0.4)

        &:hover
          background-color rgba($sgs-naranja, 0.08)

        &.tabulator-selected
          background-color rgba($sgs-naranja, 0.15)

          &:hover
            background-color rgba($sgs-naranja, 0.2)

        .tabulator-cell
          padding 0.6rem 0.5rem
          color $sgs-carbon
          border-right 1px solid rgba($sgs-azul-500, 0.1)

          &:last-child
            border-right none

  // Paginación SGS
  .tabulator-footer
    background-color $sgs-azul-100
    border-top 1px solid rgba($sgs-azul-500, 0.2)
    padding 0.5rem

    .tabulator-paginator
      display flex
      align-items center
      gap 0.5rem
      color $sgs-carbon

      label
        font-weight 600
        color $sgs-carbon

      select
        background $sgs-blanco
        border 1px solid rgba($sgs-azul-500, 0.3)
        border-radius 0.25rem
        padding 0.4rem 0.6rem
        color $sgs-carbon
        font-size 0.85rem

        &:focus
          outline none
          border-color $sgs-naranja

      .tabulator-pages
        display flex
        gap 0.25rem

        button
          background $sgs-blanco
          border 1px solid rgba($sgs-azul-500, 0.3)
          border-radius 0.25rem
          padding 0.4rem 0.75rem
          color $sgs-carbon
          font-size 0.85rem
          cursor pointer
          transition all 0.15s ease

          &:hover:not(.active):not(:disabled)
            background rgba($sgs-naranja, 0.1)
            border-color $sgs-naranja

          &.active
            background $sgs-naranja
            color $sgs-blanco
            border-color $sgs-naranja

          &:disabled
            opacity 0.4
            cursor not-allowed

  // Scrollbars personalizados
  &::-webkit-scrollbar
    width 8px
    height 8px

  &::-webkit-scrollbar-track
    background rgba($sgs-azul-500, 0.1)
    border-radius 4px

  &::-webkit-scrollbar-thumb
    background rgba($sgs-naranja, 0.6)
    border-radius 4px

    &:hover
      background rgba($sgs-naranja, 0.8)

// Responsive
@media (max-width: 768px)
  .tabulator
    font-size 0.75rem

    .tabulator-header
      .tabulator-col
        padding 0.5rem 0.3rem

    .tabulator-tableholder
      .tabulator-row
        .tabulator-cell
          padding 0.5rem 0.3rem

    .tabulator-footer
      .tabulator-paginator
        flex-wrap wrap
        justify-content center
</style>
