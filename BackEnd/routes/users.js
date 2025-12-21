const express = require('express');
const router = express.Router();
const db = require('../db');

// Lấy danh sách users  (TRƯỚC ĐÂY DÙNG CHO KIỂM TRA Login.vue)

router.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


// Tạo user mới  (DÙNG CHO Register.vue và Login.vue)
router.post('/users', (req, res) => {
  const { email, password } = req.body;
  db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, password], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ user_id: result.insertId });
  });
});


//Thay đổi mật khẩu  (DÙNG CHO AccountInfo.vue)
// routes/users.js
router.put('/users/:id/password', (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  // Lấy mật khẩu hiện tại từ DB
  db.query('SELECT password FROM users WHERE user_id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'User không tồn tại' });

    const dbPassword = results[0].password;

    // So sánh mật khẩu hiện tại
    if (dbPassword !== currentPassword) {
      return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
    }

    // Nếu đúng thì update mật khẩu mới
    db.query('UPDATE users SET password = ? WHERE user_id = ?', [newPassword, id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: 'Mật khẩu đã được cập nhật' });
    });
  });
});



// Lấy user theo id  (DÙNG CHO AccountInfo.vue)
router.get('/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM users WHERE user_id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'User không tồn tại' });
    res.json(results[0]);
  });
});

module.exports = router;