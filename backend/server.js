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

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Healthcheck & System Meta Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    platform: 'ExcelMind Academic Companion API',
    database: process.env.DB_NAME || 'excelmind_academic',
    host: process.env.DB_HOST || 'localhost',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/assignments', assignmentRoutes);

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

    // Sync schema
    await sequelize.sync({ alter: false });
    console.log('[ExcelMind DB]: ✓ Sequelize models synchronized with database tables.');
  } catch (dbErr) {
    console.warn(`[ExcelMind DB Notice]: Could not connect to MySQL at ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}.`);
    console.warn('Reason:', dbErr.message);
    console.warn('[ExcelMind DB Notice]: Server will start in standby mode. Start your local MySQL service (e.g. via XAMPP, WAMP, or MySQL Workbench) to activate live database syncing.');
  }

  app.listen(PORT, () => {
    console.log(`[ExcelMind API]: 🚀 Server running smoothly on http://localhost:${PORT}`);
    console.log(`[ExcelMind API]: Healthcheck available at http://localhost:${PORT}/api/health`);
  });
}

startServer();
