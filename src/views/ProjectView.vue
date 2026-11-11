<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { brand } from '@/data/brand'
import { getProjectBySlug, projects } from '@/data/projects'
import { buildWhatsAppLink } from '@/lib/contact'
import { usePageSeo } from '@/lib/seo'
import { useQuoteRequest } from '@/lib/use-quote-request'
import AppIcon from '@/components/ui/AppIcon.vue'
import ProjectVisual from '@/components/ui/ProjectVisual.vue'

const route = useRoute()
const { requestQuote } = useQuoteRequest()

const project = computed(() => getProjectBySlug(String(route.params.slug)))

const nextProject = computed(() => {
  if (!project.value) return undefined
  return projects.find((item) => item.slug !== project.value?.slug)
})

const whatsappLink = computed(() =>
  project.value
    ? buildWhatsAppLink('project', { projectName: project.value.name })
    : buildWhatsAppLink('contact'),
)

const statusClass = computed(() => {
  if (!project.value) return 'text-muted'
  if (project.value.statusTone === 'online') return 'text-success'
  if (project.value.statusTone === 'in-progress') return 'text-gold'
  return 'text-muted'
})

usePageSeo({
  title: project.value ? `${project.value.name} | Th Apps` : 'Projeto não encontrado | Th Apps',
  description: project.value
    ? project.value.description.slice(0, 158)
    : 'O projeto que você procura não foi encontrado no portfólio da Th Apps.',
  path: route.path,
  noindex: !project.value,
  jsonLd: project.value
    ? {
        '@type': 'CreativeWork',
        name: project.value.name,
        description: project.value.description,
        url: project.value.website || project.value.repository,
        keywords: project.value.technologies.join(', '),
        creator: {
          '@type': 'Person',
          name: brand.founder,
          url: brand.siteUrl,
        },
      }
    : undefined,
})
</script>

<template>
  <main id="conteudo" tabindex="-1" class="relative pt-[calc(var(--header-height)+2.5rem)] pb-16 sm:pb-20">
    <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <div class="absolute inset-0 grid-lines opacity-40" />
      <div class="ambient-orb right-[-12rem] top-[-8rem] h-[28rem] w-[28rem] bg-gold/[0.06]" />
    </div>

    <template v-if="project">
      <div class="shell">
        <nav class="flex flex-wrap items-center gap-2 text-[0.72rem] text-muted/70" aria-label="Navegação estrutural">
          <RouterLink to="/" class="transition hover:text-gold">Início</RouterLink>
          <AppIcon name="chevron-right" :size="12" />
          <RouterLink to="/#projetos" class="transition hover:text-gold">Projetos</RouterLink>
          <AppIcon name="chevron-right" :size="12" />
          <span class="text-paper/80">{{ project.name }}</span>
        </nav>

        <div class="mt-8 grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
          <div>
            <div class="flex flex-wrap items-center gap-2.5">
              <span class="chip chip-gold">{{ project.category }}</span>
              <span
                class="inline-flex items-center gap-1.5 text-[0.66rem] font-medium uppercase tracking-[0.14em]"
                :class="statusClass"
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

            <h1 class="display-title mt-5 !text-[clamp(2.6rem,6.5vw,4.8rem)]">
              {{ project.name }}
            </h1>
            <p class="mt-5 max-w-2xl text-[0.96rem] leading-relaxed text-muted">
              {{ project.description }}
            </p>

            <ul class="mt-6 flex flex-wrap gap-1.5" aria-label="Tecnologias utilizadas">
              <li v-for="tech in project.technologies" :key="tech">
                <span class="chip">{{ tech }}</span>
              </li>
            </ul>

            <div class="mt-8 flex flex-wrap items-center gap-3">
              <a
                v-if="project.website"
                :href="project.website"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-primary"
              >
                Visitar o site
                <AppIcon name="external" :size="16" />
              </a>
              <a
                v-if="project.repository"
                :href="project.repository"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-secondary"
              >
                <AppIcon name="code" :size="16" />
                Ver código-fonte
              </a>
              <button
                type="button"
                class="btn btn-ghost !min-h-[2.65rem] !px-2 !text-[0.8rem]"
                @click="requestQuote(project.quoteType)"
              >
                Quero algo parecido
                <AppIcon name="arrow-right" :size="15" />
              </button>
            </div>

            <p v-if="project.linkNote" class="mt-4 max-w-xl text-[0.7rem] leading-relaxed text-muted/65">
              {{ project.linkNote }}
            </p>
          </div>

          <aside class="card p-6" aria-label="Ficha do projeto">
            <h2 class="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-paper">
              Ficha do projeto
            </h2>
            <dl class="mt-5 space-y-4">
              <div class="flex items-start justify-between gap-4 border-b border-white/[0.06] pb-4">
                <dt class="text-[0.7rem] uppercase tracking-[0.12em] text-muted/70">Categoria</dt>
                <dd class="text-right text-[0.8rem] text-paper/90">{{ project.category }}</dd>
              </div>
              <div class="flex items-start justify-between gap-4 border-b border-white/[0.06] pb-4">
                <dt class="text-[0.7rem] uppercase tracking-[0.12em] text-muted/70">Situação</dt>
                <dd class="text-right text-[0.8rem]" :class="statusClass">{{ project.status }}</dd>
              </div>
              <div class="border-b border-white/[0.06] pb-4">
                <dt class="text-[0.7rem] uppercase tracking-[0.12em] text-muted/70">Tecnologias</dt>
                <dd class="mt-2 flex flex-wrap justify-end gap-1.5">
                  <span v-for="tech in project.technologies" :key="tech" class="chip !px-2.5 !py-1 !text-[0.6rem]">
                    {{ tech }}
                  </span>
                </dd>
              </div>
              <div v-if="project.website">
                <dt class="text-[0.7rem] uppercase tracking-[0.12em] text-muted/70">Website</dt>
                <dd class="mt-1.5">
                  <a
                    :href="project.website"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1.5 break-all text-[0.78rem] text-gold-soft transition hover:text-gold"
                  >
                    {{ project.website.replace(/^https?:\/\//, '') }}
                    <AppIcon name="arrow-up-right" :size="12" class="shrink-0" />
                  </a>
                </dd>
              </div>
              <div v-if="project.repository">
                <dt class="text-[0.7rem] uppercase tracking-[0.12em] text-muted/70">Repositório</dt>
                <dd class="mt-1.5">
                  <a
                    :href="project.repository"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1.5 break-all text-[0.78rem] text-gold-soft transition hover:text-gold"
                  >
                    {{ project.repository.replace(/^https?:\/\/(www\.)?github\.com\//, 'github.com/') }}
                    <AppIcon name="arrow-up-right" :size="12" class="shrink-0" />
                  </a>
                </dd>
              </div>
            </dl>
          </aside>
        </div>

        <div v-reveal class="mt-12 overflow-hidden rounded-[1.5rem] border border-white/[0.08] shadow-[0_40px_120px_-60px_rgba(0,0,0,0.95)]">
          <ProjectVisual :project="project" variant="hero" />
        </div>

        <div class="mt-14 grid gap-10 lg:grid-cols-[1fr_19rem] lg:gap-14">
          <article class="space-y-10">
            <section v-reveal>
              <p class="eyebrow">01 · Visão geral</p>
              <h2 class="mt-3 font-display text-2xl font-semibold tracking-[-0.025em] text-paper">
                Sobre o projeto
              </h2>
              <p class="mt-3 text-[0.92rem] leading-relaxed text-muted">{{ project.overview }}</p>
            </section>

            <section v-reveal class="grid gap-6 border-t border-white/[0.07] pt-8 sm:grid-cols-2">
              <div>
                <p class="eyebrow">02 · Objetivo</p>
                <h2 class="mt-3 font-display text-xl font-semibold tracking-[-0.02em] text-paper">
                  O que o projeto busca
                </h2>
                <p class="mt-3 text-[0.9rem] leading-relaxed text-muted">{{ project.objective }}</p>
              </div>
              <div>
                <p class="eyebrow">03 · Problema</p>
                <h2 class="mt-3 font-display text-xl font-semibold tracking-[-0.02em] text-paper">
                  O contexto
                </h2>
                <p class="mt-3 text-[0.9rem] leading-relaxed text-muted">{{ project.problem }}</p>
              </div>
            </section>

            <section v-reveal class="border-t border-white/[0.07] pt-8">
              <p class="eyebrow">04 · Solução</p>
              <h2 class="mt-3 font-display text-2xl font-semibold tracking-[-0.025em] text-paper">
                Como foi construído
              </h2>
              <p class="mt-3 text-[0.92rem] leading-relaxed text-muted">{{ project.solution }}</p>
            </section>

            <section v-reveal class="border-t border-white/[0.07] pt-8">
              <p class="eyebrow">05 · Funcionalidades</p>
              <h2 class="mt-3 font-display text-2xl font-semibold tracking-[-0.025em] text-paper">
                O que o projeto oferece
              </h2>
              <ul class="mt-5 grid gap-3 sm:grid-cols-2">
                <li
                  v-for="feature in project.features"
                  :key="feature"
                  class="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.018] px-4 py-3"
                >
                  <span class="mt-0.5 text-gold">
                    <AppIcon name="check" :size="15" />
                  </span>
                  <span class="text-[0.82rem] leading-relaxed text-paper/85">{{ feature }}</span>
                </li>
              </ul>
            </section>

            <section v-if="project.gallery.length" v-reveal class="border-t border-white/[0.07] pt-8">
              <p class="eyebrow">06 · Galeria</p>
              <h2 class="mt-3 font-display text-2xl font-semibold tracking-[-0.025em] text-paper">
                Imagens do projeto
              </h2>
              <div class="mt-5 grid gap-4 sm:grid-cols-2">
                <figure
                  v-for="image in project.gallery"
                  :key="image.src"
                  class="overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.02]"
                >
                  <img
                    :src="image.src"
                    :alt="image.alt"
                    class="w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption v-if="image.caption" class="px-4 py-3 text-[0.7rem] text-muted">
                    {{ image.caption }}
                  </figcaption>
                </figure>
              </div>
            </section>
          </article>

          <aside class="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div class="card p-5">
              <h2 class="font-display text-[1rem] font-semibold text-paper">Gostou deste projeto?</h2>
              <p class="mt-2 text-[0.8rem] leading-relaxed text-muted">
                Posso ajudar a construir algo com o mesmo cuidado, adaptado ao seu contexto.
              </p>
              <button
                type="button"
                class="btn btn-primary mt-4 w-full !min-h-[2.75rem] !text-[0.78rem]"
                @click="requestQuote(project.quoteType)"
              >
                Solicitar orçamento
                <AppIcon name="arrow-up-right" :size="15" />
              </button>
              <a
                v-if="whatsappLink"
                :href="whatsappLink"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-secondary mt-2.5 w-full !min-h-[2.75rem] !text-[0.78rem]"
              >
                <AppIcon name="chat" :size="15" />
                Falar sobre o projeto
              </a>
            </div>

            <div class="rounded-xl border border-white/[0.06] bg-white/[0.018] p-5">
              <p class="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-muted/70">
                Transparência
              </p>
              <p class="mt-2 text-[0.72rem] leading-relaxed text-muted/75">
                As informações desta página refletem o que foi efetivamente construído. Métricas,
                depoimentos e resultados não são inventados.
              </p>
            </div>
          </aside>
        </div>

        <div class="mt-14 flex flex-col gap-4 border-t border-white/[0.07] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <RouterLink to="/#projetos" class="inline-flex items-center gap-2 text-[0.82rem] font-medium text-muted transition hover:text-gold">
            <AppIcon name="arrow-left" :size="15" />
            Ver todos os projetos
          </RouterLink>

          <RouterLink
            v-if="nextProject"
            :to="`/projetos/${nextProject.slug}`"
            class="group inline-flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 transition hover:border-gold/30 hover:bg-gold/[0.04]"
          >
            <span class="text-left">
              <span class="block text-[0.6rem] uppercase tracking-[0.18em] text-muted/70">Próximo projeto</span>
              <span class="mt-0.5 block font-display text-[0.9rem] font-semibold text-paper">{{ nextProject.name }}</span>
            </span>
            <AppIcon name="arrow-right" :size="16" class="text-muted transition group-hover:translate-x-0.5 group-hover:text-gold" />
          </RouterLink>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="shell">
        <div class="mx-auto max-w-xl py-16 text-center">
          <p class="eyebrow eyebrow-plain justify-center">Projeto</p>
          <h1 class="section-title mt-4">Projeto não encontrado</h1>
          <p class="mt-4 text-[0.94rem] leading-relaxed text-muted">
            O projeto que você procura não está disponível neste endereço. Veja os projetos
            publicados no portfólio.
          </p>
          <div class="mt-8 flex flex-wrap justify-center gap-3">
            <RouterLink to="/#projetos" class="btn btn-primary">
              Ver projetos
              <AppIcon name="arrow-right" :size="16" />
            </RouterLink>
            <RouterLink to="/" class="btn btn-secondary">Voltar ao início</RouterLink>
          </div>
        </div>
      </div>
    </template>
  </main>
</template>
