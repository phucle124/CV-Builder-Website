const express = require('express');
const router = express.Router();
const db = require('../db');


// Đăng nhập
router.post('/login', (req, res) => {
    console.log('Đã nhận request đăng nhập:', req.body);
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn:', err);
            return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
        }

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Email không tồn tại' });
        }

        const user = results[0];
        if (user.password !== password) {
            return res.status(401).json({ success: false, message: 'Sai mật khẩu' });
        }

        res.json({
            success: true,
            message: 'Đăng nhập thành công',
            user_id: user.user_id,
            email: user.email,
            role: user.role || 'user'
        });
    });
});

//Đăng kí
router.post('/register', (req, res) => {
    console.log('Đã nhận request đăng ký:', req.body);
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
        if (results.length > 0) return res.status(400).json({ success: false, message: 'Email đã tồn tại' });

        // Lưu mật khẩu thô (không mã hóa)
        db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, password], (err) => {
            if (err) return res.status(500).json({ success: false, message: 'Lỗi khi lưu dữ liệu' });
            res.json({ success: true, message: 'Đăng ký thành công' });
        });
    });
});


module.exports = router;