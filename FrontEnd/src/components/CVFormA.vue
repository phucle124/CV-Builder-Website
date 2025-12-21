<script setup>
import { onMounted } from 'vue'

const props = defineProps({
  modelValue: { type: Object, required: true },
  cvId: { type: String, required: false }
})

const emit = defineEmits(['update:modelValue'])


const updateCV = (path, value) => {
	const updated = JSON.parse(JSON.stringify(props.modelValue))
	const keys = path.split('.')
	let obj = updated
  
	// Navigate to parent object
	for (let i = 0; i < keys.length - 1; i++) {
		const key = keys[i]
		// Handle array indices
		if (!isNaN(key)) {
			obj = obj[parseInt(key)]
		} else {
			obj = obj[key]
		}
	}
  
	// Set the value
	const lastKey = keys[keys.length - 1]
	if (!isNaN(lastKey)) {
		obj[parseInt(lastKey)] = value
	} else {
		obj[lastKey] = value
	}
  
	emit('update:modelValue', updated)
}

onMounted(async () => {
  if (!props.cvId) return;

  try {
    const res = await fetch(`http://localhost:8888/api/cvs/${props.cvId}`);
    if (res.ok) {
      const data = await res.json();
      // Map data to modelValue structure
      const mapped = {
			header: data.header || { name: '', title: '', summary: '' },
			photoUrl: data.photoUrl || '',
			contact: data.contact || { phone: '', email: '', birthday: '', location: '', linkedin: '' },
			skills: data.skills ? {
				backend: data.skills.filter(s => s.category==='backend').map(s => ({ label: s.name||'', note: s.note||'' })) || [{label:'',note:''},{label:'',note:''}],
				frontend: data.skills.filter(s => s.category==='frontend').map(s => ({ label: s.name||'', note: s.note||'' })) || [{label:'',note:''},{label:'',note:''}],
				soft: data.skills.filter(s => s.category==='soft').map(s => s.name||'') || ['', '']
			} : { backend:[{label:'',note:''},{label:'',note:''}], frontend:[{label:'',note:''},{label:'',note:''}], soft:['',''] },
			education: (data.education && data.education[0]) || { school:'', degree:'', start_date:'', end_date:'', gpa:'' },
			certificates: data.certificates?.length ? data.certificates : [{ name:'', issuer:'', date:'', url:'' }],
			experience: data.experience?.length ? data.experience : [
				{ role:'', company:'', start_date:'', end_date:'', bullets:['','',''], project:{ name:'', period_start:'', period_end:'', description:'', responsibilities:[''], tech:'', teamSize:'' } },
				{ role:'', company:'', start_date:'', end_date:'', bullets:['','',''] }
			],
			highlights: data.highlights?.length ? data.highlights : [{ name:'', period_start:'', period_end:'', bullets:['',''] }],
			languages: data.languages ? data.languages.map(l=>l.language||'') : ['', ''],
			awards: data.awards?.length ? data.awards : [{ name:'', org:'', year:'' }]
		};
      emit('update:modelValue', mapped);
    }
  } catch (err) {
    console.error('Không thể tải dữ liệu CV:', err);
  }
});

async function onFile(e) {
	const file = e.target.files?.[0]
	if (!file) return

	try {
		const reader = new FileReader()
		reader.onload = () => {
			updateCV('photoUrl', String(reader.result))
		}
		reader.readAsDataURL(file)
	} catch (err) {
		console.error('Không thể đọc ảnh:', err)
	}
}

async function saveCV() {
  try {
    const userId = localStorage.getItem('user_id')
    if (!userId) {
      alert('Vui lòng đăng nhập trước')
      return
    }
	alert('Lưu CV cho userId: ' + userId)

    const url = props.cvId
      ? `http://localhost:8888/api/cvs/${props.cvId}`   // PUT /cvs/:cv_id
      : `http://localhost:8888/api/cvs`       // POST /cvs

    const method = props.cvId ? 'PUT' : 'POST'

	const payload = props.cvId
	  ? props.modelValue
	  : { ...props.modelValue, user_id: userId }

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    // Guard against non-JSON responses
    const contentType = res.headers.get('content-type') || ''
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`HTTP ${res.status}: ${text}`)
    }
    if (!contentType.includes('application/json')) {
      const text = await res.text()
      throw new Error(`Server không trả JSON: ${text.slice(0, 120)}...`)
    }

    const data = await res.json()
    alert(data.message || 'Thành công')
  } catch (err) {
    console.error(err)
    alert('Không thể lưu CV: ' + err.message)
  }
}

function removePhoto() {
  updateCV('photoUrl', null)
}

</script>


<template>
	<form class="cv-form" @submit.prevent>
		<h2>Thông tin chung</h2>
		<div class="grid">
		<label>
			Họ tên
			<input :value="modelValue.header.name" @input="updateCV('header.name', $event.target.value)" placeholder="Tên" />
		</label>
		<label>
			Chức danh
			<input :value="modelValue.header.title" @input="updateCV('header.title', $event.target.value)" placeholder="Software Developer" />
		</label>
		</div>
		<label>
		Tóm tắt
		<textarea :value="modelValue.header.summary" @input="updateCV('header.summary', $event.target.value)" rows="4" />
		</label>

		<!-- Ảnh đại diện -->
		<h3>Ảnh đại diện</h3>
		<div class="grid">
		<label class="file">
			Tải ảnh
			<input type="file" accept="image/*" @change="onFile" />
		</label>
		<div class="preview-img" v-if="modelValue.photoUrl">
			<img :src="modelValue.photoUrl" alt="avatar" />
			<button type="button" @click="removePhoto">Xóa ảnh</button>
		</div>
		</div>


		<h2>Liên hệ</h2>
		<div class="grid">
			<label>Điện thoại<input :value="modelValue.contact.phone" @input="updateCV('contact.phone', $event.target.value)" /></label>
			<label>Email<input :value="modelValue.contact.email" @input="updateCV('contact.email', $event.target.value)" /></label>
			<label>Sinh nhật<input :value="modelValue.contact.birthday" @input="updateCV('contact.birthday', $event.target.value)" type="date" /></label>
			<label>Địa điểm<input :value="modelValue.contact.location" @input="updateCV('contact.location', $event.target.value)" /></label>
			<label>LinkedIn<input :value="modelValue.contact.linkedin" @input="updateCV('contact.linkedin', $event.target.value)" /></label>
		</div>

		<h2>Kỹ năng</h2>
		<div class="grid">
			<label>Backend <input :value="modelValue.skills.backend[0].label" @input="updateCV('skills.backend.0.label', $event.target.value)" /></label>
			<label>Backend ghi chú<input :value="modelValue.skills.backend[0].note" @input="updateCV('skills.backend.0.note', $event.target.value)" /></label>
			<label>Backend <input :value="modelValue.skills.backend[1].label" @input="updateCV('skills.backend.1.label', $event.target.value)" /></label>
			<label>Backend ghi chú<input :value="modelValue.skills.backend[1].note" @input="updateCV('skills.backend.1.note', $event.target.value)" /></label>

			<label>Frontend <input :value="modelValue.skills.frontend[0].label" @input="updateCV('skills.frontend.0.label', $event.target.value)" /></label>
			<label>Frontend ghi chú<input :value="modelValue.skills.frontend[0].note" @input="updateCV('skills.frontend.0.note', $event.target.value)" /></label>
			<label>Frontend <input :value="modelValue.skills.frontend[1].label" @input="updateCV('skills.frontend.1.label', $event.target.value)" /></label>
			<label>Frontend ghi chú<input :value="modelValue.skills.frontend[1].note" @input="updateCV('skills.frontend.1.note', $event.target.value)" /></label>
			
			<label>Soft 1<input :value="modelValue.skills.soft[0]" @input="updateCV('skills.soft.0', $event.target.value)" /></label>
			<label>Soft 2<input :value="modelValue.skills.soft[1]" @input="updateCV('skills.soft.1', $event.target.value)" /></label>
		</div>

		<h2>Học vấn</h2>
		<div class="grid">
			<label>Trường<input :value="modelValue.education.school" @input="updateCV('education.school', $event.target.value)" /></label>
			<label>Bằng cấp<input :value="modelValue.education.degree" @input="updateCV('education.degree', $event.target.value)" /></label>
			<label>Bắt đầu<input :value="modelValue.education.start_date" @input="updateCV('education.start_date', $event.target.value)" type="date" /></label>
			<label>Kết thúc<input :value="modelValue.education.end_date" @input="updateCV('education.end_date', $event.target.value)" type="date" /></label>
			<label>GPA<input :value="modelValue.education.gpa" @input="updateCV('education.gpa', $event.target.value)" /></label>
		</div>

		<h2>Chứng chỉ</h2>
		<div class="grid">
			<label>Tên<input :value="modelValue.certificates[0].name" @input="updateCV('certificates.0.name', $event.target.value)" /></label>
			<label>Tổ chức<input :value="modelValue.certificates[0].issuer" @input="updateCV('certificates.0.issuer', $event.target.value)" /></label>
			<label>Thời gian<input :value="modelValue.certificates[0].date" @input="updateCV('certificates.0.date', $event.target.value)" type="date" /></label>
		</div>

		<h2>Kinh nghiệm</h2>
		<div class="grid">
			<label>Role <input :value="modelValue.experience[0].role" @input="updateCV('experience.0.role', $event.target.value)" /></label>
			<label>Công ty <input :value="modelValue.experience[0].company" @input="updateCV('experience.0.company', $event.target.value)" /></label>
			<label>Bắt đầu <input :value="modelValue.experience[0].start_date" @input="updateCV('experience.0.start_date', $event.target.value)" type="date" /></label>
			<label>Kết thúc <input :value="modelValue.experience[0].end_date" @input="updateCV('experience.0.end_date', $event.target.value)" type="date" /></label>
		</div>
		<label>Kinh nghiệm 1:<textarea :value="modelValue.experience[0].bullets[0]" @input="updateCV('experience.0.bullets.0', $event.target.value)" rows="2" /></label>
		<label>Kinh nghiệm 2:<textarea :value="modelValue.experience[0].bullets[1]" @input="updateCV('experience.0.bullets.1', $event.target.value)" rows="2" /></label>
		<label>Kinh nghiệm 3:<textarea :value="modelValue.experience[0].bullets[2]" @input="updateCV('experience.0.bullets.2', $event.target.value)" rows="2" /></label>

		<h3>Dự án nổi bật</h3>
		<div class="grid">
			<label>Tên<input :value="modelValue.highlights[0].name" @input="updateCV('highlights.0.name', $event.target.value)" /></label>
			<label>Bắt đầu<input :value="modelValue.highlights[0].period_start" @input="updateCV('highlights.0.period_start', $event.target.value)" type="date" /></label>
			<label>Kết thúc<input :value="modelValue.highlights[0].period_end" @input="updateCV('highlights.0.period_end', $event.target.value)" type="date" /></label>
		</div>
		<label>Dự án 1:<textarea :value="modelValue.highlights[0].bullets[0]" @input="updateCV('highlights.0.bullets.0', $event.target.value)" rows="2" /></label>
		<label>Dự án 2:<textarea :value="modelValue.highlights[0].bullets[1]" @input="updateCV('highlights.0.bullets.1', $event.target.value)" rows="2" /></label>

		<!-- Nút Lưu -->
    <div style="margin-top:20px;" @click="saveCV">
      <button type="submit" class="save-btn">Lưu CV</button>
    </div>

	</form>
</template>

<style scoped>
.cv-form {
	display: grid;
	gap: 14px;
}
.grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 10px;
}
label {
	color: #111820;
	font-size: 14px;
	display: grid;
	gap: 6px;
}
input, textarea {
	background: #ffffff;
	border: 1px solid #d5dde6;
	color: #111820;
	border-radius: 10px;
	padding: 10px 12px;
	box-shadow: none;
}
.cv-form :is(input, textarea)::placeholder { color: #8a98a6; }
.file input {
	padding: 6px;
}
.preview-img img {
	width: 96px;
	height: 96px;
	object-fit: cover;
	border-radius: 16px;
	border: 4px solid #1da2a9;
	box-shadow: 0 8px 20px rgba(0,0,0,0.35);
}

.preview-img button {
    /* Style cơ bản cho nút */
    background: #e74c3c;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 4px 8px;
    cursor: pointer;
    font-size: 12px;
}

.save-btn {
  background: #1da2a9;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
}
.save-btn:hover {
  background: #13868c;
}

@media (max-width: 768px) {
	.grid { grid-template-columns: 1fr; }
}
</style>
