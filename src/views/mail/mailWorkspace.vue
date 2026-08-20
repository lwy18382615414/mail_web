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
        <div class="contacts-button">
          <SvgIcon name="mail-contacts" :size="20" />
          <span>{{ t('mail.contacts') }}</span>
        </div>
        <div v-if="currentUser" class="profile">
          <span class="profile-image">
            <el-avatar :size="40" :src="currentUser.avatar" :alt="currentUser.username" />
            <i></i>
          </span>
          <span class="profile-copy">
            <strong>{{ currentUser.username }}</strong>
            <small>{{ currentUser.domain }}</small>
          </span>
          <SvgIcon name="mail-chevron" :size="16" />
        </div>
      </div>
    </header>

    <MailSidebar :folders="folders" />
    <MailListPanel
      :title="title"
      :mails="filteredMails"
      :selected-mail-id="selectedMailId"
      :loading="listLoading"
      :error="listError"
      @select="selectMail"
    />
    <MailDetailPanel
      :mail="selectedMail"
      :mailbox="mailbox"
      :loading="detailLoading"
      :error="detailError"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { getCurrentUser } from '@/api/account'
import { getMailFolders, getMailMessage, getMailMessages } from '@/api/mail'
import type { CurrentUser } from '@/types/account'
import type { Mail, MailDetail, MailFolder, MailboxType } from '@/types/mail'
import MailDetailPanel from './components/MailDetailPanel.vue'
import MailListPanel from './components/MailListPanel.vue'
import MailSidebar from './components/MailSidebar.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const searchQuery = ref('')
const currentUser = ref<CurrentUser>()
const folders = ref<MailFolder[]>([])
const mails = ref<Mail[]>([])
const selectedMail = ref<MailDetail>()
const listLoading = ref(false)
const detailLoading = ref(false)
const listError = ref('')
const detailError = ref('')
let listRequest = 0
let detailRequest = 0

const title = computed(() => t(`pages.${String(route.meta.pageKey)}`))
const mailbox = computed(() => (route.meta.mailbox as MailboxType | undefined) ?? 'inbox')
const folderId = computed(() =>
  typeof route.params.folderId === 'string' ? route.params.folderId : undefined,
)
const selectedMailId = computed(() =>
  typeof route.params.messageId === 'string' ? route.params.messageId : undefined,
)
const filteredMails = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return mails.value
  return mails.value.filter((mail) =>
    `${mail.sender} ${mail.subject} ${mail.preview}`.toLowerCase().includes(query),
  )
})

function selectMail(messageId: string) {
  router.push({ name: route.name ?? 'inbox', params: { ...route.params, messageId } })
}

async function loadShell() {
  try {
    ;[currentUser.value, folders.value] = await Promise.all([getCurrentUser(), getMailFolders()])
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : t('mail.load.accountFailed'))
  }
}

async function loadList() {
  const requestId = ++listRequest
  listLoading.value = true
  listError.value = ''

  try {
    const result = await getMailMessages({ mailbox: mailbox.value, folderId: folderId.value })
    if (requestId === listRequest) mails.value = result
  } catch {
    if (requestId === listRequest) {
      mails.value = []
      listError.value = t('mail.load.listFailed')
    }
  } finally {
    if (requestId === listRequest) listLoading.value = false
  }
}

async function loadDetail() {
  const requestId = ++detailRequest
  selectedMail.value = undefined
  detailError.value = ''
  if (!selectedMailId.value) return

  detailLoading.value = true
  try {
    const result = await getMailMessage(selectedMailId.value)
    if (requestId === detailRequest) selectedMail.value = result
  } catch {
    if (requestId === detailRequest) detailError.value = t('mail.load.detailFailed')
  } finally {
    if (requestId === detailRequest) detailLoading.value = false
  }
}

watch(
  [mailbox, folderId],
  () => {
    searchQuery.value = ''
    void loadList()
  },
  { immediate: true },
)

watch(selectedMailId, () => void loadDetail(), { immediate: true })
onMounted(() => void loadShell())
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
  padding: 0 24px;
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
  display: flex;
  align-items: center;
  color: var(--app-color-brand);
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
    padding: 0 16px;
  }

  .topbar > .global-search {
    position: static !important;
    width: 100%;
  }
}
</style>
