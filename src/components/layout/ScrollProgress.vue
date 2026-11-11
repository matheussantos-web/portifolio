<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const progress = ref(0)
let frame = 0

function update() {
  frame = 0
  const doc = document.documentElement
  const scrollable = doc.scrollHeight - window.innerHeight
  progress.value = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0
}

function onScroll() {
  if (frame) return
  frame = window.requestAnimationFrame(update)
}

onMounted(() => {
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (frame) window.cancelAnimationFrame(frame)
})
</script>

<template>
  <div class="pointer-events-none fixed inset-x-0 top-0 z-[75] h-[2px] bg-transparent" aria-hidden="true">
    <div
      class="h-full origin-left bg-[linear-gradient(90deg,#a97c2f_0%,#d6a64a_45%,#f0d9a6_100%)] shadow-[0_0_12px_rgba(214,166,74,0.45)]"
      :style="{ transform: `scaleX(${progress})` }"
    />
  </div>
</template>
