/**
 * CONTATOS E LINKS — edite somente este arquivo.
 *
 * Regra do projeto: campos vazios não são renderizados em nenhum lugar.
 * Nada de números, e-mails ou perfis inventados.
 */
export const contact = {
  /** Somente dígitos, com DDI e DDD. Ex.: '5511999999999'. */
  whatsappNumber: '',
  /** Como o número aparece na interface. Ex.: '+55 (11) 99999-9999'. */
  whatsappDisplay: '',
  email: '',
  instagram: '',
  /** Perfil real informado nos repositórios do projeto. */
  github: 'https://github.com/matheussantos-web',
  linkedin: '',
} as const

export type ContactChannel = 'whatsapp' | 'email' | 'instagram' | 'github' | 'linkedin'

export const navigation = [
  { label: 'Início', href: '#inicio', section: 'inicio' },
  { label: 'Sobre mim', href: '#sobre', section: 'sobre' },
  { label: 'Serviços', href: '#servicos', section: 'servicos' },
  { label: 'Projetos', href: '#projetos', section: 'projetos' },
  { label: 'Processo', href: '#processo', section: 'processo' },
  { label: 'Contato', href: '#contato', section: 'contato' },
] as const

export const contactEndpoint = import.meta.env.VITE_CONTACT_ENDPOINT || ''
export const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || ''

export const socialChannels = [
  { id: 'github', label: 'GitHub', href: contact.github },
  { id: 'instagram', label: 'Instagram', href: contact.instagram },
  { id: 'linkedin', label: 'LinkedIn', href: contact.linkedin },
] as const
