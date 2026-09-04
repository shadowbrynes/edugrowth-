const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireRole, studentIsolation } = require('../middleware/rbacMiddleware');

// Student self routes (protected by student isolation)
router.get('/profile', authMiddleware, studentIsolation, studentController.getStudentProfile);
router.get('/timetable', authMiddleware, studentIsolation, studentController.getStudentTimetable);
router.get('/attendance', authMiddleware, studentIsolation, studentController.getStudentAttendance);

// Institutional student management - restricted to Admin only to prevent student data leakage
router.get('/', authMiddleware, requireRole('admin'), studentController.getAllStudents);
router.post('/', authMiddleware, requireRole('admin'), studentController.registerStudent);
router.get('/:id', authMiddleware, studentIsolation, studentController.getStudentById);
router.put('/:id', authMiddleware, requireRole('admin'), studentController.updateStudent);
router.delete('/:id', authMiddleware, requireRole('admin'), studentController.deleteStudent);

module.exports = router;
