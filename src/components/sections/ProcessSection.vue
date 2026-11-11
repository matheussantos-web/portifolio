<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { processSteps } from '@/data/process'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import SectionHeading from '@/components/ui/SectionHeading.vue'

const sectionRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
let cleanup: (() => void) | null = null

onMounted(() => {
  if (!sectionRef.value || !lineRef.value || prefersReducedMotion()) return

  const ctx = gsap.context(() => {
    gsap.fromTo(
      lineRef.value,
      { scaleY: 0 },
      {
        scaleY: 1,
        transformOrigin: 'top center',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 62%',
          end: 'bottom 78%',
          scrub: 0.6,
        },
      },
    )
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

        <ol class="relative space-y-0">
          <div class="pointer-events-none absolute left-[1.45rem] top-2 bottom-2 w-px bg-white/[0.07] sm:left-[1.7rem]" aria-hidden="true" />
          <div
            ref="lineRef"
            class="pointer-events-none absolute left-[1.45rem] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-gold via-gold/70 to-transparent sm:left-[1.7rem]"
            aria-hidden="true"
          />

          <li
            v-for="(step, index) in processSteps"
            :key="step.number"
            v-reveal="{ delay: index * 0.06, y: 20 }"
            class="group relative flex gap-5 pb-9 last:pb-0 sm:gap-7"
          >
            <span class="relative z-10 grid size-[2.9rem] shrink-0 place-items-center rounded-full border border-gold/25 bg-ink font-mono text-[0.68rem] font-semibold text-gold transition group-hover:border-gold/60 group-hover:bg-gold/[0.08] sm:size-[3.4rem]">
              {{ step.number }}
            </span>

            <div class="flex-1 rounded-2xl border border-white/[0.06] bg-white/[0.018] p-5 transition group-hover:border-gold/20 group-hover:bg-gold/[0.025] sm:p-6">
              <h3 class="font-display text-[1.08rem] font-semibold tracking-[-0.015em] text-paper">
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
