<template>
  <div class="mail-layout">
    <div :inert="isComposeOpen || undefined" :aria-hidden="isComposeOpen || undefined">
      <RouterView />
    </div>
    <RouterView name="compose" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isComposeOpen = computed(() => Boolean(route.meta.compose))
</script>

<style scoped lang="scss">
.mail-layout {
  position: relative;
  min-height: 100vh;
}
</style>
