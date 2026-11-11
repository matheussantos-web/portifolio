<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string
    title?: string
    description?: string
    align?: 'left' | 'center'
    size?: 'default' | 'large'
  }>(),
  { align: 'left', size: 'default' },
)
</script>

<template>
  <div
    class="max-w-2xl"
    :class="align === 'center' ? 'mx-auto text-center' : ''"
  >
    <p v-if="eyebrow" class="eyebrow" :class="align === 'center' ? 'justify-center' : ''">
      {{ eyebrow }}
    </p>
    <h2 class="section-title mt-4" :class="size === 'large' ? 'md:text-[3.6rem]' : ''">
      <span class="block overflow-hidden py-0.5">
        <span class="inline-block">
          <slot>{{ title }}</slot>
        </span>
      </span>
    </h2>
    <p v-if="description" class="mt-4 max-w-xl text-[0.94rem] leading-relaxed text-muted" :class="align === 'center' ? 'mx-auto' : ''">
      {{ description }}
    </p>
    <slot name="extra" />
  </div>
</template>
