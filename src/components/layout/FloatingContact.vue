<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getProjectBySlug } from '@/data/projects'
import { buildWhatsAppLink } from '@/lib/contact'
import AppIcon from '@/components/ui/AppIcon.vue'
import SocialIcon from '@/components/ui/SocialIcon.vue'

const route = useRoute()
const visible = ref(true)
let observer: IntersectionObserver | null = null

const project = computed(() => {
  if (!route.path.startsWith('/projetos/')) return undefined
  const slug = route.path.split('/').filter(Boolean).pop()
  return slug ? getProjectBySlug(slug) : undefined
})

const isHome = computed(() => route.path === '/')
const quoteLink = computed(() => (isHome.value ? '#orcamento' : '/#orcamento'))

const whatsappLink = computed(() =>
  project.value
    ? buildWhatsAppLink('project', { projectName: project.value.name })
    : buildWhatsAppLink('contact'),
)

onMounted(() => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return
  const target = document.getElementById('orcamento')
  if (!target) return
  observer = new IntersectionObserver(
    ([entry]) => {
      visible.value = !entry.isIntersecting
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
  )
  observer.observe(target)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <Transition name="float">
    <div
      v-if="visible"
      class="fixed right-4 z-40 flex flex-col items-end gap-3 sm:right-6"
      style="bottom: max(1.25rem, env(safe-area-inset-bottom))"
    >
      <a
        v-if="whatsappLink"
        :href="whatsappLink"
        target="_blank"
        rel="noopener noreferrer"
        class="group flex items-center gap-2.5 rounded-full border border-white/10 bg-graphite/90 py-2.5 pl-3.5 pr-3.5 text-xs font-medium text-paper shadow-[0_18px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl transition hover:border-[#25D366]/45 hover:bg-graphite"
        aria-label="Conversar pelo WhatsApp"
      >
        <span class="grid size-7 place-items-center rounded-full bg-[#25D366]/10 text-[#25D366]">
          <SocialIcon name="whatsapp" :size="16" />
        </span>
        <span class="hidden sm:inline">Falar no WhatsApp</span>
      </a>

      <RouterLink
        v-else
        :to="quoteLink"
        class="group flex items-center gap-2.5 rounded-full border border-gold/30 bg-graphite/90 py-2.5 pl-3.5 pr-3.5 text-xs font-medium text-paper shadow-[0_18px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl transition hover:border-gold/60 hover:bg-graphite"
        aria-label="Solicitar orçamento"
      >
        <span class="grid size-7 place-items-center rounded-full bg-gold/10 text-gold">
          <AppIcon name="send" :size="15" />
        </span>
        <span class="hidden sm:inline">Solicitar orçamento</span>
      </RouterLink>
    </div>
  </Transition>
</template>

<style scoped>
.float-enter-active,
.float-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.float-enter-from,
.float-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.97);
}
</style>
