const express = require('express');
const router = express.Router();
const db = require('../db');

// Lấy bullets theo highlight
router.get('/:highlightId', (req, res) => {
  db.query('SELECT * FROM highlight_bullets WHERE highlight_id = ?', [req.params.highlightId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Lấy bullets theo user
router.get('/user/:userId', (req, res) => {
  db.query('SELECT hb.* FROM highlight_bullets hb JOIN highlights h ON hb.highlight_id = h.highlight_id JOIN cvs c ON h.cv_id = c.cv_id WHERE c.user_id = ?', [req.params.userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Thêm bullet mới
router.post('/', (req, res) => {
  const { highlight_id, description } = req.body;
  db.query('INSERT INTO highlight_bullets (highlight_id, description) VALUES (?, ?)',
    [highlight_id, description],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ bullet_id: result.insertId });
    });
});

module.exports = router;