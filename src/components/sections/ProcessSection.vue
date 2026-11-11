<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { processSteps } from '@/data/process'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import SectionHeading from '@/components/ui/SectionHeading.vue'

const sectionRef = ref<HTMLElement | null>(null)
const svgLineRef = ref<SVGLineElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
let cleanup: (() => void) | null = null

onMounted(() => {
  if (!sectionRef.value || prefersReducedMotion()) return

  const ctx = gsap.context(() => {
    // Animação da linha SVG desenhando com o scroll
    if (svgLineRef.value && listRef.value) {
      const line = svgLineRef.value
      const listHeight = listRef.value.clientHeight
      const length = listHeight

      line.style.strokeDasharray = `${length}`
      line.style.strokeDashoffset = `${length}`

      gsap.to(line, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: listRef.value,
          start: 'top 65%',
          end: 'bottom 82%',
          scrub: 0.6,
        },
      })
    }

    // Cada etapa acende em dourado ao ser alcançada pelo scroll
    if (listRef.value) {
      const steps = listRef.value.querySelectorAll<HTMLElement>('.process-step-item')
      steps.forEach((step) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 68%',
          onEnter: () => step.classList.add('is-step-active'),
          onLeaveBack: () => step.classList.remove('is-step-active'),
        })
      })
    }
  }, sectionRef.value)

  cleanup = () => {
    ctx.revert()
    ScrollTrigger.refresh()
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <section id="processo" ref="sectionRef" class="section relative" aria-labelledby="process-title">
    <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <div class="ambient-orb right-[-8rem] top-1/3 h-[24rem] w-[24rem] bg-[#6d4bb8]/[0.05]" />
    </div>

    <div class="shell">
      <div class="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div class="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            v-reveal
            eyebrow="Processo de desenvolvimento"
            description="Um caminho claro, com etapas bem definidas — e espaço para ajustar o percurso conforme o tamanho e a complexidade do projeto."
          >
            <template #default>
              Do primeiro contato <span class="serif-accent">à entrega</span>
            </template>
          </SectionHeading>

          <div v-reveal class="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
            <p class="text-[0.8rem] leading-relaxed text-muted">
              O processo pode variar conforme o escopo. Projetos menores podem percorrer as etapas
              mais rápido; projetos maiores podem exigir mais rodadas de planejamento e testes.
            </p>
          </div>

          <RouterLink v-reveal to="/#contato" class="btn btn-secondary mt-6 !min-h-[2.8rem] !text-[0.82rem]">
            Começar pelo primeiro contato
            <span aria-hidden="true">→</span>
          </RouterLink>
        </div>

        <ol ref="listRef" class="relative space-y-0">
          <!-- Linha SVG que se desenha no scroll -->
          <svg
            class="pointer-events-none absolute left-[1.45rem] top-4 bottom-6 w-3 -translate-x-1/2 overflow-visible sm:left-[1.7rem]"
            aria-hidden="true"
          >
            <!-- Guia estática translúcida -->
            <line
              x1="50%"
              y1="0"
              x2="50%"
              y2="100%"
              stroke="rgba(244, 244, 244, 0.08)"
              stroke-width="2"
              stroke-linecap="round"
            />
            <!-- Linha animada dourada -->
            <line
              ref="svgLineRef"
              x1="50%"
              y1="0"
              x2="50%"
              y2="100%"
              stroke="url(#process-gold-gradient)"
              stroke-width="2.5"
              stroke-linecap="round"
            />
            <defs>
              <linearGradient id="process-gold-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#D6A64A" stop-opacity="0.85" />
                <stop offset="60%" stop-color="#E5BE6B" stop-opacity="1" />
                <stop offset="100%" stop-color="#D6A64A" stop-opacity="0.3" />
              </linearGradient>
            </defs>
          </svg>

          <li
            v-for="(step, index) in processSteps"
            :key="step.number"
            v-reveal="{ delay: index * 0.06, y: 20 }"
            class="process-step-item group relative flex gap-5 pb-9 last:pb-0 sm:gap-7"
          >
            <!-- Número da etapa que acende -->
            <span class="step-badge relative z-10 grid size-[2.9rem] shrink-0 place-items-center rounded-full border border-gold/25 bg-ink font-mono text-[0.68rem] font-semibold text-gold transition-all duration-500 group-hover:border-gold/60 group-hover:bg-gold/[0.08] sm:size-[3.4rem]">
              {{ step.number }}
            </span>

            <!-- Card da etapa que acende -->
            <div class="step-card flex-1 rounded-2xl border border-white/[0.06] bg-white/[0.018] p-5 transition-all duration-500 group-hover:border-gold/25 group-hover:bg-gold/[0.03] sm:p-6">
              <h3 class="step-title font-display text-[1.08rem] font-semibold tracking-[-0.015em] text-paper transition-colors duration-500">
                {{ step.title }}
              </h3>
              <p class="mt-2 text-[0.86rem] leading-relaxed text-muted">
                {{ step.description }}
              </p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Efeito de etapa acendendo em dourado ao ser alcançada no scroll */
.process-step-item.is-step-active .step-badge {
  border-color: rgba(214, 166, 74, 0.85);
  background-color: rgba(214, 166, 74, 0.16);
  color: var(--color-gold-soft);
  box-shadow: 0 0 22px rgba(214, 166, 74, 0.32);
  transform: scale(1.06);
}

.process-step-item.is-step-active .step-card {
  border-color: rgba(214, 166, 74, 0.32);
  background-color: rgba(214, 166, 74, 0.038);
  box-shadow: 0 6px 24px rgba(214, 166, 74, 0.06);
}

.process-step-item.is-step-active .step-title {
  color: var(--color-paper);
}

@media (prefers-reduced-motion: reduce) {
  .process-step-item.is-step-active .step-badge {
    transform: none;
    box-shadow: none;
  }
}
</style>
