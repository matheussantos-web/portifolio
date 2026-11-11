<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: Record<string, unknown>,
      ) => string
      remove: (widgetId: string) => void
      reset: (widgetId?: string) => void
    }
  }
}

const props = defineProps<{
  siteKey: string
}>()

const emit = defineEmits<{
  verified: [token: string]
  expired: []
  error: []
}>()

const container = ref<HTMLElement | null>(null)
const widgetId = ref<string | null>(null)
let scriptPromise: Promise<void> | null = null

function loadScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.turnstile) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-thapps-turnstile]')
    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve()
        return
      }
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('turnstile-load-error')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.dataset.thappsTurnstile = 'true'
    script.addEventListener(
      'load',
      () => {
        script.dataset.loaded = 'true'
        resolve()
      },
      { once: true },
    )
    script.addEventListener('error', () => reject(new Error('turnstile-load-error')), { once: true })
    document.head.appendChild(script)
  })

  return scriptPromise
}

async function renderWidget() {
  if (!props.siteKey || !container.value || typeof window === 'undefined') return
  try {
    await loadScript()
    if (!window.turnstile || !container.value || widgetId.value) return
    widgetId.value = window.turnstile.render(container.value, {
      sitekey: props.siteKey,
      theme: 'dark',
      language: 'pt-br',
      callback: (token: string) => emit('verified', token),
      'expired-callback': () => {
        emit('expired')
      },
      'error-callback': () => {
        emit('error')
      },
    })
  } catch {
    emit('error')
  }
}

function reset() {
  if (widgetId.value && window.turnstile) {
    window.turnstile.reset(widgetId.value)
  }
}

onMounted(renderWidget)

onBeforeUnmount(() => {
  if (widgetId.value && window.turnstile) {
    window.turnstile.remove(widgetId.value)
  }
  widgetId.value = null
})

defineExpose({ reset })
</script>

<template>
  <div v-if="siteKey" class="min-h-[65px]">
    <div ref="container" class="cf-turnstile" />
  </div>
</template>
