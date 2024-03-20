import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { crx } from '@crxjs/vite-plugin';
import manifest from './src/manifest.json';
import { resolve } from 'path';

const srcDir = resolve(__dirname, 'src');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    crx({
      manifest: manifest as any,
    }),
  ],
  resolve: {
    alias: {
      src: srcDir,
      '@': srcDir,
    },
  },
  build: {
    rollupOptions: {
      input: {
        'wakeup-page': resolve(srcDir, '../wakeup-page.html'),
      },
    },
  },
});
