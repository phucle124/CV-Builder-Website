const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const port = process.env.PORT;
const db = require('./db');

app.use(cors());
app.use(express.json());

// Import các routes
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const cvsRoutes = require('./routes/cvs');
const awardsRoutes = require('./routes/awards');
const certificatesRoutes = require('./routes/certificates');
const contactsRoutes = require('./routes/contacts');
const educationRoutes = require('./routes/education');
const experienceRoutes = require('./routes/experience');
const expBulletsRoutes = require('./routes/expBullets');
const headersRoutes = require('./routes/headers');
const highlightsRoutes = require('./routes/highlights');
const highlightBulletsRoutes = require('./routes/highlightBullets');
const languagesRoutes = require('./routes/languages');
const projectsRoutes = require('./routes/projects');
const projectResponsibilitiesRoutes = require('./routes/projectResponsibilities');
const skillsRoutes = require('./routes/skills');

// Mount routes
app.use('/api', authRoutes);
app.use('/api', usersRoutes);
app.use('/api/cvs', cvsRoutes);
app.use('/api/awards', awardsRoutes);
app.use('/api/certificates', certificatesRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/exp-bullets', expBulletsRoutes);
app.use('/api/headers', headersRoutes);
app.use('/api/highlights', highlightsRoutes);
app.use('/api/highlight-bullets', highlightBulletsRoutes);
app.use('/api/languages', languagesRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/project-responsibilities', projectResponsibilitiesRoutes);
app.use('/api/skills', skillsRoutes);


// Tăng giới hạn lên 10MB
app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))


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