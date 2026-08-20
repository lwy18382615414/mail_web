<template>
  <div class="password-page">
    <main class="password-main">
      <div class="password-bg" aria-hidden="true">
        <img src="@/assets/login-bg.png" alt="" />
      </div>

      <section class="password-panel">
        <h1>{{ $t('initialPassword.title') }}</h1>

        <el-form class="password-form" @submit.prevent="handleSubmit">
          <el-input
            v-model="newPassword"
            :type="showNewPassword ? 'text' : 'password'"
            :placeholder="$t('initialPassword.newPasswordPlaceholder')"
            autocomplete="new-password"
          >
            <template #suffix>
              <button
                type="button"
                class="password-toggle"
                :title="
                  $t(
                    showNewPassword
                      ? 'initialPassword.hidePassword'
                      : 'initialPassword.showPassword',
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
            :placeholder="$t('initialPassword.confirmPasswordPlaceholder')"
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

          <div class="button-group">
            <el-button type="primary" native-type="submit" :loading="loading">
              {{ $t('initialPassword.confirm') }}
            </el-button>
            <el-button @click="returnToLogin">
              {{ $t('initialPassword.backToLogin') }}
            </el-button>
          </div>
        </el-form>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()
const { t } = useI18n()

const newPassword = ref('')
const confirmPassword = ref('')
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
function returnToLogin() {
  router.push('/login')
}

function handleSubmit() {
  if (!newPassword.value || !confirmPassword.value) {
    ElMessage.warning(t('initialPassword.passwordRequired'))
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    ElMessage.warning(t('initialPassword.passwordMismatch'))
    return
  }

  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success(t('initialPassword.updateSuccess'))
    returnToLogin()
  }, 600)
}
</script>

<style scoped lang="scss">
.password-page {
  min-height: calc(100vh - 72px);
  display: flex;
  flex-direction: column;
  color: var(--app-color-text-primary);
}

.password-main {
  position: relative;
  flex: 1;
  min-height: calc(100vh - 72px);
  padding: 8px;
  overflow: hidden;
  background: var(--app-color-bg-page);
}

.password-bg {
  position: absolute;
  inset: -72px 0 0;
  pointer-events: none;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.password-panel {
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

.password-form {
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

    &:hover,
    &:focus {
      background: var(--app-color-brand-hover);
    }
  }

  .el-button--default {
    background: var(--app-color-brand-subtle);
    color: var(--app-color-brand);

    &:hover,
    &:focus {
      background: var(--app-color-brand-subtle-hover);
      color: var(--app-color-brand-hover);
    }
  }
}

@media (max-height: 760px) {
  .password-panel {
    padding-top: 96px;
  }
}

@media (max-width: 640px) {
  .password-panel {
    padding-top: 96px;
  }
}
</style>
