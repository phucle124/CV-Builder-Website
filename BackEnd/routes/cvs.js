const express = require('express');
const router = express.Router();
const db = require('../db');

// Lấy CV theo user
router.get('/user/:userId', (req, res) => {
  db.query('SELECT * FROM cvs WHERE user_id = ?', [req.params.userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0] || {});
  });
});

// Lấy CV theo cv_id
router.get('/:cv_id', async (req, res) => {
  const { cv_id } = req.params
  try {
    // Lấy CV chính
    const [rows] = await db.promise().query('SELECT * FROM cvs WHERE cv_id = ?', [cv_id])
    const cv = rows[0]
    if (!cv) return res.status(404).json({ success: false, message: 'Không tìm thấy CV' })

    // Lấy header và contact (1 record)
    const [headerRows] = await db.promise().query('SELECT * FROM headers WHERE cv_id = ?', [cv.cv_id])
    const header = headerRows[0]

    const [contactRows] = await db.promise().query('SELECT * FROM contacts WHERE cv_id = ?', [cv.cv_id])
    const contact = contactRows[0]

    // Lấy các bảng nhiều record
    const [skills] = await db.promise().query('SELECT * FROM skills WHERE cv_id = ?', [cv.cv_id])
    const [education] = await db.promise().query('SELECT * FROM education WHERE cv_id = ?', [cv.cv_id])
    const [certificates] = await db.promise().query('SELECT * FROM certificates WHERE cv_id = ?', [cv.cv_id])
    const [experience] = await db.promise().query('SELECT * FROM experience WHERE cv_id = ?', [cv.cv_id])
    const [highlights] = await db.promise().query('SELECT * FROM highlights WHERE cv_id = ?', [cv.cv_id])
    const [languages] = await db.promise().query('SELECT * FROM languages WHERE cv_id = ?', [cv.cv_id])
    const [awards] = await db.promise().query('SELECT * FROM awards WHERE cv_id = ?', [cv.cv_id])

    // Ghép bullets và projects cho experience
    for (let exp of experience) {
      const [bullets] = await db.promise().query('SELECT description FROM exp_bullets WHERE exp_id = ?', [exp.exp_id])
      exp.bullets = bullets

      const [projects] = await db.promise().query('SELECT * FROM projects WHERE exp_id = ?', [exp.exp_id])
      exp.project = projects
      if (exp.project.length > 0) {
        const [resp] = await db.promise().query(
          'SELECT description FROM project_responsibilities WHERE project_id = ?',
          [exp.project[0].project_id]
        )
        exp.project[0].responsibilities = resp
      }
    }

    // Ghép bullets cho highlights
    for (let hl of highlights) {
      const [bullets] = await db.promise().query('SELECT description FROM highlight_bullets WHERE highlight_id = ?', [hl.highlight_id])
      hl.bullets = bullets
    }

    // Trả về JSON đầy đủ
    res.json({
      cv_id: cv.cv_id,
      user_id: cv.user_id,
      photoUrl: cv.photo_url,
      header,
      contact,
      skills,
      education,
      certificates,
      experience,
      highlights,
      languages,
      awards,
      created_at: cv.created_at
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' })
  }
})

// GET /api/cvs/:id
router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM cvs WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Lỗi MySQL:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy CV' });
    }
    res.json(results[0]);
  });
});

// GET /api/cvs/user/:userId
router.get('/user/:userId', (req, res) => {
  const userId = req.params.userId;
  db.query('SELECT * FROM cvs WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Lỗi MySQL:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy CV cho user này' });
    }
    res.json(results[0]); // hoặc res.json(results) nếu muốn trả nhiều CV
  });
});

// PUT /api/cvs/:cv_id
router.put('/:cv_id', async (req, res) => {
  const cv_id = req.params.cv_id
  const { photoUrl, header, contact, skills, education, certificates, experience, highlights, languages, awards } = req.body

  try {
    // Update photo_url
    await db.promise().query(
      'UPDATE cvs SET photo_url = ? WHERE cv_id = ?',
      [photoUrl, cv_id]
    )

    // Update header
    await db.promise().query(
      'UPDATE headers SET name = ?, title = ?, summary = ? WHERE cv_id = ?',
      [header.name, header.title, header.summary, cv_id]
    )

    // Update contact
    await db.promise().query(
      'UPDATE contacts SET phone = ?, email = ?, birthday = ?, location = ?, linkedin = ? WHERE cv_id = ?',
      [contact.phone, contact.email, contact.birthday, contact.location, contact.linkedin, cv_id]
    )

    // Update education
    await db.promise().query(
      'UPDATE education SET school = ?, degree = ?, start_date = ?, end_date = ?, gpa = ? WHERE cv_id = ?',
      [education.school, education.degree, education.start_date, education.end_date, education.gpa, cv_id]
    )

    // Skills
    await db.promise().query('DELETE FROM skills WHERE cv_id = ?', [cv_id])
    for (const cat in skills) {
      for (const s of skills[cat]) {
        if (cat === 'soft') {
          await db.promise().query(
            'INSERT INTO skills (cv_id, category, name) VALUES (?, ?, ?)',
            [cv_id, cat, s]
          )
        } else {
          await db.promise().query(
            'INSERT INTO skills (cv_id, category, name, note) VALUES (?, ?, ?, ?)',
            [cv_id, cat, s.label, s.note]
          )
        }
      }
    }

    // Certificates
    await db.promise().query('DELETE FROM certificates WHERE cv_id = ?', [cv_id])
    for (const c of certificates) {
      await db.promise().query(
        'INSERT INTO certificates (cv_id, name, issuer, date) VALUES (?, ?, ?, ?)',
        [cv_id, c.name, c.issuer, c.date]
      )
    }

    // Experience: xóa bullets trước
   
    await db.promise().query(
      'DELETE FROM exp_bullets WHERE exp_id IN (SELECT exp_id FROM experience WHERE cv_id = ?)',
      [cv_id]
    );
    await db.promise().query(
      'DELETE FROM project_responsibilities WHERE project_id IN (SELECT project_id FROM projects WHERE cv_id = ?)',
      [cv_id]
    );
    await db.promise().query('DELETE FROM projects WHERE cv_id = ?', [cv_id]);
    await db.promise().query('DELETE FROM experience WHERE cv_id = ?', [cv_id]);

    for (const exp of experience) {
      const [expResult] = await db.promise().query(
        'INSERT INTO experience (cv_id, role, company, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
        [cv_id, exp.role, exp.company, exp.start_date, exp.end_date]
      );
      const exp_id = expResult.insertId;

      for (const b of exp.bullets || []) {
        await db.promise().query(
          'INSERT INTO exp_bullets (exp_id, description) VALUES (?, ?)',
          [exp_id, b]
        );
      }

      if (exp.project) {
        const [projResult] = await db.promise().query(
          'INSERT INTO projects (cv_id, exp_id, name, period_start, period_end, description, tech, team_size) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [cv_id, exp_id, exp.project.name, exp.project.period_start, exp.project.period_end, exp.project.description, exp.project.tech, exp.project.teamSize]
        );
        const project_id = projResult.insertId;

        for (const r of exp.project.responsibilities || []) {
          await db.promise().query(
            'INSERT INTO project_responsibilities (project_id, description) VALUES (?, ?)',
            [project_id, r]
          );
        }
      }
    }

    // Highlights: xóa bullets trước
    await db.promise().query(
      'DELETE FROM highlight_bullets WHERE highlight_id IN (SELECT highlight_id FROM highlights WHERE cv_id = ?)',
      [cv_id]
    )
    await db.promise().query('DELETE FROM highlights WHERE cv_id = ?', [cv_id])

    for (const hl of highlights) {
      const [hlResult] = await db.promise().query(
        'INSERT INTO highlights (cv_id, name, period_start, period_end) VALUES (?, ?, ?, ?)',
        [cv_id, hl.name, hl.period_start, hl.period_end]
      )
      const highlight_id = hlResult.insertId
      for (const b of hl.bullets || []) {
        await db.promise().query(
          'INSERT INTO highlight_bullets (highlight_id, description) VALUES (?, ?)',
          [highlight_id, b]
        )
      }
    }

    // Languages
    await db.promise().query('DELETE FROM languages WHERE cv_id = ?', [cv_id])
    for (const l of languages) {
      await db.promise().query(
        'INSERT INTO languages (cv_id, language, proficiency) VALUES (?, ?, ?)',
        [cv_id, l.language, l.proficiency]
      )
    }

    // Awards
    await db.promise().query('DELETE FROM awards WHERE cv_id = ?', [cv_id])
    for (const a of awards) {
      await db.promise().query(
        'INSERT INTO awards (cv_id, name, organization, year) VALUES (?, ?, ?, ?)',
        [cv_id, a.name, a.organization, a.year]
      )
    }

    res.json({ message: 'Updated successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// Tạo CV mới (hoặc báo đã tồn tại)
router.post('/', async (req, res) => {
  console.log('POST received:', req.body)
  const { user_id, photoUrl, header = {}, contact = {}, skills = {}, education = {}, certificates = [], experience = [], highlights = [], languages = [], awards = [] } = req.body

  try {
    // Kiểm tra đã có CV chưa
    const [rows] = await db.promise().query('SELECT * FROM cvs WHERE user_id = ?', [user_id])
    if (rows.length > 0) {
      return res.status(400).json({ success: false, message: 'CV đã tồn tại, hãy dùng PUT để cập nhật' })
    }

    // Tạo CV mới
    const [result] = await db.promise().query('INSERT INTO cvs (user_id, photo_url, title) VALUES (?, ?, ?)', [user_id, photoUrl, header.title || 'My CV'])
    const cv_id = result.insertId

    // Insert header và contact
    await db.promise().query('INSERT INTO headers (cv_id, name, title, summary) VALUES (?, ?, ?, ?)', [cv_id, header.name || '', header.title || '', header.summary || ''])
    await db.promise().query('INSERT INTO contacts (cv_id, phone, email, birthday, location, linkedin) VALUES (?, ?, ?, ?, ?, ?)', [cv_id, contact.phone || '', contact.email || '', contact.birthday || null, contact.location || '', contact.linkedin || ''])

    // Insert skills
    for (const s of skills.backend || []) {
      await db.promise().query('INSERT INTO skills (cv_id, category, name, note) VALUES (?, ?, ?, ?)', [cv_id, 'backend', s.label, s.note])
    }
    for (const s of skills.frontend || []) {
      await db.promise().query('INSERT INTO skills (cv_id, category, name, note) VALUES (?, ?, ?, ?)', [cv_id, 'frontend', s.label, s.note])
    }
    for (const s of skills.soft || []) {
      await db.promise().query('INSERT INTO skills (cv_id, category, name) VALUES (?, ?, ?)', [cv_id, 'soft', s])
    }

    // Insert education
    await db.promise().query(
      'INSERT INTO education (cv_id, school, degree, start_date, end_date, gpa) VALUES (?, ?, ?, ?, ?, ?)',
      [cv_id, education.school || '', education.degree || '', education.start_date || null, education.end_date || null, education.gpa || '']
    )

    // Insert certificates
    for (const c of certificates) {
      await db.promise().query('INSERT INTO certificates (cv_id, name, issuer, date) VALUES (?, ?, ?, ?)', [cv_id, c.name, c.issuer, c.date || null])
    }

    // Insert experience + bullets + project
    for (const exp of experience) {
      const [expResult] = await db.promise().query(
        'INSERT INTO experience (cv_id, role, company, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
        [cv_id, exp.role, exp.company, exp.start_date || null, exp.end_date || null]
      )
      const exp_id = expResult.insertId

      for (const b of exp.bullets || []) {
        await db.promise().query('INSERT INTO exp_bullets (exp_id, description) VALUES (?, ?)', [exp_id, b])
      }

      if (exp.project) {
        const [projResult] = await db.promise().query(
          'INSERT INTO projects (cv_id, exp_id, name, period_start, period_end, description, tech, team_size) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [cv_id, exp_id, exp.project.name, exp.project.period_start || null, exp.project.period_end || null, exp.project.description, exp.project.tech, exp.project.teamSize]
        )
        const project_id = projResult.insertId

        for (const r of exp.project.responsibilities || []) {
          await db.promise().query('INSERT INTO project_responsibilities (project_id, description) VALUES (?, ?)', [project_id, r])
        }
      }
    }

    // Insert highlights + bullets
    for (const hl of highlights) {
      const [hlResult] = await db.promise().query(
        'INSERT INTO highlights (cv_id, name, period_start, period_end) VALUES (?, ?, ?, ?)',
        [cv_id, hl.name, hl.period_start || null, hl.period_end || null]
      )
      const highlight_id = hlResult.insertId

      for (const b of hl.bullets || []) {
        await db.promise().query('INSERT INTO highlight_bullets (highlight_id, description) VALUES (?, ?)', [highlight_id, b])
      }
    }

    // Insert languages
    for (const l of languages) {
      await db.promise().query('INSERT INTO languages (cv_id, language, proficiency) VALUES (?, ?, ?)', [cv_id, l.language, l.proficiency])
    }

    // Insert awards
    for (const a of awards) {
      await db.promise().query('INSERT INTO awards (cv_id, name, organization, year) VALUES (?, ?, ?, ?)', [cv_id, a.name, a.organization, a.year || null])
    }

    res.json({ success: true, message: 'CV đã được tạo thành công', cv_id })
  } catch (err) {
    console.error('POST error:', err.message, err.stack)
    res.status(500).json({ success: false, message: 'Lỗi khi tạo CV' })
  }
})

module.exports = router;