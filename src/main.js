import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/scss/main.scss'

// 1. 引入 auth 服務
import { auth } from './api/firebase' 
import { onAuthStateChanged } from 'firebase/auth'

let app;

// 2. 監聽登入狀態改變
// 這個函式會在「Firebase 確認完使用者身分」後觸發
onAuthStateChanged(auth, (user) => {
  
  // 3. 確保只初始化一次 Vue 實例 (避免重複建立)
  if (!app) {
    app = createApp(App)
    app.use(createPinia())
    app.use(router) // Router 會在這裡讀取到最新的 user 狀態
    app.mount('#app')
  }
});