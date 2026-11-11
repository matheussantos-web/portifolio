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
   * Imagem de apresentação. Campo vazio: o bloco visual não é renderizado.
   * Quando houver screenshot real, coloque o arquivo em /public (webp) e informe o caminho.
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
    status: 'Online',
    statusTone: 'online',
    technologies: ['React 19', 'Vite', 'Tailwind CSS v4', 'JavaScript'],
    website: 'https://matheussantos-web.github.io/brokencrownsite/',
    repository: 'https://github.com/matheussantos-web/brokencrownsite',
    linkNote: 'Website hospedado no GitHub Pages.',
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
  {
    slug: 'albion-market-insights',
    name: 'Albion Market Insights',
    category: 'Sistemas',
    description:
      'Dashboard privado e API para análise de mercado do Albion Online, integrando ingestão local de dados em tempo real e baseline da API pública do AODP.',
    status: 'Repositório público',
    statusTone: 'repository',
    technologies: ['Node.js', 'Express', 'SQLite', 'REST API', 'JavaScript'],
    website: '',
    repository: 'https://github.com/matheussantos-web/albion-market-insights',
    linkNote: 'Código-fonte disponível no repositório.',
    quoteType: 'sistema-web',
    image: '',
    imageAlt: '',
    accent: 'gold',
    monogram: 'AMI',
    overview:
      'Dashboard privado para análise de oportunidades e variações de preços no mercado do Albion Online. O sistema separa dados capturados privadamente do client de dados públicos, garantindo vantagem competitiva.',
    objective:
      'Monitorar preços de itens nas diferentes cidades do jogo, permitindo identificar margens de lucro e oportunidades de negociação de forma automatizada.',
    problem:
      'A consulta manual de preços no jogo exige deslocamento entre cidades e consumo de tempo considerável, além de dados públicos serem acessíveis a todos os concorrentes.',
    solution:
      'Servidor em Express com banco SQLite local (better-sqlite3), ingestão de dados privados via client e sincronização pontual de watchlist via API pública do Albion Online Data Project.',
    features: [
      'Ingestão e armazenamento de dados privados de mercado',
      'Integração de fallback com a API pública do AODP',
      'Consulta de preços mais recentes por cidade e item',
      'Watchlist personalizada com cache e persistência local',
    ],
    gallery: [],
  },
  {
    slug: 'dona-ca-doceria',
    name: 'Dona Cá Doceria',
    category: 'Websites',
    description:
      'Website e catálogo digital para confeitaria artesanal, apresentando cardápio de doces, bolos decorados e canal direto para encomendas.',
    status: 'Online',
    statusTone: 'online',
    technologies: ['HTML5', 'Tailwind CSS', 'JavaScript'],
    website: 'https://dona-ca-doceria.vercel.app',
    repository: 'https://github.com/matheussantos-web/dona-ca-doceria',
    linkNote: 'Site publicado e acessível na Vercel.',
    quoteType: 'site-institucional',
    image: '',
    imageAlt: '',
    accent: 'violet',
    monogram: 'DC',
    overview:
      'Página institucional desenvolvida para a confeitaria artesanal Dona Cá Doceria. Apresenta os produtos, a história da marca e facilita a solicitação de encomendas.',
    objective:
      'Proporcionar uma presença digital profissional para o negócio, exibindo os produtos de maneira atrativa e direcionando o cliente para o atendimento no WhatsApp.',
    problem:
      'A doceria dependia apenas de redes sociais para divulgar produtos e cardápio, dificultando a visualização organizada de opções e valores.',
    solution:
      'Interface limpa e responsiva desenvolvida com HTML e Tailwind CSS, destacando fotografias de produtos, informações de contato e link direto de pedido.',
    features: [
      'Cardápio digital organizado por categorias',
      'Apresentação institucional e história da doceria',
      'Integração direta para pedidos via WhatsApp',
      'Design responsivo para smartphones e desktops',
    ],
    gallery: [],
  },
  {
    slug: 'simulado-dev-senai',
    name: 'Simulado DEV SENAI',
    category: 'Aplicações',
    description:
      'Aplicação web interativa para estudantes praticarem questões de desenvolvimento de software com correção automática e suporte a tema escuro.',
    status: 'Online',
    statusTone: 'online',
    technologies: ['Vue 3', 'Tailwind CSS', 'Supabase', 'JavaScript'],
    website: 'https://matheussantos-web.github.io/simuladodev/',
    repository: 'https://github.com/matheussantos-web/simuladodev',
    linkNote: 'Aplicação hospedada no GitHub Pages.',
    quoteType: 'aplicacao-personalizada',
    image: '',
    imageAlt: '',
    accent: 'gold',
    monogram: 'SD',
    overview:
      'Plataforma interativa desenvolvida para apoiar estudantes de desenvolvimento de software em suas rotinas de estudos, com simulados práticos e pontuação em tempo real.',
    objective:
      'Auxiliar na fixação de conceitos de programação e banco de dados por meio de exercícios práticos e feedback imediato de desempenho.',
    problem:
      'Estudantes precisavam de uma ferramenta ágil e focada para testar seus conhecimentos antes de avaliações técnicas, sem dependência de formulários estáticos.',
    solution:
      'Aplicação single-page construída com Vue 3, Tailwind CSS com modo escuro nativo e backend Supabase para gerenciamento dinâmico de questões e gabaritos.',
    features: [
      'Interface de simulado com alternativas e gabarito imediato',
      'Modo claro e escuro (dark mode)',
      'Integração com Supabase para dados de questões',
      'Cálculo de desempenho e revisão de respostas',
    ],
    gallery: [],
  },
  {
    slug: 'bots-discord-albion',
    name: 'Bots Discord — Albion Online',
    category: 'Sistemas',
    description:
      'Automações e bots em Python para gestão de comunidades e guildas no Discord, incluindo pings de eventos, filas inteligentes por classe e verificação de membros.',
    status: 'Repositório público',
    statusTone: 'repository',
    technologies: ['Python', 'discord.py', 'Flask', 'REST API'],
    website: '',
    repository: 'https://github.com/matheussantos-web/bots-discord',
    linkNote: 'Código-fonte disponível no repositório.',
    quoteType: 'sistema-web',
    image: '',
    imageAlt: '',
    accent: 'crimson',
    monogram: 'BD',
    overview:
      'Conjunto de bots e serviços em Python para Discord desenvolvidos para organizar atividades cooperativas, chamadas de voz e registros de membros de guildas de jogos online.',
    objective:
      'Automatizar tarefas repetitivas de moderação, montagem de grupos de masmorras (DGs) e controle de presença em servidores do Discord.',
    problem:
      'Organizar manualmente grupos de dezenas de jogadores com classes específicas gera confusão de vagas e perda de tempo antes de cada atividade.',
    solution:
      'Bot multifuncional utilizando discord.py e servidor web Flask integrado para execução contínua, com botões interativos para seleção de classes e fila de espera automática.',
    features: [
      'Pings de masmorras e eventos com limite de vagas por classe',
      'Sistema de fila de espera em tempo real nos embeds',
      'Promoção automática de participantes quando uma vaga é liberada',
      'Criação de canais de voz temporários dinâmicos',
      'Verificação automática de integrantes através da API do jogo',
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
