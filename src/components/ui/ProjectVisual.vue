<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '@/data/projects'

const props = withDefaults(
  defineProps<{
    project: Project
    variant?: 'card' | 'hero' | 'thumb'
  }>(),
  { variant: 'card' },
)

const aspect = computed(() => {
  if (props.variant === 'hero') return 'aspect-[16/9] md:aspect-[16/8.5]'
  if (props.variant === 'thumb') return 'aspect-[4/3]'
  return 'aspect-[16/10]'
})

const intrinsic = computed(() => {
  if (props.variant === 'hero') return { width: 1600, height: 900 }
  if (props.variant === 'thumb') return { width: 1200, height: 900 }
  return { width: 1600, height: 1000 }
})
</script>

<template>
  <div
    v-if="project.image"
    class="project-visual relative isolate h-full w-full overflow-hidden rounded-[inherit]"
    :class="aspect"
  >
    <img
      v-if="project.image"
      :src="project.image"
      :alt="project.imageAlt || project.name"
      class="absolute inset-0 h-full w-full object-cover"
      :width="intrinsic.width"
      :height="intrinsic.height"
      loading="lazy"
      decoding="async"
    />
  </div>
</template>

<style scoped>
.project-visual {
  background: #121317;
}
</style>
