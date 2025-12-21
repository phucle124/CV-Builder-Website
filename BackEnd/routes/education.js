const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/cv/:cvId', (req, res) => {
  db.query('SELECT * FROM education WHERE cv_id = ?', [req.params.cvId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

router.get('/user/:userId', (req, res) => {
  db.query('SELECT e.* FROM education e JOIN cvs c ON e.cv_id = c.cv_id WHERE c.user_id = ?', [req.params.userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0] || {});
  });
});

router.post('/', (req, res) => {
  const { cv_id, school, degree, start_date, end_date, gpa } = req.body;
  db.query('INSERT INTO education (cv_id, school, degree, start_date, end_date, gpa) VALUES (?, ?, ?, ?, ?, ?)',
    [cv_id, school, degree, start_date, end_date, gpa],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ edu_id: result.insertId });
    });
});

module.exports = router;