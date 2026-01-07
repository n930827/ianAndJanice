// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue'; // 確保路徑正確
import Login from '@/views/Login.vue'; // 確保路徑正確
import { auth } from '@/api/firebase'; // <--- 1. 確保引入 auth

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 2. 修改路由守衛
router.beforeEach((to, from, next) => {
  // 直接抓取當下最即時的 Firebase 使用者狀態
  const currentUser = auth.currentUser; 

  console.log(`路由切換: 去哪裡? ${to.path}, 有登入嗎? ${!!currentUser}`); // <--- 除錯用

  // 情況 A: 要去首頁 (需要權限) 且 沒登入 -> 踢回登入頁
  if (to.meta.requiresAuth && !currentUser) {
    console.log("被擋住了：沒登入不能去首頁");
    next('/login');
  } 
  // 情況 B: 已經登入了 卻還想去登入頁 -> 踢回首頁
  else if (to.path === '/login' && currentUser) {
    console.log("已登入，強制導向首頁");
    next('/');
  } 
  // 情況 C: 其他狀況 -> 放行
  else {
    next();
  }
});

export default router;