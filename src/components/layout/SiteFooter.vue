<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { brand } from '@/data/brand'
import { contact, navigation, socialChannels } from '@/data/links'
import { services } from '@/data/services'
import { buildWhatsAppLink, hasEmail, hasWhatsApp } from '@/lib/contact'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppLogo from '@/components/ui/AppLogo.vue'
import SocialIcon from '@/components/ui/SocialIcon.vue'

const route = useRoute()
const year = new Date().getFullYear()
const isHome = computed(() => route.path === '/')
const configuredSocials = socialChannels.filter((channel) => channel.href)
const whatsappLink = computed(() => buildWhatsAppLink('footer'))

function sectionLink(hash: string) {
  return isHome.value ? hash : `/${hash}`
}
</script>

<template>
  <footer class="relative overflow-hidden border-t border-white/[0.07] bg-[#0b0c0e]">
    <div class="pointer-events-none absolute -top-40 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-gold/[0.06] blur-[110px]" />
    <div class="shell relative py-14 md:py-18">
      <div class="grid gap-12 lg:grid-cols-[1.35fr_0.8fr_1fr_1fr]">
        <div>
          <RouterLink to="/" class="inline-flex rounded-lg" aria-label="Th Apps Matheus Santos — ir para o início">
            <AppLogo />
          </RouterLink>
          <p class="mt-5 max-w-sm text-sm leading-relaxed text-muted">
            {{ brand.shortDescription }} Uma marca pessoal, com contato direto com quem desenvolve.
          </p>

          <div class="mt-6 flex flex-wrap items-center gap-2.5">
            <a
              v-if="whatsappLink"
              :href="whatsappLink"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-2 text-xs text-muted transition hover:border-gold/35 hover:text-paper"
            >
              <SocialIcon name="whatsapp" :size="15" />
              WhatsApp
            </a>
            <a
              v-if="hasEmail"
              :href="`mailto:${contact.email}`"
              class="inline-flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-2 text-xs text-muted transition hover:border-gold/35 hover:text-paper"
            >
              <AppIcon name="mail" :size="15" />
              E-mail
            </a>
            <a
              v-for="channel in configuredSocials"
              :key="channel.id"
              :href="channel.href"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-2 text-xs text-muted transition hover:border-gold/35 hover:text-paper"
            >
              <SocialIcon :name="channel.id" :size="15" />
              {{ channel.label }}
            </a>
          </div>
        </div>

        <nav aria-label="Navegação do rodapé">
          <h2 class="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-paper">Navegação</h2>
          <ul class="mt-5 space-y-3">
            <li v-for="item in navigation" :key="item.href">
              <RouterLink
                :to="sectionLink(item.href)"
                class="text-sm text-muted transition hover:text-gold"
              >
                {{ item.label }}
              </RouterLink>
            </li>
            <li>
              <RouterLink :to="sectionLink('#orcamento')" class="text-sm text-muted transition hover:text-gold">
                Solicitar orçamento
              </RouterLink>
            </li>
          </ul>
        </nav>

        <div>
          <h2 class="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-paper">Serviços</h2>
          <ul class="mt-5 space-y-3">
            <li v-for="service in services" :key="service.id">
              <RouterLink
                :to="sectionLink('#servicos')"
                class="text-sm text-muted transition hover:text-gold"
              >
                {{ service.title }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <h2 class="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-paper">Contato</h2>
          <p class="mt-5 text-sm leading-relaxed text-muted">
            Tem uma ideia ou precisa de uma solução digital? Vamos conversar.
          </p>
          <RouterLink :to="sectionLink('#orcamento')" class="btn btn-secondary mt-5 w-full !min-h-[2.8rem] !text-[0.8rem]">
            Solicitar orçamento
            <AppIcon name="arrow-up-right" :size="15" />
          </RouterLink>
          <a
            v-if="whatsappLink"
            :href="whatsappLink"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[0.8rem] font-medium text-muted transition hover:text-gold"
          >
            <SocialIcon name="whatsapp" :size="15" />
            Conversar pelo WhatsApp
          </a>
        </div>
      </div>

      <div class="mt-12 flex flex-col gap-4 border-t border-white/[0.07] pt-6 text-[0.7rem] text-muted/80 md:flex-row md:items-center md:justify-between">
        <p>© {{ year }} Th Apps. Todos os direitos reservados.</p>
        <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
          <RouterLink to="/politica-de-privacidade" class="transition hover:text-gold">
            Política de privacidade
          </RouterLink>
          <p>Desenvolvido por Matheus Santos — Th Apps.</p>
        </div>
      </div>
    </div>
  </footer>
</template>
