import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routerOptions } from './router'
import { vGlow, vMagnetic, vReveal, vTilt } from './lib/directives'
import { initAnalytics } from './lib/analytics'
import './style.css'

const analyticsDomain = import.meta.env.VITE_ANALYTICS_DOMAIN

export const createApp = ViteSSG(App, routerOptions, ({ app, router }) => {
  app.directive('reveal', vReveal)
  app.directive('glow', vGlow)
  app.directive('tilt', vTilt)
  app.directive('magnetic', vMagnetic)

  if (analyticsDomain) {
    initAnalytics(analyticsDomain)
    router.afterEach((to) => {
      void import('./lib/analytics').then(({ trackPageView }) => {
        trackPageView(to.path)
      })
    })
  }
})
