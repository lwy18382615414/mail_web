<template>
  <div class="mail-workspace">
    <header class="topbar">
      <div class="brand">
        <img class="brand-logo" src="@/assets/logo.png" :alt="t('mail.logoAlt')" />
        <strong>{{ t('mail.brand') }}</strong>
      </div>

      <el-input
        v-model="searchQuery"
        class="global-search"
        clearable
        :placeholder="t('mail.searchPlaceholder')"
      >
        <template #prefix><SvgIcon name="mail-search" :size="18" /></template>
      </el-input>

      <div class="account-area">
        <el-button class="contacts-button" link type="primary">
          <SvgIcon name="mail-contacts" :size="20" />
          <span>{{ t('mail.contacts') }}</span>
        </el-button>
        <div class="profile">
          <span class="profile-image">
            <el-avatar :size="40" :src="profileAvatar" alt="zhouqin" />
            <i></i>
          </span>
          <span class="profile-copy">
            <strong>zhouqin</strong>
            <small>@smartapp.net.cn</small>
          </span>
          <SvgIcon name="mail-chevron" :size="16" />
        </div>
      </div>
    </header>

    <MailSidebar />
    <MailListPanel
      :title="title"
      :mails="filteredMails"
      :selected-mail-id="selectedMail?.id"
      @select="selectMail"
    />
    <MailDetailPanel :mail="selectedMail" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import profileAvatar from '@/assets/mail/mail-image-4.png'
import type { Mail } from '@/types/mail'
import MailDetailPanel from './components/MailDetailPanel.vue'
import MailListPanel from './components/MailListPanel.vue'
import MailSidebar from './components/MailSidebar.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const searchQuery = ref('')

const mails: Mail[] = [
  {
    id: 'art-invitation',
    sender: 'Ruoxi Xu',
    initials: 'Ru',
    subject: "Contemporary Art Exhibition: 'Boundaries and Flow' Opening Invitation",
    preview: 'You are cordially invited to attend the exhibition next Saturday...',
    time: '12:15',
    color: '#2563eb',
    email: 'ruoxi.xu@example.com',
    recipient: 'ivyzhouqin',
    date: '6/18 Thu 12:15',
    unread: true,
    new: true,
    external: true,
    attachment: true,
  },
  {
    id: 'meeting-notes',
    sender: 'Li An',
    initials: 'Li',
    subject: 'Product Launch Prep Meeting Notes',
    preview: 'Hi everyone, yesterday afternoon we held the product launch preparation meeting...',
    time: '12:15',
    color: '#3b82f6',
    email: 'li.an@example.com',
    recipient: 'zhouqin',
    date: '6/18 Thu 12:15',
  },
  {
    id: 'external-news',
    sender: 'Li Con',
    initials: 'Li',
    subject: 'Industry Newsletter and Market Highlights',
    preview: 'This week we are sharing the latest market highlights and industry news...',
    time: '12:15',
    color: '#afd230',
    email: 'li.con@example.com',
    recipient: 'zhouqin',
    date: '6/18 Thu 12:15',
    external: true,
  },
  {
    id: 'team-update',
    sender: 'Ma Any',
    initials: 'Ma',
    subject: 'Team Project Status Update',
    preview: 'Here is the latest progress update from the product and design teams...',
    time: '12:15',
    color: '#3fc1f4',
    email: 'ma.any@example.com',
    recipient: 'product-team',
    date: '6/18 Thu 12:15',
    group: true,
    attachment: true,
  },
  {
    id: 'release-plan',
    sender: 'Hnu An',
    initials: 'Hn',
    subject: 'Release Plan Review Required',
    preview: 'Please review the attached release plan before our next sync...',
    time: '12:15',
    color: '#af2161',
    email: 'hnu.an@example.com',
    recipient: 'release-group',
    date: '6/18 Thu 12:15',
    unread: true,
    new: true,
    group: true,
    attachment: true,
  },
  {
    id: 'weekly-review',
    sender: 'Zi Yo',
    initials: 'Zi',
    subject: 'Weekly Performance Review',
    preview: 'The weekly performance summary is ready for your review...',
    time: '12:15',
    color: '#3b82f6',
    email: 'zi.yo@example.com',
    recipient: 'zhouqin',
    date: '6/18 Thu 12:15',
  },
]

const title = computed(() => t(`pages.${String(route.meta.pageKey)}`))
const selectedMail = computed(() => mails.find((mail) => mail.id === route.params.messageId))
const filteredMails = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return mails
  return mails.filter((mail) =>
    `${mail.sender} ${mail.subject} ${mail.preview}`.toLowerCase().includes(query),
  )
})

function selectMail(messageId: string) {
  router.push({ name: route.name ?? 'inbox', params: { ...route.params, messageId } })
}

watch(
  () => route.meta.mailbox,
  () => {
    searchQuery.value = ''
  },
)
</script>

<style scoped lang="scss">
.mail-workspace {
  display: grid;
  grid-template-columns: 280px 516px minmax(560px, 1fr);
  grid-template-rows: 72px minmax(0, calc(100vh - 72px));
  min-width: 1180px;
  min-height: 100vh;
  overflow: hidden;
  color: var(--app-color-text-primary);
  background: var(--app-color-bg-subtle);
  font-family: Inter, 'Segoe UI', sans-serif;
}

.topbar {
  position: relative;
  z-index: 5;
  display: flex;
  grid-column: 1 / -1;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  padding: 0 16px;
  border-bottom: 1px solid var(--app-color-divider-translucent);
  background: var(--app-color-bg-muted);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;

  img {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    object-fit: cover;
  }

  strong {
    font-size: 24px;
    line-height: 32px;
  }
}

.topbar > .global-search {
  position: absolute !important;
  top: 15px;
  left: 280px;
  width: 513px;
  height: 42px;

  :deep(.el-input__wrapper) {
    padding: 0 17px;
    border-radius: 999px;
    background: var(--app-color-bg-subtle);
    box-shadow: 0 0 0 1px var(--app-color-border) inset;
  }

  :deep(.el-input__inner) {
    color: var(--app-color-text-primary);
    font-size: 15px;

    &::placeholder {
      color: var(--app-color-text-disabled);
    }
  }
}

.account-area {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 32px;
}

.contacts-button {
  gap: 8px;
  padding: 0;
  font-size: 15px;
  font-weight: 500;
}

.profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 32px;
  border-left: 1px solid var(--app-color-border);
}

.profile-image {
  position: relative;
  width: 40px;
  height: 40px;

  .el-avatar {
    border: 1px solid var(--app-color-bg-surface);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  i {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 10px;
    height: 10px;
    border: 1px solid var(--app-color-bg-surface);
    border-radius: 50%;
    background: var(--app-color-presence-online);
  }
}

.profile-copy {
  display: flex;
  flex-direction: column;

  strong {
    font-size: 14px;
    line-height: 21px;
  }

  small {
    color: var(--app-color-text-secondary);
    font-size: 12px;
    line-height: 18px;
  }
}

@media (max-width: 1500px) {
  .mail-workspace {
    grid-template-columns: 240px 400px minmax(540px, 1fr);
  }

  .topbar {
    display: grid;
    grid-template-columns: 240px 400px 1fr;
  }

  .topbar > .global-search {
    position: static !important;
    width: 100%;
  }
}
</style>
