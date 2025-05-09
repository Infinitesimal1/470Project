const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const coursesRoutes = require('./routes/courses');
const lessonsRoutes = require('./routes/lessons');
const adminRoutes = require('./routes/admin');
const dictionaryRoutes = require('./routes/dictionary'); 

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/quiz', require('./routes/quiz'));


app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dictionary', dictionaryRoutes); 
app.use('/api/courses', require('./routes/courses'));
app.use('/api/forum', require('./routes/forum'));

module.exports = app;

