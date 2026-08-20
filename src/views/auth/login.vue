<template>
  <div class="login-page">
    <div class="login-main">
      <div class="login-bg-layer" aria-hidden="true">
        <img class="login-bg-img" src="@/assets/login-bg.png" alt="Background" />
      </div>

      <div class="login-card">
        <div class="login-header-text">
          <h1 class="login-title">{{ $t('login.title') }}</h1>
          <p class="login-subtitle">{{ $t('login.subtitle') }}</p>
        </div>

        <div class="login-tabs">
          <div
            class="tab-item"
            :class="{ active: activeTab === 'password' }"
            @click="activeTab = 'password'"
          >
            <span>{{ $t('login.tabPassword') }}</span>
          </div>
          <div
            class="tab-item"
            :class="{ active: activeTab === 'code' }"
            @click="activeTab = 'code'"
          >
            <span>{{ $t('login.tabCode') }}</span>
          </div>
        </div>

        <el-form class="login-form" @submit.prevent="handleLogin">
          <el-form-item class="form-item-block">
            <el-input
              v-model.trim="account"
              class="login-input"
              :placeholder="$t('login.accountPlaceholder')"
              clearable
              autocomplete="username"
            >
              <template #clear>
                <SvgIcon name="clear" :size="24" class="input-clear-icon" />
              </template>
            </el-input>
          </el-form-item>

          <template v-if="activeTab === 'password'">
            <el-form-item class="form-item-block">
              <el-input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="login-input"
                :placeholder="$t('login.passwordPlaceholder')"
                autocomplete="current-password"
              >
                <template #suffix>
                  <button
                    type="button"
                    class="password-toggle-btn"
                    :title="showPassword ? 'Hide password' : 'Show password'"
                    @click="showPassword = !showPassword"
                  >
                    <SvgIcon
                      :name="showPassword ? 'eye-open' : 'eye-close'"
                      :size="24"
                      class="password-toggle-icon"
                    />
                  </button>
                </template>
              </el-input>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item class="form-item-block">
              <el-input
                v-model.trim="verifyCode"
                class="login-input code-input"
                :placeholder="$t('login.codePlaceholder')"
                maxlength="6"
              >
                <template #suffix>
                  <el-button
                    link
                    type="primary"
                    class="code-btn"
                    :disabled="countdown > 0"
                    @click="handleSendCode"
                  >
                    {{
                      countdown > 0
                        ? $t('login.resendCode', { seconds: countdown })
                        : $t('login.sendCode')
                    }}
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
          </template>

          <div class="forgot-password-row">
            <el-link
              type="primary"
              :underline="'never'"
              class="forgot-link"
              @click="handleForgotPassword"
            >
              {{ $t('login.forgotPassword') }}
            </el-link>
          </div>

          <div class="submit-section">
            <el-button type="primary" class="login-btn" :loading="loading" native-type="submit">
              {{ loading ? $t('login.loggingIn') : $t('login.submit') }}
            </el-button>

            <div class="agreement-row">
              <el-checkbox v-model="agreePolicy" class="custom-checkbox" />
              <span class="agreement-text">
                {{ $t('login.agreePrefix') }}
                <a href="javascript:void(0)" class="policy-link" @click.prevent="openAgreement">{{
                  $t('login.userAgreement')
                }}</a>
                {{ $t('login.andText') }}
                <a href="javascript:void(0)" class="policy-link" @click.prevent="openPrivacy">{{
                  $t('login.privacyPolicy')
                }}</a>
              </span>
            </div>
          </div>
        </el-form>
      </div>
    </div>

    <SecurityVerificationDialog v-model="securityDialogVisible" @verified="enterMailbox" />
    <EnterpriseSelectionDialog
      v-model="enterpriseDialogVisible"
      :accounts="enterpriseAccounts"
      @confirm="enterMailbox"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getEnterpriseAccounts } from '@/api/account'
import type { EnterpriseAccount } from '@/types/account'
import SecurityVerificationDialog from './SecurityVerificationDialog.vue'
import EnterpriseSelectionDialog from './EnterpriseSelectionDialog.vue'

const router = useRouter()
const { t, locale } = useI18n()

const currentLang = computed(() => locale.value)
const activeTab = ref<'password' | 'code'>('password')
const account = ref('')
const password = ref('')
const verifyCode = ref('')
const showPassword = ref(false)
const agreePolicy = ref(false)
const loading = ref(false)
const countdown = ref(0)
const securityDialogVisible = ref(false)
const enterpriseDialogVisible = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

const enterpriseAccounts = ref<EnterpriseAccount[]>([])

onMounted(async () => {
  try {
    enterpriseAccounts.value = await getEnterpriseAccounts()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : t('login.enterpriseLoadFailed'))
  }
})

function handleSendCode() {
  if (!account.value) {
    ElMessage.warning(t('login.accountRequired'))
    return
  }
  countdown.value = 60
  ElMessage.success(
    currentLang.value === 'zh-CN'
      ? '验证码已发送（模拟：123456）'
      : 'Verification code sent (mock: 123456)',
  )
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0 && timer) {
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}

function handleForgotPassword() {
  router.push('/reset-password')
}

function openAgreement() {
  ElMessage.info(currentLang.value === 'zh-CN' ? '查看《用户协议》' : 'View User Agreement')
}

function openPrivacy() {
  ElMessage.info(currentLang.value === 'zh-CN' ? '查看《隐私政策》' : 'View Privacy Policy')
}

function handleLogin() {
  if (!account.value) {
    ElMessage.warning(t('login.accountRequired'))
    return
  }
  if (activeTab.value === 'password' && !password.value) {
    ElMessage.warning(t('login.passwordRequired'))
    return
  }
  if (activeTab.value === 'code' && !verifyCode.value) {
    ElMessage.warning(t('login.codePlaceholder'))
    return
  }
  if (!agreePolicy.value) {
    ElMessage.warning(t('login.agreeRequired'))
    return
  }

  loading.value = true
  setTimeout(() => {
    loading.value = false
    if (activeTab.value === 'password') {
      securityDialogVisible.value = true
    } else {
      enterpriseDialogVisible.value = true
    }
  }, 600)
}

function enterMailbox() {
  ElMessage.success(t('login.loginSuccess'))
  router.push('/mail/inbox')
}
</script>

<style scoped lang="scss">
.login-page {
  position: relative;
  width: 100%;
  min-height: calc(100vh - 72px);
  display: flex;
  flex-direction: column;
}

.login-main {
  position: relative;
  flex: 1;
  width: 100%;
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
  padding: 8px 8px 8px 0;
  box-sizing: border-box;
  background-color: var(--app-color-bg-page);
}

.login-bg-layer {
  position: absolute;
  inset: -72px 0 0;
  overflow: hidden;
  pointer-events: none;
}

.login-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: left center;
}

.login-card {
  position: relative;
  z-index: 5;
  width: min(598px, calc(100vw - 32px));
  background: var(--app-color-bg-surface);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 200px min(80px, 4.16vw) 40px;
  box-sizing: border-box;
}

.login-header-text {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: center;
  margin-bottom: 24px;
}

.login-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  line-height: 34px;
  color: var(--app-color-text-primary);
}

.login-subtitle {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  color: var(--app-color-text-secondary);
}

.login-tabs {
  display: flex;
  width: 100%;
  border-bottom: 0.5px solid var(--app-color-border);
  margin-bottom: 24px;
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  color: var(--app-color-text-secondary);
  position: relative;
  user-select: none;
  transition: color 0.2s;

  &:hover {
    color: var(--app-color-brand);
  }

  &.active {
    color: var(--app-color-brand);
    font-weight: 600;

    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background-color: var(--app-color-brand);
      border-radius: 2px 2px 0 0;
    }
  }
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.form-item-block {
  margin-bottom: 0 !important;
}

:deep(.login-input) {
  width: 100%;

  .el-input__wrapper {
    height: 48px;
    padding: 0 10px;
    background-color: var(--app-color-bg-surface);
    border-radius: 12px;
    box-shadow: 0 0 0 1px var(--app-color-border-strong) inset;
    transition:
      box-shadow 0.2s,
      border-color 0.2s;

    &:hover {
      box-shadow: 0 0 0 1px var(--app-color-text-secondary) inset;
    }

    &.is-focus {
      box-shadow:
        0 0 0 1px var(--app-color-brand) inset,
        0 0 0 3px var(--app-color-brand-focus);
    }
  }

  .el-input__inner {
    font-size: 14px;
    font-weight: 500;
    line-height: 22px;
    color: var(--app-color-text-primary);
    height: 100%;

    &::placeholder {
      color: var(--app-color-text-placeholder);
      font-weight: 400;
    }
  }
}

.input-clear-icon {
  color: var(--app-color-text-placeholder);
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: var(--app-color-text-secondary);
  }
}

.password-toggle-btn {
  background: transparent;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--app-color-text-placeholder);
  transition: color 0.2s;

  &:hover {
    color: var(--app-color-text-secondary);
  }
}

.password-toggle-icon {
  display: block;
}

.code-btn {
  font-size: 14px;
  font-weight: 500;
  color: var(--app-color-brand);
  padding: 0;
  height: auto;

  &:hover:not(:disabled) {
    text-decoration: underline;
  }

  &:disabled {
    color: var(--app-color-text-disabled);
    cursor: not-allowed;
  }
}

.forgot-password-row {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.forgot-link {
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  color: var(--app-color-brand);

  &:hover {
    text-decoration: underline;
    opacity: 0.85;
  }
}

.submit-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin-top: 24px;
  width: 100%;
}

.login-btn {
  width: 100%;
  height: 48px;
  background-color: var(--app-color-brand);
  border-color: var(--app-color-brand);
  color: var(--app-color-text-on-color);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  transition:
    background-color 0.2s,
    border-color 0.2s,
    opacity 0.2s;

  &:hover {
    background-color: var(--app-color-brand-hover);
    border-color: var(--app-color-brand-hover);
  }

  &:active {
    background-color: var(--app-color-brand-active);
    border-color: var(--app-color-brand-active);
  }
}

.agreement-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  user-select: none;
}

.custom-checkbox {
  margin-right: 0 !important;
  height: auto !important;

  :deep(.el-checkbox__input),
  :deep(.el-checkbox__inner) {
    width: 16px;
    height: 16px;
  }

  :deep(.el-checkbox__inner) {
    border-radius: 3px;
    border-color: var(--app-color-text-secondary);
  }

  :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
    background-color: var(--app-color-brand);
    border-color: var(--app-color-brand);
  }
}

.agreement-text {
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  color: var(--app-color-text-primary);
  white-space: nowrap;
}

.policy-link {
  color: var(--app-color-brand);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

@media (max-height: 900px) {
  .login-card {
    padding-top: clamp(72px, 16vh, 192px);
  }
}
</style>
