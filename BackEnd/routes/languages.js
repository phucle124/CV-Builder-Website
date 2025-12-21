const express = require('express');
const router = express.Router();
const db = require('../db');

// Lấy danh sách ngôn ngữ theo CV
router.get('/cv/:cvId', (req, res) => {
  const { cvId } = req.params
  db.query('SELECT * FROM languages WHERE cv_id = ?', [cvId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(results)
  })
})

// Lấy danh sách ngôn ngữ theo user
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params
  db.query('SELECT l.* FROM languages l JOIN cvs c ON l.cv_id = c.cv_id WHERE c.user_id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(results)
  })
})

// Thêm ngôn ngữ mới
router.post('/', (req, res) => {
  const { cv_id, language, proficiency } = req.body
  if (!cv_id || !language) {
    return res.status(400).json({ error: 'cv_id và language là bắt buộc' })
  }
  db.query('INSERT INTO languages (cv_id, language, proficiency) VALUES (?, ?, ?)',
    [cv_id, language, proficiency],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ lang_id: result.insertId })
    })
})

module.exports = router;