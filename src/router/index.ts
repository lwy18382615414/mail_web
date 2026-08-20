import { createRouter, createWebHistory } from 'vue-router'

const MailWorkspace = () => import('@/views/mail/mailWorkspace.vue')
const Compose = () => import('@/views/mail/compose.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/mail/inbox',
    },
    {
      path: '/',
      component: () => import('@/layouts/AuthLayout.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/auth/login.vue'),
        },
        {
          path: 'first-login',
          name: 'initial-password',
          component: () => import('@/views/auth/initialPassword.vue'),
        },
        {
          path: 'reset-password',
          name: 'reset-password',
          component: () => import('@/views/auth/resetPassword.vue'),
        },
      ],
    },
    {
      path: '/',
      component: () => import('@/layouts/MailLayout.vue'),
      children: [
        {
          path: 'mail',
          redirect: '/mail/inbox',
        },
        {
          path: 'mail/inbox/:messageId?',
          name: 'inbox',
          component: MailWorkspace,
          meta: { mailbox: 'inbox', pageKey: 'inbox' },
        },
        {
          path: 'mail/starred/:messageId?',
          name: 'starred',
          component: MailWorkspace,
          meta: { mailbox: 'starred', pageKey: 'starred' },
        },
        {
          path: 'mail/drafts',
          name: 'drafts',
          component: MailWorkspace,
          meta: { mailbox: 'drafts', pageKey: 'drafts' },
        },
        {
          path: 'mail/sent/:messageId?',
          name: 'sent',
          component: MailWorkspace,
          meta: { mailbox: 'sent', pageKey: 'sent' },
        },
        {
          path: 'mail/trash/:messageId?',
          name: 'trash',
          component: MailWorkspace,
          meta: { mailbox: 'trash', pageKey: 'trash' },
        },
        {
          path: 'mail/spam/:messageId?',
          name: 'spam',
          component: MailWorkspace,
          meta: { mailbox: 'spam', pageKey: 'spam' },
        },
        {
          path: 'mail/folder/:folderId/:messageId?',
          name: 'custom-folder',
          component: MailWorkspace,
          meta: { mailbox: 'custom', pageKey: 'customFolder' },
        },
        {
          path: 'mail/search/:messageId?',
          name: 'search',
          component: MailWorkspace,
          meta: { mailbox: 'search', pageKey: 'search' },
        },
        {
          path: 'compose',
          name: 'compose',
          components: {
            default: MailWorkspace,
            compose: Compose,
          },
          meta: { mailbox: 'inbox', pageKey: 'inbox', compose: true },
        },
        {
          path: 'compose/:draftId',
          name: 'edit-draft',
          components: {
            default: MailWorkspace,
            compose: Compose,
          },
          meta: { mailbox: 'inbox', pageKey: 'inbox', compose: true },
        },
        {
          path: 'settings',
          component: () => import('@/layouts/SettingsLayout.vue'),
          children: [
            {
              path: '',
              redirect: '/settings/profile',
            },
            {
              path: 'profile',
              name: 'settings-profile',
              component: () => import('@/views/settings/profile.vue'),
            },
            {
              path: 'signatures',
              name: 'settings-signatures',
              component: () => import('@/views/settings/signatures.vue'),
            },
            {
              path: 'auto-reply',
              name: 'settings-auto-reply',
              component: () => import('@/views/settings/autoReply.vue'),
            },
            {
              path: 'rules',
              name: 'settings-rules',
              component: () => import('@/views/settings/rules.vue'),
            },
            {
              path: 'blocklist',
              name: 'settings-blocklist',
              component: () => import('@/views/settings/blocklist.vue'),
            },
          ],
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/notFound.vue'),
    },
  ],
})

export default router
