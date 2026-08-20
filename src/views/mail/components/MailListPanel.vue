<template>
  <section class="mail-list-panel">
    <header class="list-heading">
      <h1>{{ title }}</h1>
      <el-dropdown trigger="click">
        <el-button link>
          {{ t('mail.filters.all') }} <SvgIcon name="mail-chevron" :size="20" />
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>{{ t('mail.filters.all') }}</el-dropdown-item>
            <el-dropdown-item>{{ t('mail.filters.unread') }}</el-dropdown-item>
            <el-dropdown-item>{{ t('mail.filters.flagged') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </header>

    <div class="mail-list">
      <div
        v-for="mail in mails"
        :key="mail.id"
        :class="['mail-item', { selected: selectedMailId === mail.id, unread: mail.unread }]"
        @click="$emit('select', mail.id)"
      >
        <el-avatar class="avatar" :size="40" :style="{ background: mail.color }">{{
          mail.initials
        }}</el-avatar>
        <span class="mail-summary">
          <span class="mail-meta">
            <span class="sender-line">
              <strong>{{ mail.sender }}</strong>
              <el-tag v-if="mail.new" class="tag new" effect="light">{{
                t('mail.tags.new')
              }}</el-tag>
            </span>
            <time>{{ mail.time }}</time>
          </span>
          <strong class="subject">{{ mail.subject }}</strong>
          <span class="preview">{{ mail.preview }}</span>
          <span v-if="mail.group || mail.external || mail.attachment" class="mail-flags">
            <el-tag v-if="mail.group" class="tag group" effect="light">{{
              t('mail.tags.group')
            }}</el-tag>
            <el-tag v-if="mail.external" class="tag external" effect="light">{{
              t('mail.tags.external')
            }}</el-tag>
            <SvgIcon v-if="mail.attachment" name="mail-receipt" :size="20" />
          </span>
        </span>
        <i v-if="mail.unread" class="unread-dot"></i>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Mail } from '@/types/mail'

const { t } = useI18n()

defineProps<{
  title: string
  mails: Mail[]
  selectedMailId?: string
}>()

defineEmits<{
  select: [messageId: string]
}>()
</script>

<style scoped lang="scss">
.mail-list-panel {
  grid-row: 2;
  min-width: 0;
  overflow: hidden;
  border-right: 1px solid var(--app-color-border);
  background: var(--app-color-bg-muted);
}

.list-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 4px;

  h1 {
    margin: 0;
    font-size: 24px;
    line-height: 32px;
  }

  .el-button {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0;
    border: 0;
    color: inherit;
    background: transparent;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }
}

.mail-list {
  height: calc(100% - 56px);
  padding: 16px;
  overflow-y: auto;
}

.mail-item {
  position: relative;
  display: flex;
  gap: 12px;
  width: 100%;
  min-height: 132px;
  padding: 16px 16px 16px 12px;
  height: auto;
  margin: 0;
  border: 0;
  border-bottom: 1px solid var(--app-color-border);
  border-left: 4px solid transparent;
  color: var(--app-color-text-primary);
  background: transparent;
  font: inherit;
  text-align: left;
  cursor: pointer;

  &.selected {
    border-bottom-color: transparent;
    border-left-color: var(--app-color-brand);
    border-radius: 4px;
    background: var(--app-color-bg-surface);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
  }

  &:hover:not(.selected) {
    background: var(--app-color-bg-surface-translucent);
  }
}

.avatar {
  flex: 0 0 40px;
  border-radius: 16px;
  color: var(--app-color-text-on-color);
  font-size: 14px;
  font-weight: 700;
}

.mail-summary {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  padding: 4px 0;
}

.mail-meta,
.mail-flags,
.sender-line {
  display: flex;
  align-items: center;
}

.mail-meta {
  justify-content: space-between;

  strong {
    color: var(--app-color-text-heading);
    font-size: 15px;
    line-height: 22px;
  }

  time {
    color: var(--app-color-text-disabled);
    font-size: 12px;
  }
}

.sender-line {
  gap: 10px;
}

.subject,
.preview {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.subject {
  font-size: 16px;
  line-height: 22px;
}

.preview {
  color: var(--app-color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
}

.mail-flags {
  justify-content: space-between;
  min-height: 18px;
}

.tag {
  height: 18px;
  width: fit-content;
  padding: 0 6px;
  border: 0;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  line-height: 14px;

  &.new {
    color: var(--app-color-brand);
    background: var(--app-color-brand-tint);
  }
  &.group {
    color: var(--app-color-danger-emphasis);
    background: var(--app-color-danger-tint);
  }
  &.external {
    color: var(--app-color-warning-emphasis);
    background: var(--app-color-warning-tint);
  }
}

.unread-dot {
  position: absolute;
  top: 33px;
  left: 3px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--app-color-brand);
}
</style>
