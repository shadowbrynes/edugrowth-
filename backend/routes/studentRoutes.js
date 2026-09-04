const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/profile', authMiddleware, studentController.getStudentProfile);
router.get('/timetable', authMiddleware, studentController.getStudentTimetable);
router.get('/attendance', authMiddleware, studentController.getStudentAttendance);
router.get('/all', authMiddleware, studentController.getAllStudents);
router.post('/register', authMiddleware, studentController.registerStudent);

module.exports = router;
