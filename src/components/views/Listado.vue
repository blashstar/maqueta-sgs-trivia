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
import * as XLSX from 'xlsx';
import 'tabulator-tables/dist/css/tabulator.min.css';

// Registrar XLSX globalmente para Tabulator
window.XLSX = XLSX;

const store = useTriviaStore();
const registros = ref([]);
const cargando = ref(true);
const tabla = ref(null);
const tablaContainer = ref(null);

const formatearFecha = (timestamp) => {
  const fecha = new Date(timestamp);
  // Convierte explícitamente a string para exportación Excel
  return String(fecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }));
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
    layout: 'fitDataFill',

    // Paginación mejorada
    pagination: 'local',
    paginationSize: 20,
    paginationSizeSelector: [10, 20, 50, 100],
    paginationButtonCount: 5,
    paginationCounter: 'rows',
    paginationInitialPage: 1,
    paginationSizeSelectorLabel: 'filas',

    // Ordenamiento
    headerSort: true,

    // Traducción completa al español con emojis
    langs: {
      'es-es': {
        data: {
          loading: 'Cargando...',
          error: 'Error'
        },
        groups: {
          item: 'registro',
          items: 'registros'
        },
        pagination: {
          page_size: 'Filas',
          page_title: 'Mostrar página',
          first: '⏮',
          first_title: 'Primera página',
          last: '⏭',
          last_title: 'Última página',
          prev: '◀',
          prev_title: 'Página anterior',
          next: '▶',
          next_title: 'Siguiente página',
          all: 'Todas',
          counter: {
            showing: '📄',
            of: 'de',
            rows: 'registros',
            pages: 'páginas'
          }
        },
        headerFilters: {
          default: 'filtrar...',
          columns: {
            nombre: 'nombre...',
            apellido: 'apellido...',
            celular: 'celular...',
            correo: 'correo...',
            cargo: 'cargo...',
            empresa: 'empresa...'
          }
        }
      }
    },
    locale: 'es-es',

    // Asegurar que el footer esté al final
    height: '100%'
  });

  // Forzar recálculo después de renderizar
  setTimeout(() => {
    if (tabla.value) {
      tabla.value.redraw(true);
    }
  }, 100);
};

const exportarExcel = () => {
  if (!tabla.value) return;
  
  // Obtener datos y convertir fecha explícitamente a string
  const datosParaExportar = tabla.value.getData().map(registro => ({
    nombre: String(registro.nombre || ''),
    apellido: String(registro.apellido || ''),
    celular: String(registro.celular || ''),
    correo: String(registro.correo || ''),
    cargo: String(registro.cargo || ''),
    empresa: String(registro.empresa || ''),
    // Convertir timestamp a string formateado para Excel
    fecha: String(formatearFecha(registro.fecha))
  }));
  
  // Exportar con datos explícitamente como strings
  tabla.value.download('xlsx', 'registros_sgs.xlsx', {
    sheetName: 'Registros',
    fileName: `registros_sgs_${new Date().toISOString().split('T')[0]}`,
    data: datosParaExportar
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
@import '../../styles/tabulator-theme-simple.styl'
</style>
