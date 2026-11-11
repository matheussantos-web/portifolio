export type ProjectCategory = 'Websites' | 'Sistemas' | 'Plataformas' | 'Aplicações'

export interface ProjectImage {
  src: string
  alt: string
  caption?: string
}

export interface Project {
  slug: string
  name: string
  category: ProjectCategory
  description: string
  status: string
  statusTone: 'online' | 'repository' | 'in-progress'
  technologies: string[]
  website: string
  repository: string
  /** Observação honesta exibida junto aos links (ex.: cold start do Render). */
  linkNote: string
  quoteType: string
  /**
   * Imagem de apresentação. Deixe vazio para usar o placeholder elegante.
   * Quando houver uma imagem real, coloque o arquivo em /public e informe o caminho.
   */
  image: string
  imageAlt: string
  accent: 'violet' | 'crimson' | 'gold'
  monogram: string
  overview: string
  objective: string
  problem: string
  solution: string
  features: string[]
  /** Galeria real do projeto. Enquanto estiver vazia, a seção não é renderizada. */
  gallery: ProjectImage[]
}

/**
 * Projetos reais. Não adicione resultados, clientes, métricas ou funcionalidades
 * que não possam ser comprovados.
 *
 * Campos sem informação confirmada devem ficar vazios e são ocultados na interface.
 */
export const projects: Project[] = [
  {
    slug: 'festou',
    name: 'Festou!',
    category: 'Plataformas',
    description:
      'Plataforma digital voltada ao ecossistema de eventos, conectando organizadores e fornecedores, com funcionalidades de gestão e solicitação de orçamentos.',
    status: 'Online',
    statusTone: 'online',
    technologies: ['Vue 3', 'Vite', 'Tailwind CSS', 'Express', 'PostgreSQL'],
    website: 'https://festou.onrender.com',
    repository: 'https://github.com/matheussantos-web/festou',
    linkNote:
      'O site está hospedado no Render e pode levar alguns segundos para carregar na primeira visita.',
    quoteType: 'marketplace',
    image: '',
    imageAlt: '',
    accent: 'violet',
    monogram: 'F!',
    overview:
      'O Festou! é uma plataforma digital para o ecossistema de eventos. Reúne uma vitrine de fornecedores, solicitações de orçamento e convites digitais com RSVP em um só lugar.',
    objective:
      'Conectar organizadores e fornecedores, facilitando a descoberta de serviços, a organização de orçamentos e a comunicação com os convidados.',
    problem:
      'Quem organiza uma festa costuma lidar com vários canais para encontrar fornecedores, comparar orçamentos e gerenciar convites. O Festou! centraliza essas etapas em uma única plataforma.',
    solution:
      'Uma aplicação web com vitrine de fornecedores, fluxo de orçamentos e convites digitais com confirmação de presença. O front-end em Vue consome uma API em Express e um banco PostgreSQL.',
    features: [
      'Vitrine de fornecedores de bolos, doces e brinquedos',
      'Solicitação e organização de orçamentos',
      'Convites digitais com confirmação de presença (RSVP)',
      'Área de gestão para acompanhar pedidos',
    ],
    gallery: [],
  },
  {
    slug: 'broken-crown',
    name: 'Broken Crown',
    category: 'Websites',
    description:
      'Website institucional de uma comunidade gamer, com identidade visual medieval, temática dark fantasy e apresentação da comunidade.',
    status: 'Repositório público',
    statusTone: 'repository',
    technologies: ['React 19', 'Vite', 'Tailwind CSS v4', 'JavaScript'],
    website: '',
    repository: 'https://github.com/matheussantos-web/brokencrownsite',
    linkNote: 'Projeto disponível publicamente como repositório de código.',
    quoteType: 'site-institucional',
    image: '',
    imageAlt: '',
    accent: 'crimson',
    monogram: 'BC',
    overview:
      'Website institucional da guilda BROKEN CROWN, comunidade de Albion Online. O projeto traduz a identidade medieval e a estética dark fantasy da guilda em uma experiência digital.',
    objective:
      'Criar um portal próprio para a comunidade, com identidade visual marcante e informações organizadas sobre a guilda.',
    problem:
      'A comunidade precisava de um espaço oficial que reunisse sua identidade e suas informações, em vez de depender apenas de canais externos.',
    solution:
      'Uma interface construída com React e Tailwind CSS, com tema dark fantasy em preto, dourado metálico e prata, seções institucionais e conteúdo preparado para evoluir junto com a comunidade.',
    features: [
      'Página institucional com identidade dark fantasy',
      'Seções de apresentação da guilda',
      'Layout responsivo para diferentes telas',
      'Estrutura de conteúdo preparada para evoluir',
    ],
    gallery: [],
  },
]

export const projectCategories: Array<'Todos' | ProjectCategory> = [
  'Todos',
  'Websites',
  'Sistemas',
  'Plataformas',
  'Aplicações',
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}
