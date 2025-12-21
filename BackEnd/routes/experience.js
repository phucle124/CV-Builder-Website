const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/cv/:cvId', (req, res) => {
  db.query('SELECT * FROM experience WHERE cv_id = ?', [req.params.cvId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

router.get('/user/:userId', (req, res) => {
  db.query('SELECT ex.* FROM experience ex JOIN cvs c ON ex.cv_id = c.cv_id WHERE c.user_id = ?', [req.params.userId], (err, experiences) => {
    if (err) return res.status(500).json({ error: err.message });
    if (experiences.length === 0) return res.json([]);
    let completed = 0;
    experiences.forEach((exp, index) => {
      db.query('SELECT description FROM exp_bullets WHERE exp_id = ?', [exp.exp_id], (err2, bullets) => {
        if (err2) return res.status(500).json({ error: err2.message });
        exp.bullets = bullets.map(b => b.description);
        completed++;
        if (completed === experiences.length) {
          res.json(experiences);
        }
      });
    });
  });
});

router.post('/', (req, res) => {
  const { cv_id, role, company, start_date, end_date } = req.body;
  db.query('INSERT INTO experience (cv_id, role, company, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
    [cv_id, role, company, start_date, end_date],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ exp_id: result.insertId });
    });
});

module.exports = router;