<script setup lang="ts">
import AboutSection from '@/components/sections/AboutSection.vue'
import DifferentialsSection from '@/components/sections/DifferentialsSection.vue'
import FinalCtaSection from '@/components/sections/FinalCtaSection.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import PortfolioSection from '@/components/sections/PortfolioSection.vue'
import ProcessSection from '@/components/sections/ProcessSection.vue'
import QuoteSection from '@/components/sections/QuoteSection.vue'
import ServicesSection from '@/components/sections/ServicesSection.vue'
import TechnologiesSection from '@/components/sections/TechnologiesSection.vue'
import { useActiveSection } from '@/lib/active-section'
import { personSchema, usePageSeo, websiteSchema } from '@/lib/seo'

usePageSeo({
  title: 'Th Apps | Matheus Santos — Desenvolvimento Web e Soluções Digitais',
  description:
    'Conheça a Th Apps, marca pessoal de Matheus Santos. Desenvolvimento de sites, sistemas e soluções digitais personalizadas.',
  path: '/',
  jsonLd: [personSchema(), websiteSchema()],
})

useActiveSection(['inicio', 'sobre', 'servicos', 'projetos', 'processo', 'contato'])
</script>

<template>
  <main id="conteudo" tabindex="-1">
    <HeroSection />
    <AboutSection />
    <TechnologiesSection />
    <ServicesSection />
    <PortfolioSection />
    <DifferentialsSection />
    <ProcessSection />
    <QuoteSection />
    <FinalCtaSection />
  </main>
</template>
