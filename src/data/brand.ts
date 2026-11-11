import { resolveSiteUrl } from './site'

export const brand = {
  name: 'Th Apps',
  founder: 'Matheus Santos',
  role: 'Desenvolvedor Web',
  roleLong: 'Desenvolvedor Web & Criador da Th Apps',
  tagline: 'Ideias em código. Soluções em realidade.',
  shortDescription:
    'Desenvolvimento de sites, sistemas e soluções digitais modernas, funcionais e personalizadas.',
  seoTitle: 'Th Apps | Matheus Santos — Desenvolvimento Web e Soluções Digitais',
  seoDescription:
    'Conheça a Th Apps, marca pessoal de Matheus Santos. Desenvolvimento de sites, sistemas e soluções digitais personalizadas.',
  siteUrl: resolveSiteUrl(import.meta.env.VITE_SITE_URL),
  /**
   * Foto profissional. Coloque o arquivo em /public (ex.: /sobre.webp)
   * e informe o caminho abaixo. Campo vazio: o bloco não é renderizado.
   */
  aboutPhoto: '/sobre.webp',
  aboutPhotoAlt: 'Retrato de Matheus Santos, desenvolvedor web e criador da Th Apps',
} as const
