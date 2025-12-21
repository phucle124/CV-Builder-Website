const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/cv/:cvId', (req, res) => {
  db.query('SELECT * FROM awards WHERE cv_id = ?', [req.params.cvId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.get('/user/:userId', (req, res) => {
  db.query('SELECT a.* FROM awards a JOIN cvs c ON a.cv_id = c.cv_id WHERE c.user_id = ?', [req.params.userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { cv_id, name, organization, year } = req.body;
  db.query('INSERT INTO awards (cv_id, name, organization, year) VALUES (?, ?, ?, ?)',
    [cv_id, name, organization, year],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ award_id: result.insertId });
    });
});

module.exports = router;