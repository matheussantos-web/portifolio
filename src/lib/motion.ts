import { onBeforeUnmount, onMounted, readonly, ref } from 'vue'

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function usePrefersReducedMotion() {
  const reduced = ref(false)
  let media: MediaQueryList | null = null

  const update = (event: MediaQueryListEvent | MediaQueryList) => {
    reduced.value = event.matches
  }

  onMounted(() => {
    media = window.matchMedia('(prefers-reduced-motion: reduce)')
    update(media)
    media.addEventListener('change', update)
  })

  onBeforeUnmount(() => {
    media?.removeEventListener('change', update)
  })

  return readonly(reduced)
}

export function scrollToId(id: string) {
  if (typeof document === 'undefined') return
  const element = document.getElementById(id)
  if (!element) return
  element.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  })
}
