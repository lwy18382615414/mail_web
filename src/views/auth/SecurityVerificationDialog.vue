<template>
  <el-dialog
    v-model="visible"
    width="398px"
    align-center
    append-to-body
    :show-close="false"
    :close-on-click-modal="false"
    class="security-dialog"
  >
    <div class="dialog-heading">
      <img
        class="security-icon"
        src="@/assets/dialogs/security-verify.svg"
        alt=""
        aria-hidden="true"
      />
      <h2>{{ t('login.securityDialog.title') }}</h2>
    </div>

    <p class="dialog-description">
      {{ t('login.securityDialog.descriptionPrefix')
      }}<span>{{ t('login.securityDialog.forceOffline') }}</span
      >{{ t('login.securityDialog.descriptionSuffix') }}
    </p>

    <div class="phone-row">
      <span>{{ t('login.securityDialog.boundPhone') }}</span>
      <span>{{ phone }}</span>
    </div>

    <div class="code-row">
      <el-input
        v-model.trim="code"
        maxlength="6"
        :placeholder="t('login.securityDialog.codePlaceholder')"
      />
      <el-button class="code-button" :disabled="countdown > 0" @click="sendCode">
        {{
          countdown > 0
            ? t('login.securityDialog.retryCode', { seconds: countdown })
            : t('login.sendCode')
        }}
      </el-button>
    </div>

    <div class="dialog-actions">
      <el-button class="cancel-button" @click="cancel">
        {{ t('login.securityDialog.cancel') }}
      </el-button>
      <el-button type="primary" class="confirm-button" @click="confirm">
        {{ t('login.securityDialog.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'

withDefaults(
  defineProps<{
    phone?: string
  }>(),
  {
    phone: '131****1111',
  },
)

const visible = defineModel<boolean>({ default: false })
const { t } = useI18n()
const emit = defineEmits<{
  verified: [code: string]
  cancel: []
}>()

const code = ref('')
const countdown = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

function sendCode() {
  countdown.value = 60
  ElMessage.success(t('login.securityDialog.codeSent'))
  timer = setInterval(() => {
    countdown.value -= 1
    if (countdown.value === 0) {
      clearInterval(timer)
      timer = undefined
    }
  }, 1000)
}

function cancel() {
  visible.value = false
  emit('cancel')
}

function confirm() {
  if (code.value.length !== 6) {
    ElMessage.warning(t('login.securityDialog.codeRequired'))
    return
  }

  visible.value = false
  emit('verified', code.value)
}

onBeforeUnmount(() => clearInterval(timer))
</script>

<style scoped lang="scss">
:global(.security-dialog) {
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgb(0 0 0 / 10%);
}

:global(.security-dialog .el-dialog__header) {
  display: none;
}

:global(.security-dialog .el-dialog__body) {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0;
}

.dialog-heading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  h2 {
    margin: 0;
    color: var(--app-color-text-primary);
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
  }
}

.security-icon {
  width: 80px;
  height: 80px;
  padding: 10px 13.5px;
}

.dialog-description {
  margin: -14px 0 0;
  color: var(--app-color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;

  span {
    color: var(--app-color-danger);
  }
}

.phone-row {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 24px;
  color: var(--app-color-text-primary);
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
}

.code-row {
  display: flex;
  gap: 10px;
  height: 44px;

  :deep(.el-input__wrapper) {
    border-radius: 8px;
    box-shadow: 0 0 0 1px var(--app-color-border) inset;
  }

  :deep(.el-input__inner) {
    color: var(--app-color-text-primary);
    font-size: 14px;
    font-weight: 500;
  }
}

.code-button {
  height: 44px;
  padding: 10px 16px;
  border-color: var(--app-color-brand);
  border-radius: 8px;
  color: var(--app-color-brand);
  font-weight: 500;
}

.dialog-actions {
  display: flex;
  gap: 11px;

  .el-button {
    flex: 1;
    height: 42px;
    margin: 0;
    border: 0;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
  }
}

.cancel-button {
  background: var(--app-color-bg-hover);
  color: var(--app-color-text-secondary);
}

.confirm-button {
  background: var(--app-color-brand);
}

@media (max-width: 480px) {
  :global(.security-dialog) {
    width: calc(100vw - 32px) !important;
  }
}
</style>
