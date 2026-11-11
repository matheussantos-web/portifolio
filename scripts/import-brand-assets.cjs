const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const srcDir = 'C:/Users/Administrador/OneDrive/Desktop/thapps/Th_Apps_Identidade_Visual_Imagens'
const outDir = path.join(__dirname, '..', 'public', 'brand')

fs.mkdirSync(outDir, { recursive: true })

async function keyOutDark(input, output, width) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
    const alpha = Math.max(0, Math.min(255, Math.round((luma - 24) * 2.2)))
    data[i + 3] = alpha
  }

  const keyed = sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })

  const trimmed = await keyed
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 2 })
    .png()
    .toBuffer()

  const meta = await sharp(trimmed).metadata()
  const pipeline = sharp(trimmed)
  if (width && meta.width && meta.width > width) {
    pipeline.resize({ width, withoutEnlargement: true })
  }

  await pipeline.png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(output)

  const finalMeta = await sharp(output).metadata()
  const finalStats = await sharp(output).stats()
  console.log(
    `${path.basename(input)} -> ${path.basename(output)} ${finalMeta.width}x${finalMeta.height} alphaMean=${Math.round(finalStats.channels[3].mean)}`,
  )
}

;(async () => {
  await keyOutDark(path.join(srcDir, '01-logo-horizontal.png'), path.join(outDir, 'thapps-logo.png'), 720)
  await keyOutDark(path.join(srcDir, '02-simbolo-th-dourado.png'), path.join(outDir, 'thapps-symbol-gold.png'), 320)
  await keyOutDark(path.join(srcDir, '03-simbolo-th-branco.png'), path.join(outDir, 'thapps-symbol-white.png'), 320)
  await keyOutDark(path.join(srcDir, '04-monograma-th-simples.png'), path.join(outDir, 'thapps-monogram.png'), 320)
})()
