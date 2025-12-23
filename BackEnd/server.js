const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const port = process.env.PORT;
const db = require('./db');

app.use(cors({
    origin:[
        'https://github.com/phucle124/CV-Builder-Website',
        'http://localhost:5173'
    ],
    credentials:true,
    methods:['GET','POST','PUT','DELETE'],
    allowedHeaders:['Content-Type','Authorization']
}));

app.use(express.json());

// Import các routes
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const cvsRoutes = require('./routes/cvs');


// Mount routes
app.use('/api', authRoutes);
app.use('/api', usersRoutes);
app.use('/api/cvs', cvsRoutes);



// Tăng giới hạn lên 10MB
app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ limit: '20mb', extended: true }))


// Root route
app.get('/', (req, res) => {
    res.send(`Server is running on port ${port}`);
});

// Khởi động server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

// Kiểm tra kết nối DB
db.getConnection((err, connection) => {
    if (err) {
        console.error('Không thể kết nối tới MySQL:', err);
    } else {
        console.log('Kết nối MySQL thành công');
        connection.release();
    }

});
