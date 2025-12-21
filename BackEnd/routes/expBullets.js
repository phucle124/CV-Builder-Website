const express = require('express');
const router = express.Router();
const db = require('../db');

// Lấy bullets theo experience
router.get('/exp/:expId', (req, res) => {
  const { expId } = req.params;
  db.query('SELECT * FROM exp_bullets WHERE exp_id = ?', [expId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Lấy bullets theo user
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  db.query('SELECT eb.* FROM exp_bullets eb JOIN experience e ON eb.exp_id = e.exp_id JOIN cvs c ON e.cv_id = c.cv_id WHERE c.user_id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Thêm bullet mới
router.post('/', (req, res) => {
  const { expId, description } = req.body;
  if (!expId || !description) {
    return res.status(400).json({ error: 'expId và description là bắt buộc' });
  }
  db.query(
    'INSERT INTO exp_bullets (exp_id, description) VALUES (?, ?)',
    [expId, description],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ bullet_id: result.insertId });
    }
  );
});

module.exports = router;