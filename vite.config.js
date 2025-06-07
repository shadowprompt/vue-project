import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {createHtmlPlugin} from 'vite-plugin-html'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

const filePath = fileURLToPath(new URL('./src/modules/water/index.html', import.meta.url));
console.log('xxx ~ ', filePath, import.meta.url)

const htmlParams = {
  minify: true,
  pages: [
    {
      filename: 'index',     // filename 默认是template文件名，就是index.html
      entry: './main.js',
      template: './index.html',
    }
  ]
}

// https://vite.dev/config/
export default defineConfig({
  root: `./src/modules/water/`,
  plugins: [
    vue(),
    // createHtmlPlugin(htmlParams),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    outDir: '../../../dist',
    rollupOptions: {
      input: {
        water: filePath,
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  }
})
