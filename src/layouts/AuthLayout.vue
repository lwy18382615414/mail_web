<template>
  <div class="auth-layout">
    <header class="auth-header">
      <div class="brand-section">
        <img class="brand-logo" src="@/assets/logo.png" alt="Logo" />
        <span class="brand-name">Unified Operations</span>
      </div>

      <el-dropdown trigger="click" @command="handleLanguageChange">
        <div class="lang-selector">
          <span>{{ currentLangLabel }}</span>
          <SvgIcon name="arrow-down" :size="16" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="zh-CN" :disabled="currentLang === 'zh-CN'">
              {{ $t('languages.zhCN') }}
            </el-dropdown-item>
            <el-dropdown-item command="en-US" :disabled="currentLang === 'en-US'">
              {{ $t('languages.enUS') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </header>

    <RouterView class="auth-content" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const currentLang = computed(() => locale.value)
const currentLangLabel = computed(() =>
  currentLang.value === 'zh-CN' ? t('languages.zhCN') : t('languages.enUS'),
)

function handleLanguageChange(lang: string) {
  locale.value = lang
}
</script>

<style scoped lang="scss">
.auth-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.auth-header {
  position: relative;
  z-index: 10;
  height: 72px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: var(--app-color-bg-surface);
}

.brand-section,
.lang-selector {
  display: flex;
  align-items: center;
}

.brand-section {
  gap: 12px;
}

.brand-logo {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
}

.brand-name {
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: var(--app-color-text-primary);
}

.lang-selector {
  gap: 8px;
  height: 40px;
  padding: 8px 10px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  color: var(--app-color-text-primary);
  user-select: none;

  &:hover {
    background: var(--app-color-bg-hover);
  }
}

.auth-content {
  flex: 1;
}

@media (max-width: 640px) {
  .brand-name {
    display: none;
  }
}
</style>
