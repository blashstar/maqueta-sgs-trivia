# AGENTS.md - Maqueta Trivia SGS

> Compact instructions for AI agents working on this Astro + Vue PWA trivia application.

## Quick Facts

- **Framework**: Astro 6.1.8 + Vue 3.5.32 SPA
- **Language**: Spanish (UI and codebase)
- **Node**: >=22.12.0 required
- **Type**: PWA (Progressive Web App) for safety training trivia
- **Entry**: `src/pages/index.astro` → mounts Vue app via `App.vue`

## Developer Commands

```bash
# Install dependencies (use legacy peer deps for PWA compatibility)
npm install --legacy-peer-deps

# Dev server with network access (runs on 0.0.0.0:4321)
npm run dev              # astro dev --host

# Build and preview
npm run build            # Output: ./dist/
npm run preview          # Preview production build locally

# Astro CLI
npm run astro -- add <integration>
npm run astro -- check   # Type checking
```

## Architecture

### Routing (Vue Router with hash history)
```
/ → Portada (landing)
/#/instrucciones → Instructions
/#/pregunta → Question screen
/#/respuesta → Answer feedback
/#/resultado → Final results
```
- Hash history used for SPA routing (SSR-safe via createMemoryHistory fallback)
- Routes defined in `src/router.js`

### State Management
- **Pinia** store at `src/stores/trivia.js`
- Game state: score, current question index, selected questions pool
- Config loaded from `.cfg.json` (questions, timing, scoring rules)

### File Organization
```
src/
  pages/index.astro      # Entry HTML shell
  components/
    App.vue              # Root Vue app with router-view
    views/               # Route components (Portada, Pregunta, etc.)
    comun/               # Shared components (logo.vue)
  stores/trivia.js       # Pinia state
  styles/                # Stylus variables and common styles
  router.js              # Vue Router config
  app.js                 # Vue plugin initialization (Pinia + Router)
  pwa.js                 # Service worker registration
```

## Technology Stack & Conventions

### Styling
- **Stylus** preprocessor (indented syntax, no braces)
- Variables in `src/styles/variables.styl` (SGS brand colors: `$sgs-naranja = #CA4300`)
- Common utilities in `src/styles/common.styl` (`.boton-primario`, `.tarjeta`, `.vista`)
- Responsive font sizing based on viewport dimensions

### Templates
- Vue SFCs use **Pug** (`<template lang="pug">`)
- Example: `.tarjeta` instead of `<div class="tarjeta">`

### TypeScript
- Extends `astro/tsconfigs/strict`
- JSX preserved with Vue as import source

### Animations
- **GSAP** for timeline-based animations (timer bar, transitions)
- Vue `<transition>` for route changes

## PWA Configuration

- **Plugin**: `@vite-pwa/astro` in development mode
- **Manifest**: `Trivia de Seguridad SGS`, theme color `#CA4300`
- **Caching**: Fonts cached for 1 year, assets up to 5MB
- **Auto-update**: Service worker updates automatically
- **Assets**: `favicon.svg`, audio files (mp3), images in `public/`

## Configuration (`.cfg.json`)

```json
{
  "configuracion": {
    "preguntasTotal": 40,
    "preguntasPorJuego": 5,
    "tiempoPorPregunta": 10,
    "puntosPorAcierto": 20
  },
  "preguntas": [...]
}
```

- Questions randomly selected per game session
- Each question has: `id`, `texto`, `opciones[]`, `indiceCorrecto`, `explicacion`

## Docker Deployment

```bash
# Build image (multi-stage: Node build → Nginx runtime)
docker build -t trivia-sgs .

# Run
# - Nginx serves /usr/share/nginx/html
# - SPA routing fallback to index.html configured
# - Static assets cached 1 year
```

**Nginx config**: `try_files $uri $uri/ /index.html` for hash-router SPA support.

## Important Constraints

1. **Always use `--legacy-peer-deps`** when installing packages (Astro 6 + PWA plugin compatibility)
2. **Hash router**: All routes use `/#/` prefix (not history API)
3. **SSR-safe**: Check `typeof window === 'undefined'` before browser APIs
4. **Audio**: Uses Howler for sound effects (mp3 files in `public/assets/sonidos/`)
5. **Images**: Supervisor character images in `public/assets/img/`

## VS Code

Recommended extension: `astro-build.astro-vscode`

## Common Patterns

### Adding a new view
1. Create component in `src/components/views/`
2. Add route in `src/router.js`
3. Add navigation action in `src/stores/trivia.js` using `cambiarVista('nuevaVista')`

### Styling a component
```vue
<style lang="stylus" scoped>
@import '../../styles/common.styl'

.mi-componente
  color $sgs-naranja
</style>
```

### Accessing store
```javascript
import { useTriviaStore } from '../../stores/trivia';
const store = useTriviaStore();
// store.puntuacion, store.siguientePregunta(), etc.
```

## Gotchas

- Vue plugins registered in `src/app.js`, not in component `<script setup>`
- Timer animation in `Pregunta.vue` uses GSAP with cleanup on unmount
- PWA dev mode enabled—may see service worker warnings in console during development
- All text content is in Spanish; maintain Spanish for any UI additions
