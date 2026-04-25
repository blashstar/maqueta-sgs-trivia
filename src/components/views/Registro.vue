<template lang="pug">
.vista.registro
  .tarjeta
    h2 Registro de Participante

    form.formulario(@submit.prevent="enviarFormulario")
      .campo(:class="{ 'campo--error': errores.nombre }")
        label.campo__etiqueta(for="nombre") Nombre
        input.campo__entrada(
          type="text"
          id="nombre"
          v-model="formulario.nombre"
          placeholder="Tu nombre"
          autocomplete="given-name"
        )
        span.campo__error(v-if="errores.nombre") {{ errores.nombre }}

      .campo(:class="{ 'campo--error': errores.apellido }")
        label.campo__etiqueta(for="apellido") Apellido
        input.campo__entrada(
          type="text"
          id="apellido"
          v-model="formulario.apellido"
          placeholder="Tu apellido"
          autocomplete="family-name"
        )
        span.campo__error(v-if="errores.apellido") {{ errores.apellido }}

      .campo(:class="{ 'campo--error': errores.celular }")
        label.campo__etiqueta(for="celular") Celular
        input.campo__entrada(
          type="tel"
          id="celular"
          v-model="formulario.celular"
          placeholder="Ej: 3001234567"
          autocomplete="tel"
          @input="formatearCelular"
        )
        span.campo__error(v-if="errores.celular") {{ errores.celular }}

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

      .campo(:class="{ 'campo--error': errores.cargo }")
        label.campo__etiqueta(for="cargo") Cargo
        input.campo__entrada(
          type="text"
          id="cargo"
          v-model="formulario.cargo"
          placeholder="Tu cargo en la empresa"
          autocomplete="organization-title"
        )
        span.campo__error(v-if="errores.cargo") {{ errores.cargo }}

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
  apellido: '',
  celular: '',
  correo: '',
  cargo: '',
  empresa: ''
});

const errores = reactive({
  nombre: '',
  apellido: '',
  celular: '',
  correo: '',
  cargo: '',
  empresa: ''
});

const guardando = ref(false);
const mensajeExito = ref('');
const mensajeError = ref('');

const formatearCelular = () => {
  // Solo permitir números y limitar a 10 dígitos
  formulario.celular = formulario.celular.replace(/[^0-9]/g, '').slice(0, 10);
};

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
  
  if (campo === 'celular' && valor.trim()) {
    const celularLimpio = valor.replace(/[^0-9]/g, '');
    if (celularLimpio.length < 10) {
      return 'Ingresa un celular válido (mínimo 10 dígitos)';
    }
    if (celularLimpio.length > 10) {
      return 'El celular no puede tener más de 10 dígitos';
    }
  }
  
  return '';
};

const validarFormulario = () => {
  errores.nombre = validarCampo('nombre', formulario.nombre);
  errores.apellido = validarCampo('apellido', formulario.apellido);
  errores.celular = validarCampo('celular', formulario.celular);
  errores.correo = validarCampo('correo', formulario.correo);
  errores.cargo = validarCampo('cargo', formulario.cargo);
  errores.empresa = validarCampo('empresa', formulario.empresa);

  return !errores.nombre && !errores.apellido && !errores.celular && 
         !errores.correo && !errores.cargo && !errores.empresa;
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
      apellido: formulario.apellido.trim(),
      celular: formulario.celular.trim(),
      correo: formulario.correo.trim(),
      cargo: formulario.cargo.trim(),
      empresa: formulario.empresa.trim()
    });

    mensajeExito.value = '¡Registro guardado exitosamente!';

    // Limpiar formulario
    formulario.nombre = '';
    formulario.apellido = '';
    formulario.celular = '';
    formulario.correo = '';
    formulario.cargo = '';
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
  padding-top 10%
  justify-content: flex-start;

  .tarjeta
    width 100%
    max-width 90vw
    padding 1.5rem 1rem
    max-height 85vh
    overflow-y auto

    @media (min-width: 480px)
      max-width 500px
      padding 2rem 1.5rem

  h2
    font-size 1.8rem
    margin-bottom 2vh
    text-align center
    flex-shrink 0

    @media (min-width: 480px)
      font-size 2.5vh

.formulario
  max-width 640px
  width 100%
  display flex
  flex-direction column
  gap 1.5vh

.campo
  display flex
  flex-direction column
  gap .5vh

  &__etiqueta
    font-size 1.5vh
    font-weight 600
    color $sgs-carbon
    text-align left

  &__entrada
    padding 0.6rem 0.9rem
    border 2px solid rgba($sgs-azul-500, 0.3)
    border-radius 0.5em
    font-size 1.4vh
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
    font-size 1.2vh
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
  padding 0.4em 1.5em
  font-size 2vh

.boton-enviar
  @extend .boton-primario
  padding 0.4em 1.5em
  font-size 2vh
  min-width 140px

  &:disabled
    opacity 0.7
    cursor not-allowed
</style>
