<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'
import FloatingContact from '@/components/layout/FloatingContact.vue'
import ScrollProgress from '@/components/layout/ScrollProgress.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import { ScrollTrigger } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'

const route = useRoute()
const announcement = ref('')
let hashScrollTimer: number | undefined

useHead({
  htmlAttrs: { lang: 'pt-BR' },
})

/**
 * Rola até a âncora depois que a transição de página monta o novo conteúdo.
 * O refresh do ScrollTrigger zera a rolagem para medir as posições, por isso
 * ele roda antes de iniciar o scroll.
 */
function scrollToHash(hash: string, attempt = 0) {
  const element = document.getElementById(hash.slice(1))
  if (!element) {
    if (attempt < 40) {
      hashScrollTimer = window.setTimeout(() => scrollToHash(hash, attempt + 1), 25)
    }
    return
  }

  ScrollTrigger.refresh()
  element.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  })
}

watch(
  // Só troca de página exige recalcular posições. Navegação por âncora na
  // mesma página não deve sofrer refresh (o refresh zera a rolagem).
  () => route.path,
  async () => {
    await nextTick()
    announcement.value = (route.meta.label as string | undefined) ?? ''

    if (route.hash) {
      window.clearTimeout(hashScrollTimer)
      scrollToHash(route.hash)
      return
    }

    window.requestAnimationFrame(() => ScrollTrigger.refresh())
  },
)

onMounted(() => {
  window.requestAnimationFrame(() => ScrollTrigger.refresh())
})

onBeforeUnmount(() => {
  window.clearTimeout(hashScrollTimer)
})
</script>

<template>
  <a class="skip-link" href="#conteudo">Ir para o conteúdo</a>

  <ScrollProgress />
  <SiteHeader />

  <RouterView v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>

  <SiteFooter />
  <FloatingContact />

  <p class="sr-only" aria-live="polite">{{ announcement }}</p>
</template>
