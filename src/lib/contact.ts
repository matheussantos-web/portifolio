import { contact } from '@/data/links'

export const projectTypeOptions = [
  { value: 'site-institucional', label: 'Site institucional' },
  { value: 'landing-page', label: 'Landing page' },
  { value: 'sistema-web', label: 'Sistema web' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'loja-virtual', label: 'Loja virtual' },
  { value: 'aplicacao-personalizada', label: 'Aplicação personalizada' },
  { value: 'modernizacao-site', label: 'Modernização de site' },
  { value: 'outro', label: 'Outro' },
] as const

export const budgetOptions = [
  { value: 'nao-definido', label: 'Ainda não defini' },
  { value: 'ate-1000', label: 'Até R$ 1.000' },
  { value: '1000-3000', label: 'R$ 1.000 a R$ 3.000' },
  { value: '3000-5000', label: 'R$ 3.000 a R$ 5.000' },
  { value: '5000-10000', label: 'R$ 5.000 a R$ 10.000' },
  { value: 'acima-10000', label: 'Acima de R$ 10.000' },
] as const

export const timelineOptions = [
  { value: '', label: 'Selecione uma opção' },
  { value: 'o-quanto-antes', label: 'O quanto antes' },
  { value: 'ate-1-mes', label: 'Em até 1 mês' },
  { value: '1-a-3-meses', label: 'De 1 a 3 meses' },
  { value: '3-a-6-meses', label: 'De 3 a 6 meses' },
  { value: 'ainda-nao-defini', label: 'Ainda não defini' },
] as const

export function projectTypeLabel(value: string): string {
  return projectTypeOptions.find((option) => option.value === value)?.label ?? value
}

export function budgetLabel(value: string): string {
  return budgetOptions.find((option) => option.value === value)?.label ?? value
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, 11)
}

export function formatPhoneBR(value: string): string {
  const digits = onlyDigits(value)
  if (!digits) return ''
  if (digits.length <= 2) return `(${digits}`
  const ddd = digits.slice(0, 2)
  const rest = digits.slice(2)
  if (rest.length <= 4) return `(${ddd}) ${rest}`
  if (rest.length <= 8) return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`
  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5, 9)}`
}

export function isValidPhoneBR(value: string): boolean {
  const digits = onlyDigits(value)
  if (digits.length !== 10 && digits.length !== 11) return false
  const ddd = Number(digits.slice(0, 2))
  if (ddd < 11 || ddd > 99) return false
  if (digits.length === 11 && digits[2] !== '9') return false
  return true
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value.trim())
}

export function normalizeWhatsAppNumber(value: string): string {
  return value.replace(/\D/g, '')
}

export const hasWhatsApp = normalizeWhatsAppNumber(contact.whatsappNumber).length >= 10
export const hasEmail = contact.email.trim().length > 0
export const hasInstagram = contact.instagram.trim().length > 0
export const hasLinkedIn = contact.linkedin.trim().length > 0

export type WhatsAppContext = 'default' | 'hero' | 'contact' | 'footer' | 'project' | 'service'

export function whatsAppMessage(
  context: WhatsAppContext = 'default',
  extra?: { projectName?: string; serviceName?: string },
): string {
  switch (context) {
    case 'project':
      return extra?.projectName
        ? `Olá, Matheus! Vi o projeto ${extra.projectName} no site da Th Apps e gostaria de conversar sobre algo parecido.`
        : 'Olá, Matheus! Vi um projeto no site da Th Apps e gostaria de conversar.'
    case 'service':
      return extra?.serviceName
        ? `Olá, Matheus! Vim pelo site da Th Apps e gostaria de falar sobre ${extra.serviceName.toLowerCase()}.`
        : 'Olá, Matheus! Vim pelo site da Th Apps e gostaria de falar sobre um serviço.'
    case 'hero':
      return 'Olá, Matheus! Vim pelo site da Th Apps e gostaria de conversar sobre uma ideia.'
    case 'contact':
      return 'Olá, Matheus! Quero conversar sobre um projeto digital.'
    case 'footer':
      return 'Olá, Matheus! Vim pelo site da Th Apps.'
    default:
      return 'Olá, Matheus! Vim pelo site da Th Apps e gostaria de conversar sobre um projeto.'
  }
}

export function buildWhatsAppLink(
  context: WhatsAppContext = 'default',
  extra?: { projectName?: string; serviceName?: string; message?: string },
): string | null {
  const number = normalizeWhatsAppNumber(contact.whatsappNumber)
  if (!number) return null
  const message = extra?.message || whatsAppMessage(context, extra)
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function fallbackWhatsAppMessage(data: {
  name: string
  email: string
  phone: string
  projectType: string
  description: string
}): string {
  return [
    'Olá, Matheus! Tentei enviar uma solicitação de orçamento pelo site da Th Apps, mas o envio não foi concluído.',
    '',
    `Nome: ${data.name}`,
    `E-mail: ${data.email}`,
    `WhatsApp: ${data.phone}`,
    `Tipo de projeto: ${projectTypeLabel(data.projectType)}`,
    '',
    `Descrição: ${data.description}`,
  ].join('\n')
}
