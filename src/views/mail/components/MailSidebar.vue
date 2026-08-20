<template>
  <aside class="sidebar">
    <RouterLink class="compose-button" to="/compose">
      <SvgIcon name="mail-compose" :size="24" />
      <span>{{ t('pages.compose') }}</span>
    </RouterLink>

    <nav class="mail-nav" :aria-label="t('mail.sidebar.navigation')">
      <RouterLink
        v-for="item in navigation"
        :key="item.path"
        :to="item.path"
        :class="{ active: route.path.startsWith(item.path) }"
      >
        <span class="nav-label">
          <SvgIcon :name="item.icon" :size="24" />
          {{ item.label }}
        </span>
        <el-tag
          v-if="item.count"
          :class="['nav-count', { primary: item.path === '/mail/inbox' }]"
          :type="item.path === '/mail/inbox' ? 'primary' : 'info'"
          effect="plain"
          round
        >
          {{ item.count }}
        </el-tag>
      </RouterLink>
    </nav>

    <section class="folders">
      <header>
        <strong>{{ t('mail.sidebar.folders') }}</strong>
        <el-button link :title="t('mail.sidebar.addFolder')"
          ><SvgIcon name="mail-plus" :size="20"
        /></el-button>
      </header>
      <RouterLink to="/mail/folder/my-folders">
        <SvgIcon name="mail-folder" :size="24" />
        <span>{{ t('pages.customFolder') }}</span>
      </RouterLink>
    </section>

    <section class="storage">
      <div>
        <span>{{ t('mail.sidebar.storage') }}</span
        ><span><b>520 MB</b> / 1024MB</span>
      </div>
      <el-progress :percentage="51" :show-text="false" :stroke-width="8" />
    </section>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const route = useRoute()
const { t } = useI18n()

const navigation = computed(() => [
  { label: t('pages.inbox'), path: '/mail/inbox', icon: 'mail-inbox', count: 12 },
  { label: t('pages.starred'), path: '/mail/starred', icon: 'mail-star' },
  { label: t('pages.drafts'), path: '/mail/drafts', icon: 'mail-draft', count: 3 },
  { label: t('pages.sent'), path: '/mail/sent', icon: 'mail-sent' },
  { label: t('pages.trash'), path: '/mail/trash', icon: 'mail-delete' },
  { label: t('pages.spam'), path: '/mail/spam', icon: 'mail-spam' },
])
</script>

<style scoped lang="scss">
.sidebar {
  display: flex;
  grid-row: 2;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
  padding: 24px 25px 24px 24px;
  border-right: 1px solid var(--app-color-border);
  background: var(--app-color-bg-muted);
}

.compose-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 48px;
  border-radius: 8px;
  color: var(--app-color-text-on-color);
  background: var(--app-color-brand);
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
}

.mail-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;

  a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 46px;
    padding: 0 16px;
    border-radius: 8px;
    color: var(--app-color-text-secondary);
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;

    &:hover,
    &.active {
      color: var(--app-color-brand);
      background: var(--app-color-brand-selection);
      font-weight: 700;
    }
  }
}

.nav-label,
.folders a {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-count {
  height: auto;
  border: 0;
  color: var(--app-color-text-secondary);
  background: transparent;

  &.primary {
    min-width: 36px;
    height: 24px;
    padding: 0 10px;
    color: var(--app-color-text-on-color);
    background: var(--app-color-brand);
    font-size: 12px;
    line-height: 20px;
    text-align: center;
  }
}

.folders {
  padding-top: 8px;

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 16px 8px;
    border-top: 1px solid var(--app-color-border);

    strong {
      color: var(--app-color-text-heading);
      font-size: 12px;
      line-height: 20px;
    }
  }

  .el-button {
    padding: 0;
    color: inherit;
  }

  a {
    min-height: 48px;
    padding: 0 16px;
    border-radius: 8px;
    color: var(--app-color-text-secondary);
    font-size: 14px;
    text-decoration: none;
  }
}

.storage {
  margin-top: auto;
  padding-top: 24px;
  border-top: 1px solid var(--app-color-border);

  div {
    display: flex;
    justify-content: space-between;
    color: var(--app-color-text-secondary);
    font-size: 14px;
    line-height: 22px;

    b {
      color: var(--app-color-brand);
      font-weight: 500;
    }
  }

  .el-progress {
    margin-top: 12px;

    :deep(.el-progress-bar__outer) {
      background: var(--app-color-border-muted);
    }
    :deep(.el-progress-bar__inner) {
      background: var(--app-color-brand);
    }
  }
}

@media (max-width: 1500px) {
  .sidebar {
    padding-inline: 16px;
  }
}
</style>
