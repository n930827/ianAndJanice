import { createRouter, createWebHistory } from 'vue-router';
// 引入你的頁面組件
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
// 引入 Auth 邏輯，用來檢查使用者是否已登入
import { useAuth } from '@/composables/useAuth';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    // meta 欄位用來標記這個頁面「需要登入」才能看
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
];

const router = createRouter({
  // 使用 HTML5 History 模式 (網址不會有 # 字號)
  history: createWebHistory(),
  routes
});

// 全域路由守衛 (每一次換頁前都會執行這裡)
router.beforeEach((to, from, next) => {
  const { user } = useAuth();
  
  // 情況 1: 去的頁面需要權限 (requiresAuth)，但使用者沒登入 (!user.value)
  if (to.meta.requiresAuth && !user.value) {
    // -> 踢回登入頁
    next('/login');
  } 
  // 情況 2: 使用者已經登入了，卻還想去登入頁 (path === '/login')
  else if (to.path === '/login' && user.value) {
    // -> 踢回首頁 (不用再登入了)
    next('/');
  } 
  // 其他情況: 放行
  else {
    next();
  }
});

export default router;