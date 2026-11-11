export interface Technology {
  name: string
  description: string
  /** Ícone do Simple Icons ou 'code' para o ícone genérico. */
  icon: string
}

export interface TechnologyCategory {
  id: string
  title: string
  description: string
  items: Technology[]
}

/**
 * Ajuste esta lista conforme sua stack real.
 * Sem barras de porcentagem e sem níveis de domínio inventados.
 */
export const technologyCategories: TechnologyCategory[] = [
  {
    id: 'frontend',
    title: 'Front-end',
    description: 'Interfaces, estrutura e interação.',
    items: [
      { name: 'HTML5', description: 'Estrutura semântica', icon: 'siHtml5' },
      { name: 'CSS3', description: 'Estilos e layouts', icon: 'siCss' },
      { name: 'JavaScript', description: 'Interatividade', icon: 'siJavascript' },
      { name: 'Tailwind CSS', description: 'Estilização utilitária', icon: 'siTailwindcss' },
      { name: 'Vue.js', description: 'Interfaces reativas', icon: 'siVuedotjs' },
      { name: 'React', description: 'Componentização', icon: 'siReact' },
    ],
  },
  {
    id: 'backend',
    title: 'Back-end',
    description: 'Lógica, dados e serviços.',
    items: [
      { name: 'Python', description: 'Automação e back-end', icon: 'siPython' },
      { name: 'Node.js', description: 'Aplicações e APIs', icon: 'siNodedotjs' },
      { name: 'Express', description: 'Serviços HTTP', icon: 'siExpress' },
      { name: 'PostgreSQL', description: 'Banco de dados relacional', icon: 'siPostgresql' },
    ],
  },
  {
    id: 'ferramentas',
    title: 'Ferramentas',
    description: 'Do código à publicação.',
    items: [
      { name: 'Git', description: 'Versionamento', icon: 'siGit' },
      { name: 'GitHub', description: 'Código e colaboração', icon: 'siGithub' },
      { name: 'VS Code', description: 'Ambiente de desenvolvimento', icon: 'code' },
      { name: 'Vite', description: 'Build e dev server', icon: 'siVite' },
      { name: 'Render', description: 'Deploy de aplicações', icon: 'siRender' },
      { name: 'GitHub Pages', description: 'Publicação estática', icon: 'siGithubpages' },
    ],
  },
]
