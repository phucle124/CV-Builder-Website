<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-left">
        <router-link to="/" class="logo-text">CV BUILDER</router-link>
        <router-link class="nav-link" to="/">Home</router-link>
        <router-link class="nav-link" to="/introduce">Introduce</router-link>
        <router-link class="nav-link" to="/login">Login</router-link>
      </div>
      
      <div class="nav-right">
        <div class="profile" v-if="isLoggedIn">
          <button type="button" class="profile-btn" @click.stop="toggleProfile">
            <span class="avatar">{{ avatarInitial }}</span>
            <span class="email">{{ currentUserEmail }}</span>
            <span class="chevron" :class="{ open: showProfile }">▾</span>
          </button>
          <div v-if="showProfile" class="profile-menu">
            <button type="button" class="item" @click="goToAccount">Thông tin tài khoản</button>
            <button type="button" class="item" @click="goToLibrary">Library</button>
            <div class="divider"></div>
            <button type="button" class="item logout-item" @click.stop="handleLogout">Đăng xuất</button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { isAuthenticated } from '@/utils/auth'

export default {
  name: 'Navbar',
  data() {
    return {
      showProfile: false,
      authState: localStorage.getItem('isLoggedIn') === 'true',
      currentUserEmail: localStorage.getItem('userEmail') || 'Tài khoản'
    }
  },
  computed: {
    isLoggedIn() {
      return this.authState
    },
    avatarInitial() {
      const email = this.currentUserEmail || ''
      return email.charAt(0).toUpperCase()
    }
  },
  mounted() {
    window.addEventListener('click', this.handleOutside)
    window.addEventListener('storage', this.refreshAuthState)
  },
  beforeUnmount() {
    window.removeEventListener('click', this.handleOutside)
    window.removeEventListener('storage', this.refreshAuthState)
  },
  methods: {
    refreshAuthState() {
      this.authState = localStorage.getItem('isLoggedIn') === 'true'
      this.currentUserEmail = localStorage.getItem('userEmail') || 'Tài khoản'
      console.log('Auth state refreshed:', this.authState, 'Email:', this.currentUserEmail)
    },
    toggleProfile() {
      this.showProfile = !this.showProfile
    },
    closeProfile() {
      this.showProfile = false
    },
    handleOutside() {
      this.showProfile = false
    },
    handleLogout() {
      console.log('Logout clicked')
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('userEmail')
      this.authState = false
      this.showProfile = false
      console.log('Auth state after logout:', this.authState)
      this.$router.push('/login')
    },
    goToAccount() {
      this.showProfile = false
      this.$router.push('/account')
    },
    goToLibrary() {
      this.showProfile = false
      this.$router.push('/library')
    }
  }
}
</script>

<style scoped>
.navbar {
  position: relative;
  width: 100%;
  padding: 10px 20px;
  z-index: 10;
  background-color: #f7f9fc;
  border-radius: 12px;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  width: 100%;
  gap: 24px;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-text {
  font-size: 1.6rem;
  font-weight: bold;
  color: #111820;
  text-decoration: none;
}
.logo-text:hover { color: #19a2a9; }

.nav-link {
  font-weight: 600;
  color: #333;
  text-decoration: none;
  transition: color 0.3s ease;
}
.nav-link:hover { color: #19a2a9; }

.router-link-exact-active {
  color: #19a2a9;
  font-weight: bold;
}

.profile {
  position: relative;
  display: flex;
  align-items: center;
}

.profile-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid #d5dde6;
  background: #ffffff;
  color: #0c1b2a;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 6px 14px rgba(16, 31, 44, 0.08);
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #19a2a9, #13868c);
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.email { font-weight: 600; color: #0c1b2a; }

.chevron { color: #4c5a66; transition: transform 0.2s ease; }
.chevron.open { transform: rotate(180deg); }

.profile-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  background: #ffffff;
  border: 1px solid #d5dde6;
  border-radius: 12px;
  box-shadow: 0 14px 30px rgba(16, 31, 44, 0.12);
  padding: 6px;
  display: grid;
  gap: 6px;
  z-index: 20;
}

.profile-menu .item {
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  padding: 10px 12px;
  border-radius: 10px;
  font-weight: 600;
  color: #0c1b2a;
  cursor: pointer;
}

.profile-menu .item:hover {
  background: #f1f5f9;
}

.divider {
  height: 1px;
  background: #e1e7ed;
  margin: 6px 0;
}

.logout-item {
  color: #c84e4e;
}
.logout-item:hover {
  background: #ffe8e8;
}
</style>
