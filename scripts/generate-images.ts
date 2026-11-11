import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')
const brandDir = path.join(publicDir, 'brand')

const symbolPath = path.join(brandDir, 'thapps-symbol-gold.png')
const logoPath = path.join(brandDir, 'thapps-logo.png')

async function makeIcon(size: number, output: string) {
  const symbolSize = Math.round(size * 0.64)
  const symbol = await sharp(symbolPath)
    .resize({ width: symbolSize, height: symbolSize, fit: 'contain' })
    .png()
    .toBuffer()

  const background = Buffer.from(`
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stop-color="#D6A64A" stop-opacity="0.22" />
          <stop offset="60%" stop-color="#D6A64A" stop-opacity="0.05" />
          <stop offset="100%" stop-color="#0D0E10" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#D6A64A" stop-opacity="0.5" />
          <stop offset="55%" stop-color="#D6A64A" stop-opacity="0.12" />
          <stop offset="100%" stop-color="#F4F4F4" stop-opacity="0.18" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="#0D0E10" />
      <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="url(#glow)" />
      <rect x="${size * 0.045}" y="${size * 0.045}" width="${size * 0.91}" height="${size * 0.91}" rx="${size * 0.18}" fill="none" stroke="url(#edge)" stroke-width="${Math.max(1, size * 0.006)}" />
    </svg>
  `)

  await sharp(background)
    .composite([{ input: symbol, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, output))
}

async function makeOgImage() {
  const width = 1200
  const height = 630
  const logo = await sharp(logoPath)
    .resize({ width: 470, withoutEnlargement: true })
    .png()
    .toBuffer()

  const background = Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow" cx="78%" cy="8%" r="70%">
          <stop offset="0%" stop-color="#D6A64A" stop-opacity="0.22" />
          <stop offset="45%" stop-color="#D6A64A" stop-opacity="0.06" />
          <stop offset="100%" stop-color="#0D0E10" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#F4F4F4" stop-opacity="0.06" />
          <stop offset="100%" stop-color="#F4F4F4" stop-opacity="0" />
        </linearGradient>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#F4F4F4" stroke-opacity="0.045" stroke-width="1" />
        </pattern>
        <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#D6A64A" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#D6A64A" stop-opacity="0" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="#0D0E10" />
      <rect width="${width}" height="${height}" fill="url(#glow)" />
      <rect width="${width}" height="${height}" fill="url(#grid)" />
      <rect x="24" y="24" width="${width - 48}" height="${height - 48}" rx="26" fill="none" stroke="#F4F4F4" stroke-opacity="0.08" />
      <rect x="0" y="0" width="${width}" height="190" fill="url(#fade)" />

      <rect x="90" y="318" width="96" height="3" rx="1.5" fill="url(#rule)" />

      <text x="90" y="392" fill="#F4F4F4" font-family="Arial, Helvetica, sans-serif" font-size="58" font-weight="700" letter-spacing="-1.6">Ideias em código.</text>
      <text x="90" y="462" fill="#F4F4F4" font-family="Arial, Helvetica, sans-serif" font-size="58" font-weight="700" letter-spacing="-1.6">Soluções em <tspan fill="#D6A64A" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-weight="400">realidade.</tspan></text>

      <text x="90" y="540" fill="#A5A5AA" font-family="Arial, Helvetica, sans-serif" font-size="22" letter-spacing="0.2">Desenvolvimento de sites, sistemas e soluções digitais personalizadas.</text>

      <text x="90" y="588" fill="#D6A64A" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700" letter-spacing="4.4">TH APPS · MATHEUS SANTOS</text>
      <text x="${width - 90}" y="588" fill="#A5A5AA" font-family="Arial, Helvetica, sans-serif" font-size="16" letter-spacing="1.6" text-anchor="end">thapps</text>

      <g opacity="0.5">
        <circle cx="1070" cy="500" r="190" fill="none" stroke="#D6A64A" stroke-opacity="0.08" />
        <circle cx="1070" cy="500" r="130" fill="none" stroke="#D6A64A" stroke-opacity="0.1" />
        <circle cx="1070" cy="500" r="70" fill="none" stroke="#D6A64A" stroke-opacity="0.14" />
      </g>
    </svg>
  `)

  await sharp(background)
    .composite([{ input: logo, left: 90, top: 86 }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'og-image.png'))
}

async function main() {
  await mkdir(brandDir, { recursive: true })
  await Promise.all([
    makeIcon(512, 'favicon-512.png'),
    makeIcon(192, 'favicon-192.png'),
    makeIcon(180, 'apple-touch-icon.png'),
    makeIcon(32, 'favicon-32x32.png'),
    makeIcon(16, 'favicon-16x16.png'),
    makeOgImage(),
  ])
  console.log('Imagens de marca geradas em /public.')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
