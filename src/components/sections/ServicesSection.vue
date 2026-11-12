<script setup lang="ts">
import { services } from '@/data/services'
import { useQuoteRequest } from '@/lib/use-quote-request'
import { trackQuoteClick } from '@/lib/analytics'
import AppIcon from '@/components/ui/AppIcon.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'

const { requestQuote } = useQuoteRequest()
</script>

<template>
  <section id="servicos" class="section relative" aria-labelledby="services-title">
    <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <div class="ambient-orb left-[-12rem] top-1/3 h-[26rem] w-[26rem] bg-[#6d4bb8]/[0.06]" />
    </div>

    <div class="shell">
      <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          v-reveal
          eyebrow="Serviços"
          description="Soluções digitais pensadas para o seu objetivo — com planejamento, design e desenvolvimento no mesmo lugar."
        >
          <template #default>
            O que posso construir <span class="serif-accent">para você</span>
          </template>
        </SectionHeading>

        <button
          v-reveal
          v-magnetic
          type="button"
          class="btn btn-secondary shrink-0 self-start md:self-auto"
          @click="() => { trackQuoteClick('service'); requestQuote() }"
        >
          Solicitar orçamento
          <AppIcon name="arrow-up-right" :size="16" />
        </button>
      </div>

      <ul class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="(service, index) in services"
          :key="service.id"
          v-reveal="{ delay: index * 0.05 }"
        >
          <article
            v-glow
            class="card card-hover glow-card group flex h-full flex-col p-6"
          >
            <div class="relative z-10 flex h-full flex-col">
              <div class="flex items-start justify-between gap-3">
                <span class="grid size-11 place-items-center rounded-xl border border-gold/20 bg-gold/[0.06] text-gold transition group-hover:border-gold/40 group-hover:bg-gold/[0.1]">
                  <AppIcon :name="service.icon" :size="20" />
                </span>
                <span class="font-mono text-[0.6rem] tracking-[0.16em] text-muted/40">
                  0{{ index + 1 }}
                </span>
              </div>

              <h3 class="mt-5 font-display text-[1.05rem] font-semibold tracking-[-0.015em] text-paper">
                {{ service.title }}
              </h3>
              <p class="mt-2 flex-1 text-[0.84rem] leading-relaxed text-muted">
                {{ service.description }}
              </p>

              <button
                type="button"
                class="mt-6 inline-flex items-center gap-1.5 self-start text-[0.76rem] font-medium text-muted transition hover:text-gold"
                :aria-label="`Solicitar orçamento para ${service.title}`"
                @click="() => { trackQuoteClick('service'); requestQuote(service.projectType) }"
              >
                Solicitar orçamento
                <AppIcon
                  name="arrow-right"
                  :size="14"
                  class="transition group-hover:translate-x-0.5"
                />
              </button>
            </div>
          </article>
        </li>
      </ul>

      <p v-reveal class="mt-8 text-center text-[0.72rem] leading-relaxed text-muted/70">
        Cada projeto é avaliado individualmente. Escopo, prazo e investimento são definidos após a
        conversa inicial.
      </p>
    </div>
  </section>
</template>
