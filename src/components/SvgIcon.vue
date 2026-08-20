<template>
  <svg
    class="svg-icon"
    :style="{ width: iconSize, height: iconSize, color }"
    :aria-hidden="title ? undefined : true"
    :aria-label="title || undefined"
    :role="title ? 'img' : undefined"
    focusable="false"
  >
    <title v-if="title">{{ title }}</title>
    <use :href="symbolId" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'SvgIcon' })

const props = withDefaults(
  defineProps<{
    name: string
    prefix?: string
    size?: number | string
    color?: string
    title?: string
  }>(),
  {
    prefix: 'icon',
    size: '1em',
  },
)

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
const iconSize = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))
</script>

<style scoped lang="scss">
.svg-icon {
  display: inline-block;
  overflow: hidden;
  flex-shrink: 0;
  fill: currentColor;
  stroke: currentColor;
  vertical-align: -0.15em;
}
</style>
