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
    width: 130,
    headerSort: true
  },
  {
    title: 'Nombre',
    field: 'nombre',
    width: 150,
    headerSort: true
  },
  {
    title: 'Apellido',
    field: 'apellido',
    width: 150,
    headerSort: true
  },
  {
    title: 'Celular',
    field: 'celular',
    width: 110,
    headerSort: true
  },
  {
    title: 'Correo',
    field: 'correo',
    width: 220,
    headerSort: true
  },
  {
    title: 'Cargo',
    field: 'cargo',
    width: 160,
    headerSort: true
  },
  {
    title: 'Empresa',
    field: 'empresa',
    width: 180,
    headerSort: true
  }
];

const inicializarTabla = () => {
  if (!tablaContainer.value) return;

  tabla.value = new Tabulator(tablaContainer.value, {
    data: registros.value,
    columns: columnas,
    layout: 'fitColumns',
    
    // Paginación mejorada
    pagination: 'local',
    paginationSize: 20,
    paginationSizeSelector: [10, 20, 50, 100],
    paginationButtonCount: 5,
    paginationCounter: 'rows',
    paginationInitialPage: 1,
    paginationSizeSelectorLabel: 'filas',
    
    // Ordenamiento y movilidad
    headerSort: true,
    movableColumns: true,
    
    // Traducción completa al español
    langs: {
      'es-es': {
        pagination: {
          first: 'Primera',
          firstTitle: 'Primera página',
          prev: '←',
          prevTitle: 'Página anterior',
          next: '→',
          nextTitle: 'Siguiente página',
          last: 'Última',
          lastTitle: 'Última página',
          counter: '{count} registros encontrados'
        },
        data: {
          loading: 'Cargando registros...',
          error: 'Error al cargar datos',
          noData: 'No hay registros disponibles'
        },
        columns: {
          item: 'registro',
          items: 'registros'
        },
        ajax: {
          loading: 'Cargando',
          error: 'Error'
        },
        groups: {
          item: 'grupo',
          items: 'grupos'
        }
      }
    },
    locale: 'es-es',
    
    // Estilos y comportamiento
    rowHeight: 42,
    columnHeaderVertAlign: 'middle',
    cellVertAlign: 'middle',
    
    // Asegurar que el footer esté al final
    height: '100%',
    footerElement: '<div></div>'
  });
  
  // Forzar recálculo de altura después de renderizar
  setTimeout(() => {
    if (tabla.value) {
      tabla.value.redraw(true);
    }
  }, 100);
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

// Tema personalizado SGS para Tabulator v6.4
.tabulator
  font-family $fuente-principal
  font-size 0.85rem
  border 1px solid rgba($sgs-azul-500, 0.3)
  border-radius 0.5rem
  overflow hidden
  background-color $sgs-blanco
  display flex
  flex-direction column

  // Header con colores SGS
  .tabulator-header
    background: linear-gradient(135deg, $sgs-naranja 0%, darken($sgs-naranja, 8%) 100%)
    color $sgs-blanco
    font-weight 600
    border-bottom 2px solid $sgs-naranja
    flex-shrink 0
    min-height: 48px

    .tabulator-col
      background: transparent
      color $sgs-blanco
      border-right 1px solid rgba($sgs-blanco, 0.15)
      padding: 0.7rem 0.5rem
      transition background-color 0.2s ease
      font-size 0.75rem

      &:hover
        background-color rgba($sgs-blanco, 0.1)

      &:last-child
        border-right none

      .tabulator-col-content
        display flex
        align-items center
        gap 0.5rem
        
        .tabulator-col-title
          white-space nowrap
          text-transform uppercase
          letter-spacing 0.3px
          font-size 0.7rem
          font-weight 700

      // Icono de ordenamiento
      .tabulator-col-sorter
        color $sgs-blanco
        opacity 0.8
        font-size 1rem

        &:hover
          opacity 1

  // Cuerpo de la tabla
  .tabulator-tableholder
    flex 1
    overflow auto
    min-height 0

    .tabulator-table
      background-color $sgs-blanco

      .tabulator-row
        border-bottom 1px solid rgba($sgs-azul-500, 0.12)
        transition all 0.15s ease
        font-size 0.8rem

        &:nth-child(even)
          background-color rgba($sgs-azul-100, 0.5)

        &:hover
          background-color rgba($sgs-naranja, 0.06)

        .tabulator-cell
          padding: 0.6rem 0.5rem
          color $sgs-carbon
          border-right 1px solid rgba($sgs-azul-500, 0.08)
          vertical-align middle
          font-size 0.8rem

          &:last-child
            border-right none

          // Formato especial para fecha
          &:first-child
            font-weight 500
            color rgba($sgs-carbon, 0.85)
            font-size 0.75rem

  // Footer con paginación - siempre al final
  .tabulator-footer
    background: linear-gradient(135deg, $sgs-azul-100 0%, rgba($sgs-azul-100, 0.9) 100%)
    border-top 2px solid rgba($sgs-azul-500, 0.25)
    padding: 0.75rem 1rem
    flex-shrink 0
    margin-top auto

    .tabulator-paginator
      display flex
      align-items center
      justify-content space-between
      gap 0.75rem
      color $sgs-carbon
      flex-wrap wrap

      // Selector de cantidad de registros
      .tabulator-page-size
        background $sgs-blanco
        border 2px solid rgba($sgs-azul-500, 0.3)
        border-radius 0.375rem
        padding: 0.45rem 0.65rem
        color $sgs-carbon
        font-size 0.8rem
        font-weight 600
        cursor pointer
        transition all 0.2s ease
        min-width: 70px

        &:hover
          border-color $sgs-naranja
          background-color rgba($sgs-naranja, 0.05)

        &:focus
          outline none
          border-color $sgs-naranja
          box-shadow 0 0 0 3px rgba($sgs-naranja, 0.15)

      // Contador de registros
      .tabulator-paginator-row-label
        font-weight 600
        color $sgs-carbon
        white-space nowrap
        font-size 0.8rem

      // Botones de paginación
      .tabulator-pages
        display flex
        gap 0.3rem

        button
          background $sgs-blanco
          border 2px solid rgba($sgs-azul-500, 0.3)
          border-radius 0.375rem
          min-width: 36px
          height: 36px
          padding: 0 0.4rem
          color $sgs-carbon
          font-size 0.8rem
          font-weight 600
          cursor pointer
          transition all 0.2s ease
          display flex
          align-items center
          justify-content center

          &:hover:not(.active):not(:disabled)
            background rgba($sgs-naranja, 0.12)
            border-color $sgs-naranja
            transform translateY(-1px)

          &.active
            background: linear-gradient(135deg, $sgs-naranja 0%, darken($sgs-naranja, 10%) 100%)
            color $sgs-blanco
            border-color $sgs-naranja
            box-shadow 0 2px 6px rgba($sgs-naranja, 0.35)
            font-weight 700

          &:disabled
            opacity 0.4
            cursor not-allowed
            transform none

          // Flechas de navegación
          &[data-page='first'],
          &[data-page='prev'],
          &[data-page='next'],
          &[data-page='last']
            font-weight 700
            font-size 0.9rem

  // Scrollbars personalizados
  &::-webkit-scrollbar
    width 10px
    height 10px

  &::-webkit-scrollbar-track
    background rgba($sgs-azul-500, 0.08)
    border-radius 5px

  &::-webkit-scrollbar-thumb
    background: linear-gradient(135deg, $sgs-naranja 0%, darken($sgs-naranja, 15%) 100%)
    border-radius 5px
    border 2px solid rgba($sgs-azul-500, 0.08)

    &:hover
      background: linear-gradient(135deg, darken($sgs-naranja, 5%) 0%, darken($sgs-naranja, 20%) 100%)

// Estado de carga y error
.tabulator-loader
  background rgba($sgs-blanco, 0.95)
  color $sgs-carbon
  font-size 1rem
  font-weight 600

// Responsive
@media (max-width: 768px)
  .tabulator
    font-size 0.75rem

    .tabulator-header
      .tabulator-col
        padding: 0.5rem 0.3rem
        font-size 0.65rem

        .tabulator-col-title
          font-size 0.6rem

    .tabulator-tableholder
      .tabulator-row
        .tabulator-cell
          padding: 0.5rem 0.3rem
          font-size 0.7rem

    .tabulator-footer
      padding: 0.5rem

      .tabulator-paginator
        justify-content center
        gap 0.5rem

        .tabulator-pages
          button
            min-width: 32px
            height: 32px
            font-size 0.7rem

        .tabulator-page-size
          font-size 0.7rem
          padding: 0.35rem 0.5rem
          min-width: 60px
</style>
