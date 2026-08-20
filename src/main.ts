import { createApp } from 'vue'
import 'virtual:svg-icons-register'
import 'element-plus/dist/index.css'
import App from './App.vue'
import i18n from './i18n'
import router from './router'
import './styles/index.scss'

const app = createApp(App)

app.use(router)
app.use(i18n)

app.mount('#app')
