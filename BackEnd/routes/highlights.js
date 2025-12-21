const express = require('express');
const router = express.Router();
const db = require('../db');

// Lấy highlights theo CV
router.get('/cv/:cvId', (req, res) => {
  db.query('SELECT * FROM highlights WHERE cv_id = ?', [req.params.cvId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Lấy highlights theo user
router.get('/user/:userId', (req, res) => {
  db.query('SELECT h.* FROM highlights h JOIN cvs c ON h.cv_id = c.cv_id WHERE c.user_id = ?', [req.params.userId], (err, highlights) => {
    if (err) return res.status(500).json({ error: err.message });
    if (highlights.length === 0) return res.json([]);
    let completed = 0;
    highlights.forEach((h, index) => {
      db.query('SELECT description FROM highlight_bullets WHERE highlight_id = ?', [h.highlight_id], (err2, bullets) => {
        if (err2) return res.status(500).json({ error: err2.message });
        h.bullets = bullets.map(b => b.description);
        completed++;
        if (completed === highlights.length) {
          res.json(highlights);
        }
      });
    });
  });
});

// Thêm highlight mới
router.post('/', (req, res) => {
  const { cv_id, name, period_start, period_end } = req.body;
  db.query('INSERT INTO highlights (cv_id, name, period_start, period_end) VALUES (?, ?, ?, ?)',
    [cv_id, name, period_start, period_end],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ highlight_id: result.insertId });
    });
});

module.exports = router;