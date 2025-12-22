<template>
  <div class="account-container">
    <div class="account-card">
      <h1>Thông tin tài khoản</h1>
      
      <!-- Account Info Section -->
      <div class="info-section">
        <div class="info-item">
          <label>Email:</label>
          <div class="info-value">{{ email }}</div>
        </div>
        <div class="info-item">
          <label>Ngày tạo tài khoản:</label>
          <div class="info-value">{{ createdDate }}</div>
        </div>
      </div>

      <!-- Password Change Section -->
      <div class="password-section">
        <div class="section-header">
          
          <button class="btn-edit" @click="togglePasswordEdit" v-if="!showPasswordEdit">
            <span class="edit-icon">✏️</span> Đổi mật khẩu
          </button>
          

        <div v-if="showPasswordEdit" class="password-form">
          <div class="form-group">
            <label>Mật khẩu hiện tại:</label>
            <input type="password" v-model="currentPassword" placeholder="Nhập mật khẩu hiện tại" />
          </div>

          <div class="form-group">
            <label>Mật khẩu mới:</label>
            <input type="password" v-model="newPassword" placeholder="Nhập mật khẩu mới" />
          </div>

          <div class="form-group">
            <label>Xác nhận mật khẩu mới:</label>
            <input type="password" v-model="confirmPassword" placeholder="Xác nhận mật khẩu mới" />
          </div>

          <div class="password-actions">
            <button class="btn-save" @click="handleSave" :disabled="loading">{{ loading ? 'Đang lưu...' : 'Lưu mật khẩu mới' }}</button>
          </div>
        </div>
      </div>

      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>

      <div class="footer-actions">
        <button class="btn-back" @click="goBack">Quay lại</button>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  name: 'AccountInfo',
  data() {
    return {
      email: '',
      createdDate: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      loading: false,
      message: '',
      messageType: 'success',
      showPasswordEdit: false
    }
  },
  mounted() {
    this.getUserInfo()
  },
  methods: {

    async getUserInfo() {
      const userId = localStorage.getItem('user_id')
      if (!userId) return
      const res = await fetch(`http://localhost:8888/api/users/${userId}`)
      if(!res.ok){
        console.error('Không thể lấy thông tin người dùng')
        return
      }
      const data = await res.json()
      this.email = data.email
      this.createdDate = new Date(data.created_at).toLocaleDateString('vi-VN')
    },

    togglePasswordEdit() {
      this.showPasswordEdit = !this.showPasswordEdit
      // Clear form when closing
      if (!this.showPasswordEdit) {
        this.currentPassword = ''
        this.newPassword = ''
        this.confirmPassword = ''
        this.message = ''
      }
    },
    async handleSave() {
      if (this.newPassword && this.newPassword !== this.confirmPassword) {
        this.message = 'Mật khẩu mới không khớp!'
        this.messageType = 'error'
        return
      }

      if (!this.currentPassword) {
        this.message = 'Vui lòng nhập mật khẩu hiện tại!'
        this.messageType = 'error'
        return
      }

      if (!this.newPassword) {
        this.message = 'Vui lòng nhập mật khẩu mới!'
        this.messageType = 'error'
        return
      }

      this.loading = true
      try {
        const userId = localStorage.getItem('user_id') // nhớ dùng đúng key đã lưu khi login
        if (!userId) {
          this.message = 'Bạn chưa đăng nhập!'
          this.messageType = 'error'
          this.loading = false
          return
        }

        const res = await fetch(`http://localhost:8888/api/users/${userId}/password`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentPassword: this.currentPassword, // gửi cả mật khẩu hiện tại
            newPassword: this.newPassword
          })
        })

        if (!res.ok) {
          const errorData = await res.json()
          this.message = errorData.message || 'Cập nhật mật khẩu thất bại!'
          this.messageType = 'error'
          this.loading = false
          return
        }

        const data = await res.json()
        this.message = data.message || 'Cập nhật mật khẩu thành công!'
        this.messageType = 'success'
        this.currentPassword = ''
        this.newPassword = ''
        this.confirmPassword = ''
        this.showPasswordEdit = false
      } catch (err) {
        console.error(err)
        this.message = 'Lỗi kết nối: ' + err.message
        this.messageType = 'error'
      } finally {
        this.loading = false
      }
    },
    goBack() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.account-container {
  padding: 40px 20px;
  max-width: 600px;
  margin: 0 auto;
}

.account-card {
  background: #ffffff;
  border: 1px solid #dde3ea;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 10px 26px rgba(16, 31, 44, 0.12);
}

h1 {
  color: #0c1b2a;
  margin-bottom: 28px;
  font-size: 1.8rem;
}

h2 {
  color: #0c1b2a;
  font-size: 1.2rem;
  margin: 0;
}

/* Info Section */
.info-section {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 28px;
}

.info-item {
  margin-bottom: 16px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item label {
  display: block;
  font-weight: 600;
  color: #6b7b85;
  font-size: 0.9rem;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  color: #0c1b2a;
  font-size: 1.1rem;
  padding: 8px 12px;
}

/* Password Section */
.password-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #dde3ea;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.btn-edit {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: #19a2a9;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s ease;
}

.btn-edit:hover {
  background: #13868c;
}

.edit-icon {
  font-size: 1rem;
}


.password-form {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px;
  margin-top: 12px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-group {
  margin-bottom: 14px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #0c1b2a;
  margin-bottom: 6px;
  font-size: 0.95rem;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d5dde6;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #19a2a9;
  box-shadow: 0 0 0 3px rgba(25, 162, 169, 0.1);
}

.password-actions {
  margin-top: 14px;
}

.btn-save {
  width: 100%;
  padding: 12px 20px;
  background: linear-gradient(135deg, #19a2a9, #13868c);
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s ease;
  font-size: 0.95rem;
}

.btn-save:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.footer-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
}

.btn-back {
  flex: 1;
  padding: 12px 20px;
  background: #f1f5f9;
  color: #0c1b2a;
  border: 1px solid #d5dde6;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-back:hover {
  background: #e6eef5;
}

.message {
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: 6px;
  font-weight: 600;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>
