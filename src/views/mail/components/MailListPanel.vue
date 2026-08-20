<template>
  <section class="mail-list-panel">
    <header class="list-heading">
      <h1>{{ title }}</h1>
      <el-dropdown
        trigger="click"
        placement="bottom-end"
        :show-arrow="false"
        :popper-options="filterPopperOptions"
        popper-class="mail-filter-popper"
        @command="handleFilterCommand"
        @visible-change="handleFilterVisibleChange"
      >
        <el-button
          class="filter-trigger"
          :class="{ expanded: isFilterOpen }"
          :aria-expanded="isFilterOpen"
          link
        >
          {{ t(`mail.filters.${filter}`) }}
          <span class="filter-chevron" aria-hidden="true">
            <SvgIcon name="mail-filter-chevron" />
          </span>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu class="mail-filter-menu">
            <li class="filter-group" role="group" :aria-label="t('mail.filters.filter')">
              <el-dropdown-item class="menu-label" disabled>
                {{ t('mail.filters.filter') }}
              </el-dropdown-item>
              <el-dropdown-item command="filter:all" :class="{ active: filter === 'all' }">
                {{ t('mail.filters.all') }}
                <span v-if="filter === 'all'" class="check-icon" aria-hidden="true">
                  <SvgIcon name="mail-check" />
                </span>
              </el-dropdown-item>
              <el-dropdown-item command="filter:unread" :class="{ active: filter === 'unread' }">
                {{ t('mail.filters.unread') }}
                <span v-if="filter === 'unread'" class="check-icon" aria-hidden="true">
                  <SvgIcon name="mail-check" />
                </span>
              </el-dropdown-item>
            </li>

            <li class="filter-group" role="group" :aria-label="t('mail.filters.sortBy')">
              <el-dropdown-item class="menu-label" disabled>
                {{ t('mail.filters.sortBy') }}
              </el-dropdown-item>
              <el-dropdown-item
                v-for="option in sortOptions"
                :key="option"
                :command="`sort:${option}`"
                :class="{ active: sortBy === option }"
              >
                {{ t(`mail.filters.${option}`) }}
                <span v-if="sortBy === option" class="check-icon" aria-hidden="true">
                  <SvgIcon name="mail-check" />
                </span>
              </el-dropdown-item>
            </li>

            <li class="filter-group" role="group" :aria-label="t('mail.filters.order')">
              <el-dropdown-item class="menu-label" disabled>
                {{ t('mail.filters.order') }}
              </el-dropdown-item>
              <el-dropdown-item
                v-for="option in orderOptions"
                :key="option"
                :command="`order:${option}`"
                :class="{ active: sortOrder === option }"
              >
                {{ t(`mail.filters.${option}`) }}
                <span v-if="sortOrder === option" class="check-icon" aria-hidden="true">
                  <SvgIcon name="mail-check" />
                </span>
              </el-dropdown-item>
            </li>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </header>

    <div class="mail-list">
      <div
        v-for="mail in displayedMails"
        :key="mail.id"
        :class="['mail-item', { selected: selectedMailId === mail.id, unread: mail.unread }]"
        @click="$emit('select', mail.id)"
      >
        <el-avatar class="avatar" :size="40" :style="{ background: getAvatarColor(mail.initials) }">{{
          mail.initials
        }}</el-avatar>
        <span class="mail-summary">
          <span class="mail-meta">
            <span class="sender-line">
              <strong>{{ mail.sender }}</strong>
              <el-tag v-if="mail.new" class="tag new" effect="light">{{
                t('mail.tags.new')
              }}</el-tag>
            </span>
            <time>{{ mail.time }}</time>
          </span>
          <strong class="subject">{{ mail.subject }}</strong>
          <span class="preview">{{ mail.preview }}</span>
          <span v-if="mail.group || mail.external || mail.attachment" class="mail-flags">
            <el-tag v-if="mail.group" class="tag group" effect="light">{{
              t('mail.tags.group')
            }}</el-tag>
            <el-tag v-if="mail.external" class="tag external" effect="light">{{
              t('mail.tags.external')
            }}</el-tag>
            <SvgIcon v-if="mail.attachment" name="mail-receipt" :size="20" />
          </span>
        </span>
        <i v-if="mail.unread" class="unread-dot"></i>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Mail } from '@/types/mail'
import { getAvatarColor } from '@/utils/avatar'

const { t } = useI18n()

const props = defineProps<{
  title: string
  mails: Mail[]
  selectedMailId?: string
}>()

defineEmits<{
  select: [messageId: string]
}>()

type MailFilter = 'all' | 'unread'
type MailSort = 'date' | 'sender' | 'size' | 'priority'
type SortOrder = 'oldest' | 'newest'

const sortOptions: MailSort[] = ['date', 'sender', 'size', 'priority']
const orderOptions: SortOrder[] = ['oldest', 'newest']
const filterPopperOptions = {
  modifiers: [{ name: 'offset', options: { offset: [0, 4] } }],
}
const filter = ref<MailFilter>('all')
const sortBy = ref<MailSort>('date')
const sortOrder = ref<SortOrder>('oldest')
const isFilterOpen = ref(false)

const displayedMails = computed(() => {
  const filtered =
    filter.value === 'unread' ? props.mails.filter((mail) => mail.unread) : props.mails
  const direction = sortOrder.value === 'oldest' ? 1 : -1

  return [...filtered].sort((first, second) => {
    if (sortBy.value === 'sender') {
      return first.sender.localeCompare(second.sender) * direction
    }

    if (sortBy.value === 'date') {
      return (props.mails.indexOf(first) - props.mails.indexOf(second)) * direction
    }

    return 0
  })
})

function handleFilterCommand(command: string) {
  const [group, value] = command.split(':')

  if (group === 'filter') filter.value = value as MailFilter
  if (group === 'sort') sortBy.value = value as MailSort
  if (group === 'order') sortOrder.value = value as SortOrder
}

function handleFilterVisibleChange(visible: boolean) {
  isFilterOpen.value = visible
}
</script>

<style scoped lang="scss">
.mail-list-panel {
  grid-row: 2;
  min-width: 0;
  overflow: hidden;
  border-right: 1px solid var(--app-color-border);
  background: var(--app-color-bg-muted);
}

.list-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 4px;

  h1 {
    margin: 0;
    font-size: 24px;
    line-height: 32px;
  }

  .el-button {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0;
    border: 0;
    color: inherit;
    background: transparent;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }

  .filter-trigger {
    color: var(--app-color-text-disabled);
    transition: color 120ms ease;

    &.expanded {
      color: var(--app-color-brand);
    }
  }
}

.filter-chevron {
  display: inline-flex;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;

  .svg-icon {
    width: 7.5px !important;
    height: 13.5px !important;
    transform: rotate(-90deg);
    transition: transform 160ms ease;
  }
}

.filter-trigger.expanded .filter-chevron .svg-icon {
  transform: rotate(90deg);
}

.mail-list {
  height: calc(100% - 56px);
  padding: 16px;
  overflow-y: auto;
}

.mail-item {
  position: relative;
  display: flex;
  gap: 12px;
  width: 100%;
  min-height: 132px;
  padding: 16px 16px 16px 12px;
  height: auto;
  margin: 0;
  border: 0;
  border-bottom: 1px solid var(--app-color-border);
  border-left: 4px solid transparent;
  color: var(--app-color-text-primary);
  background: transparent;
  font: inherit;
  text-align: left;
  cursor: pointer;

  &.selected {
    border-bottom-color: transparent;
    border-left-color: var(--app-color-brand);
    border-radius: 4px;
    background: var(--app-color-bg-surface);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
  }

  &:hover:not(.selected) {
    background: var(--app-color-bg-surface-translucent);
  }
}

.avatar {
  flex: 0 0 40px;
  border-radius: 16px;
  color: var(--app-color-text-on-color);
  font-size: 16px;
  font-weight: 700;
}

.mail-summary {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  padding: 4px 0;
}

.mail-meta,
.mail-flags,
.sender-line {
  display: flex;
  align-items: center;
}

.mail-meta {
  justify-content: space-between;

  strong {
    color: var(--app-color-text-heading);
    font-size: 15px;
    line-height: 22px;
  }

  time {
    color: var(--app-color-text-disabled);
    font-size: 12px;
  }
}

.sender-line {
  gap: 10px;
}

.subject,
.preview {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.subject {
  font-size: 16px;
  line-height: 22px;
}

.preview {
  color: var(--app-color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
}

.mail-flags {
  justify-content: space-between;
  min-height: 18px;
}

.tag {
  height: 18px;
  width: fit-content;
  padding: 0 6px;
  border: 0;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  line-height: 14px;

  &.new {
    color: var(--app-color-brand);
    background: var(--app-color-brand-tint);
  }
  &.group {
    color: var(--app-color-danger-emphasis);
    background: var(--app-color-danger-tint);
  }
  &.external {
    color: var(--app-color-warning-emphasis);
    background: var(--app-color-warning-tint);
  }
}

.unread-dot {
  position: absolute;
  top: 33px;
  left: 3px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--app-color-brand);
}

:global(.mail-filter-popper.el-popper) {
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
}

:global(.mail-filter-menu) {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 140px;
  padding: 0;
  overflow: hidden;
  border-radius: 8px;
  background: var(--app-color-bg-surface);
  box-shadow:
    0 0 10px rgb(0 0 0 / 10%),
    0 0 2px rgb(0 0 0 / 5%);
}

:global(.mail-filter-menu .filter-group) {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  padding: 10px;
  border-bottom: 1px solid var(--app-color-border);
  list-style: none;
}

:global(.mail-filter-menu .filter-group:last-child) {
  border-bottom: 0;
}

:global(.mail-filter-menu .el-dropdown-menu__item) {
  justify-content: space-between;
  min-height: 22px;
  margin-inline: -6px;
  padding: 0 6px;
  border-radius: 4px;
  color: var(--app-color-text-primary);
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  transition:
    color 120ms ease,
    background-color 120ms ease;
}

:global(.mail-filter-menu .el-dropdown-menu__item.active) {
  color: var(--app-color-brand);
}

:global(.mail-filter-menu .el-dropdown-menu__item.menu-label) {
  min-height: 22px;
  color: var(--app-color-text-disabled);
  opacity: 1;
  cursor: default;
}

:global(.mail-filter-menu .check-icon) {
  display: inline-flex;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  margin-block: -1px;
}

:global(.mail-filter-menu .check-icon .svg-icon) {
  width: 19.5px !important;
  height: 13.5px !important;
}

:global(.mail-filter-menu .el-dropdown-menu__item:not(.is-disabled):is(:hover, :focus)) {
  color: var(--app-color-brand);
  background: var(--app-color-brand-subtle);
}
</style>
