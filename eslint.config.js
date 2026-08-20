import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import pluginVue from 'eslint-plugin-vue'

export default defineConfigWithVueTs(
  {
    name: 'email-web/files',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  {
    name: 'email-web/ignores',
    ignores: ['dist/**', 'src/auto-imports.d.ts', 'src/components.d.ts'],
  },
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  skipFormatting,
  {
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
)
