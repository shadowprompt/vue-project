import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

const PROJECT_NAME = process.env.PROJECT_NAME;

console.log('working with ~ ', PROJECT_NAME, import.meta.url)

// https://vite.dev/config/
export default defineConfig({
  root: `./src/modules/${PROJECT_NAME}/`,
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    outDir: fileURLToPath(new URL(`./dist_${PROJECT_NAME}`, import.meta.url)),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        [PROJECT_NAME]: fileURLToPath(new URL(`./src/modules/${PROJECT_NAME}/index.html`, import.meta.url)),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  }
})
