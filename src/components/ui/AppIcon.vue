<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    name: string
    size?: number
    strokeWidth?: number
  }>(),
  { size: 20, strokeWidth: 1.6 },
)

const paths: Record<string, string[]> = {
  'arrow-right': ['M5 12h14', 'm13 6 6 6-6 6'],
  'arrow-left': ['M19 12H5', 'm11 18-6-6 6-6'],
  'arrow-up-right': ['M7 17 17 7', 'M8 7h9v9'],
  'chevron-down': ['m6 9 6 6 6-6'],
  'chevron-right': ['m9 18 6-6-6-6'],
  menu: ['M4 7h16', 'M4 12h16', 'M4 17h16'],
  close: ['M6 6l12 12', 'M18 6 6 18'],
  check: ['m20 6-11 11-5-5'],
  external: ['M15 3h6v6', 'M10 14 21 3', 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'],
  mail: ['M4 6h16v12H4z', 'm4 7 8 6 8-6'],
  lock: ['M6 11h12v10H6z', 'M8 11V8a4 4 0 0 1 8 0v3'],
  globe: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M3 12h18', 'M12 3c2.5 2.5 3.8 5.6 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.6-3.8-9S9.5 5.5 12 3Z'],
  send: ['m22 2-7 20-4-9-9-4Z', 'M22 2 11 13'],
  alert: ['M12 9v4', 'M12 17h.01', 'M10.3 3.6 2.4 17a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0Z'],
  clock: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M12 7v5l3 2'],
  code: ['m8 9-4 3 4 3', 'M16 9l4 3-4 3', 'm14 5-4 14'],
  monitor: ['M3 4h18v13H3z', 'M8 21h8', 'M12 17v4'],
  layers: ['m12 3 9 5-9 5-9-5 9-5Z', 'm3 13 9 5 9-5', 'm3 18 9 5 9-5'],
  network: ['M12 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z', 'M5 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z', 'M19 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z', 'M12 8v4', 'm10.7 13.4-4 3.2', 'm13.3 13.4 4 3.2'],
  bag: ['M6 7h12l1 13H5L6 7Z', 'M9 7a3 3 0 0 1 6 0'],
  puzzle: ['M9 4h6v3a2 2 0 1 0 4 0h2v6h-3a2 2 0 1 0 0 4h3v3H9v-3a2 2 0 1 0-4 0H3V9h2a2 2 0 0 0 4 0V4Z'],
  refresh: ['M21 12a9 9 0 1 1-2.64-6.36', 'M21 3v6h-6'],
  target: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z', 'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z'],
  spark: ['M12 3v4', 'M12 17v4', 'M3 12h4', 'M17 12h4', 'm5.6 5.6 2.8 2.8', 'm15.6 15.6 2.8 2.8', 'm18.4 5.6-2.8 2.8', 'm8.4 15.6-2.8 2.8'],
  book: ['M4 5a2 2 0 0 1 2-2h14v18H6a2 2 0 0 1-2-2V5Z', 'M8 3v18'],
  search: ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z', 'm21 21-4.3-4.3'],
  chat: ['M21 12a8 8 0 0 1-8 8H7l-4 3V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8Z', 'M8 12h.01', 'M12 12h.01', 'M16 12h.01'],
  trending: ['m3 17 6-6 4 4 8-8', 'M17 7h4v4'],
  shield: ['M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z', 'm9 12 2 2 4-4'],
  image: ['M4 5h16v14H4z', 'm4 16 5-5 4 4 3-3 4 4', 'M9 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z'],
  plus: ['M12 5v14', 'M5 12h14'],
  minus: ['M5 12h14'],
  quote: ['M9 11H5a1 1 0 0 1-1-1V7a3 3 0 0 1 3-3h1', 'M9 11c0 5-2 7-5 8', 'M20 11h-4a1 1 0 0 1-1-1V7a3 3 0 0 1 3-3h1', 'M20 11c0 5-2 7-5 8'],
  filter: ['M3 5h18', 'M6 12h12', 'M10 19h4'],
  star: ['m12 3 2.7 5.6 6.3.9-4.5 4.4 1 6.1-5.5-2.9-5.5 2.9 1-6.1L3 9.5l6.3-.9L12 3Z'],
}

const content = computed(() => paths[props.name] || paths.spark)
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path v-for="(d, index) in content" :key="index" :d="d" />
  </svg>
</template>
