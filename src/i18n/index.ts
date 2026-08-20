import { createI18n } from 'vue-i18n'
import enUS from './locales/en-US'
import zhCN from './locales/zh-CN'

const locale = navigator.language.toLowerCase().startsWith('en') ? 'en-US' : 'zh-CN'

document.documentElement.lang = locale

export default createI18n({
  legacy: false,
  globalInjection: true,
  locale,
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
})
