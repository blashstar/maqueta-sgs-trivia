<template lang="pug">
.vista.registro
  .tarjeta
    h2 Registro de Participante

    form.formulario(@submit.prevent="enviarFormulario")
      .campo(:class="{ 'campo--error': errores.nombre }")
        label.campo__etiqueta(for="nombre") Nombre completo
        input.campo__entrada(
          type="text"
          id="nombre"
          v-model="formulario.nombre"
          placeholder="Ingresa tu nombre"
          autocomplete="name"
        )
        span.campo__error(v-if="errores.nombre") {{ errores.nombre }}

      .campo(:class="{ 'campo--error': errores.correo }")
        label.campo__etiqueta(for="correo") Correo electrónico
        input.campo__entrada(
          type="email"
          id="correo"
          v-model="formulario.correo"
          placeholder="correo@ejemplo.com"
          autocomplete="email"
        )
        span.campo__error(v-if="errores.correo") {{ errores.correo }}

      .campo(:class="{ 'campo--error': errores.empresa }")
        label.campo__etiqueta(for="empresa") Empresa
        input.campo__entrada(
          type="text"
          id="empresa"
          v-model="formulario.empresa"
          placeholder="Nombre de tu empresa"
          autocomplete="organization"
        )
        span.campo__error(v-if="errores.empresa") {{ errores.empresa }}

      .formulario__mensaje(v-if="mensajeExito")
        p.formulario__exito ✓ {{ mensajeExito }}

      .formulario__mensaje(v-if="mensajeError")
        p.formulario__error {{ mensajeError }}

      .formulario__acciones
        button.boton-volver(@click="irAtras" type="button") Volver
        button.boton-enviar(type="submit" :disabled="guardando")
          span(v-if="guardando") Guardando...
          span(v-else) Registrarse
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useTriviaStore } from '../../stores/trivia';
import { guardarRegistro } from '../../db/registroDB';

const store = useTriviaStore();

const formulario = reactive({
  nombre: '',
  correo: '',
  empresa: ''
});

const errores = reactive({
  nombre: '',
  correo: '',
  empresa: ''
});

const guardando = ref(false);
const mensajeExito = ref('');
const mensajeError = ref('');

const validarCampo = (campo, valor) => {
  if (!valor || valor.trim() === '') {
    return `El campo ${campo} es obligatorio`;
  }
  if (campo === 'correo' && valor.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(valor.trim())) {
      return 'Ingresa un correo electrónico válido';
    }
  }
  return '';
};

const validarFormulario = () => {
  errores.nombre = validarCampo('nombre', formulario.nombre);
  errores.correo = validarCampo('correo', formulario.correo);
  errores.empresa = validarCampo('empresa', formulario.empresa);

  return !errores.nombre && !errores.correo && !errores.empresa;
};

const enviarFormulario = async () => {
  mensajeExito.value = '';
  mensajeError.value = '';

  if (!validarFormulario()) {
    return;
  }

  guardando.value = true;

  try {
    await guardarRegistro({
      nombre: formulario.nombre.trim(),
      correo: formulario.correo.trim(),
      empresa: formulario.empresa.trim()
    });

    mensajeExito.value = '¡Registro guardado exitosamente!';

    // Limpiar formulario
    formulario.nombre = '';
    formulario.correo = '';
    formulario.empresa = '';

    // Redirigir a instrucciones después de un momento
    setTimeout(() => {
      store.cambiarVista('instrucciones');
    }, 1500);
  } catch (error) {
    console.error('Error al guardar registro:', error);
    mensajeError.value = 'Ocurrió un error al guardar. Intenta de nuevo.';
  } finally {
    guardando.value = false;
  }
};

const irAtras = () => {
  store.cambiarVista('portada');
};
</script>

<style lang="stylus" scoped>
@import '../../styles/common.styl'
@import '../../styles/variables.styl'

.registro
  padding-top 15%

  .tarjeta
    width 100%
    max-width 90vw
    padding 1.5rem 1rem

    @media (min-width: 480px)
      max-width 450px
      padding 2rem 1.5rem

  h2
    font-size 1.8rem
    margin-bottom 1.5rem
    text-align center

    @media (min-width: 480px)
      font-size 2.2rem

.formulario
  width 100%
  display flex
  flex-direction column
  gap 1rem

.campo
  display flex
  flex-direction column
  gap 0.35rem

  &__etiqueta
    font-size 0.95rem
    font-weight 600
    color $sgs-carbon
    text-align left

  &__entrada
    padding 0.75rem 1rem
    border 2px solid rgba($sgs-azul-500, 0.3)
    border-radius 0.5rem
    font-size 1rem
    font-family inherit
    color $sgs-carbon
    background $sgs-blanco
    transition border-color 0.2s ease, box-shadow 0.2s ease

    &::placeholder
      color rgba($sgs-carbon, 0.4)

    &:focus
      outline none
      border-color $sgs-naranja
      box-shadow 0 0 0 3px rgba($sgs-naranja, 0.15)

  &--error
    .campo__entrada
      border-color $sgs-rojo

      &:focus
        box-shadow 0 0 0 3px rgba($sgs-rojo, 0.15)

  &__error
    font-size 0.8rem
    color $sgs-rojo
    text-align left

.formulario__mensaje
  text-align center
  padding 0.5rem

  p
    margin 0
    font-size 1rem

.formulario__exito
  color $sgs-verde

.formulario__error
  color $sgs-rojo

.formulario__acciones
  display flex
  gap 1rem
  justify-content center
  margin-top 0.5rem
  flex-wrap wrap

.boton-volver
  @extend .boton-secundario
  padding 0.6rem 1.5rem
  font-size 1rem

.boton-enviar
  @extend .boton-primario
  padding 0.6rem 1.5rem
  font-size 1rem
  min-width 140px

  &:disabled
    opacity 0.7
    cursor not-allowed
</style>
