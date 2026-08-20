# 企业邮箱 Web 前端

基于 Vue 3、TypeScript、Vite、Element Plus、SCSS 和 Vue I18n 的企业邮箱前端骨架。

## 开发环境

- Node.js：`^18.18.0 || ^20.9.0 || >=22.0.0`
- pnpm：`>=10.34.5 <11`

## 常用命令

```bash
pnpm install
pnpm dev
pnpm lint
pnpm audit:colors
pnpm format:check
pnpm build
```

## 主题颜色

- 基础色板与业务语义色定义在 `src/styles/tokens.scss`。
- 业务样式使用 `--app-*` 变量，不直接依赖 Element Plus 的 `--el-*` 变量。
- Element Plus 的主题映射集中在 `src/styles/element-plus.scss`。
- 界面 SVG 使用 `currentColor`；头像、邮件正文装饰和插图可保留内容固有色。
- 修改样式后运行 `pnpm audit:colors`，检查新增的界面颜色硬编码。

需求基线见 [企业邮箱Web端_原型开发文档.md](./企业邮箱Web端_原型开发文档.md)。

## 命名约定

- 页面文件使用小驼峰命名，不添加 `View` 后缀，例如 `initialPassword.vue`。
- 组件文件使用大驼峰命名，例如 `AuthLayout.vue`。

## SVG 图标

图标文件放在 `src/assets/icons`，组件无需手动导入：

```vue
<SvgIcon name="mail" :size="20" title="邮件" />
```
