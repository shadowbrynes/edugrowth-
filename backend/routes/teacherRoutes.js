const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/dashboard', authMiddleware, teacherController.getTeacherDashboard);
router.get('/all', authMiddleware, teacherController.getAllTeachers);

module.exports = router;
