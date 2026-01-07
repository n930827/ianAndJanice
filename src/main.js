import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/scss/main.scss'
import { initAuth } from './composables/useAuth'

const app = createApp(App)
app.use(createPinia())
app.use(router)

initAuth().then(() => { app.mount('#app') })