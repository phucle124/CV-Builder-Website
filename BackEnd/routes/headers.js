const express = require('express');
const router = express.Router();
const db = require('../db');

// Lấy header theo CV
router.get('/cv/:cvId', (req, res) => {
  db.query('SELECT * FROM headers WHERE cv_id = ?', [req.params.cvId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Lấy header theo user
router.get('/user/:userId', (req, res) => {
  db.query('SELECT h.* FROM headers h JOIN cvs c ON h.cv_id = c.cv_id WHERE c.user_id = ?', [req.params.userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0] || {});
  });
});

// Thêm header mới
router.post('/', (req, res) => {
  const { cv_id, name, title, summary } = req.body;
  db.query('INSERT INTO headers (cv_id, name, title, summary) VALUES (?, ?, ?, ?)',
    [cv_id, name, title, summary],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ header_id: result.insertId });
    });
});

module.exports = router;