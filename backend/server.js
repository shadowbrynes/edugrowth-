const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { sequelize, User } = require('./models');

// Route Handlers
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const parentRoutes = require('./routes/parentRoutes');
const examRoutes = require('./routes/examRoutes');
const resultRoutes = require('./routes/resultRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const communicationRoutes = require('./routes/communicationRoutes');
const curriculumRoutes = require('./routes/curriculumRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const aiRoutes = require('./routes/aiRoutes');
const backupRoutes = require('./routes/backupRoutes');
const imageRoutes = require('./routes/imageRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static uploaded passport photographs
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Healthcheck & System Meta Endpoint
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    await sequelize.authenticate();
    dbStatus = 'connected';
  } catch (e) {
    dbStatus = 'error: ' + e.message;
  }

  res.status(200).json({
    status: 'online',
    platform: 'ExcelMind Academic Companion API',
    database: process.env.DB_NAME || 'excelmind_academic',
    databaseStatus: dbStatus,
    host: process.env.DB_HOST || 'localhost',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/curriculum', curriculumRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/communication', communicationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/backup', backupRoutes);
app.use('/api/images', imageRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[ExcelMind Server Error]:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Database Initialization & Server Start
async function startServer() {
  try {
    console.log(`[ExcelMind DB]: Connecting to MySQL on ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}...`);
    await sequelize.authenticate();
    console.log('[ExcelMind DB]: ✓ MySQL Database connection established successfully.');

    // Sync schema without dropping tables
    await sequelize.sync({ alter: false });
    console.log('[ExcelMind DB]: ✓ Sequelize models synchronized with database tables.');
  } catch (dbErr) {
    console.warn(`[ExcelMind DB Notice]: Could not connect to MySQL at ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}.`);
    console.warn('Reason:', dbErr.message);
  }

  app.listen(PORT, () => {
    console.log(`[ExcelMind API]: 🚀 Server running smoothly on http://localhost:${PORT}`);
    console.log(`[ExcelMind API]: Healthcheck available at http://localhost:${PORT}/api/health`);
  });
}

startServer();
