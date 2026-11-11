import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import 'vite-ssg/node'
import { projects } from './src/data/projects.ts'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
  },
  ssgOptions: {
    entry: 'src/main.ts',
    dirStyle: 'nested',
    formatting: 'minify',
    script: 'defer',
    includedRoutes() {
      return [
        '/',
        ...projects.map((project) => `/projetos/${project.slug}`),
        '/politica-de-privacidade',
        '/404',
      ]
    },
  },
})
