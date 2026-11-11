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

/** Atualiza variáveis CSS com a posição do ponteiro para o brilho dos cards (somente desktop). */
export const vGlow: Directive<HTMLElement> = {
  mounted(el) {
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

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

interface TiltCleanups {
  move: (e: PointerEvent) => void
  leave: () => void
}

const tiltHandlers = new WeakMap<HTMLElement, TiltCleanups>()

/**
 * Efeito de Tilt 3D sutil para cards de projetos.
 * Desligado automaticamente em telas de toque (touch) e prefers-reduced-motion.
 */
export const vTilt: Directive<HTMLElement> = {
  mounted(el) {
    if (typeof window === 'undefined' || prefersReducedMotion()) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    el.style.transformStyle = 'preserve-3d'
    el.style.willChange = 'transform'

    let ticking = false
    const maxAngle = 5 // Ângulo baixo e elegante

    const move = (e: PointerEvent) => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        const rect = el.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        gsap.to(el, {
          rotateY: x * maxAngle * 2,
          rotateX: -y * maxAngle * 2,
          transformPerspective: 950,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      })
    }

    const leave = () => {
      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.65,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }

    el.addEventListener('pointermove', move, { passive: true })
    el.addEventListener('pointerleave', leave)
    tiltHandlers.set(el, { move, leave })
  },
  unmounted(el) {
    const handlers = tiltHandlers.get(el)
    if (handlers) {
      el.removeEventListener('pointermove', handlers.move)
      el.removeEventListener('pointerleave', handlers.leave)
    }
    tiltHandlers.delete(el)
  },
}

interface MagneticCleanups {
  move: (e: PointerEvent) => void
  leave: () => void
  down: () => void
  up: () => void
}

const magneticHandlers = new WeakMap<HTMLElement, MagneticCleanups>()

/**
 * Efeito magnético sutil para CTAs principais e microinteração de clique.
 * Desligado em touch e reduced-motion.
 */
export const vMagnetic: Directive<HTMLElement> = {
  mounted(el) {
    if (typeof window === 'undefined' || prefersReducedMotion()) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const maxDelta = 7

    const move = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = Math.max(-maxDelta, Math.min(maxDelta, (e.clientX - centerX) * 0.22))
      const deltaY = Math.max(-maxDelta, Math.min(maxDelta, (e.clientY - centerY) * 0.22))

      gsap.to(el, {
        x: deltaX,
        y: deltaY,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    const leave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.55,
        ease: 'elastic.out(1, 0.4)',
        overwrite: 'auto',
      })
    }

    const down = () => {
      gsap.to(el, { scale: 0.95, duration: 0.12, ease: 'power2.out' })
    }

    const up = () => {
      gsap.to(el, { scale: 1, duration: 0.28, ease: 'back.out(2)' })
    }

    el.addEventListener('pointermove', move, { passive: true })
    el.addEventListener('pointerleave', leave)
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointerup', up)

    magneticHandlers.set(el, { move, leave, down, up })
  },
  unmounted(el) {
    const handlers = magneticHandlers.get(el)
    if (handlers) {
      el.removeEventListener('pointermove', handlers.move)
      el.removeEventListener('pointerleave', handlers.leave)
      el.removeEventListener('pointerdown', handlers.down)
      el.removeEventListener('pointerup', handlers.up)
    }
    magneticHandlers.delete(el)
  },
}
