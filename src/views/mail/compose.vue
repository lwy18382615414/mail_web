<template>
  <div class="compose-overlay" role="presentation">
    <section
      class="compose-window"
      :class="{ maximized: isMaximized, 'viewport-maximized': viewportForcesMaximized }"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      @keydown.esc="requestClose"
    >
      <h1 :id="titleId" class="sr-only">{{ t('pages.compose') }}</h1>

      <header class="compose-header">
        <div class="primary-actions">
          <button class="send-button" type="button" :disabled="isSending" @click="sendMessage">
            <SvgIcon name="mail-sent" :size="20" />
            <span>{{ isSending ? t('mail.compose.sending') : t('mail.compose.send') }}</span>
          </button>
          <button type="button" :disabled="isSaving" @click="saveManually">
            {{ isSaving ? t('mail.compose.saving') : t('mail.compose.save') }}
          </button>
          <button type="button">{{ t('mail.compose.attachment') }}</button>
          <button class="optional-action" type="button">
            {{ t('mail.compose.largeAttachment') }}
          </button>
          <button class="optional-action" type="button">
            {{ t('mail.compose.sendSettings') }}
          </button>
        </div>

        <div class="window-actions">
          <strong>zhouqin@smartapp.net.cn</strong>
          <button
            class="icon-button window-toggle"
            type="button"
            :disabled="viewportForcesMaximized"
            :aria-label="toggleLabel"
            :aria-pressed="isMaximized"
            :title="toggleTitle"
            @click="toggleMaximized"
          >
            <SvgIcon
              :name="isMaximized ? 'mail-compose-restore' : 'mail-compose-maximize'"
              :size="24"
            />
          </button>
          <button
            class="icon-button close-button"
            type="button"
            :aria-label="t('mail.compose.close')"
            :title="t('mail.compose.close')"
            @click="requestClose"
          >
            <SvgIcon name="mail-compose-close" :size="24" />
          </button>
        </div>
      </header>

      <div class="message-card">
        <label class="address-row">
          <span>{{ t('mail.compose.to') }}</span>
          <input
            ref="recipientInput"
            v-model="form.to"
            :placeholder="t('mail.compose.recipientPlaceholder')"
          />
          <button type="button" :aria-label="t('mail.compose.addRecipient')">+</button>
        </label>
        <label class="address-row">
          <span>{{ t('mail.compose.cc') }}</span>
          <input v-model="form.cc" />
          <button type="button">{{ t('mail.compose.bcc') }}</button>
        </label>
        <label class="address-row subject-row">
          <span>{{ t('mail.compose.subject') }}</span>
          <input v-model="form.subject" />
        </label>

        <div class="editor-toolbar" role="toolbar" :aria-label="t('mail.compose.formatting')">
          <button type="button" title="Bold"><b>B</b></button>
          <button type="button" title="Italic"><i>I</i></button>
          <button type="button" title="Underline"><u>U</u></button>
          <span class="toolbar-divider"></span>
          <button type="button">Arial</button>
          <button type="button">11</button>
          <span class="toolbar-divider"></span>
          <button type="button">≡</button>
          <button type="button">☷</button>
          <button type="button">A</button>
        </div>

        <textarea
          v-model="form.body"
          class="message-editor"
          :aria-label="t('mail.compose.body')"
        ></textarea>

        <footer class="compose-status" aria-live="polite">
          {{ saveStatusText }}
        </footer>
      </div>
    </section>

    <div v-if="showCloseConfirmation" class="confirmation-overlay" role="presentation">
      <section
        ref="confirmationDialog"
        class="confirmation-dialog"
        role="alertdialog"
        tabindex="-1"
        aria-modal="true"
        :aria-labelledby="confirmationTitleId"
        @keydown.esc="continueEditing"
      >
        <h2 :id="confirmationTitleId">{{ t('mail.compose.unsavedTitle') }}</h2>
        <p>{{ t('mail.compose.unsavedDescription') }}</p>
        <div class="confirmation-actions">
          <button type="button" @click="continueEditing">
            {{ t('mail.compose.continueEditing') }}
          </button>
          <button type="button" @click="discardAndClose">{{ t('mail.compose.discard') }}</button>
          <button class="confirm-save" type="button" :disabled="isSaving" @click="saveAndClose">
            {{ t('mail.compose.saveAndClose') }}
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import { saveDraft } from '@/api/drafts'
import { useComposeSource } from './composeSession'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const titleId = 'compose-dialog-title'
const confirmationTitleId = 'compose-close-confirmation-title'
const recipientInput = ref<HTMLInputElement>()
const confirmationDialog = ref<HTMLElement>()
const userMaximized = ref(false)
const viewportForcesMaximized = ref(false)
const isSaving = ref(false)
const isSending = ref(false)
const showCloseConfirmation = ref(false)
const saveStatus = ref<'idle' | 'dirty' | 'saving' | 'saved' | 'error'>('idle')
const composeSource = useComposeSource()
const form = reactive({ to: '', cc: '', subject: '', body: '' })
let draftId = typeof route.params.draftId === 'string' ? route.params.draftId : undefined
let version = 0
let lastSavedSnapshot = JSON.stringify(form)
let saveQueue = Promise.resolve(true)
let autoSaveTimer = 0
let allowLeave = false
let pendingDestination = ''

const isMaximized = computed(() => userMaximized.value || viewportForcesMaximized.value)
const currentSnapshot = computed(() => JSON.stringify(form))
const hasContent = computed(() => Object.values(form).some((value) => value.trim()))
const hasUnsavedChanges = computed(() => currentSnapshot.value !== lastSavedSnapshot)
const sourcePath = computed(() => composeSource.value?.fullPath ?? '/mail/inbox')
const saveStatusText = computed(() => {
  if (saveStatus.value === 'saving') return t('mail.compose.saving')
  if (saveStatus.value === 'saved') return t('mail.compose.saved')
  if (saveStatus.value === 'error') return t('mail.compose.saveFailed')
  if (hasUnsavedChanges.value) return t('mail.compose.unsaved')
  return ''
})
const toggleLabel = computed(() =>
  isMaximized.value ? t('mail.compose.restoreAria') : t('mail.compose.maximizeAria'),
)
const toggleTitle = computed(() =>
  viewportForcesMaximized.value
    ? t('mail.compose.restoreUnavailable')
    : isMaximized.value
      ? t('mail.compose.restore')
      : t('mail.compose.maximize'),
)

function updateViewportMode() {
  viewportForcesMaximized.value = window.innerWidth < 1004 || window.innerHeight < 644
}

function toggleMaximized() {
  if (!viewportForcesMaximized.value) userMaximized.value = !userMaximized.value
}

function requestClose() {
  if (!hasContent.value && !draftId) return closeTo(sourcePath.value)
  if (!hasUnsavedChanges.value) return closeTo(sourcePath.value)

  pendingDestination = sourcePath.value
  showCloseConfirmation.value = true
  nextTick(() => confirmationDialog.value?.focus())
}

function closeTo(path: string) {
  allowLeave = true
  router.replace(path)
}

function continueEditing() {
  showCloseConfirmation.value = false
  pendingDestination = ''
  nextTick(() => recipientInput.value?.focus())
}

function discardAndClose() {
  closeTo(pendingDestination || sourcePath.value)
}

function queueSave(mode: 'auto' | 'manual') {
  const snapshot = currentSnapshot.value
  if (!hasContent.value || (mode === 'auto' && snapshot === lastSavedSnapshot))
    return Promise.resolve(true)

  saveQueue = saveQueue.then(async () => {
    const latestSnapshot = currentSnapshot.value
    if (mode === 'auto' && latestSnapshot === lastSavedSnapshot) return true

    isSaving.value = true
    saveStatus.value = 'saving'
    const payload = JSON.parse(latestSnapshot) as typeof form

    try {
      const result = await saveDraft({
        draftId,
        ...payload,
        saveMode: mode,
        version: ++version,
      })
      draftId = result.draftId
      lastSavedSnapshot = latestSnapshot
      saveStatus.value = 'saved'

      if (route.name === 'compose') {
        await router.replace({ name: 'edit-draft', params: { draftId } })
      }
      return true
    } catch {
      saveStatus.value = 'error'
      return false
    } finally {
      isSaving.value = false
    }
  })

  return saveQueue
}

async function saveManually() {
  if (!hasContent.value) {
    ElMessage.warning(t('mail.compose.emptyDraft'))
    return
  }

  const saved = await queueSave('manual')
  if (saved) ElMessage.success(t('mail.compose.savedToDrafts'))
}

async function saveAndClose() {
  const saved = await queueSave('manual')
  if (saved) closeTo(pendingDestination || sourcePath.value)
}

async function sendMessage() {
  if (!form.to.trim()) {
    ElMessage.warning(t('mail.compose.recipientRequired'))
    recipientInput.value?.focus()
    return
  }

  isSending.value = true
  await new Promise((resolve) => window.setTimeout(resolve, 500))
  isSending.value = false
  ElMessage.success(t('mail.compose.sent'))
  closeTo(sourcePath.value)
}

function handleBeforeUnload(event: BeforeUnloadEvent) {
  if (!hasUnsavedChanges.value) return
  event.preventDefault()
  event.returnValue = ''
}

function trapFocus(event: KeyboardEvent) {
  if (event.key !== 'Tab') return
  const root = (
    showCloseConfirmation.value
      ? confirmationDialog.value
      : recipientInput.value?.closest('.compose-window')
  ) as HTMLElement | null
  const focusable = root?.querySelectorAll<HTMLElement>(
    'button:not(:disabled), input, textarea, [tabindex="0"]',
  )
  if (!focusable?.length) return
  const first = focusable[0]!
  const last = focusable[focusable.length - 1]!

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

onMounted(() => {
  updateViewportMode()
  window.addEventListener('resize', updateViewportMode)
  window.addEventListener('beforeunload', handleBeforeUnload)
  document.addEventListener('keydown', trapFocus)
  autoSaveTimer = window.setInterval(() => void queueSave('auto'), 60_000)
  nextTick(() => recipientInput.value?.focus())
})

onBeforeRouteLeave((to) => {
  if (allowLeave || !hasUnsavedChanges.value || (!hasContent.value && !draftId)) return true

  pendingDestination = to.fullPath
  showCloseConfirmation.value = true
  nextTick(() => confirmationDialog.value?.focus())
  return false
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewportMode)
  window.removeEventListener('beforeunload', handleBeforeUnload)
  document.removeEventListener('keydown', trapFocus)
  window.clearInterval(autoSaveTimer)
})
</script>

<style scoped lang="scss">
.compose-overlay {
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: grid;
  place-items: center;
}

.compose-window {
  display: flex;
  flex-direction: column;
  width: min(1000px, calc(100vw - 48px));
  height: min(800px, calc(100vh - 48px));
  overflow: hidden;
  border: 1px solid var(--app-color-border);
  border-radius: 8px;
  background: var(--app-color-bg-page);
  box-shadow: 0 20px 50px rgb(0 0 0 / 15%);
  transition:
    width 180ms cubic-bezier(0.2, 0, 0, 1),
    height 180ms cubic-bezier(0.2, 0, 0, 1),
    border-radius 180ms cubic-bezier(0.2, 0, 0, 1),
    box-shadow 180ms cubic-bezier(0.2, 0, 0, 1);

  &.maximized {
    width: 100vw;
    height: 100vh;
    border: 0;
    border-radius: 0;
    box-shadow: none;
  }
}

.compose-header {
  display: flex;
  flex: 0 0 72px;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 0 24px;
}

.primary-actions,
.window-actions {
  display: flex;
  align-items: center;
}

.primary-actions {
  gap: 6px;

  button {
    height: 40px;
    padding: 0 12px;
    border: 0;
    border-radius: 8px;
    color: var(--app-color-text-primary);
    background: transparent;
    font: inherit;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;

    &:hover {
      background: var(--app-color-bg-hover);
    }
  }

  .send-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 20px 0 12px;
    color: var(--app-color-text-on-color);
    background: var(--app-color-brand);

    &:hover {
      background: var(--app-color-brand-hover);
    }
  }
}

.window-actions {
  gap: 20px;

  strong {
    margin-right: 12px;
    font-size: 14px;
  }
}

.icon-button {
  position: relative;
  display: grid;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  place-items: center;
  color: var(--app-color-text-secondary);
  background: transparent;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: var(--app-color-bg-hover);
  }

  &:focus-visible {
    outline: 2px solid var(--app-color-brand);
    outline-offset: 2px;
  }

  &:disabled {
    color: var(--app-color-text-disabled);
    cursor: not-allowed;
  }
}

.message-card {
  display: flex;
  overflow: hidden;
  flex: 1;
  flex-direction: column;
  margin: 0 16px 16px;
  border-radius: 8px;
  background: var(--app-color-bg-surface);
  box-shadow: 0 1px 2px rgb(0 0 0 / 5%);
}

.address-row {
  display: flex;
  flex: 0 0 56px;
  align-items: center;
  padding: 0 24px;
  border-bottom: 1px solid var(--app-color-border);
  color: var(--app-color-text-placeholder);
  font-size: 14px;
  font-weight: 500;

  > span {
    width: 68px;
  }

  input {
    min-width: 0;
    height: 100%;
    flex: 1;
    border: 0;
    outline: 0;
    color: var(--app-color-text-primary);
    font: inherit;

    &::placeholder {
      color: var(--app-color-text-disabled);
    }
  }

  button {
    min-width: 32px;
    height: 32px;
    border: 0;
    border-radius: 4px;
    color: var(--app-color-text-secondary);
    background: transparent;
    font: inherit;
    cursor: pointer;
  }
}

.editor-toolbar {
  display: flex;
  overflow: hidden;
  flex: 0 0 56px;
  align-items: center;
  gap: 6px;
  padding: 0 24px;
  border-bottom: 1px solid var(--app-color-border);

  button {
    min-width: 32px;
    height: 32px;
    padding: 0 8px;
    border: 0;
    border-radius: 4px;
    color: var(--app-color-text-secondary);
    background: transparent;
    font: inherit;
    cursor: pointer;

    &:hover {
      background: var(--app-color-bg-hover);
    }
  }
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  margin: 0 8px;
  background: var(--app-color-border);
}

.message-editor {
  min-height: 0;
  flex: 1;
  resize: none;
  padding: 24px;
  border: 0;
  outline: 0;
  color: var(--app-color-text-primary);
  font:
    14px/1.7 'Microsoft YaHei',
    'PingFang SC',
    sans-serif;
}

.compose-status {
  min-height: 32px;
  padding: 6px 24px;
  color: var(--app-color-text-secondary);
  font-size: 12px;
  text-align: right;
}

.confirmation-overlay {
  position: fixed;
  z-index: 1040;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgb(17 24 39 / 42%);
}

.confirmation-dialog {
  width: min(440px, calc(100vw - 48px));
  padding: 24px;
  border: 1px solid var(--app-color-border);
  border-radius: 8px;
  background: var(--app-color-bg-surface);
  box-shadow: 0 20px 50px rgb(0 0 0 / 20%);

  h2 {
    margin: 0;
    font-size: 18px;
  }

  p {
    margin: 12px 0 24px;
    color: var(--app-color-text-secondary);
    font-size: 14px;
    line-height: 1.6;
  }
}

.confirmation-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;

  button {
    height: 36px;
    padding: 0 14px;
    border: 1px solid var(--app-color-border);
    border-radius: 6px;
    color: var(--app-color-text-primary);
    background: var(--app-color-bg-surface);
    cursor: pointer;
  }

  .confirm-save {
    border-color: var(--app-color-brand);
    color: var(--app-color-text-on-color);
    background: var(--app-color-brand);
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  padding: 0;
  border: 0;
  margin: -1px;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

@media (max-width: 1180px) {
  .optional-action {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .compose-window {
    transition: none;
  }
}
</style>
