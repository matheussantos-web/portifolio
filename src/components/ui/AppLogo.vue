<script setup lang="ts">
withDefaults(
  defineProps<{
    compact?: boolean
  }>(),
  { compact: false },
)
</script>

<template>
  <span class="inline-flex items-center gap-2.5">
    <img
      src="/brand/thapps-symbol-gold.png"
      alt=""
      class="size-10 shrink-0 object-contain drop-shadow-[0_6px_18px_rgba(214,166,74,0.18)]"
      width="40"
      height="40"
      aria-hidden="true"
      decoding="async"
    />

    <span v-if="!compact" class="flex min-w-0 flex-col leading-none">
      <span class="font-display text-[0.92rem] font-semibold tracking-[0.18em] text-paper">
        TH <span class="text-gold">APPS</span>
      </span>
      <span class="mt-1.5 text-[0.5rem] font-medium uppercase tracking-[0.28em] text-muted">
        Matheus Santos
      </span>
    </span>
  </span>
</template>
