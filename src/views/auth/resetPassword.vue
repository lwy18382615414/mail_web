<template>
  <main class="reset-page">
    <div class="reset-bg" aria-hidden="true">
      <img src="@/assets/login-bg.png" alt="" />
    </div>

    <section class="reset-panel">
      <h1>{{ $t('resetPassword.title') }}</h1>

      <el-form class="reset-form" @submit.prevent="handleSubmit">
        <el-input
          v-model.trim="account"
          :placeholder="$t('resetPassword.accountPlaceholder')"
          autocomplete="username"
        />

        <el-input
          v-model="newPassword"
          :type="showNewPassword ? 'text' : 'password'"
          :placeholder="$t('resetPassword.newPasswordPlaceholder')"
          autocomplete="new-password"
        >
          <template #suffix>
            <button
              type="button"
              class="password-toggle"
              :title="
                $t(
                  showNewPassword ? 'initialPassword.hidePassword' : 'initialPassword.showPassword',
                )
              "
              @click="showNewPassword = !showNewPassword"
            >
              <SvgIcon :name="showNewPassword ? 'eye-open' : 'eye-close'" :size="24" />
            </button>
          </template>
        </el-input>

        <el-input
          v-model="confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          :placeholder="$t('resetPassword.confirmPasswordPlaceholder')"
          autocomplete="new-password"
        >
          <template #suffix>
            <button
              type="button"
              class="password-toggle"
              :title="
                $t(
                  showConfirmPassword
                    ? 'initialPassword.hidePassword'
                    : 'initialPassword.showPassword',
                )
              "
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <SvgIcon :name="showConfirmPassword ? 'eye-open' : 'eye-close'" :size="24" />
            </button>
          </template>
        </el-input>

        <div class="code-row">
          <el-input
            v-model.trim="verifyCode"
            :placeholder="$t('resetPassword.codePlaceholder')"
            maxlength="6"
          />
          <el-button type="primary" plain :disabled="countdown > 0" @click="handleSendCode">
            {{
              countdown > 0
                ? $t('resetPassword.resendCode', { seconds: countdown })
                : $t('resetPassword.sendCode')
            }}
          </el-button>
        </div>

        <div class="button-group">
          <el-button type="primary" native-type="submit" :loading="loading">
            {{ $t('resetPassword.confirm') }}
          </el-button>
          <el-button @click="returnToLogin">
            {{ $t('resetPassword.backToLogin') }}
          </el-button>
        </div>
      </el-form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()
const { t } = useI18n()
const account = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const verifyCode = ref('')
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const countdown = ref(0)
const loading = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

function returnToLogin() {
  router.push('/login')
}

function handleSendCode() {
  if (!account.value) {
    ElMessage.warning(t('resetPassword.accountRequired'))
    return
  }

  countdown.value = 60
  ElMessage.success(t('resetPassword.codeSent'))
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0 && timer) {
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}

function handleSubmit() {
  if (!account.value || !newPassword.value || !confirmPassword.value || !verifyCode.value) {
    ElMessage.warning(t('resetPassword.fieldsRequired'))
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    ElMessage.warning(t('initialPassword.passwordMismatch'))
    return
  }

  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success(t('resetPassword.updateSuccess'))
    returnToLogin()
  }, 600)
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped lang="scss">
.reset-page {
  position: relative;
  min-height: calc(100vh - 72px);
  padding: 8px;
  overflow: hidden;
  background: var(--app-color-bg-page);
  color: var(--app-color-text-primary);
}

.reset-bg {
  position: absolute;
  inset: -72px 0 0;
  pointer-events: none;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.reset-panel {
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 88px);
  padding: 200px 24px 40px;
  border-radius: 12px;
  background: var(--app-color-bg-surface);

  h1 {
    width: min(438px, 100%);
    margin: 0 auto 40px;
    font-size: 24px;
    font-weight: 500;
    line-height: 34px;
    text-align: center;
  }
}

.reset-form {
  width: min(438px, 100%);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

:deep(.el-input__wrapper) {
  height: 44px;
  padding: 0 10px;
  border-radius: 12px;
  box-shadow: 0 0 0 1px var(--app-color-border) inset;

  &:hover {
    box-shadow: 0 0 0 1px var(--app-color-text-secondary) inset;
  }

  &.is-focus {
    box-shadow: 0 0 0 1px var(--app-color-brand) inset;
  }
}

:deep(.el-input__inner) {
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  color: var(--app-color-text-primary);

  &::placeholder {
    color: var(--app-color-text-placeholder);
  }
}

.password-toggle {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--app-color-text-placeholder);
  cursor: pointer;
}

.code-row {
  height: 44px;
  display: flex;
  gap: 10px;

  .el-input {
    min-width: 0;
  }

  .el-button {
    height: 44px;
    margin: 0;
    padding: 0 16px;
    border-radius: 8px;
  }
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .el-button {
    width: 100%;
    height: 44px;
    margin: 0;
    border: 0;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
  }

  .el-button--primary {
    background: var(--app-color-brand);
  }

  .el-button--default {
    background: var(--app-color-brand-subtle);
    color: var(--app-color-brand);
  }
}

@media (max-height: 900px) {
  .reset-panel {
    padding-top: 80px;
  }
}

@media (max-width: 640px) {
  .reset-panel {
    padding-top: 72px;
  }

  .code-row .el-button {
    padding: 0 12px;
  }
}
</style>
