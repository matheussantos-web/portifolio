<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { prefersReducedMotion } from '@/lib/motion'

const cursorRef = ref<HTMLDivElement | null>(null)
const ringRef = ref<HTMLDivElement | null>(null)

let isMounted = false
let isVisible = false
let isHovered = false
let currentX = 0
let currentY = 0
let targetX = 0
let targetY = 0
let currentScale = 1
let targetScale = 1
let animationFrame: number | null = null
let pointerMoveHandler: ((e: PointerEvent) => void) | null = null
let mouseOverHandler: ((e: MouseEvent) => void) | null = null
let mouseOutHandler: ((e: MouseEvent) => void) | null = null

const FORM_SELECTORS = 'input, textarea, select, button, [role="button"], [contenteditable="true"]'

function isFinePointerDesktop(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

function isFormField(target: EventTarget | null): boolean {
  if (!target || !(target instanceof Element)) return false
  return target.closest(FORM_SELECTORS) !== null
}

function updateCursor(): void {
  if (!cursorRef.value || !ringRef.value || !isMounted) return

  const dx = targetX - currentX
  const dy = targetY - currentY
  currentX += dx * 0.18
  currentY += dy * 0.18

  currentScale += (targetScale - currentScale) * 0.22

  cursorRef.value.style.setProperty('--cx', `${currentX}px`)
  cursorRef.value.style.setProperty('--cy', `${currentY}px`)
  cursorRef.value.style.setProperty('--cs', String(currentScale))

  if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1 || Math.abs(targetScale - currentScale) > 0.01) {
    animationFrame = requestAnimationFrame(updateCursor)
  }
}

function onPointerMove(event: PointerEvent): void {
  if (!isMounted || !isVisible) return
  targetX = event.clientX
  targetY = event.clientY
  if (!animationFrame) animationFrame = requestAnimationFrame(updateCursor)
}

function onMouseOver(event: MouseEvent): void {
  if (!isMounted || !isVisible) return
  // Não ativa sobre campos de formulário: o cursor do sistema continua visível
  if (isFormField(event.target)) {
    if (isHovered) {
      isHovered = false
      targetScale = 1
    }
    return
  }
  const target = event.target as Element | null
  const isInteractive = target?.closest('a, button, [role="button"], .card-hover, .glow-card, .btn, .filter-button, .nav-link') !== null
  if (isInteractive && !isHovered) {
    isHovered = true
    targetScale = 2.2
  } else if (!isInteractive && isHovered) {
    isHovered = false
    targetScale = 1
  }
}

function onMouseOut(event: MouseEvent): void {
  if (!isMounted || !isVisible) return
  if (isHovered) {
    isHovered = false
    targetScale = 1
  }
}

function enable(): void {
  isVisible = true
  if (cursorRef.value) cursorRef.value.style.opacity = '1'
}

function disable(): void {
  isVisible = false
  if (cursorRef.value) cursorRef.value.style.opacity = '0'
}

onMounted(() => {
  if (typeof window === 'undefined') return
  if (prefersReducedMotion()) return
  if (!isFinePointerDesktop()) return

  isMounted = true

  pointerMoveHandler = onPointerMove
  mouseOverHandler = onMouseOver
  mouseOutHandler = onMouseOut

  window.addEventListener('pointermove', pointerMoveHandler, { passive: true })
  window.addEventListener('mouseover', mouseOverHandler, true) // capture para detectar campos de formulário
  window.addEventListener('mouseout', mouseOutHandler, true)

  enable()
  requestAnimationFrame(updateCursor)
})

onBeforeUnmount(() => {
  isMounted = false
  isVisible = false
  if (animationFrame) cancelAnimationFrame(animationFrame)
  if (pointerMoveHandler) window.removeEventListener('pointermove', pointerMoveHandler)
  if (mouseOverHandler) window.removeEventListener('mouseover', mouseOverHandler, true)
  if (mouseOutHandler) window.removeEventListener('mouseout', mouseOutHandler, true)
})
</script>

<template>
  <div
    ref="cursorRef"
    v-if="isMounted"
    class="fixed pointer-events-none z-[9999] size-4 rounded-full border border-gold/60 bg-gold/10 bg-clip-padding backdrop-blur-sm transition-opacity duration-300"
    :style="{
      left: `var(--cx, 0px)`,
      top: `var(--cy, 0px)`,
      transform: `translate(calc(var(--cx, 0px) * -1), calc(var(--cy, 0px) * -1)) scale(var(--cs, 1))`,
    }"
    aria-hidden="true"
  >
    <div
      ref="ringRef"
      class="absolute inset-0 rounded-full border border-gold/40 transition-all duration-300 ease-out"
    />
  </div>
</template>

<style scoped>
/* O cursor do sistema continua visível em todos os momentos; este anel é uma camada visual extra. */
</style>