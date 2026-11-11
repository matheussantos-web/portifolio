import { onBeforeUnmount, onMounted, ref } from 'vue'

export const activeSection = ref('inicio')

export function useActiveSection(ids: readonly string[]) {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element))

    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]) {
          activeSection.value = visible[0].target.id
        }
      },
      {
        rootMargin: '-18% 0px -64% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75],
      },
    )

    elements.forEach((element) => observer?.observe(element))
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })
}
