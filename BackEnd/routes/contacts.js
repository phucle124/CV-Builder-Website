const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/cv/:cvId', (req, res) => {
  db.query('SELECT * FROM contacts WHERE cv_id = ?', [req.params.cvId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

router.get('/user/:userId', (req, res) => {
  db.query('SELECT co.* FROM contacts co JOIN cvs c ON co.cv_id = c.cv_id WHERE c.user_id = ?', [req.params.userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0] || {});
  });
});

router.post('/', (req, res) => {
  const { cv_id, phone, email, birthday, location, linkedin } = req.body;
  db.query('INSERT INTO contacts (cv_id, phone, email, birthday, location, linkedin) VALUES (?, ?, ?, ?, ?, ?)',
    [cv_id, phone, email, birthday, location, linkedin],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ contact_id: result.insertId });
    });
});

module.exports = router;