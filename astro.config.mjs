// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  integrations: [vue({
    appEntrypoint: path.resolve(__dirname, 'src/app.js')
  })]
});