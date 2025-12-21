const express = require('express');
const router = express.Router();
const db = require('../db');

// Lấy projects theo CV
router.get('/cv/:cvId', (req, res) => {
  const { cvId } = req.params
  db.query('SELECT * FROM projects WHERE cv_id = ?', [cvId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(results)
  })
})

// Lấy projects theo user
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params
  db.query('SELECT p.* FROM projects p JOIN cvs c ON p.cv_id = c.cv_id WHERE c.user_id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(results)
  })
})

// Thêm project mới
router.post('/', (req, res) => {
  const { cvId, expId, name, description, period_start, period_end, tech, team_size } = req.body
  if (!cvId || !name) {
    return res.status(400).json({ error: 'cvId và name là bắt buộc' })
  }
  db.query(
    'INSERT INTO projects (cv_id, exp_id, name, description, period_start, period_end, tech, team_size) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [cvId, expId, name, description, period_start, period_end, tech, team_size],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ project_id: result.insertId })
    }
  )
})
module.exports = router;