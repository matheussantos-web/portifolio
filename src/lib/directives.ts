import type { Directive } from 'vue'
import { gsap, ScrollTrigger } from './gsap'
import { prefersReducedMotion } from './motion'

interface RevealOptions {
  delay?: number
  y?: number
  duration?: number
}

const triggers = new WeakMap<HTMLElement, ScrollTrigger>()

/**
 * Revela o elemento ao entrar na viewport.
 * Sem JS (ou com prefers-reduced-motion), o conteúdo permanece visível.
 */
export const vReveal: Directive<HTMLElement, RevealOptions | undefined> = {
  mounted(el, binding) {
    if (typeof window === 'undefined' || prefersReducedMotion()) return

    const { delay = 0, y = 26, duration = 0.8 } = binding.value || {}

    try {
      gsap.set(el, { opacity: 0, y })
      el.dataset.reveal = 'pending'

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration,
            delay,
            ease: 'power3.out',
            clearProps: 'transform,will-change',
            onComplete: () => {
              delete el.dataset.reveal
            },
          })
        },
      })

      triggers.set(el, trigger)
    } catch {
      gsap.set(el, { clearProps: 'all' })
    }
  },
  unmounted(el) {
    triggers.get(el)?.kill()
    triggers.delete(el)
  },
}

const glowHandlers = new WeakMap<HTMLElement, (event: PointerEvent) => void>()

/** Atualiza variáveis CSS com a posição do ponteiro para o brilho dos cards. */
export const vGlow: Directive<HTMLElement> = {
  mounted(el) {
    if (typeof window === 'undefined') return
    const handler = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      el.style.setProperty('--glow-x', `${event.clientX - rect.left}px`)
      el.style.setProperty('--glow-y', `${event.clientY - rect.top}px`)
    }
    el.addEventListener('pointermove', handler, { passive: true })
    glowHandlers.set(el, handler)
  },
  unmounted(el) {
    const handler = glowHandlers.get(el)
    if (handler) el.removeEventListener('pointermove', handler)
    glowHandlers.delete(el)
  },
}
