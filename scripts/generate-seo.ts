import { copyFile, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'
import { projects } from '../src/data/projects'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(root, 'dist')

// Prioriza variáveis do ambiente (Vercel/Render). Em desenvolvimento, lê o .env.
const fileEnv = loadEnv(process.env.NODE_ENV || 'production', root, '')
const siteUrl = (process.env.VITE_SITE_URL || fileEnv.VITE_SITE_URL || 'https://thapps.example').replace(
  /\/$/,
  '',
)
const lastmod = new Date().toISOString().slice(0, 10)

interface SitemapEntry {
  path: string
  changefreq: 'weekly' | 'monthly' | 'yearly'
  priority: string
}

const entries: SitemapEntry[] = [
  { path: '/', changefreq: 'monthly', priority: '1.0' },
  ...projects.map((project) => ({
    path: `/projetos/${project.slug}`,
    changefreq: 'monthly' as const,
    priority: '0.8',
  })),
  { path: '/politica-de-privacidade', changefreq: 'yearly', priority: '0.3' },
]

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function sitemap(): string {
  const urls = entries
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(`${siteUrl}${entry.path}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

function robots(): string {
  return `User-agent: *
Allow: /
Disallow: /404

Sitemap: ${siteUrl}/sitemap.xml
`
}

async function main() {
  await mkdir(distDir, { recursive: true })
  await Promise.all([
    writeFile(path.join(distDir, 'sitemap.xml'), sitemap(), 'utf8'),
    writeFile(path.join(distDir, 'robots.txt'), robots(), 'utf8'),
  ])

  // Vercel serve 404.html para rotas estáticas não encontradas.
  // O app Vue assume o catch-all e renderiza a página 404 com o layout completo.
  const notFoundSource = path.join(distDir, '404', 'index.html')
  await copyFile(notFoundSource, path.join(distDir, '404.html')).catch(async () => {
    console.warn('Aviso: dist/404/index.html não encontrado; usando dist/index.html como fallback.')
    await copyFile(path.join(distDir, 'index.html'), path.join(distDir, '404.html')).catch(() => {
      console.warn('Aviso: dist/index.html não encontrado; 404.html não foi gerado.')
    })
  })

  console.log(`SEO gerado: sitemap.xml, robots.txt e 404.html (${entries.length} URLs).`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
