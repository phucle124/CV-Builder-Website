const express = require('express');
const router = express.Router();
const db = require('../db');

// Lấy danh sách kỹ năng theo CV
router.get('/cv/:cvId', (req, res) => {
  const { cvId } = req.params
  db.query('SELECT * FROM skills WHERE cv_id = ?', [cvId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(results)
  })
})

// Lấy danh sách kỹ năng theo user
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params
  db.query('SELECT s.* FROM skills s JOIN cvs c ON s.cv_id = c.cv_id WHERE c.user_id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message })
    const grouped = {
      backend: [],
      frontend: [],
      soft: []
    }
    results.forEach(skill => {
      if (skill.category === 'backend') {
        grouped.backend.push({ label: skill.name, note: skill.note || '' })
      } else if (skill.category === 'frontend') {
        grouped.frontend.push({ label: skill.name, note: skill.note || '' })
      } else if (skill.category === 'soft') {
        grouped.soft.push(skill.name)
      }
    })
    res.json(grouped)
  })
})

// Thêm kỹ năng mới
router.post('/', (req, res) => {
  const { cv_id, category, name, note } = req.body
  if (!cv_id || !name) {
    return res.status(400).json({ error: 'cv_id và name là bắt buộc' })
  }
  db.query('INSERT INTO skills (cv_id, category, name, note) VALUES (?, ?, ?, ?)',
    [cv_id, category, name, note],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ skill_id: result.insertId })
    })
})

module.exports = router;