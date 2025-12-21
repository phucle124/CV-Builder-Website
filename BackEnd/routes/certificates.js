const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/cv/:cvId', (req, res) => {
  db.query('SELECT * FROM certificates WHERE cv_id = ?', [req.params.cvId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

router.get('/user/:userId', (req, res) => {
  db.query('SELECT ce.* FROM certificates ce JOIN cvs c ON ce.cv_id = c.cv_id WHERE c.user_id = ?', [req.params.userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { cv_id, name, issuer, date, url } = req.body;
  db.query('INSERT INTO certificates (cv_id, name, issuer, date, url) VALUES (?, ?, ?, ?, ?)',
    [cv_id, name, issuer, date, url],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ cert_id: result.insertId });
    });
});

module.exports = router;