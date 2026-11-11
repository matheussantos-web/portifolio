<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '@/data/projects'

const props = withDefaults(
  defineProps<{
    project: Project
    variant?: 'card' | 'hero' | 'thumb'
  }>(),
  { variant: 'card' },
)

const aspect = computed(() => {
  if (props.variant === 'hero') return 'aspect-[16/9] md:aspect-[16/8.5]'
  if (props.variant === 'thumb') return 'aspect-[4/3]'
  return 'aspect-[16/10]'
})
</script>

<template>
  <div
    class="project-visual relative isolate h-full w-full overflow-hidden rounded-[inherit]"
    :class="[aspect, `accent-${project.accent}`]"
  >
    <img
      v-if="project.image"
      :src="project.image"
      :alt="project.imageAlt || project.name"
      class="absolute inset-0 h-full w-full object-cover"
      loading="lazy"
      decoding="async"
    />

    <template v-else>
      <div class="absolute inset-0 bg-[linear-gradient(145deg,#1b1c21_0%,#121317_55%,#0d0e10_100%)]" />
      <div class="absolute inset-0 grid-lines opacity-60" />
      <div class="placeholder-glow absolute -right-20 -top-24 h-80 w-80 rounded-full blur-[80px]" />
      <div class="placeholder-glow-secondary absolute -bottom-28 -left-16 h-72 w-72 rounded-full blur-[90px]" />

      <svg
        v-if="project.accent === 'crimson'"
        class="absolute right-6 top-1/2 h-[65%] w-auto -translate-y-1/2 text-gold/10 md:right-10"
        viewBox="0 0 120 120"
        fill="none"
        aria-hidden="true"
      >
        <path d="M18 46 34 28l16 16L60 20l10 24 16-16 16 18-8 44H26l-8-44Z" stroke="currentColor" stroke-width="1.2" />
        <path d="M26 90h68M34 100h52" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
        <circle cx="60" cy="56" r="7" stroke="currentColor" stroke-width="1.2" />
      </svg>

      <svg
        v-else-if="project.accent === 'violet'"
        class="absolute right-4 top-1/2 h-[62%] w-auto -translate-y-1/2 text-gold/10 md:right-8"
        viewBox="0 0 120 120"
        fill="none"
        aria-hidden="true"
      >
        <rect x="22" y="38" width="76" height="48" rx="8" stroke="currentColor" stroke-width="1.2" />
        <path d="M22 52h76" stroke="currentColor" stroke-width="1.2" />
        <path d="M40 38V30a8 8 0 0 1 8-8h24a8 8 0 0 1 8 8v8" stroke="currentColor" stroke-width="1.2" />
        <circle cx="42" cy="64" r="4" stroke="currentColor" stroke-width="1.2" />
        <circle cx="60" cy="64" r="4" stroke="currentColor" stroke-width="1.2" />
        <circle cx="78" cy="64" r="4" stroke="currentColor" stroke-width="1.2" />
      </svg>

      <svg
        v-else
        class="absolute right-6 top-1/2 h-[62%] w-auto -translate-y-1/2 text-gold/10"
        viewBox="0 0 120 120"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="60" cy="60" r="34" stroke="currentColor" stroke-width="1.2" />
        <circle cx="60" cy="60" r="18" stroke="currentColor" stroke-width="1.2" />
        <path d="M60 8v16M60 96v16M8 60h16M96 60h16" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
      </svg>

      <div class="relative z-10 flex h-full flex-col justify-between p-5 md:p-7">
        <div class="flex items-center justify-between gap-3">
          <span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-muted backdrop-blur-sm">
            <span class="status-dot" />
            Prévia visual
          </span>
          <span class="text-[0.58rem] uppercase tracking-[0.22em] text-muted/70">Em breve</span>
        </div>

        <div>
          <div class="font-serif text-[3.6rem] italic leading-none text-gold/85 md:text-[4.6rem]">
            {{ project.monogram }}
          </div>
          <p class="mt-3 font-display text-xl font-semibold tracking-[-0.02em] text-paper md:text-2xl">
            {{ project.name }}
          </p>
          <p class="mt-1 text-[0.62rem] font-medium uppercase tracking-[0.24em] text-muted">
            {{ project.category }}
          </p>
        </div>
      </div>

      <div class="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/[0.06]" />
    </template>
  </div>
</template>

<style scoped>
.project-visual {
  background: #121317;
}

.accent-violet {
  --accent-glow: rgba(139, 92, 246, 0.24);
  --accent-glow-2: rgba(214, 166, 74, 0.16);
}

.accent-crimson {
  --accent-glow: rgba(163, 58, 58, 0.26);
  --accent-glow-2: rgba(214, 166, 74, 0.18);
}

.accent-gold {
  --accent-glow: rgba(214, 166, 74, 0.24);
  --accent-glow-2: rgba(214, 166, 74, 0.1);
}

.placeholder-glow {
  background: var(--accent-glow);
}

.placeholder-glow-secondary {
  background: var(--accent-glow-2);
}
</style>
