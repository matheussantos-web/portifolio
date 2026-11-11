import { gsap, ScrollTrigger } from './gsap'
import { prefersReducedMotion } from './motion'

let triggers: ScrollTrigger[] = []

/**
 * Animação sutil de iluminação ambiental:
 * Move manchas de luz radiais (.ambient-orb) devagar conforme o scroll.
 * Desativado automaticamente em telas de toque (touch) e prefers-reduced-motion.
 */
export function initAmbientParallax(): () => void {
  cleanupAmbientParallax()

  if (typeof window === 'undefined' || prefersReducedMotion()) {
    return () => {}
  }

  // Apenas desktop com ponteiro fino para garantir 60fps no mobile
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return () => {}
  }

  const orbs = document.querySelectorAll<HTMLElement>('.ambient-orb')

  orbs.forEach((orb, index) => {
    const section = orb.closest('section') || orb.parentElement
    if (!section) return

    // Deslocamento pequeno e sutil (~40px) com direções alternadas
    const direction = index % 2 === 0 ? 1 : -1
    const deltaY = 38 * direction

    const tween = gsap.fromTo(
      orb,
      { y: -deltaY * 0.5 },
      {
        y: deltaY * 0.5,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.4,
        },
      },
    )

    if (tween.scrollTrigger) {
      triggers.push(tween.scrollTrigger)
    }
  })

  return cleanupAmbientParallax
}

export function cleanupAmbientParallax(): void {
  triggers.forEach((trigger) => trigger.kill())
  triggers = []
}
