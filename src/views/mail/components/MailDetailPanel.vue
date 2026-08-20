<template>
  <main v-loading="loading" class="mail-detail">
    <header v-if="mail && !error" class="detail-toolbar">
      <div class="toolbar-group">
        <template v-for="action in toolbarActions" :key="action.key">
          <i v-if="action.dividerBefore" class="toolbar-divider" aria-hidden="true"></i>
          <button
            class="toolbar-action"
            :class="{ danger: action.danger }"
            type="button"
            :title="t(action.labelKey)"
          >
            <SvgIcon :name="action.icon" :size="24" />
            <span>{{ t(action.labelKey) }}</span>
          </button>
        </template>
      </div>
      <button class="toolbar-action more-button" type="button" :title="t('mail.actions.more')">
        <SvgIcon name="mail-more" :size="24" />
      </button>
    </header>

    <article v-if="mail && !error" class="message">
      <header class="message-title">
        <div>
          <h2>{{ mail.subject }}</h2>
          <el-tag v-if="mail.external" class="external-badge" effect="plain"
            ><i></i>{{ t('mail.tags.external') }}</el-tag
          >
        </div>
        <el-button link :title="t('mail.actions.star')"
          ><SvgIcon name="mail-star" :size="24"
        /></el-button>
      </header>

      <section class="sender-card">
        <div class="sender-profile">
          <el-avatar class="sender-avatar" :size="48" :style="{ background: mail.color }">{{
            mail.initials
          }}</el-avatar>
          <div>
            <p>
              <strong>{{ mail.sender }}</strong> <span>&lt;{{ mail.email }}&gt;</span>
            </p>
            <p class="recipient">
              {{ t('mail.detail.to') }}: <b>{{ mail.recipient }}</b>
              <SvgIcon name="mail-chevron" :size="13" />
            </p>
          </div>
        </div>
        <div class="message-date">
          <time>{{ mail.date }}</time
          ><el-button link type="primary">{{ t('mail.detail.details') }}</el-button>
        </div>
      </section>

      <section class="receipt-notice">
        <p><SvgIcon name="mail-receipt" :size="24" />{{ t('mail.receipt.prompt') }}</p>
        <div>
          <el-button link>{{ t('mail.receipt.decline') }}</el-button
          ><el-button link type="primary">{{ t('mail.receipt.send') }}</el-button>
        </div>
      </section>

      <section class="message-body">
        <p v-for="paragraph in mail.paragraphs" :key="paragraph">{{ paragraph }}</p>
      </section>
    </article>

    <section v-else class="empty-detail">
      <SvgIcon name="mail-inbox" :size="44" />
      <h2>{{ error ? t('mail.load.detailFailed') : t('mail.empty.title') }}</h2>
      <p>{{ error || t('mail.empty.description') }}</p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { MailDetail, MailboxType } from '@/types/mail'

const { t } = useI18n()

const props = defineProps<{
  mail?: MailDetail
  mailbox: MailboxType
  loading?: boolean
  error?: string
}>()

type ToolbarAction = {
  key: string
  icon: string
  labelKey: string
  danger?: boolean
  dividerBefore?: boolean
}

const toolbarActions = computed<ToolbarAction[]>(() => {
  if (props.mailbox === 'sent') {
    return [
      { key: 'delete', icon: 'mail-delete', labelKey: 'mail.actions.delete', danger: true },
      { key: 'edit-again', icon: 'mail-compose', labelKey: 'mail.actions.editAgain' },
    ]
  }

  if (props.mailbox === 'trash' || props.mailbox === 'spam') {
    return [
      {
        key: 'permanently-delete',
        icon: 'mail-delete',
        labelKey: 'mail.actions.permanentlyDelete',
        danger: true,
      },
    ]
  }

  return [
    { key: 'delete', icon: 'mail-delete', labelKey: 'mail.actions.delete', danger: true },
    { key: 'reject', icon: 'mail-spam', labelKey: 'mail.actions.reject' },
    {
      key: 'reply',
      icon: 'mail-reply',
      labelKey: 'mail.actions.reply',
      dividerBefore: true,
    },
    { key: 'reply-all', icon: 'mail-reply-all', labelKey: 'mail.actions.replyAll' },
    { key: 'forward', icon: 'mail-forward', labelKey: 'mail.actions.forward' },
  ]
})
</script>

<style scoped lang="scss">
.mail-detail {
  grid-row: 2;
  min-width: 0;
  overflow: hidden;
  background: var(--app-color-bg-surface);
}

.detail-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  padding: 0 32px;
  border-bottom: 1px solid var(--app-color-border);
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 24px;
}

.toolbar-action {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  border: 0;
  color: var(--app-color-text-primary);
  background: transparent;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
  cursor: pointer;
  user-select: none;

  &:hover {
    color: var(--app-color-text-strong);
  }

  &:focus-visible {
    border-radius: 4px;
    outline: 2px solid var(--app-color-brand);
    outline-offset: 4px;
  }

  &.danger {
    color: var(--app-color-danger);
  }
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  margin: 0 8px;
  background: var(--app-color-border);
}

.more-button {
  display: grid;
  place-items: center;
  color: var(--app-color-text-secondary);
}

.message {
  height: calc(100% - 72px);
  padding: 40px;
  overflow-y: auto;
}

.message-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 10px 0;

  > div {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 0;
  }

  h2 {
    margin: 0;
    font-size: clamp(20px, 1.36vw, 26px);
    line-height: 1.25;
    letter-spacing: 0;
  }

  > button {
    flex: 0 0 auto;
    padding: 0;
    color: var(--app-color-warning);
  }
}

.external-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 0 0 auto;
  height: 27px;
  padding: 0 11px;
  border: 1px solid var(--app-color-border);
  border-radius: 6px;
  color: var(--app-color-text-secondary);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;

  i {
    width: 8px;
    height: 8px;
    border-radius: 2px;
    background: var(--app-color-warning);
  }
}

.sender-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
}

.sender-profile {
  display: flex;
  align-items: center;
  gap: 16px;
}

.sender-profile p {
  margin: 0;
}

.sender-profile strong {
  font-size: 16px;
}

.sender-profile p span {
  color: var(--app-color-text-secondary);
  font-size: 13px;
}

.sender-avatar {
  border-radius: 16px;
  color: var(--app-color-text-on-color);
  font-size: 17px;
  font-weight: 700;
}

.recipient {
  display: flex;
  align-items: center;
  gap: 4px;
  padding-top: 4px;
  color: var(--app-color-text-secondary);
  font-size: 13px;

  b {
    padding: 2px 8px;
    border-radius: 6px;
    color: var(--app-color-text-primary);
    background: var(--app-color-bg-hover);
    font-weight: 500;
  }
}

.message-date {
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  color: var(--app-color-text-secondary);
  font-size: 14px;

  .el-button {
    padding: 6px 0 0;
    font-size: 13px;
  }
}

.receipt-notice {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 54px;
  margin-top: 16px;
  padding: 12px 17px;
  border: 1px solid var(--app-color-info-border);
  border-radius: 8px;
  background: var(--app-color-info-subtle);

  p,
  div {
    display: flex;
    align-items: center;
  }

  p {
    gap: 4px;
    margin: 0;
    font-size: 14px;
    font-weight: 500;
  }

  div {
    gap: 32px;
  }

  .el-button {
    padding: 0;
    color: var(--app-color-text-secondary);
    font-size: 14px;
    font-weight: 600;
  }

  .el-button--primary {
    color: var(--app-color-brand);
  }
}

.message-body {
  padding-top: 16px;
  font-size: 15px;
  line-height: 1.625;
}

.message-body p {
  margin: 0 0 8px;
}

.empty-detail {
  display: grid;
  height: 100%;
  place-content: center;
  color: var(--app-color-text-placeholder);
  text-align: center;

  .svg-icon {
    margin: 0 auto 12px;
    color: var(--app-color-brand);
  }
  h2 {
    margin: 0;
    color: var(--app-color-text-primary);
    font-size: 20px;
  }
  p {
    margin: 8px 0 0;
    font-size: 14px;
  }
}

@media (max-width: 1500px) {
  .toolbar-group {
    gap: 14px;

    .toolbar-action span {
      display: none;
    }
  }

  .message {
    padding: 28px;
  }
}
</style>
