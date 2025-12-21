<script setup>
import { computed } from 'vue'
const props = defineProps({ data: { type: Object, required: true } })
const d = computed(() => props.data)
</script>

<template>
  <div class="page-bg">
    <div class="card">
      <header class="header">
        <h1 class="name">{{ d.header.name }}</h1>
        <div class="title">SOFTWARE DEVELOPER</div>
        <ul class="contact">
          <li>
            <span class="ic">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M6.6 10.8c1.8 2.9 3.7 4.8 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.2 1 .4 2 .7 3.1.9.5.1.8.5.8 1.1v3.3c0 .6-.4 1-1 1C9.6 21.3 2.7 14.4 2.7 3.5c0-.6.4-1 1-1h3.3c.5 0 .9.3 1.1.8.2 1.1.5 2.1.9 3.1.2.4.1.9-.2 1.2L6.6 10.8z"/></svg>
            </span>
            {{ d.contact.phone }}
          </li>
          <li>
            <span class="ic">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M2 6c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6zm2 0l8 5 8-5H4zm16 12V9l-8 5-8-5v9h16z"/></svg>
            </span>
            {{ d.contact.email }}
          </li>
          <li>
            <span class="ic">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M7 4h1a2 2 0 114 0h1a2 2 0 114 0h1v4H6V4h1zm13 6H4v10a2 2 0 002 2h12a2 2 0 002-2V10z"/></svg>
            </span>
            {{ d.contact.birthday }}
          </li>
          <li>
            <span class="ic">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C7.6 2 4 5.6 4 10c0 6.1 7.1 11.4 7.4 11.6.3.2.8.2 1.1 0C12.9 21.4 20 16.1 20 10c0-4.4-3.6-8-8-8zm0 11.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"/></svg>
            </span>
            {{ d.contact.location }}
          </li>
          <li>
            <span class="ic">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M4 4h16v16H4V4zm4.8 12.8h2.5V11H8.8v5.8zM11.2 8.7c0-.7-.5-1.2-1.2-1.2-.7 0-1.2.5-1.2 1.2 0 .7.5 1.2 1.2 1.2.7 0 1.2-.5 1.2-1.2zm6 8.1h-2.5v-3.2c0-.8-.3-1.3-1-1.3-.6 0-1 .4-1 .1v4.5H10.3V11h2.3v.9c.3-.5.9-1 1.9-1 1.4 0 2.6.9 2.6 3.1v3.7z"/></svg>
            </span>
            {{ d.contact.linkedin }}
          </li>
        </ul>
      </header>

      <section class="about">
        <h3>ABOUT ME</h3>
        <p>{{ d.header.summary }}</p>
      </section>

      <section class="work">
        <h3>TECHNOLOGY EXPERIENCE</h3>
        <div class="job" v-for="(x, i) in d.experience" :key="i">
          <div class="row">
            <div>
              <div class="role">{{ x.role }}</div>
              <div class="company">{{ x.company }}</div>
            </div>
            <div class="period">{{ x.start_date }} - {{ x.end_date }}</div>
          </div>
          <ul class="bullets">
            <li v-for="(b, j) in x.bullets" :key="j">{{ b }}</li>
          </ul>
        </div>
      </section>

      <section class="education">
        <h3>EDUCATION</h3>
        <div class="item">
          <div class="row">
            <div>
              <div class="school">{{ d.education.school }}</div>
              <div class="degree">{{ d.education.degree }}</div>
              <div class="gpa">{{ d.education.gpa }}</div>
            </div>
            <div class="period">{{ d.education.start_date }} - {{ d.education.end_date }}</div>
          </div>
        </div>
      </section>

      <section class="skills">
        <h3>SKILL</h3>
        <div class="skill-table">
          <div class="row-line">
            <div class="label">Back-end</div>
            <div class="chips">
              <span v-for="(s,i) in d.skills.backend" :key="'b'+i" class="chip">{{ s.label }} ({{ s.note }})</span>
            </div>
          </div>
          <div class="row-line">
            <div class="label">Front-end</div>
            <div class="chips">
              <span v-for="(s,i) in d.skills.frontend" :key="'f'+i" class="chip">{{ s.label }} ({{ s.note }})</span>
            </div>
          </div>
          <div class="row-line">
            <div class="label">Soft skills</div>
            <div class="chips">
              <span v-for="(s,i) in d.skills.soft" :key="'s'+i" class="chip soft">{{ s }}</span>
            </div>
          </div>
        </div>
      </section>

     
    </div>
  </div>
</template>

<style scoped>
.page-bg {
  background: radial-gradient(1400px 900px at -200px -200px, #111 0%, #0b0b0f 50%, #3b0f17 100%);
  padding: 24px;
}
.card {
  background: #ffffff;
  color: #111820;
  border-radius: 22px;
  padding: 28px 26px 26px;
  max-width: 900px;
  margin: 0 auto;
  box-shadow: 0 14px 36px rgba(238, 238, 238, 0.28);
}
.header { text-align: center; padding-bottom: 16px; border-bottom: 1px solid #d6dce2; }
.name { margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 0.2px; }
.title { color: #5a6670; font-size: 12px; letter-spacing: 2px; margin-top: 4px; font-weight: 600; }
.contact { display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; list-style: none; padding: 12px 0 0; margin: 0; color: #4b5560; font-size: 13px; }
.contact li { display: inline-flex; align-items: center; gap: 6px; }
.ic { color: #5a6670; display: inline-flex; align-items: center; justify-content: center; }

.about h3, .work h3, .education h3, .skills h3 { font-size: 13px; letter-spacing: .6px; color: #111820; border-top: 2px solid #111820; padding-top: 10px; margin-top: 18px; font-weight: 800; }
.about p { color: #323f49; line-height: 1.7; font-size: 14px; }

.job { padding: 14px 0; border-bottom: 1px solid #e2e7ed; }
.row { display: flex; justify-content: space-between; gap: 12px; align-items: baseline; }
.role { font-weight: 800; font-size: 14px; color: #111820; }
.company { color: #111820; font-weight: 700; font-size: 13px; margin-top: 2px; }
.period { color: #4f5b65; font-size: 12px; font-weight: 700; }
.bullets { margin: 8px 0 8px 18px; padding: 0; }
.bullets li { color: #2a3a44; line-height: 1.6; }

.education .item { padding: 10px 0; border-bottom: 1px solid #e2e7ed; }
.education .school { font-weight: 800; }
.education .degree { color: #111820; font-weight: 600; }
.education .gpa { color: #4b5560; }

.skills { padding-bottom: 4px; }
.skill-table { display: grid; gap: 10px; }
.row-line { display: grid; grid-template-columns: 140px 1fr; gap: 8px; align-items: center; }
.label { font-weight: 800; color: #111820; }
.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chip { background: #f0f2f5; border: 1px solid #d6dce2; border-radius: 999px; padding: 3px 10px; color: #111820; font-size: 12px; font-weight: 600; }
.chip.soft { background: #ffffff; border-style: dashed; }

.page { text-align: right; color: #6b7b85; font-size: 11px; margin-top: 18px; }

@media print {
  .page-bg { background: #0b0b0f; padding: 0; }
  .card { box-shadow: none; margin: 0 auto; width: 190mm; min-height: 277mm; border-radius: 0; }
}
</style>
