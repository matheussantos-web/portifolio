/**
 * Origem canônica do site. Única fonte do domínio padrão.
 * Canonical, Open Graph, sitemap e robots usam este valor
 * (ou VITE_SITE_URL, se definido, sem barra final).
 */
export const DEFAULT_SITE_URL = 'https://www.th.app.br'

export const OG_IMAGE_PATH = '/og-image.png'
export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630

export function resolveSiteUrl(candidate?: string | null): string {
  const value = (candidate || '').trim().replace(/\/$/, '')
  if (!value || /thapps\.example/i.test(value)) return DEFAULT_SITE_URL
  return value
}
