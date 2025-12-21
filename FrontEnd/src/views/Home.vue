<template>
  <div class="hero-shell">
    <section class="hero-card">
      <p class="eyebrow">CV Builder</p>
      <h1>Tạo CV chuyên nghiệp trong vài phút</h1>
      <p class="lead">Chuẩn bị hồ sơ nổi bật, chỉnh sửa linh hoạt, xuất PDF tức thì.</p>

      <div class="actions">
        <button
          class="cta"
          @click="goToCV">
          Tạo CV ngay
        </button>
        <router-link class="ghost" to="/introduce">Tìm hiểu thêm</router-link>
      </div>

      <ul class="pills">
        <li>3 mẫu CV có sẵn</li>
        <li>Chỉnh sửa realtime</li>
        <li>Xuất PDF nhanh</li>
      </ul>
    </section>
  </div>
</template>

<script>
import { isAuthenticated } from '@/utils/auth'

export default {
  name: 'Home',
  computed: {
    isLoggedIn() {
      return isAuthenticated()
    }
  },
  methods: {
    goToCV() {
      if (isAuthenticated()) {
        this.$router.push('/cv')
      } else {
        alert('Bạn cần đăng nhập hoặc đăng ký để sử dụng chức năng này.')
        this.$router.push('/login')
      }
    }
  }
}
</script>





<style scoped>
.hero-shell {
  position: relative;
  padding: 72px 32px;
  border-radius: 20px;
  background: radial-gradient(900px 600px at 10% 10%, rgba(25, 162, 169, 0.16), transparent),
    linear-gradient(120deg, #ffffff 0%, #f5f7fb 60%, #edf5f7 100%);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.hero-card {
  max-width: 760px;
  margin: 0 auto;
  text-align: left;
}

.eyebrow {
  display: inline-flex;
  padding: 6px 12px;
  border-radius: 999px;
  background: #e6f4f5;
  color: #0f5f63;
  font-weight: 700;
  letter-spacing: 0.4px;
  margin-bottom: 12px;
}

h1 {
  font-size: 2.6rem;
  line-height: 1.2;
  color: #0c1b2a;
  margin-bottom: 12px;
}

.lead {
  font-size: 1.1rem;
  color: #4c5a66;
  margin-bottom: 24px;
}

.actions {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.cta {
  padding: 12px 20px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #19a2a9 0%, #13868c 100%);
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(19, 134, 140, 0.25);
}

.cta[disabled] {
  opacity: 0.65;
  cursor: not-allowed;
  box-shadow: none;
}

.ghost {
  padding: 11px 18px;
  border-radius: 12px;
  border: 1px solid #c7d4da;
  color: #0c1b2a;
  font-weight: 600;
  background: #ffffff;
}

.pills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.pills li {
  padding: 8px 12px;
  border-radius: 12px;
  background: #f1f5f9;
  color: #28323b;
  font-weight: 600;
}

@media (max-width: 768px) {
  .hero-shell { padding: 56px 20px; }
  h1 { font-size: 2.1rem; }
  .actions { flex-direction: column; align-items: stretch; }
  .ghost { text-align: center; }
}
</style>