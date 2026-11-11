<script setup lang="ts">
import { buildWhatsAppLink } from '@/lib/contact'
import { useQuoteRequest } from '@/lib/use-quote-request'
import AppIcon from '@/components/ui/AppIcon.vue'

const { requestQuote } = useQuoteRequest()
const whatsappLink = buildWhatsAppLink('contact')
</script>

<template>
  <section class="relative overflow-hidden py-16 sm:py-20" aria-labelledby="final-cta-title">
    <div class="shell">
      <div v-reveal class="relative overflow-hidden rounded-[1.8rem] border border-gold/[0.18] bg-[linear-gradient(145deg,rgba(41,42,48,0.55),rgba(13,14,16,0.96))] px-6 py-12 text-center sm:px-10 sm:py-16">
        <div class="pointer-events-none absolute inset-0" aria-hidden="true">
          <div class="absolute inset-0 grid-lines opacity-50" />
          <div class="absolute left-1/2 top-[-8rem] h-[22rem] w-[34rem] -translate-x-1/2 rounded-full bg-gold/[0.14] blur-[90px]" />
          <div class="absolute -bottom-24 -right-16 h-56 w-56 rounded-full border border-gold/10" />
          <div class="absolute -bottom-16 -right-8 h-40 w-40 rounded-full border border-gold/10" />
        </div>

        <div class="relative mx-auto max-w-2xl">
          <p class="eyebrow eyebrow-plain justify-center">Vamos começar</p>
          <h2 id="final-cta-title" class="section-title mt-4">
            Seu próximo projeto pode <span class="serif-accent">começar aqui.</span>
          </h2>
          <p class="mx-auto mt-5 max-w-xl text-[0.94rem] leading-relaxed text-muted">
            Tem uma ideia, um negócio ou precisa de uma solução digital? Vamos conversar.
          </p>

          <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button v-magnetic type="button" class="btn btn-primary w-full sm:w-auto" @click="requestQuote()">
              Solicitar orçamento
              <AppIcon name="arrow-up-right" :size="16" />
            </button>
            <a
              v-if="whatsappLink"
              v-magnetic
              :href="whatsappLink"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-secondary w-full sm:w-auto"
            >
              <AppIcon name="chat" :size="16" />
              Conversar pelo WhatsApp
            </a>
          </div>

          <p class="mt-6 text-[0.66rem] uppercase tracking-[0.2em] text-muted/60">
            Atendimento direto com o desenvolvedor
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
