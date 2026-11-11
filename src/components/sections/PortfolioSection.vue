<script setup lang="ts">
import { computed, ref } from 'vue'
import { projectCategories, projects, type ProjectCategory } from '@/data/projects'
import { useQuoteRequest } from '@/lib/use-quote-request'
import AppIcon from '@/components/ui/AppIcon.vue'
import ProjectVisual from '@/components/ui/ProjectVisual.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'

type Filter = 'Todos' | ProjectCategory

const activeFilter = ref<Filter>('Todos')
const { requestQuote } = useQuoteRequest()

/** Só mostra categorias que possuem pelo menos um projeto. */
const visibleCategories = computed(() =>
  projectCategories.filter(
    (category) => category === 'Todos' || projects.some((project) => project.category === category),
  ),
)

const filtered = computed(() =>
  activeFilter.value === 'Todos'
    ? projects
    : projects.filter((project) => project.category === activeFilter.value),
)

const statusClass: Record<string, string> = {
  online: 'text-success',
  repository: 'text-muted',
  'in-progress': 'text-gold',
}
</script>

<template>
  <section id="projetos" class="section relative" aria-labelledby="projects-title">
    <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <div class="ambient-orb right-[-14rem] top-0 h-[30rem] w-[30rem] bg-gold/[0.055]" />
    </div>

    <div class="shell">
      <div class="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          v-reveal
          eyebrow="Portfólio"
          description="Projetos reais, construídos do planejamento à publicação. Cada um com seu contexto, suas decisões técnicas e seu propósito."
        >
          <template #default>
            Projetos <span class="serif-accent">desenvolvidos</span>
          </template>
        </SectionHeading>

        <div v-reveal class="flex flex-wrap gap-2" role="group" aria-label="Filtrar projetos por categoria">
          <button
            v-for="category in visibleCategories"
            :key="category"
            type="button"
            class="filter-button"
            :class="{ 'is-active': activeFilter === category }"
            :aria-pressed="activeFilter === category"
            @click="activeFilter = category"
          >
            {{ category }}
            <span v-if="category !== 'Todos'" class="filter-count">
              {{ projects.filter((project) => project.category === category).length }}
            </span>
          </button>
        </div>
      </div>

      <div class="mt-10 grid gap-6 md:grid-cols-2">
        <article
          v-for="(project, index) in filtered"
          :key="project.slug"
          v-reveal="{ delay: index * 0.07 }"
          class="card card-hover group flex flex-col overflow-hidden"
        >
          <RouterLink
            v-if="project.image"
            :to="`/projetos/${project.slug}`"
            class="relative block overflow-hidden border-b border-white/[0.06]"
            :aria-label="`Conhecer o projeto ${project.name}`"
          >
            <div class="transition-transform duration-700 ease-out group-hover:scale-[1.025]">
              <ProjectVisual :project="project" variant="card" />
            </div>
            <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </RouterLink>

          <div class="flex flex-1 flex-col p-6">
            <div class="flex flex-wrap items-center gap-2.5">
              <span class="chip chip-gold !text-[0.62rem]">{{ project.category }}</span>
              <span
                class="inline-flex items-center gap-1.5 text-[0.62rem] font-medium uppercase tracking-[0.14em]"
                :class="statusClass[project.statusTone]"
              >
                <span
                  class="status-dot"
                  :class="{
                    '!bg-success': project.statusTone === 'online',
                    '!bg-muted': project.statusTone === 'repository',
                  }"
                />
                {{ project.status }}
              </span>
            </div>

            <h3 class="mt-4 font-display text-2xl font-semibold tracking-[-0.03em] text-paper">
              <RouterLink :to="`/projetos/${project.slug}`" class="transition hover:text-gold">
                {{ project.name }}
              </RouterLink>
            </h3>

            <p class="mt-2.5 flex-1 text-[0.86rem] leading-relaxed text-muted">
              {{ project.description }}
            </p>

            <ul class="mt-5 flex flex-wrap gap-1.5" aria-label="Tecnologias utilizadas">
              <li v-for="tech in project.technologies" :key="tech">
                <span class="chip !px-2.5 !py-1 !text-[0.62rem]">{{ tech }}</span>
              </li>
            </ul>

            <p v-if="project.linkNote" class="mt-4 text-[0.68rem] leading-relaxed text-muted/65">
              {{ project.linkNote }}
            </p>

            <div class="mt-6 flex flex-wrap items-center gap-2.5 border-t border-white/[0.06] pt-5">
              <RouterLink
                :to="`/projetos/${project.slug}`"
                class="btn btn-secondary !min-h-[2.5rem] !px-3.5 !text-[0.76rem]"
              >
                Conhecer o projeto
                <AppIcon name="arrow-right" :size="14" />
              </RouterLink>

              <a
                v-if="project.website"
                :href="project.website"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex min-h-[2.5rem] items-center gap-1.5 rounded-full px-3 text-[0.74rem] font-medium text-muted transition hover:text-gold"
                :aria-label="`Abrir o site do projeto ${project.name}`"
              >
                <AppIcon name="external" :size="14" />
                Site
              </a>

              <a
                v-if="project.repository"
                :href="project.repository"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex min-h-[2.5rem] items-center gap-1.5 rounded-full px-3 text-[0.74rem] font-medium text-muted transition hover:text-gold"
                :aria-label="`Abrir o repositório do projeto ${project.name}`"
              >
                <AppIcon name="code" :size="14" />
                Código
              </a>
            </div>
          </div>
        </article>

        <article
          v-if="activeFilter === 'Todos'"
          v-reveal="{ delay: 0.14 }"
          class="relative flex min-h-[22rem] flex-col items-center justify-center overflow-hidden rounded-[var(--radius-card)] border border-dashed border-white/[0.12] bg-white/[0.012] p-8 text-center transition hover:border-gold/35 hover:bg-gold/[0.03]"
        >
          <div class="pointer-events-none absolute inset-0 grid-lines opacity-30" />
          <span class="relative grid size-12 place-items-center rounded-2xl border border-gold/25 bg-gold/[0.06] text-gold">
            <AppIcon name="plus" :size="22" />
          </span>
          <h3 class="relative mt-5 font-display text-xl font-semibold tracking-[-0.02em] text-paper">
            Seu projeto pode ser o próximo
          </h3>
          <p class="relative mt-2 max-w-xs text-[0.84rem] leading-relaxed text-muted">
            Novos projetos são adicionados aqui conforme são publicados. Tem uma ideia? Vamos
            conversar sobre ela.
          </p>
          <button
            type="button"
            class="btn btn-primary relative mt-6 !min-h-[2.65rem] !text-[0.78rem]"
            @click="requestQuote()"
          >
            Solicitar orçamento
            <AppIcon name="arrow-up-right" :size="15" />
          </button>
        </article>
      </div>

      <p v-if="filtered.length === 0" class="mt-8 rounded-xl border border-white/[0.07] bg-white/[0.02] px-5 py-6 text-center text-sm text-muted">
        Ainda não há projetos publicados nesta categoria.
      </p>
    </div>
  </section>
</template>

<style scoped>
.filter-button {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 2.35rem;
  border: 1px solid rgba(244, 244, 244, 0.09);
  border-radius: 999px;
  padding: 0.45rem 0.9rem;
  color: var(--color-muted);
  font-size: 0.74rem;
  font-weight: 500;
  transition:
    color 0.25s ease,
    border-color 0.25s ease,
    background-color 0.25s ease;
}

.filter-button:hover {
  border-color: rgba(214, 166, 74, 0.3);
  color: var(--color-paper);
}

.filter-button.is-active {
  border-color: rgba(214, 166, 74, 0.45);
  background: rgba(214, 166, 74, 0.1);
  color: var(--color-gold-soft);
}

.filter-count {
  display: inline-grid;
  min-width: 1.15rem;
  place-items: center;
  border-radius: 999px;
  background: rgba(244, 244, 244, 0.07);
  padding: 0.1rem 0.3rem;
  font-size: 0.58rem;
  color: var(--color-muted);
}

.filter-button.is-active .filter-count {
  background: rgba(214, 166, 74, 0.16);
  color: var(--color-gold-soft);
}
</style>
