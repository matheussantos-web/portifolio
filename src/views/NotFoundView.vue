<script setup lang="ts">
import { usePageSeo } from '@/lib/seo'
import AppIcon from '@/components/ui/AppIcon.vue'

usePageSeo({
  title: 'Página não encontrada | Th Apps',
  description: 'A página que você procura não foi encontrada no site da Th Apps.',
  path: '/404',
  noindex: true,
})
</script>

<template>
  <main id="conteudo" tabindex="-1" class="relative flex min-h-[80vh] items-center pt-[calc(var(--header-height)+2rem)] pb-20">
    <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <div class="absolute inset-0 grid-lines opacity-40" />
      <div class="ambient-orb left-1/2 top-1/3 h-[24rem] w-[30rem] -translate-x-1/2 bg-gold/[0.06]" />
    </div>

    <div class="shell">
      <div class="mx-auto max-w-xl text-center">
        <p class="font-display text-[clamp(4.5rem,16vw,9rem)] font-semibold leading-none tracking-[-0.06em] text-gradient-gold">
          404
        </p>
        <p class="eyebrow eyebrow-plain mt-2 justify-center">Página não encontrada</p>
        <h1 class="section-title mt-4">Este caminho não existe.</h1>
        <p class="mx-auto mt-4 max-w-md text-[0.92rem] leading-relaxed text-muted">
          O endereço pode ter mudado ou o link está incorreto. Você pode voltar ao início ou
          explorar os projetos publicados.
        </p>

        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <RouterLink to="/" class="btn btn-primary">
            Voltar ao início
            <AppIcon name="arrow-right" :size="16" />
          </RouterLink>
          <RouterLink to="/#projetos" class="btn btn-secondary">
            Ver projetos
            <AppIcon name="arrow-up-right" :size="15" />
          </RouterLink>
        </div>
      </div>
    </div>
  </main>
</template>
