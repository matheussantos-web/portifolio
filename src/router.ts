import type { RouteRecordRaw, RouterScrollBehavior } from 'vue-router'
import { prefersReducedMotion } from '@/lib/motion'
import HomeView from '@/views/HomeView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import PrivacyView from '@/views/PrivacyView.vue'
import ProjectView from '@/views/ProjectView.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { label: 'Início' },
  },
  {
    path: '/projetos/:slug',
    name: 'project',
    component: ProjectView,
    meta: { label: 'Projeto' },
  },
  {
    path: '/politica-de-privacidade',
    name: 'privacy',
    component: PrivacyView,
    meta: { label: 'Política de Privacidade' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: { label: 'Página não encontrada' },
  },
]

const scrollBehavior: RouterScrollBehavior = (to, _from, savedPosition) => {
  if (savedPosition) return savedPosition

  if (to.hash) {
    return {
      el: to.hash,
      top: 96,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    }
  }

  return { top: 0, behavior: 'auto' }
}

export const routerOptions = {
  routes,
  scrollBehavior,
}
