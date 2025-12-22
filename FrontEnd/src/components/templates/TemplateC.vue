<script setup>
import { computed } from 'vue'
const props = defineProps({ data: { type: Object, required: true } })
const d = computed(() => props.data)

function formatDate(dateString) {
  if(!dateString) return;
  const date = new Date(dateString);
  // return isNaN(date) ? dateStr : date.toLocaleDateString('vi-VN')

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')


  return isNaN(date) ? dateStr : `${month}/${day}/${year}`

}

</script>

<template>
  <div class="page">
    <div class="card">
      <div class="left">
        <section class="hero">
          <div class="name">{{ d.header.name }}</div>
          <div class="title">{{ d.header.title }}</div>
          <p class="summary">{{ d.header.summary }}</p>
        </section>

        <section class="skills">
          <h3>SKILL</h3>
          <div class="skill-block">
            <div class="label">Back-end</div>
            <div class="chips">
              <span v-for="(s,i) in d.skills.backend" :key="'b'+i" class="chip" v-show="s.label || s.note">{{ s.label }} ({{ s.note }})</span>
            </div>
          </div>
          <div class="skill-block">
            <div class="label">Front-end</div>
            <div class="chips">
              <span v-for="(s,i) in d.skills.frontend" :key="'f'+i" class="chip" v-show="s.label || s.note">{{ s.label }} ({{ s.note }})</span>
            </div>
          </div>
          <div class="skill-block soft">
            <div class="label">Soft Skills</div>
            <ul>
              <li v-for="(s,i) in d.skills.soft" :key="'s'+i" v-show="s">{{ s }}</li>
            </ul>
          </div>
        </section>

        <section class="work">
          <h3>WORK EXPERIENCE</h3>
          <div class="job" v-for="(x,i) in d.experience" :key="i">
            <div class="row">
              <div class="dot" />
              <div class="meta">
                <div class="period">{{ x.start_date }} - {{ x.end_date }}</div>
                <div class="role">{{ x.role }}</div>
                <div class="company">{{ x.company }}</div>
              </div>
            </div>
            <ul class="bullets">
              <li v-for="(b,j) in x.bullets" :key="j">{{ b }}</li>
            </ul>
            <div v-if="x.project" class="project">
              <div class="proj-title">PROJECT: {{ x.project.name }} <span class="proj-period">{{ x.project.period_start }} - {{ x.project.period_end }}</span></div>
              <div class="proj-line"><strong>Project description:</strong> {{ x.project.description }}</div>
              <div class="proj-line"><strong>Responsibilities:</strong></div>
              <ul class="bullets">
                <li v-for="(r,k) in x.project.responsibilities" :key="k" v-show="r">{{ r }}</li>
              </ul>
              <div class="proj-line"><strong>Tech stack:</strong> {{ x.project.tech }}</div>
              <div class="proj-line"><strong>Team size:</strong> {{ x.project.teamSize }} members</div>
            </div>
          </div>
        </section>
      </div>

      <aside>
        <div class="avatar">
          <img v-if="d.photoUrl" :src="d.photoUrl" alt="avatar" />
          <div v-else class="ph" />
        </div>
        <div class="contact">
          <ul class="contact-list">
            <li>
              <span class="ic">
                <!-- Phone -->
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M6.6 10.8c1.8 2.9 3.7 4.8 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.2 1 .4 2 .7 3.1.9.5.1.8.5.8 1.1v3.3c0 .6-.4 1-1 1C9.6 21.3 2.7 14.4 2.7 3.5c0-.6.4-1 1-1h3.3c.5 0 .9.3 1.1.8.2 1.1.5 2.1.9 3.1.2.4.1.9-.2 1.2L6.6 10.8z"/>
                </svg>
              </span>{{ d.contact.phone }}
            </li>
            <li>
              <span class="ic">
                <!-- Email -->
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M2 6c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6zm2 0l8 5 8-5H4zm16 12V9l-8 5-8-5v9h16z"/>
                </svg>
              </span>{{ d.contact.email }}
            </li>
            <li>
              <span class="ic">
                <!-- Birthday -->
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M7 4h1a2 2 0 114 0h1a2 2 0 114 0h1v4H6V4h1zm13 6H4v10a2 2 0 002 2h12a2 2 0 002-2V10z"/>
                </svg>
              </span>{{formatDate( d.contact.birthday) }}
            </li>
            <li>
              <span class="ic">
                <!-- Location -->
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M12 2C7.6 2 4 5.6 4 10c0 6.1 7.1 11.4 7.4 11.6.3.2.8.2 1.1 0C12.9 21.4 20 16.1 20 10c0-4.4-3.6-8-8-8zm0 11.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"/>
                </svg>
              </span>{{ d.contact.location }}
            </li>
            <li>
              <span class="ic">
                <!-- LinkedIn -->
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M4 4h16v16H4V4zm4.8 12.8h2.5V11H8.8v5.8zM11.2 8.7c0-.7-.5-1.2-1.2-1.2-.7 0-1.2.5-1.2 1.2 0 .7.5 1.2 1.2 1.2.7 0 1.2-.5 1.2-1.2zm6 8.1h-2.5v-3.2c0-.8-.3-1.3-1-1.3-.6 0-1 .4-1 .1v4.5H10.3V11h2.3v.9c.3-.5.9-1 1.9-1 1.4 0 2.6.9 2.6 3.1v3.7z"/>
                </svg>
              </span>{{ d.contact.linkedin }}
            </li>
          </ul>
        </div>

        <div class="section">
          <div class="s-title">EDUCATION</div>
          <div class="edu">
            <div class="school">{{ d.education.school }}</div>
            <div class="degree">{{ d.education.degree }}</div>
            <div class="period">{{ d.education.start_date }} / {{ d.education.end_date }}</div>
            <div class="gpa">{{ d.education.gpa }}</div>
          </div>
        </div>

        <div class="section" v-if="d.certificates?.length">
          <div class="s-title">CERTIFICATE</div>
          <div class="cert" v-for="(c,i) in d.certificates" :key="i">
            <div class="cert-name">{{ c.name }}</div>
            <div class="cert-org">{{ c.issuer }}</div>
            <div class="period">{{ c.date }}</div>
            <div v-if="c.url" class="link">{{ c.url }}</div>
          </div>
        </div>

        <div class="section" v-if="d.languages">
          <div class="s-title">FOREIGN LANGUAGE</div>
          <div class="lang" v-for="(l,i) in d.languages" :key="i" v-show="l">{{ l }}</div>
        </div>

        
        <div class="section" v-if="Array.isArray(d.awards) && d.awards.length">
        <div class="s-title">AWARD</div>
        <div class="award" v-for="(a,i) in d.awards" :key="i">
          <div class="award-name">{{ a.name }}</div>
          <div class="award-org">{{ a.org }}</div>
          <div class="period">{{ a.year }}</div>
        </div>
      </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.page {
  background: #111;
  padding: 24px;
}
.card {
  max-width: 960px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  background: #f7f3f0;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 14px 36px rgba(0,0,0,0.28);
}
.left { padding: 18px 20px 24px; background: #f7f3f0; }
.hero {
  background: #6b4a34;
  color: #ffffff;
  padding: 16px 18px;
  border-radius: 14px;
  margin-bottom: 14px;
}
.hero .name { font-size: 22px; font-weight: 800; }
.hero .title { font-size: 12px; letter-spacing: 1.4px; margin-top: 4px; font-weight: 700; }
.hero .summary { margin-top: 10px; line-height: 1.6; color: #f1e6dc; }

.skills h3, .work h3 { font-size: 13px; letter-spacing: 0.6px; color: #2d2d2d; margin: 14px 0 10px; }
.skill-block { padding: 8px 0; border-bottom: 1px solid #d9cfc6; }
.skill-block:last-child { border-bottom: none; }
.label { font-weight: 800; margin-bottom: 6px; color: #2d2d2d; }
.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chip { background: #f0e9e2; border: 1px solid #d3c7be; border-radius: 999px; padding: 3px 10px; font-size: 12px; color: #2d2d2d; }
.soft ul { margin: 4px 0 0 18px; color: #3a2e2a; }
.soft li { margin: 4px 0; }

.work { margin-top: 10px; }
.job { padding: 12px 0; border-bottom: 1px solid #d9cfc6; }
.row { display: flex; gap: 10px; align-items: flex-start; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: #6b4a34; margin-top: 6px; }
.meta { display: grid; gap: 2px; }
.period { font-size: 12px; color: #5c4b42; font-weight: 700; }
.role { font-weight: 800; color: #2d2d2d; }
.company { font-weight: 700; color: #2d2d2d; }
.bullets { margin: 8px 0 8px 18px; padding: 0; color: #3a2e2a; line-height: 1.6; }
.project { background: #f1ebe5; border: 1px solid #d9cfc6; border-radius: 10px; padding: 10px 12px; margin-top: 8px; color: #2d2d2d; }
.proj-title { font-weight: 800; }
.proj-period { color: #5c4b42; font-size: 12px; font-weight: 700; margin-left: 6px; }
.proj-line { margin-top: 6px; line-height: 1.5; }

aside {
  background: #e9e5df;
  padding: 18px 18px 20px;
  display: grid;
  gap: 14px;
  align-content: start;
}
.avatar { display: flex; justify-content: center; }
.avatar img, .avatar .ph {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  background: #d3c7be;
}
.contact { display: grid; gap: 8px; }
.c-item { display: flex; align-items: center; gap: 8px; color: #3a2e2a; font-size: 13px; }
.ic { width: 18px; text-align: center; font-weight: 700; }

.section { border-top: 1px solid #cdbfb6; padding-top: 10px; }
.s-title { font-weight: 800; color: #2d2d2d; letter-spacing: 0.6px; margin-bottom: 6px; }
.edu .school, .cert-name, .award-name { font-weight: 800; color: #2d2d2d; }
.edu .degree, .cert-org, .award-org { color: #3a2e2a; font-weight: 600; }
.section .period, .gpa, .lang, .award { color: #4b3d36; }
.lang { margin: 2px 0; }
.award { display: grid; gap: 2px; }
.link { color: #6b4a34; font-size: 12px; }

.page-num { text-align: right; color: #c9c9c9; font-size: 11px; margin-top: 8px; }

.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.contact-list li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 13px;
  color: #3a2e2a;
}
.contact-list li .ic {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  color: #5c4b42;
}


@media print {
  .page { background: #0b0b0f; padding: 0; }
  .card { box-shadow: none; width: 190mm; min-height: 277mm; border-radius: 0; }
  .page-num { display: none; }
}
</style>
