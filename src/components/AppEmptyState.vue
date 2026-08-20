<template>
  <div class="app-empty-state" role="status">
    <span class="empty-illustration" aria-hidden="true">
      <img src="@/assets/mail/empty-state.png" alt="" />
    </span>
    <div class="empty-copy">
      <p class="empty-title">{{ title }}</p>
      <p v-if="description" class="empty-description">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'AppEmptyState' })

defineProps<{
  title: string
  description?: string
}>()
</script>

<style scoped lang="scss">
.app-empty-state {
  display: flex;
  width: 182px;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--app-color-text-primary);
  text-align: center;
}

.empty-illustration {
  position: relative;
  display: block;
  width: 182px;
  height: 182px;
  overflow: hidden;
}

.empty-illustration img {
  position: absolute;
  top: -17px;
  left: -139px;
  width: 448px;
  height: 336px;
  max-width: none;
  object-fit: cover;
}

.empty-copy {
  width: 100%;
}

.empty-title,
.empty-description {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
}

.empty-description {
  margin-top: 4px;
  color: var(--app-color-text-secondary);
}
</style>