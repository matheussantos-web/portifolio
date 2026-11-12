/**
 * Analytics com foco em privacidade.
 *
 * Suporta Plausible Analytics (https://plausible.io).
 * Ativa somente quando VITE_ANALYTICS_DOMAIN estiver definido no .env.
 * Não usa cookies, não rastreia usuários individuais e é leve (~1 KB).
 *
 * Eventos rastreados (apenas quando o domínio está configurado):
 *  - clique em "Solicitar orçamento" (com origem)
 *  - envio de formulário de orçamento (sucesso/erro)
 */

let initialized = false
let domain: string | null = null

export function isAnalyticsEnabled(): boolean {
  if (typeof window === 'undefined') return false
  return Boolean(domain) && !initialized === false
}

export function initAnalytics(domainValue: string): void {
  if (typeof window === 'undefined' || initialized) return
  domain = domainValue
  initialized = true

  // Carrega o script do Plausible de forma não bloqueante
  const script = document.createElement('script')
  script.defer = true
  script.setAttribute('data-domain', domainValue)
  script.src = 'https://plausible.io/js/plausible.js'
  script.onerror = () => {
    console.warn('[analytics] Falha ao carregar o script do Plausible.')
  }
  document.head.appendChild(script)
}

function plausible(eventName: string, props?: Record<string, unknown>): void {
  if (typeof window === 'undefined' || !domain || !initialized) return
  const w = window as unknown as { plausible?: (name: string, options?: { props?: Record<string, unknown> }) => void }
  if (w.plausible) {
    w.plausible(eventName, props ? { props } : undefined)
  }
}

export type QuoteOrigin = 'hero' | 'service' | 'project' | 'footer' | 'contact' | 'final-cta'

export function trackQuoteClick(origin: QuoteOrigin): void {
  plausible('Clique: Solicitar orçamento', { origem: origin })
}

export function trackQuoteSubmit(success: boolean, origin: QuoteOrigin = 'contact'): void {
  plausible(success ? 'Envio: Orçamento (sucesso)' : 'Envio: Orçamento (erro)', {
    origem: origin,
  })
}

export function trackPageView(path: string): void {
  plausible('Visualização de página', { url: path })
}

export function trackWhatsAppClick(context: QuoteOrigin = 'contact'): void {
  plausible('Clique: WhatsApp', { origem: context })
}