// src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Introduce from '@/views/Introduce.vue'
import LoginPage from '@/views/LoginPage.vue'
import CVLayout from '@/views/CVLayout.vue'
import AccountInfo from '@/views/AccountInfo.vue'
import Library from '@/views/Library.vue'
import { ensureAuth } from '@/utils/auth'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/introduce', name: 'Introduce', component: Introduce },
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/cv', name: 'CVLayout', component: CVLayout, meta: { requiresAuth: true } },
  { path: '/account', name: 'AccountInfo', component: AccountInfo, meta: { requiresAuth: true } },
  { path: '/library', name: 'Library', component: Library, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHashHistory(), // Vue 3 chuẩn
  routes
})

// Guard kiểm tra đăng nhập
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !ensureAuth()) {
    alert('Bạn cần đăng nhập hoặc đăng ký để sử dụng chức năng này.')
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router