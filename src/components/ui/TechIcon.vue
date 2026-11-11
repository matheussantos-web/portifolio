<script setup lang="ts">
import { computed } from 'vue'
import {
  siCss,
  siExpress,
  siGit,
  siGithub,
  siGithubpages,
  siHtml5,
  siJavascript,
  siNodedotjs,
  siPostgresql,
  siPython,
  siReact,
  siRender,
  siTailwindcss,
  siVite,
  siVuedotjs,
  type SimpleIcon,
} from 'simple-icons'
import AppIcon from './AppIcon.vue'

const props = withDefaults(
  defineProps<{
    icon: string
    size?: number
  }>(),
  { size: 20 },
)

const icons: Record<string, SimpleIcon> = {
  siHtml5,
  siCss,
  siJavascript,
  siTailwindcss,
  siVuedotjs,
  siReact,
  siPython,
  siNodedotjs,
  siExpress,
  siPostgresql,
  siGit,
  siGithub,
  siVite,
  siRender,
  siGithubpages,
}

const icon = computed(() => icons[props.icon])
</script>

<template>
  <svg
    v-if="icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="icon.path" />
  </svg>
  <AppIcon v-else name="code" :size="size" />
</template>
