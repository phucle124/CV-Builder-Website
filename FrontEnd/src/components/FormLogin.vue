<template>
  <div class="form-login">
    <h2 class="text-center mb-4">{{ isRegister ? 'Đăng ký tài khoản' : 'Đăng nhập' }}</h2>

    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="email" class="form-label">Email:</label>
        <input v-model="email" type="email" id="email" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Mật khẩu:</label>
        <input v-model="password" type="password" id="password" class="form-control" required />
      </div>

      <button
        type="submit"
        class="btn w-100"
        :class="isRegister ? 'btn-success' : 'btn-primary'"
        :disabled="loading"
      >
        {{ loading ? (isRegister ? 'Đang đăng ký...' : 'Đang đăng nhập...') : (isRegister ? 'Đăng ký' : 'Đăng nhập') }}
      </button>
    </form>

    <div class="text-center mt-3">
      <button class="btn btn-link" @click="toggleMode" :disabled="loading">
        {{ isRegister ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký' }}
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
      loading: false
    }
  },
  mounted() {
    // Mỗi lần vào trang login, reset form và chế độ
    this.email = ''
    this.password = ''
    this.isRegister = false
  },
  methods: {
    toggleMode() {
      this.isRegister = !this.isRegister
      // Nếu muốn reset khi chuyển chế độ:
      this.email = ''
      this.password = ''
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
          alert('Lỗi từ máy chủ: ' + (errorText || res.statusText))
          return
        }

        const data = await res.json()
        console.log('Response data:', data)
        
        if (!data || !data.message) {
          alert('Phản hồi từ máy chủ không hợp lệ')
          return
        }

        alert(data.message)

        if (data.success) {
          
          localStorage.setItem('user_id', data.user_id)
          localStorage.setItem('isLoggedIn', 'true')
          localStorage.setItem('userEmail', data.email || this.email)

          alert('User ID: ' + data.user_id)
          // Dispatch storage event để Navbar detect change
          window.dispatchEvent(new Event('storage'))

          // Reset form trước khi điều hướng
          this.email = ''
          this.password = ''

          this.$router.push('/')
        }
      } catch (err) {
        console.error('Full error:', err)
        alert('Lỗi kết nối đến máy chủ: ' + err.message)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.form-login {
  max-width: 400px;
  margin: 50px auto;
}
</style>