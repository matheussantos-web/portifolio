export interface Service {
  id: string
  title: string
  description: string
  icon: 'monitor' | 'layers' | 'network' | 'bag' | 'puzzle' | 'refresh'
  projectType: string
}

export const services: Service[] = [
  {
    id: 'sites',
    title: 'Desenvolvimento de Sites',
    description:
      'Sites institucionais, landing pages, páginas profissionais e apresentações comerciais.',
    icon: 'monitor',
    projectType: 'site-institucional',
  },
  {
    id: 'sistemas',
    title: 'Sistemas Web',
    description:
      'Sistemas personalizados para gerenciamento, organização e automação de processos.',
    icon: 'layers',
    projectType: 'sistema-web',
  },
  {
    id: 'plataformas',
    title: 'Plataformas Digitais',
    description: 'Marketplaces, plataformas de serviços e soluções digitais completas.',
    icon: 'network',
    projectType: 'marketplace',
  },
  {
    id: 'lojas',
    title: 'Lojas Virtuais',
    description: 'Experiências de comércio eletrônico para empresas e empreendedores.',
    icon: 'bag',
    projectType: 'loja-virtual',
  },
  {
    id: 'aplicacoes',
    title: 'Aplicações Personalizadas',
    description:
      'Ferramentas e aplicações desenvolvidas conforme as necessidades de cada cliente.',
    icon: 'puzzle',
    projectType: 'aplicacao-personalizada',
  },
  {
    id: 'modernizacao',
    title: 'Modernização de Sites',
    description: 'Reformulação visual, melhorias de usabilidade, responsividade e desempenho.',
    icon: 'refresh',
    projectType: 'modernizacao-site',
  },
]
