import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'normalize.css/normalize.css'
import './styles/app.scss'
import App from './App.vue'
import { installLocale } from './i18n'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')
installLocale()
