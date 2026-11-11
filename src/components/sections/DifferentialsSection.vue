<script setup lang="ts">
import { differentials } from '@/data/differentials'
import AppIcon from '@/components/ui/AppIcon.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
</script>

<template>
  <section id="diferenciais" class="section relative" aria-labelledby="differentials-title">
    <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <div class="absolute inset-x-0 top-0 gold-rule" />
      <div class="ambient-orb left-1/3 top-1/4 h-[22rem] w-[30rem] bg-gold/[0.045]" />
    </div>

    <div class="shell">
      <SectionHeading
        v-reveal
        eyebrow="Diferenciais da Th Apps"
        align="center"
        description="A Th Apps é a marca pessoal de Matheus Santos. Isso significa falar diretamente com quem planeja e desenvolve o seu projeto."
      >
        <template #default>
          Por que trabalhar <span class="serif-accent">comigo</span>
        </template>
      </SectionHeading>

      <ul class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="(item, index) in differentials"
          :key="item.title"
          v-reveal="{ delay: index * 0.05 }"
          class="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.018] p-6 transition hover:border-gold/25 hover:bg-gold/[0.035]"
        >
          <span class="pointer-events-none absolute -right-6 -top-6 font-display text-[4.5rem] font-semibold leading-none text-white/[0.035] transition group-hover:text-gold/[0.07]">
            0{{ index + 1 }}
          </span>

          <span class="relative grid size-10 place-items-center rounded-xl border border-gold/20 bg-gold/[0.06] text-gold">
            <AppIcon :name="item.icon" :size="18" />
          </span>

          <h3 class="relative mt-5 font-display text-[1.02rem] font-semibold tracking-[-0.015em] text-paper">
            {{ item.title }}
          </h3>
          <p class="relative mt-2 text-[0.84rem] leading-relaxed text-muted">
            {{ item.description }}
          </p>
        </li>
      </ul>

      <div v-reveal class="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-gold/[0.14] bg-gold/[0.03] px-6 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p class="font-display text-[1.02rem] font-semibold text-paper">
            Você fala com o desenvolvedor, não com um intermediário.
          </p>
          <p class="mt-1 text-[0.8rem] text-muted">
            Da primeira conversa à entrega, o acompanhamento é direto.
          </p>
        </div>
        <RouterLink to="/#contato" class="btn btn-primary shrink-0 !min-h-[2.7rem] !text-[0.78rem]">
          Vamos conversar
          <AppIcon name="arrow-up-right" :size="15" />
        </RouterLink>
      </div>
    </div>
  </section>
</template>
