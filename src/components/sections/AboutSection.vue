<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { brand } from '@/data/brand'
import { aboutCharacteristics, aboutParagraphs } from '@/data/about'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import AppIcon from '@/components/ui/AppIcon.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'

const sectionRef = ref<HTMLElement | null>(null)
const frameRef = ref<HTMLElement | null>(null)
const decorativeBadgeRef = ref<HTMLElement | null>(null)
let cleanup: (() => void) | null = null

onMounted(() => {
  if (!sectionRef.value || prefersReducedMotion()) return
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

  const ctx = gsap.context(() => {
    // Parallax discreto na moldura da foto (quando existir)
    if (frameRef.value) {
      gsap.fromTo(
        frameRef.value,
        { y: -24 },
        {
          y: 24,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.value,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        },
      )
    }

    // Parallax sutil no elemento decorativo geométrico de fundo
    if (decorativeBadgeRef.value) {
      gsap.fromTo(
        decorativeBadgeRef.value,
        { y: 20 },
        {
          y: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.value,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        },
      )
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
  <section id="sobre" ref="sectionRef" class="section relative overflow-hidden" aria-labelledby="about-title">
    <!-- Elemento decorativo geométrico sutil com parallax de profundidade -->
    <div
      ref="decorativeBadgeRef"
      class="pointer-events-none absolute right-[-4rem] top-1/4 -z-10 hidden size-64 select-none opacity-20 lg:block will-change-transform"
      aria-hidden="true"
    >
      <div class="h-full w-full rounded-full border border-gold/30 bg-[radial-gradient(circle,rgba(214,166,74,0.08)_0%,transparent_70%)]" />
    </div>

    <div
      class="shell grid gap-12 lg:gap-16"
      :class="brand.aboutPhoto ? 'lg:grid-cols-[0.85fr_1.15fr]' : ''"
    >
      <div v-if="brand.aboutPhoto" v-reveal class="relative">
        <div ref="frameRef" class="relative mx-auto max-w-sm lg:sticky lg:top-28 lg:mx-0 lg:max-w-none will-change-transform">
          <div class="absolute -inset-4 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_30%_20%,rgba(214,166,74,0.14),transparent_65%)] blur-xl" />

          <!-- Moldura com detalhe de linhas com deslocamento -->
          <div class="card relative overflow-hidden ring-1 ring-gold/20">
            <div class="relative aspect-[4/5]">
              <img
                :src="brand.aboutPhoto"
                :alt="brand.aboutPhotoAlt"
                class="absolute inset-0 h-full w-full object-cover"
                width="800"
                height="1000"
                loading="lazy"
                decoding="async"
              />

              <div class="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.06]" />
              <div class="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink/90 to-transparent" />
            </div>

            <div class="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-ink/70 px-4 py-3 backdrop-blur-xl">
              <div>
                <p class="font-display text-sm font-semibold tracking-[-0.01em] text-paper">
                  {{ brand.founder }}
                </p>
                <p class="mt-0.5 text-[0.6rem] uppercase tracking-[0.18em] text-muted">
                  {{ brand.role }}
                </p>
              </div>
              <span class="grid size-9 place-items-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                <AppIcon name="code" :size="16" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <SectionHeading
          v-reveal
          eyebrow="Sobre mim"
          title="Uma pessoa por trás de cada linha"
        >
          <template #default>
            Uma pessoa por trás de cada <span class="serif-accent">linha</span>
          </template>
        </SectionHeading>

        <div class="mt-7 space-y-4">
          <p
            v-for="(paragraph, index) in aboutParagraphs"
            :key="index"
            v-reveal="{ delay: index * 0.05 }"
            class="max-w-xl text-[0.94rem] leading-relaxed text-muted"
            :class="index === 0 ? 'text-paper/90' : ''"
          >
            {{ paragraph }}
          </p>
        </div>

        <ul class="mt-10 grid gap-3 sm:grid-cols-2">
          <li
            v-for="(item, index) in aboutCharacteristics"
            :key="item.title"
            v-reveal="{ delay: index * 0.04, y: 18 }"
            class="group flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.018] px-4 py-3.5 transition hover:border-gold/25 hover:bg-gold/[0.04]"
          >
            <span class="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-gold/10 text-gold transition group-hover:bg-gold/15">
              <AppIcon :name="item.icon" :size="14" />
            </span>
            <span class="text-[0.82rem] leading-snug text-paper/85">{{ item.title }}</span>
          </li>
        </ul>

        <div v-reveal class="mt-9 flex flex-wrap items-center gap-3">
          <RouterLink to="/#projetos" class="btn btn-secondary !min-h-[2.8rem] !text-[0.82rem]">
            Ver meus projetos
            <AppIcon name="arrow-right" :size="15" />
          </RouterLink>
          <RouterLink to="/#contato" class="btn btn-ghost !min-h-[2.8rem] !text-[0.82rem]">
            Falar comigo
            <AppIcon name="arrow-up-right" :size="14" />
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
