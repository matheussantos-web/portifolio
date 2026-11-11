<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { prefersReducedMotion } from '@/lib/motion'

const containerRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  isGold: boolean
  baseAlpha: number
  alpha: number
}

let animationFrameId: number | null = null
let observer: IntersectionObserver | null = null
let resizeObserver: ResizeObserver | null = null
let isVisible = true
let isTabActive = true

onMounted(() => {
  if (typeof window === 'undefined') return
  if (prefersReducedMotion()) return
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

  const canvas = canvasRef.value
  const container = containerRef.value
  if (!canvas || !container) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  let width = 0
  let height = 0
  let particles: Particle[] = []
  const maxDistance = 110
  const mouse = { x: -9999, y: -9999, radius: 140 }

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)

  function resize() {
    if (!container || !canvas || !ctx) return
    width = container.clientWidth
    height = container.clientHeight

    canvas.width = Math.floor(width * pixelRatio)
    canvas.height = Math.floor(height * pixelRatio)
    ctx.scale(pixelRatio, pixelRatio)

    initParticles()
  }

  function initParticles() {
    // Densidade controlada: ~1 partícula a cada 20.000px² (máx 55 para leveza absoluta)
    const count = Math.min(55, Math.max(22, Math.floor((width * height) / 22000)))
    particles = []

    for (let i = 0; i < count; i++) {
      // 1 em cada 5 partículas tem tom dourado suave; o restante é grafite/cinza translúcido
      const isGold = i % 5 === 0
      const baseAlpha = isGold ? 0.32 + Math.random() * 0.28 : 0.08 + Math.random() * 0.12

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        radius: isGold ? 1.6 + Math.random() * 1.0 : 1.2 + Math.random() * 0.8,
        isGold,
        baseAlpha,
        alpha: baseAlpha,
      })
    }
  }

  function render() {
    if (!ctx) return
    if (!isVisible || !isTabActive) {
      animationFrameId = requestAnimationFrame(render)
      return
    }

    ctx.clearRect(0, 0, width, height)

    // Atualiza e desenha partículas
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]

      // Movimento suave
      p.x += p.vx
      p.y += p.vy

      // Rebater nas bordas
      if (p.x < 0) {
        p.x = 0
        p.vx *= -1
      } else if (p.x > width) {
        p.x = width
        p.vx *= -1
      }
      if (p.y < 0) {
        p.y = 0
        p.vy *= -1
      } else if (p.y > height) {
        p.y = height
        p.vy *= -1
      }

      // Reação discreta ao mouse
      const dx = mouse.x - p.x
      const dy = mouse.y - p.y
      const dist = Math.hypot(dx, dy)

      if (dist < mouse.radius && dist > 0) {
        const force = (1 - dist / mouse.radius) * 0.45
        p.x -= (dx / dist) * force * 2.5
        p.y -= (dy / dist) * force * 2.5
        p.alpha = Math.min(1, p.baseAlpha * 1.8)
      } else {
        p.alpha += (p.baseAlpha - p.alpha) * 0.05
      }

      // Desenho do nó
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fillStyle = p.isGold
        ? `rgba(214, 166, 74, ${p.alpha})`
        : `rgba(244, 244, 244, ${p.alpha})`
      ctx.fill()

      // Conexões de rede sutis
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j]
        const cdx = p.x - p2.x
        const cdy = p.y - p2.y
        const cdist = Math.hypot(cdx, cdy)

        if (cdist < maxDistance) {
          const lineAlpha = (1 - cdist / maxDistance) * (p.isGold || p2.isGold ? 0.12 : 0.04)
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = p.isGold || p2.isGold
            ? `rgba(214, 166, 74, ${lineAlpha})`
            : `rgba(244, 244, 244, ${lineAlpha})`
          ctx.lineWidth = 0.75
          ctx.stroke()
        }
      }
    }

    animationFrameId = requestAnimationFrame(render)
  }

  // Interatividade com o mouse no hero
  function onPointerMove(e: PointerEvent) {
    if (!container) return
    const rect = container.getBoundingClientRect()
    mouse.x = e.clientX - rect.left
    mouse.y = e.clientY - rect.top
  }

  function onPointerLeave() {
    mouse.x = -9999
    mouse.y = -9999
  }

  // Pausa fora da viewport
  observer = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting
    },
    { threshold: 0.05 },
  )
  observer.observe(container)

  // Pausa em aba em segundo plano
  function onVisibilityChange() {
    isTabActive = document.visibilityState === 'visible'
  }
  document.addEventListener('visibilitychange', onVisibilityChange)

  container.addEventListener('pointermove', onPointerMove, { passive: true })
  container.addEventListener('pointerleave', onPointerLeave)

  // Redimensionamento
  resizeObserver = new ResizeObserver(() => resize())
  resizeObserver.observe(container)

  resize()
  animationFrameId = requestAnimationFrame(render)

  onBeforeUnmount(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
    observer?.disconnect()
    resizeObserver?.disconnect()
    document.removeEventListener('visibilitychange', onVisibilityChange)
    container.removeEventListener('pointermove', onPointerMove)
    container.removeEventListener('pointerleave', onPointerLeave)
  })
})
</script>

<template>
  <div
    ref="containerRef"
    class="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    aria-hidden="true"
  >
    <canvas
      ref="canvasRef"
      class="h-full w-full opacity-65 transition-opacity duration-1000"
    />
  </div>
</template>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  canvas {
    display: none;
  }
}
</style>
