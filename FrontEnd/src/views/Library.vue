<template>
  <div class="library-container">
    <div class="library-header">
      <h1>Thư viện CV</h1>
      <button class="btn-new-cv" @click="goToCreateCV">+ Tạo CV mới</button>
    </div>

    <div v-if="cvs.length === 0" class="empty-state">
      <p>Bạn chưa tạo CV nào</p>
      <button class="btn-start" @click="goToCreateCV">Bắt đầu tạo CV</button>
    </div>

    <div v-else class="cv-grid">
      <div v-for="(cv, index) in cvs" :key="index" class="cv-card">
        <div class="cv-header">
          <h3>{{ cv.name }}</h3>
          <span class="cv-date">{{ cv.date }}</span>
        </div>
        <div class="cv-preview">
          <p>{{ cv.description }}</p>
        </div>
        <div class="cv-actions">
          <button class="btn-edit" @click="editCV(index)">Chỉnh sửa</button>
          <button class="btn-delete" @click="deleteCV(index)">Xóa</button>
        </div>
      </div>
    </div>

    <button class="btn-back" @click="goBack">Quay lại</button>
  </div>
</template>

<script>
export default {
  name: 'Library',
  data() {
    return {
      cvs: [
        // Demo data - trong thực tế sẽ fetch từ backend
        // {
        //   name: 'CV Kỹ sư phần mềm',
        //   description: 'CV ứng tuyển vị trí kỹ sư phần mềm...',
        //   date: '14/12/2025'
        // }
      ]
    }
  },
  mounted() {
    this.loadCVs()
  },
  methods: {
    loadCVs() {
      // TODO: Fetch danh sách CV từ backend
      // const userEmail = localStorage.getItem('userEmail')
      // const response = await fetch(`http://localhost:8888/api/cvs/${userEmail}`)
      // this.cvs = await response.json()
    },
    editCV(index) {
      alert('Chỉnh sửa CV #' + (index + 1))
      // TODO: Navigate tới trang chỉnh sửa CV
    },
    deleteCV(index) {
      if (confirm('Bạn chắc chắn muốn xóa CV này?')) {
        this.cvs.splice(index, 1)
        // TODO: Gửi request xóa CV đến backend
      }
    },
    goToCreateCV() {
      this.$router.push('/cv')
    },
    goBack() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.library-container {
  padding: 40px 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.library-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

.library-header h1 {
  color: #0c1b2a;
  font-size: 1.8rem;
  margin: 0;
}

.btn-new-cv {
  padding: 12px 20px;
  background: linear-gradient(135deg, #19a2a9, #13868c);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}

.btn-new-cv:hover {
  opacity: 0.9;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: #f7f9fc;
  border-radius: 12px;
  border: 1px solid #dde3ea;
}

.empty-state p {
  color: #6b7b85;
  font-size: 1.1rem;
  margin-bottom: 16px;
}

.btn-start {
  padding: 12px 24px;
  background: linear-gradient(135deg, #19a2a9, #13868c);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  font-size: 1rem;
}

.btn-start:hover {
  opacity: 0.9;
}

.cv-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.cv-card {
  background: #ffffff;
  border: 1px solid #dde3ea;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 6px 14px rgba(16, 31, 44, 0.08);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.cv-card:hover {
  box-shadow: 0 10px 26px rgba(16, 31, 44, 0.12);
  transform: translateY(-2px);
}

.cv-header {
  margin-bottom: 12px;
}

.cv-header h3 {
  color: #0c1b2a;
  margin: 0 0 8px 0;
  font-size: 1.1rem;
}

.cv-date {
  color: #6b7b85;
  font-size: 0.9rem;
}

.cv-preview {
  margin-bottom: 16px;
  padding: 12px;
  background: #f7f9fc;
  border-radius: 8px;
  min-height: 60px;
}

.cv-preview p {
  color: #4c5a66;
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.cv-actions {
  display: flex;
  gap: 10px;
}

.btn-edit,
.btn-delete {
  flex: 1;
  padding: 10px 12px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.95rem;
}

.btn-edit {
  background: #e6f4f5;
  color: #0f5f63;
}

.btn-edit:hover {
  background: #d4ecef;
}

.btn-delete {
  background: #ffe8e8;
  color: #c84e4e;
}

.btn-delete:hover {
  background: #ffd4d4;
}

.btn-back {
  padding: 12px 24px;
  background: #f1f5f9;
  color: #0c1b2a;
  border: 1px solid #d5dde6;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: block;
  margin: 0 auto;
}

.btn-back:hover {
  background: #e6eef5;
}
</style>
