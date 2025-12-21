<template>
  <header class="topbar">
    <div class="title">CV Builder</div>
    <nav class="tabs">
      <button :class="['tab', active==='cv1' && 'on']" @click="switchCv('cv1')">CV 1</button>
      <button :class="['tab', active==='cv2' && 'on']" @click="switchCv('cv2')">CV 2</button>
      <button :class="['tab', active==='cv3' && 'on']" @click="switchCv('cv3')">CV 3</button>
    </nav>
  </header>
  <main class="layout">
    <section class="panel form">
      <component 
        :is="active==='cv1' ? CVForm : active==='cv2' ? CVFormB : CVFormC" 
        :modelValue="cv" 
        @update:modelValue="cv = $event"
        :cv-id="cvId" 
      />
    </section>
    <section class="panel preview">
      <component :is="active==='cv1' ? TemplateA : active==='cv2' ? TemplateB : TemplateC" :data="cv" />
      <div class="actions">
        <button type="button" class="print" @click="printDoc()">Export PDF</button>
      </div>
    </section>
  </main>
  <!-- <footer class="note">Page 1/2 — © itViec.com (demo)</footer> -->
</template>


<script setup>
import { reactive, ref, onMounted } from 'vue'
import CVForm from '@/components/CVFormA.vue'
import CVFormB from '@/components/CVFormB.vue'
import CVFormC from '@/components/CVFormC.vue'

import TemplateA from '@/components/templates/TemplateA.vue'
import TemplateB from '@/components/templates/TemplateB.vue'
import TemplateC from '@/components/templates/TemplateC.vue'

import { useRouter } from 'vue-router'
import { ensureAuth } from '@/utils/auth'
import { API_BASE_URL } from '@/config/api'
const router = useRouter()

// 1 CV DUY NHẤT dùng chung cho tất cả form/template
const cv = ref({
  header: {
    name: '',
    title: '',
    summary: '',
  },
  photoUrl: '',
  contact: {
    phone: '',
    email: '',
    birthday: '',
    location: '',
    linkedin: '',
  },
  skills: {
    backend: [
      { label: '', note: '' },
      { label: '', note: '' },
    ],
    frontend: [
      { label: '', note: '' },
      { label: '', note: '' },
    ],
    soft: ['', ''],
  },
  education: {
    school: '',
    degree: '',
    start_date: '',
    end_date: '',
    gpa: '',
  },
  certificates: [
    { name: '', issuer: '', date: '', url: '' },
  ],
  languages: ['', ''],
  awards: [
    { name: '', org: '', year: '' },
  ],
  experience: [
    {
      role: '',
      company: '',
      start_date: '',
      end_date: '',
      bullets: ['', '', ''],
      project: {
        name: '',
        period_start: '',
        period_end: '',
        description: '',
        responsibilities: [''],
        tech: '',
        teamSize: '',
      },
    },
    {
      role: '',
      company: '',
      start_date: '',
      end_date: '',
      bullets: ['', '', ''],
    },
  ],
  highlights: [{
    name: '',
    period_start: '',
    period_end: '',
    bullets: ['', ''],
  }],
})

const cvId = ref(null)

const query = new URLSearchParams(window.location.search)
const active = ref(query.get('cv') === 'cv2' ? 'cv2' : query.get('cv') === 'cv3' ? 'cv3' : 'cv1')

function switchCv(view) {
  active.value = view
  const url = new URL(window.location.href)
  url.searchParams.set('cv', view)
  window.history.replaceState({}, '', url)
}

function printDoc() {
  try {
    window.focus()
    window.print()
  } catch (e) {
    console.error('Print failed:', e)
  }
}

onMounted(() => {
  if (!ensureAuth()) {
    alert('Bạn cần đăng nhập để vào trang tạo CV.')
    router.replace('/login')
    return
  }
  loadExistingCV()
})

async function loadExistingCV() {
  const userId = localStorage.getItem('user_id')
  if (!userId) return

  try {
    const res = await fetch(`${API_BASE_URL}/api/cvs/user/${userId}`)
    const data = await res.json()
    if (!res.ok || !data.cv_id) return
    cvId.value = data.cv_id

    const detailRes = await fetch(`${API_BASE_URL}/api/cvs/${data.cv_id}`)
    if (!detailRes.ok) return
    const detail = await detailRes.json()
    cv.value = mapCvFromBackend(detail)
  } catch (e) {
    console.warn('Không thể tải CV có sẵn', e)
  }
}

function mapCvFromBackend(payload) {
  const skills = payload.skills || []
  const backendSkills = skills.filter(s => s.category === 'backend').map(s => ({ label: s.name || '', note: s.note || '' }))
  const frontendSkills = skills.filter(s => s.category === 'frontend').map(s => ({ label: s.name || '', note: s.note || '' }))
  const softSkills = skills.filter(s => s.category === 'soft').map(s => s.name || '')

  const edu = (payload.education && payload.education[0]) || {}

  const certs = (payload.certificates || []).map(c => ({ name: c.name || '', issuer: c.issuer || '', date: c.date || '' }))

  const exps = (payload.experience || []).map(exp => {
    const projRaw = Array.isArray(exp.project) ? exp.project[0] : exp.project
    return {
      role: exp.role || '',
      company: exp.company || '',
      start_date: exp.start_date || '',
      end_date: exp.end_date || '',
      bullets: (exp.bullets || []).map(b => b.description || ''),
      project: projRaw
        ? {
            name: projRaw.name || '',
            period_start: projRaw.period_start || '',
            period_end: projRaw.period_end || '',
            description: projRaw.description || '',
            responsibilities: (projRaw.responsibilities || []).map(r => r.description || ''),
            tech: projRaw.tech || '',
            teamSize: projRaw.team_size || '',
          }
        : undefined,
    }
  })

  const highs = (payload.highlights || []).map(h => ({
    name: h.name || '',
    period_start: h.period_start || '',
    period_end: h.period_end || '',
    bullets: (h.bullets || []).map(b => b.description || ''),
  }))

  return {
    header: {
      name: payload.header?.name || '',
      title: payload.header?.title || '',
      summary: payload.header?.summary || '',
    },
    photoUrl: payload.photoUrl || '',
    contact: {
      phone: payload.contact?.phone || '',
      email: payload.contact?.email || '',
      birthday: payload.contact?.birthday || '',
      location: payload.contact?.location || '',
      linkedin: payload.contact?.linkedin || '',
    },
    skills: {
      backend: backendSkills.length ? backendSkills : [{ label: '', note: '' }, { label: '', note: '' }],
      frontend: frontendSkills.length ? frontendSkills : [{ label: '', note: '' }, { label: '', note: '' }],
      soft: softSkills.length ? softSkills : ['', ''],
    },
    education: {
      school: edu.school || '',
      degree: edu.degree || '',
      start_date: edu.start_date || '',
      end_date: edu.end_date || '',
      gpa: edu.gpa || '',
    },
    certificates: certs.length ? certs : [{ name: '', issuer: '', date: '', url: '' }],
    experience: exps.length ? exps : [{
      role: '', company: '', start_date: '', end_date: '', bullets: ['', '', ''], project: {
        name: '', period_start: '', period_end: '', description: '', responsibilities: [''], tech: '', teamSize: '',
      }
    }, { role: '', company: '', start_date: '', end_date: '', bullets: ['', '', ''] }],
    highlights: highs.length ? highs : [{ name: '', period_start: '', period_end: '', bullets: ['', ''] }],
    languages: (payload.languages || []).map(l => l.language || ''),
    awards: (payload.awards || []).map(a => ({ name: a.name || '', org: a.organization || '', year: a.year || '' })),
  }
}
</script>


<style scoped>

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: #f7f9fc;
  border-bottom: 1px solid #dde3ea;
}
.topbar .title { color: #111820; font-weight: 700; letter-spacing: 0.3px; }
.layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 16px;
}
.tabs { display: inline-flex; gap: 8px; }
.tab { background: #ffffff; border: 1px solid #d5dde6; color: #111820; padding: 6px 12px; border-radius: 10px; cursor: pointer; font-weight: 600; }
.tab.on { background: #19a2a9; border-color: #19a2a9; color: #ffffff; font-weight: 700; }
.panel {
  background: #ffffff;
  border: 1px solid #dde3ea;
  border-radius: 12px;
  padding: 16px;
}
.preview { background: #f8fafc; }
.actions { display: flex; justify-content: flex-end; margin-top: 12px; }
.print { background: #19a2a9; color: #071317; border: none; padding: 8px 12px; border-radius: 8px; font-weight: 700; cursor: pointer; }
.print:hover { background: #13868c; }
.note {
  text-align: right;
  color: #8a8f9c;
  font-size: 12px;
  padding: 8px 16px 16px;
}
@media (max-width: 1024px) {
  .layout { grid-template-columns: 1fr; }
}
@media print {
  :host, html, body { background: #fff; }
  body { margin: 0; }
  .topbar { display: none !important; }
  .layout { display: block; padding: 0; }
  .panel.form, .actions, .note { display: none !important; }
  .panel.preview { border: none; padding: 0; }
  .preview > * { break-inside: avoid; }
}
</style>