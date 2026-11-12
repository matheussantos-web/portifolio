<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { brand } from '@/data/brand'
import { buildWhatsAppLink } from '@/lib/contact'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { trackQuoteClick } from '@/lib/analytics'
import AppIcon from '@/components/ui/AppIcon.vue'
import HeroCanvas from '@/components/ui/HeroCanvas.vue'
import SocialIcon from '@/components/ui/SocialIcon.vue'

const heroRef = ref<HTMLElement | null>(null)
const visualRef = ref<HTMLElement | null>(null)
const whatsappLink = buildWhatsAppLink('hero')

const specialties = [
  { label: 'Desenvolvimento Web', icon: 'code' },
  { label: 'Sistemas e Aplicações', icon: 'layers' },
  { label: 'Experiências Digitais', icon: 'spark' },
] as const

interface CodeLine {
  no: string
  html: string
  chars: number
}

const rawLines: CodeLine[] = [
  {
    no: '01',
    html: `<span class="text-[#8b7bd8]">const</span> <span class="text-paper">ideia</span> <span class="text-muted">=</span> <span class="text-gold-soft">'do cliente'</span>`,
    chars: 27,
  },
  {
    no: '02',
    html: '',
    chars: 0,
  },
  {
    no: '03',
    html: `<span class="text-[#8b7bd8]">function</span> <span class="text-[#7ec8e3]">transformar</span><span class="text-muted">(</span><span class="text-gold-soft">ideia</span><span class="text-muted">)</span> <span class="text-muted">{</span>`,
    chars: 29,
  },
  {
    no: '04',
    html: `<span class="pl-3 text-muted">const</span> <span class="text-paper">plano</span> <span class="text-muted">=</span> <span class="text-[#7ec8e3]">planejar</span><span class="text-muted">(</span><span class="text-gold-soft">ideia</span><span class="text-muted">)</span>`,
    chars: 33,
  },
  {
    no: '05',
    html: `<span class="pl-3 text-muted">const</span> <span class="text-paper">solucao</span> <span class="text-muted">=</span> <span class="text-[#7ec8e3]">desenvolver</span><span class="text-muted">(</span><span class="text-gold-soft">plano</span><span class="text-muted">)</span>`,
    chars: 36,
  },
  {
    no: '06',
    html: '',
    chars: 0,
  },
  {
    no: '07',
    html: `<span class="pl-3 text-[#8b7bd8]">return</span> <span class="text-[#7ec8e3]">entregar</span><span class="text-muted">(</span><span class="text-gold-soft">solucao</span><span class="text-muted">)</span>`,
    chars: 26,
  },
  {
    no: '08',
    html: `<span class="text-muted">}</span>`,
    chars: 1,
  },
]

// Estado inicial: no SSR, renderiza 100% das linhas completas
const visibleLineCount = ref(rawLines.length)
const activeTypingLine = ref(-1)
const buildStatus = ref<'compiling' | 'ready'>('ready')
let typingTimer: number | null = null

let cleanup: (() => void) | null = null

onMounted(() => {
  if (!heroRef.value) return

  const isReduced = prefersReducedMotion()
  const isFinePointer = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

  if (!isReduced) {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

      timeline
        .from('[data-hero-eyebrow]', { opacity: 0, y: 14, duration: 0.45 })
        .from('[data-hero-line]', { opacity: 0, y: '115%', duration: 0.8, stagger: 0.09 }, '-=0.3')
        .from('[data-hero-intro]', { opacity: 0, y: 14, duration: 0.5 }, '-=0.5')
        .from('[data-hero-copy]', { opacity: 0, y: 14, duration: 0.5 }, '-=0.45')
        .from('[data-hero-actions]', { opacity: 0, y: 14, duration: 0.5 }, '-=0.4')
        .from('[data-hero-specialty]', { opacity: 0, y: 10, duration: 0.4, stagger: 0.05 }, '-=0.35')
        .from('[data-hero-visual]', { opacity: 0, y: 22, scale: 0.98, duration: 0.85 }, '-=0.85')
        .from('[data-hero-float]', { opacity: 0, y: 14, duration: 0.5, stagger: 0.08 }, '-=0.45')
    }, heroRef.value)

    cleanup = () => {
      ctx.revert()
    }
  }

  // Digitação viva: apenas desktop com mouse e sem reduced-motion
  if (!isReduced && isFinePointer) {
    visibleLineCount.value = 0
    activeTypingLine.value = 0
    buildStatus.value = 'compiling'

    let currentLine = 0
    const typeNextLine = () => {
      if (currentLine < rawLines.length) {
        currentLine++
        visibleLineCount.value = currentLine
        activeTypingLine.value = currentLine < rawLines.length ? currentLine : -1

        // Ritmo de digitação natural (linhas vazias são mais rápidas)
        const delay = rawLines[currentLine - 1]?.chars ? 160 + rawLines[currentLine - 1]!.chars * 11 : 90
        typingTimer = window.setTimeout(typeNextLine, delay)
      } else {
        // Concluído: ativa "build ok" com sucesso
        activeTypingLine.value = -1
        buildStatus.value = 'ready'
      }
    }

    // Inicia após a entrada do hero
    typingTimer = window.setTimeout(typeNextLine, 850)
  }

  const visual = visualRef.value
  let frame = 0
  const onPointerMove = (event: PointerEvent) => {
    if (!visual || isReduced) return
    if (frame) return
    frame = window.requestAnimationFrame(() => {
      frame = 0
      const rect = visual.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      gsap.to(visual, {
        rotateY: x * 7,
        rotateX: -y * 7,
        transformPerspective: 900,
        duration: 0.7,
        ease: 'power2.out',
      })
    })
  }

  const onPointerLeave = () => {
    if (!visual || isReduced) return
    gsap.to(visual, { rotateX: 0, rotateY: 0, duration: 0.9, ease: 'power3.out' })
  }

  visual?.addEventListener('pointermove', onPointerMove)
  visual?.addEventListener('pointerleave', onPointerLeave)

  const prevCleanup = cleanup
  cleanup = () => {
    prevCleanup?.()
    if (typingTimer) window.clearTimeout(typingTimer)
    visual?.removeEventListener('pointermove', onPointerMove)
    visual?.removeEventListener('pointerleave', onPointerLeave)
    if (frame) window.cancelAnimationFrame(frame)
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <section
    id="inicio"
    ref="heroRef"
    class="relative overflow-hidden pt-[calc(var(--header-height)+2.5rem)] pb-16 sm:pb-20 lg:pt-[calc(var(--header-height)+4rem)] lg:pb-28"
    aria-labelledby="hero-title"
  >
    <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <HeroCanvas />
      <div class="absolute inset-0 grid-lines opacity-70" />
      <div class="ambient-orb left-1/2 top-[-14rem] h-[30rem] w-[46rem] -translate-x-1/2 bg-gold/[0.07]" />
      <div class="ambient-orb -left-40 top-1/3 h-[26rem] w-[26rem] bg-[#6d4bb8]/[0.07]" />
      <div class="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
    </div>

    <div class="shell grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
      <div class="max-w-2xl">
        <p data-hero-eyebrow class="eyebrow">Th Apps · Desenvolvimento Web</p>

        <h1 id="hero-title" class="display-title mt-6">
          <span class="block overflow-hidden pb-1">
            <span data-hero-line class="block will-change-transform">Ideias em código.</span>
          </span>
          <span class="block overflow-hidden pb-1">
            <span data-hero-line class="block will-change-transform">
              Soluções em <span class="serif-accent">realidade.</span>
            </span>
          </span>
        </h1>

        <div data-hero-intro class="mt-8 border-l border-gold/30 pl-5">
          <p class="font-display text-lg font-medium tracking-[-0.01em] text-paper sm:text-xl">
            Olá, eu sou {{ brand.founder }}.
          </p>
          <p class="mt-1 text-sm text-muted sm:text-[0.95rem]">{{ brand.roleLong }}</p>
        </div>

        <p data-hero-copy class="mt-6 max-w-xl text-[0.95rem] leading-relaxed text-muted sm:text-base">
          Transformo ideias em experiências digitais, desenvolvendo sites, sistemas e soluções web
          que unem tecnologia, criatividade e funcionalidade.
        </p>

        <div data-hero-actions class="mt-8 flex flex-wrap items-center gap-3">
          <RouterLink v-magnetic to="/#projetos" class="btn btn-primary">
            Explorar projetos
            <AppIcon name="arrow-right" :size="16" />
          </RouterLink>
          <RouterLink v-magnetic to="/#contato" class="btn btn-secondary" @click="trackQuoteClick('hero')">
            Vamos conversar
            <AppIcon name="arrow-up-right" :size="16" />
          </RouterLink>
          <a
            v-if="whatsappLink"
            v-magnetic
            :href="whatsappLink"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-ghost !min-h-[2.65rem] !px-2 !text-[0.8rem]"
          >
            <SocialIcon name="whatsapp" :size="16" />
            WhatsApp
          </a>
        </div>

        <ul class="mt-10 flex flex-wrap gap-2.5">
          <li v-for="item in specialties" :key="item.label" data-hero-specialty>
            <span class="chip">
              <AppIcon :name="item.icon" :size="13" class="text-gold/80" />
              {{ item.label }}
            </span>
          </li>
        </ul>
      </div>

      <div class="relative mx-auto w-full max-w-[34rem] lg:max-w-none">
        <div
          ref="visualRef"
          data-hero-visual
          class="relative select-none"
          style="transform-style: preserve-3d; will-change: transform"
          aria-hidden="true"
        >
          <div class="absolute -inset-8 -z-10 rounded-[2.5rem] bg-[radial-gradient(circle_at_60%_40%,rgba(214,166,74,0.16),transparent_62%)] blur-2xl" />

          <div class="relative overflow-hidden rounded-[1.6rem] border border-white/[0.09] bg-[linear-gradient(160deg,rgba(41,42,48,0.72),rgba(13,14,16,0.94))] shadow-[0_50px_120px_-50px_rgba(0,0,0,0.95)]">
            <div class="flex items-center justify-between border-b border-white/[0.07] bg-black/25 px-4 py-3">
              <div class="flex items-center gap-1.5">
                <span class="size-2.5 rounded-full bg-[#3a3b42]" />
                <span class="size-2.5 rounded-full bg-[#3a3b42]" />
                <span class="size-2.5 rounded-full bg-gold/60" />
              </div>
              <span class="font-mono text-[0.6rem] tracking-[0.08em] text-muted/70">
                th-apps / solucao.vue
              </span>
              <span class="text-[0.55rem] uppercase tracking-[0.2em] text-muted/50">live</span>
            </div>

            <div class="min-h-[12.8rem] space-y-2 p-5 font-mono text-[0.66rem] leading-relaxed sm:text-[0.72rem]">
              <template v-for="(line, idx) in rawLines" :key="line.no">
                <p v-if="idx < visibleLineCount" class="flex items-baseline">
                  <span class="w-6 shrink-0 text-muted/40">{{ line.no }}</span>
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <span class="min-w-0" v-html="line.html" />
                  <span
                    v-if="idx === visibleLineCount - 1"
                    class="ml-1 inline-block h-3.5 w-1.5 translate-y-0.5 bg-gold/80 align-middle"
                    style="animation: blink 1.2s step-end infinite"
                  />
                </p>
                <p v-else-if="idx === activeTypingLine" class="flex items-baseline">
                  <span class="w-6 shrink-0 text-muted/40">{{ line.no }}</span>
                  <span
                    class="ml-1 inline-block h-3.5 w-1.5 translate-y-0.5 bg-gold/80 align-middle"
                    style="animation: blink 1.2s step-end infinite"
                  />
                </p>
              </template>
            </div>

            <div class="flex flex-wrap items-center gap-2 border-t border-white/[0.07] bg-black/20 px-4 py-3.5">
              <span class="chip chip-gold !text-[0.6rem]">Vue 3</span>
              <span class="chip !text-[0.6rem]">Vite</span>
              <span class="chip !text-[0.6rem]">Tailwind</span>
              <span class="chip !text-[0.6rem]">Node.js</span>
              <span
                class="ml-auto inline-flex items-center gap-1.5 text-[0.58rem] uppercase tracking-[0.18em] transition-colors duration-500"
                :class="buildStatus === 'ready' ? 'text-success' : 'text-gold-soft'"
              >
                <span
                  class="status-dot transition-colors duration-500"
                  :class="buildStatus === 'ready' ? '!bg-success' : '!bg-gold-soft animate-pulse'"
                />
                {{ buildStatus === 'ready' ? 'build ok' : 'compilando...' }}
              </span>
            </div>
          </div>

          <div
            data-hero-float
            class="absolute -left-4 top-[18%] hidden items-center gap-2.5 rounded-xl border border-white/10 bg-graphite/90 px-3.5 py-2.5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:flex"
          >
            <span class="grid size-8 place-items-center rounded-lg bg-gold/10 text-gold">
              <AppIcon name="target" :size="16" />
            </span>
            <div class="leading-tight">
              <p class="text-[0.7rem] font-semibold text-paper">Foco em soluções</p>
              <p class="text-[0.58rem] text-muted">Cada projeto é único</p>
            </div>
          </div>

          <div
            data-hero-float
            class="absolute -right-3 bottom-[12%] hidden items-center gap-2.5 rounded-xl border border-white/10 bg-graphite/90 px-3.5 py-2.5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:flex"
          >
            <span class="grid size-8 place-items-center rounded-lg bg-gold/10 text-gold">
              <AppIcon name="chat" :size="16" />
            </span>
            <div class="leading-tight">
              <p class="text-[0.7rem] font-semibold text-paper">Contato direto</p>
              <p class="text-[0.58rem] text-muted">Com quem desenvolve</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
