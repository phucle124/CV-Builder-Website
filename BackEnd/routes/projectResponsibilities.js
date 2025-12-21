const express = require('express');
const router = express.Router();
const db = require('../db');

// Lấy responsibilities theo project
router.get('/project/:projectId', (req, res) => {
  const { projectId } = req.params
  db.query('SELECT * FROM project_responsibilities WHERE project_id = ?', [projectId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(results)
  })
})

// Lấy responsibilities theo user
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params
  db.query('SELECT pr.* FROM project_responsibilities pr JOIN projects p ON pr.project_id = p.project_id JOIN cvs c ON p.cv_id = c.cv_id WHERE c.user_id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(results)
  })
})

// Thêm responsibility mới
router.post('/', (req, res) => {
  const { project_id, description } = req.body
  if (!project_id || !description) {
    return res.status(400).json({ error: 'project_id và description là bắt buộc' })
  }
  db.query('INSERT INTO project_responsibilities (project_id, description) VALUES (?, ?)',
    [project_id, description],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ resp_id: result.insertId })
    })
})

module.exports = router;