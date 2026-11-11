<script setup lang="ts">
import { technologyCategories } from '@/data/technologies'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import TechIcon from '@/components/ui/TechIcon.vue'

const marqueeItems = technologyCategories.flatMap((category) => category.items)
</script>

<template>
  <section id="tecnologias" class="section relative overflow-hidden" aria-labelledby="tech-title">
    <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <div class="absolute inset-x-0 top-0 gold-rule" />
      <div class="ambient-orb right-[-10rem] top-1/4 h-[24rem] w-[24rem] bg-gold/[0.05]" />
    </div>

    <div class="shell">
      <SectionHeading
        v-reveal
        eyebrow="Tecnologias e conhecimentos"
        description="Ferramentas que uso para construir interfaces, serviços e aplicações — do primeiro componente à publicação."
      >
        <template #default>
          Tecnologias que uso no <span class="serif-accent">dia a dia</span>
        </template>
      </SectionHeading>

      <div class="mt-12 grid gap-5 md:grid-cols-3">
        <article
          v-for="(category, categoryIndex) in technologyCategories"
          :key="category.id"
          v-reveal="{ delay: categoryIndex * 0.08 }"
          v-glow
          class="card card-hover glow-card p-6"
        >
          <div class="relative z-10">
            <div class="flex items-center justify-between gap-3">
              <div>
                <h3 class="font-display text-lg font-semibold tracking-[-0.015em] text-paper">
                  {{ category.title }}
                </h3>
                <p class="mt-1 text-[0.72rem] text-muted">{{ category.description }}</p>
              </div>
              <span class="grid size-9 place-items-center rounded-xl border border-gold/20 bg-gold/[0.06] text-gold">
                <TechIcon
                  :icon="category.id === 'frontend' ? 'siHtml5' : category.id === 'backend' ? 'siNodedotjs' : 'siGit'"
                  :size="17"
                />
              </span>
            </div>

            <ul class="mt-6 space-y-2">
              <li
                v-for="item in category.items"
                :key="item.name"
                class="group flex items-center gap-3 rounded-lg border border-transparent px-2 py-2 transition hover:border-white/[0.07] hover:bg-white/[0.03]"
              >
                <span class="grid size-8 shrink-0 place-items-center rounded-lg bg-white/[0.04] text-paper/75 transition group-hover:text-gold">
                  <TechIcon :icon="item.icon" :size="16" />
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block text-[0.82rem] font-medium text-paper/90">{{ item.name }}</span>
                  <span class="block text-[0.66rem] text-muted">{{ item.description }}</span>
                </span>
              </li>
            </ul>
          </div>
        </article>
      </div>

      <div v-reveal class="relative mt-12 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.015] py-4">
        <div class="marquee flex w-max items-center gap-4 px-6">
          <template v-for="copy in 2" :key="copy">
            <div
              v-for="item in marqueeItems"
              :key="`${copy}-${item.name}`"
              class="marquee-pill group/tech flex items-center gap-2.5 rounded-full border border-white/[0.07] bg-white/[0.02] px-3.5 py-1.5 transition-all duration-300 hover:border-gold/50 hover:bg-gold/[0.08] hover:shadow-[0_0_18px_rgba(214,166,74,0.18)]"
              :aria-hidden="copy === 2 ? 'true' : undefined"
            >
              <span class="grid size-5 shrink-0 place-items-center rounded-full bg-white/[0.04] text-paper/70 transition-colors duration-300 group-hover/tech:bg-gold/20 group-hover/tech:text-gold">
                <TechIcon :icon="item.icon" :size="12" />
              </span>
              <span class="whitespace-nowrap text-[0.74rem] font-medium tracking-wide text-muted/80 transition-colors duration-300 group-hover/tech:text-paper">
                {{ item.name }}
              </span>
            </div>
          </template>
        </div>
        <div class="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-ink to-transparent" />
        <div class="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-ink to-transparent" />
      </div>

      <p v-reveal class="mt-6 text-center text-[0.72rem] text-muted/70">
        A lista evolui conforme novos projetos e aprendizados fazem parte da stack.
      </p>
    </div>
  </section>
</template>

<style scoped>
.marquee {
  animation: marquee 34s linear infinite;
}

.marquee:hover {
  animation-play-state: paused;
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee {
    animation: none;
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
  }
}
</style>
