import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import AstroPWA from '@vite-pwa/astro';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  integrations: [
    vue({
      appEntrypoint: path.resolve(__dirname, 'src/app.js')
    }),
    AstroPWA({
      base: '/',
      scope: '/',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png', 'logo-sgs.png', 'bg.png'],
      // Configuración de actualización automática
      // 'autoUpdate': El SW se actualiza automáticamente sin intervención del usuario
      // 'prompt': El usuario debe aceptar la actualización manualmente
      registerType: 'autoUpdate',
      manifest: {
        name: 'Trivia de Seguridad SGS',
        short_name: 'TriviaSGS',
        description: 'Aplicación de Trivia para capacitación en Seguridad SGS',
        theme_color: '#CA4300',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        lang: 'es',
        icons: [
          {
            src: 'favicon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon'
          }
        ]
      },
      workbox: {
        navigateFallback: '/',
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp,gif,mp3}'],
        maximumFileSizeToCacheInBytes: 5242880,
        // Limpieza automática de caché antigua
        cleanupOutdatedCaches: true,
        // Precachear assets críticos
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /^\/assets\/img\/.*\.(png|jpg|jpeg|svg|webp|gif)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'imagenes-trivia',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^\/assets\/sonidos\/.*\.mp3$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'audios-trivia',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        navigateFallbackAllowlist: [/^\//]
      }
    })
  ]
});