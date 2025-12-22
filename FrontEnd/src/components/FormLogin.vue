<template>
  <div class="auth-card panel">
    <div class="auth-head">
      <h2>{{ isRegister ? 'Tạo tài khoản' : 'Chào mừng trở lại' }}</h2>
      <p class="muted">{{ isRegister ? 'Đăng ký để bắt đầu tạo CV của bạn' : 'Đăng nhập để tiếp tục hành trình' }}</p>
    </div>

    <form class="auth-form" @submit.prevent="handleSubmit">
      <label class="field">
        <span class="label">Email</span>
        <input v-model.trim="email" type="email" autocomplete="email" placeholder="name@gmail.com" required />
      </label>

      <label class="field">
        <span class="label">Mật khẩu</span>
        <div class="password">
          <input :type="showPass ? 'text' : 'password'" v-model="password" autocomplete="current-password" placeholder="••••••••" required />
          <button type="button" class="toggle" @click="showPass = !showPass" :aria-pressed="showPass">
            {{ showPass ? 'Ẩn' : 'Hiện' }}
          </button>
        </div>
      </label>

      <p v-if="error" class="error">{{ error }}</p>

      <button class="primary" type="submit" :disabled="loading || !email || !password">
        <span v-if="loading">{{ isRegister ? 'Đang đăng ký…' : 'Đang đăng nhập…' }}</span>
        <span v-else>{{ isRegister ? 'Đăng ký' : 'Đăng nhập' }}</span>
      </button>
    </form>

    <div class="auth-foot">
      <span class="muted">{{ isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?' }}</span>
      <button type="button" class="link" @click="toggleMode" :disabled="loading">
        {{ isRegister ? 'Đăng nhập' : 'Đăng ký' }}
      </button>
    </div>
  </div>
  
</template>

<script>


export default {
  name: 'FormLogin',
  data() {
    return {
      email: '',
      password: '',
      isRegister: false,
      loading: false,
      error: '',
      showPass: false
    }
  },
  mounted() {
    // Mỗi lần vào trang login, reset form và chế độ
    this.email = ''
    this.password = ''
    this.isRegister = false
    this.error = ''
    this.showPass = false
  },
  methods: {
    toggleMode() {
      this.isRegister = !this.isRegister
      // Nếu muốn reset khi chuyển chế độ:
      this.email = ''
      this.password = ''
      this.error = ''
      this.showPass = false
    },
    async handleSubmit() {
      this.loading = true
      try {
        const endpoint = this.isRegister
          ? `http://localhost:8888/api/register`
          : `http://localhost:8888/api/login`

        console.log('Sending request to:', endpoint)
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email, password: this.password })
        })

        console.log('Response status:', res.status)
        
        if (!res.ok) {
          const errorText = await res.text()
          console.error('Server error response:', errorText)
          this.error = errorText || 'Có lỗi xảy ra. Vui lòng thử lại.'
          return
        }

        const data = await res.json()
        console.log('Response data:', data)
        
        if (!data || !data.message) {
          this.error = 'Phản hồi từ máy chủ không hợp lệ'
          return
        }

        this.error = ''

        if (data.success) {
          
          localStorage.setItem('user_id', data.user_id)
          localStorage.setItem('isLoggedIn', 'true')
          localStorage.setItem('userEmail', data.email || this.email)
          // Dispatch storage event để Navbar detect change
          window.dispatchEvent(new Event('storage'))

          // Reset form trước khi điều hướng
          this.email = ''
          this.password = ''

          this.$router.push('/')
        }
      } catch (err) {
        console.error('Full error:', err)
        this.error = 'Lỗi kết nối: ' + err.message
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.auth-card {
  width: 100%;
  max-width: 480px;
  margin: 48px auto;
  overflow: hidden;
}
.auth-head {
  padding: 24px 24px 8px;
  background: linear-gradient(135deg, var(--accent), #f9fbff);
  border-bottom: 1px solid var(--panel-border);
}
.auth-head h2 { font-size: 22px; font-weight: 800; letter-spacing: .2px; }
.muted { color: var(--muted); font-size: 13px; }

.auth-form { display: grid; gap: 14px; padding: 16px 20px 20px; }
.field { display: grid; gap: 8px; }
.label { font-size: 13px; font-weight: 700; color: #2a3742; }
.field input {
  border: 1px solid var(--panel-border);
  border-radius: 12px;
  padding: 12px 14px;
  background: #f9fbff;
  font-size: 14px;
}
.password { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 8px; }
.toggle {
  border: 1px solid var(--panel-border);
  background: #fff;
  border-radius: 10px;
  padding: 8px 10px;
  color: #3a4854;
  cursor: pointer;
}
.error { color: #b42318; background:#ffecec; border:1px solid #ffd2cf; padding:10px 12px; border-radius:10px; font-weight:600; }

.primary {
  margin-top: 6px;
  border: 1px solid transparent;
  background: linear-gradient(135deg, var(--brand), var(--brand-2));
  color: #fff;
  padding: 12px 14px;
  font-weight: 800;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 12px 28px rgba(25,162,169,.22);
}
.primary:disabled { opacity: .7; cursor: not-allowed; box-shadow: none; }

.auth-foot {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 20px 20px;
}
.link { background: transparent; border: none; color: var(--brand-2); font-weight: 800; cursor: pointer; }
</style>