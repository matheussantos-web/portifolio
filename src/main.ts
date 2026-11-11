import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routerOptions } from './router'
import { vGlow, vMagnetic, vReveal, vTilt } from './lib/directives'
import './style.css'

export const createApp = ViteSSG(App, routerOptions, ({ app }) => {
  app.directive('reveal', vReveal)
  app.directive('glow', vGlow)
  app.directive('tilt', vTilt)
  app.directive('magnetic', vMagnetic)
})
