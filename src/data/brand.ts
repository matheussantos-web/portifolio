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
  siteUrl: (import.meta.env.VITE_SITE_URL || 'https://thapps.example').replace(/\/$/, ''),
  /**
   * Espaço para fotografia profissional.
   * Coloque o arquivo em /public (ex.: /sobre.jpg) e informe o caminho abaixo.
   * Enquanto estiver vazio, um placeholder elegante é exibido.
   */
  aboutPhoto: '',
  aboutPhotoAlt: 'Retrato de Matheus Santos, desenvolvedor web e criador da Th Apps',
} as const
