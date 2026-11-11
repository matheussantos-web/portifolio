import { useHead } from '@unhead/vue'
import { brand } from '@/data/brand'
import { socialChannels } from '@/data/links'

interface PageSeoOptions {
  title: string
  description: string
  path: string
  image?: string
  type?: 'website' | 'article'
  noindex?: boolean
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  return `${brand.siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

export function usePageSeo(options: PageSeoOptions) {
  const canonical = absoluteUrl(options.path)
  const image = absoluteUrl(options.image || '/og-image.png')
  const type = options.type || 'website'

  const scripts = options.jsonLd
    ? [
        {
          key: 'thapps-json-ld',
          type: 'application/ld+json',
          textContent: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': Array.isArray(options.jsonLd) ? options.jsonLd : [options.jsonLd],
          }),
        },
      ]
    : []

  useHead({
    title: options.title,
    meta: [
      { name: 'description', content: options.description },
      { name: 'robots', content: options.noindex ? 'noindex, nofollow' : 'index, follow' },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: brand.name },
      { property: 'og:locale', content: 'pt_BR' },
      { property: 'og:title', content: options.title },
      { property: 'og:description', content: options.description },
      { property: 'og:url', content: canonical },
      { property: 'og:image', content: image },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: `${brand.name} — ${brand.tagline}` },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: options.title },
      { name: 'twitter:description', content: options.description },
      { name: 'twitter:image', content: image },
    ],
    link: [{ rel: 'canonical', href: canonical }],
    script: scripts,
  })
}

export function personSchema() {
  const sameAs = socialChannels.map((channel) => channel.href).filter(Boolean)
  return {
    '@type': 'Person',
    '@id': `${brand.siteUrl}/#matheus-santos`,
    name: brand.founder,
    jobTitle: brand.roleLong,
    description: brand.shortDescription,
    url: brand.siteUrl,
    sameAs,
    knowsAbout: [
      'HTML5',
      'CSS3',
      'JavaScript',
      'Tailwind CSS',
      'Vue.js',
      'React',
      'Python',
      'Node.js',
      'Express',
      'PostgreSQL',
    ],
  }
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${brand.siteUrl}/#website`,
    name: brand.name,
    url: brand.siteUrl,
    description: brand.seoDescription,
    inLanguage: 'pt-BR',
    publisher: { '@id': `${brand.siteUrl}/#matheus-santos` },
  }
}
