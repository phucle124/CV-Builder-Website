<script setup>
import { computed } from 'vue'
const props = defineProps({ data: { type: Object, required: true } })
const d = computed(() => props.data)
</script>

<template>
	<div class="cv">
		<aside class="sidebar">
			<div class="avatar">
				<img v-if="d.photoUrl" :src="d.photoUrl" alt="avatar" />
				<div v-else class="placeholder" />
			</div>
			<section class="contact">
				<ul class="contact-list">
					<li>
						<span class="ic">
							<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M6.6 10.8c1.8 2.9 3.7 4.8 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.2 1 .4 2 .7 3.1.9.5.1.8.5.8 1.1v3.3c0 .6-.4 1-1 1C9.6 21.3 2.7 14.4 2.7 3.5c0-.6.4-1 1-1h3.3c.5 0 .9.3 1.1.8.2 1.1.5 2.1.9 3.1.2.4.1.9-.2 1.2L6.6 10.8z"/></svg>
						</span>{{ d.contact.phone }}
					</li>
					<li>
						<span class="ic">
							<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M2 6c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6zm2 0l8 5 8-5H4zm16 12V9l-8 5-8-5v9h16z"/></svg>
						</span>{{ d.contact.email }}
					</li>
					<li>
						<span class="ic">
							<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M7 4h1a2 2 0 114 0h1a2 2 0 114 0h1v4H6V4h1zm13 6H4v10a2 2 0 002 2h12a2 2 0 002-2V10z"/></svg>
						</span>{{ d.contact.birthday }}
					</li>
					<li>
						<span class="ic">
							<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C7.6 2 4 5.6 4 10c0 6.1 7.1 11.4 7.4 11.6.3.2.8.2 1.1 0C12.9 21.4 20 16.1 20 10c0-4.4-3.6-8-8-8zm0 11.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"/></svg>
						</span>{{ d.contact.location }}
					</li>
					<li>
						<span class="ic">
							<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M4 4h16v16H4V4zm4.8 12.8h2.5V11H8.8v5.8zM11.2 8.7c0-.7-.5-1.2-1.2-1.2-.7 0-1.2.5-1.2 1.2 0 .7.5 1.2 1.2 1.2.7 0 1.2-.5 1.2-1.2zm6 8.1h-2.5v-3.2c0-.8-.3-1.3-1-1.3-.6 0-1 .4-1 .1v4.5H10.3V11h2.3v.9c.3-.5.9-1 1.9-1 1.4 0 2.6.9 2.6 3.1v3.7z"/></svg>
						</span>{{ d.contact.linkedin }}
					</li>
				</ul>
			</section>
			<section class="skills">
				<h4>SKILL</h4>
				<div class="group">
					<div class="title">Back-end</div>
					<ul class="badges">
						<li v-for="(s,i) in d.skills.backend" :key="'b'+i"><span class="pill">{{ s.label }}</span> <span class="note">{{ s.note }}</span></li>
					</ul>
				</div>
				<div class="group">
					<div class="title">Front-end</div>
					<ul class="badges">
						<li v-for="(s,i) in d.skills.frontend" :key="'f'+i"><span class="pill">{{ s.label }}</span> <span class="note">{{ s.note }}</span></li>
					</ul>
				</div>
				<div class="group">
					<div class="title">Soft Skills</div>
					<ul class="badges">
						<li v-for="(s,i) in d.skills.soft" :key="'s'+i"><span class="pill">{{ s }}</span></li>
					</ul>
				</div>
			</section>
			<section class="education">
				<h4>EDUCATION</h4>
				<div class="item">
					<div class="school">{{ d.education.school }}</div>
					<div class="degree">{{ d.education.degree }}</div>
					<div class="period">{{ d.education.start_date }} - {{ d.education.end_date }}</div>
					<div class="gpa">{{ d.education.gpa }}</div>
				</div>
			</section>
			<section class="cert">
				<h4>CERTIFICATE</h4>
				<div class="item" v-for="(c, i) in d.certificates" :key="i">
					<div class="name">{{ c.name }}</div>
					<div class="issuer">{{ c.issuer }}</div>
					<div class="period">{{ c.date }}</div>
				</div>
			</section>
		</aside>

		<section class="content">
		<header class="head">
			<h1 class="name">{{ props.data.header.name }}</h1>
			<div class="title">{{ props.data.header.title }}</div>
		</header>
		<p class="summary">{{ props.data.header.summary }}</p>


			<section class="work">
        <h3>WORK EXPERIENCE</h3>
        <div class="job" v-for="(x, i) in props.data.experience" :key="i">
          <div class="row">
            <div class="role">{{ x.role }}</div>
            <div class="period">{{ x.start_date }} - {{ x.end_date }}</div>
          </div>
          <div class="company">
            {{ x.company }}
            <span v-if="x.project?.teamSize" class="sub-badge">Team size: {{ x.project.teamSize }}</span>
          </div>
          <ul class="bullets">
            <li v-for="(b, j) in x.bullets" :key="j">{{ b }}</li>
          </ul>
          <div v-if="x.project" class="project">
            <div class="proj-name">PROJECT: {{ x.project.name }} <span class="period">{{ x.project.period_start }} - {{ x.project.period_end }}</span></div>
            <div class="desc">Project description: {{ x.project.description }}</div>
            <div class="resp">Responsibilities:</div>
            <ul class="bullets">
              <li v-for="(r,k) in x.project.responsibilities" :key="k">{{ r }}</li>
            </ul>
            <div class="tech">Tech stack: {{ x.project.tech }}</div>
            <div class="team">Team size: {{ x.project.teamSize }} members</div>
          </div>
        </div>
      </section>


			<section class="highlight">
        <h3>HIGHLIGHT PROJECT</h3>
        <div v-for="(h,i) in props.data.highlights" :key="i" class="row">
          <div class="proj-name">{{ h.name }}</div>
          <div class="period">{{ h.period_start }} - {{ h.period_end }}</div>
          <ul class="bullets">
            <li v-for="(b,j) in h.bullets" :key="j">{{ b }}</li>
          </ul>
        </div>
      </section>

		</section>
	</div>
</template>

<style scoped>
.cv {
	display: grid;
	grid-template-columns: 320px 1fr;
	background: #0a0b0f;
	color: #e6e8ee;
	border-radius: 20px;
	overflow: hidden;
	box-shadow: 0 10px 30px rgba(0,0,0,0.25);
}
.sidebar {
	background: #184a6b; /* solid blue column */
	padding: 22px 18px;
	color: #eaf2f6;
	border-right: 0;
}

/* brand removed */
.avatar { display: flex; justify-content: center; margin: 10px 0 18px; }
.avatar img, .avatar .placeholder {
	width: 120px; height: 120px; border-radius: 18px;
	object-fit: cover; background: #17435f; border: 6px solid #0e334b;
	box-shadow: 0 6px 16px rgba(0,0,0,0.35);
}
.avatar img, .avatar .placeholder { border-radius: 18px; }
.contact-list { list-style: none; padding: 0; margin: 0; }
.contact li { color: #c7d3da; font-size: 13px; padding: 8px 0; display: flex; align-items: center; gap: 8px; }
.contact li + li { border-top: 1px solid #15323a; }
.contact { border-top: 1px solid #15323a; border-bottom: 1px solid #15323a; padding: 6px 0; }
.ic { display: inline-flex; width: 18px; height: 18px; align-items: center; justify-content: center; color: #b9f2f6; }
.skills { margin-top: 18px; }
.skills h4, .education h4, .cert h4 { color: #bfe8f1; letter-spacing: 1px; font-size: 12px; margin: 12px 0; }
.group { margin-bottom: 12px; }
.group .title { color: #eaf2f6; font-weight: 700; font-size: 13px; margin-bottom: 8px; }
.group ul { list-style: none; padding: 0; margin: 0; }
.badges li { display: flex; align-items: center; gap: 8px; margin: 6px 0; }
.pill { display: inline-block; background: #0f3b58; color: #e9f6f7; border: 1px solid #2a6484; padding: 4px 10px; border-radius: 999px; font-size: 12px; }
.note { color: #c7dae2; font-size: 12px; }
.education .item { background: #0f3b58; border: 1px solid #2a6484; border-radius: 12px; padding: 10px; }
.education .item .school { color: #eaf2f4; font-weight: 800; }
.education .degree { color: #c7d3da; font-size: 13px; }
.education .period, .education .gpa { color: #9fb3bb; font-size: 12px; }
.cert .item .name { color: #eaf2f4; font-weight: 700; }
.cert .issuer, .cert .period { color: #c7dae2; font-size: 12px; }

.content { background: #ffffff; color: #0f1f27; padding: 32px; }
.head .name { font-size: 30px; margin: 0; color: #0e1820; font-weight: 900; }
.head .title { font-size: 12px; letter-spacing: 2px; color: #6b7b85; margin-top: 6px; }
.summary { color: #32424c; line-height: 1.7; font-size: 14px; border-top: 1px solid #e7edf1; margin-top: 16px; padding-top: 16px; }

.work h3, .highlight h3 { font-size: 14px; letter-spacing: 1px; color: #19a2a9; margin-top: 20px; border-top: 1px solid #e7edf1; padding-top: 14px; }
.job { margin-top: 14px; }
.row { display: flex; justify-content: space-between; align-items: baseline; }
.role { font-weight: 800; color: #17232a; }
.company { color: #19a2a9; font-weight: 800; font-size: 13px; margin-bottom: 6px; position: relative; display: flex; align-items: center; gap: 8px; }
.sub-badge { background: #eaf7f8; color: #13868c; border: 1px solid #cfe8ea; font-size: 11px; padding: 2px 6px; border-radius: 999px; }
.sub-badge.alt { background: #e1eef7; color: #1c6fb8; border-color: #c9dff1; }
.period { color: #6b7b85; font-size: 12px; }
.bullets { margin: 8px 0 8px 18px; }
.bullets li { margin: 4px 0; color: #2a3a44; }
.project { background: #f3f7f9; border: 1px solid #e1ebf0; border-radius: 10px; padding: 12px 14px; }
.project .desc { margin-top: 6px; }
.project .resp { margin-top: 6px; font-weight: 700; }
.project .tech, .project .team { margin-top: 6px; }
.proj-name { font-weight: 800; color: #18242b; }
.desc, .resp, .tech, .team { color: #2a3a44; font-size: 13px; }

.highlight .proj-name { font-weight: 800; color: #18242b; }
.page-num { text-align: right; color: #6b7b85; font-size: 11px; padding-top: 8px; }

@media print {
	/* A4 page size: 210mm x 297mm with safe margins */
	:host { display: block; }
	.cv {
		box-shadow: none; border-radius: 0;
		width: 190mm; /* content width */
		min-height: 277mm; /* content height */
		margin: 10mm auto; /* margins to fit A4 */
	}
	.page-num { display: none; }
}
</style>
