<template>
  <el-dialog
    v-model="visible"
    width="432px"
    align-center
    append-to-body
    :show-close="false"
    :close-on-click-modal="false"
    class="enterprise-dialog"
  >
    <div class="dialog-heading">
      <div class="success-icon" aria-hidden="true">
        <img src="@/assets/dialogs/success-part-1.svg" alt="" />
      </div>
      <h2>{{ t('login.enterpriseDialog.title') }}</h2>
      <p>{{ t('login.enterpriseDialog.description') }}</p>
    </div>

    <div class="account-list">
      <button
        v-for="account in accounts"
        :key="account.id"
        type="button"
        class="account-item"
        :class="{ selected: selectedId === account.id }"
        @click="selectedId = account.id"
      >
        <span class="avatar" :style="{ backgroundColor: account.avatarColor }">{{
          account.avatarText
        }}</span>
        <span class="account-copy">
          <span class="email">{{ account.email }}</span>
          <span class="company">{{ account.company }}</span>
        </span>
        <img
          v-if="selectedId === account.id"
          class="selected-icon"
          src="@/assets/dialogs/success-part-2.svg"
          :alt="t('login.enterpriseDialog.selected')"
        />
      </button>
    </div>

    <el-button type="primary" class="enter-button" @click="confirm">
      {{ t('login.enterpriseDialog.enter') }}
    </el-button>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

export interface EnterpriseAccount {
  id: string
  email: string
  company: string
  avatarText: string
  avatarColor: string
}

const props = defineProps<{
  accounts: EnterpriseAccount[]
}>()

const visible = defineModel<boolean>({ default: false })
const { t } = useI18n()
const emit = defineEmits<{
  confirm: [account: EnterpriseAccount]
}>()

const selectedId = ref('')

watch(
  () => props.accounts,
  (accounts) => {
    if (!accounts.some((account) => account.id === selectedId.value)) {
      selectedId.value = accounts[0]?.id ?? ''
    }
  },
  { immediate: true },
)

function confirm() {
  const selectedAccount = props.accounts.find((account) => account.id === selectedId.value)
  if (!selectedAccount) return

  visible.value = false
  emit('confirm', selectedAccount)
}
</script>

<style scoped lang="scss">
:global(.enterprise-dialog) {
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgb(0 0 0 / 10%);
}

:global(.enterprise-dialog .el-dialog__header) {
  display: none;
}

:global(.enterprise-dialog .el-dialog__body) {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0;
}

.dialog-heading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  h2,
  p {
    margin: 0;
    font-weight: 500;
  }

  h2 {
    color: var(--app-color-text-primary);
    font-size: 16px;
    line-height: 24px;
  }

  p {
    color: var(--app-color-text-secondary);
    font-size: 16px;
    line-height: 24px;
    text-align: center;
  }
}

.success-icon {
  position: relative;
  width: 80px;
  height: 80px;

  &::before {
    position: absolute;
    inset: 10px;
    border-radius: 50%;
    background: var(--app-color-success);
    content: '';
  }

  img {
    position: absolute;
    top: 30px;
    left: 25px;
    width: 30px;
    height: 20px;
  }
}

.account-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.account-item {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 64px;
  padding: 10px;
  border: 1px solid var(--app-color-border);
  border-radius: 12px;
  background: var(--app-color-bg-surface);
  color: var(--app-color-text-primary);
  font: inherit;
  text-align: left;
  cursor: pointer;

  &.selected {
    border-color: var(--app-color-brand-border);
    background: var(--app-color-brand-subtle);
  }
}

.avatar {
  display: flex;
  flex: 0 0 40px;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 16px;
  color: var(--app-color-text-on-color);
  font-size: 13px;
  font-weight: 700;
  line-height: 20px;
}

.account-copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  margin-left: 8px;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
}

.email,
.company {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.company {
  color: var(--app-color-text-secondary);
}

.selected-icon {
  flex: 0 0 24px;
  width: 24px;
  height: 24px;
  padding: 5px 2px;
}

.enter-button {
  width: 100%;
  height: 42px;
  margin: 0;
  border-color: var(--app-color-brand);
  border-radius: 8px;
  background: var(--app-color-brand);
  font-size: 14px;
  font-weight: 500;
}

@media (max-width: 480px) {
  :global(.enterprise-dialog) {
    width: calc(100vw - 32px) !important;
  }
}
</style>
